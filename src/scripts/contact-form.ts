/** Contact form: accessible validation, honeypot, endpoint or WhatsApp/e-mail fallback. */
type Routing = {
  routing: Record<string, string>;
  founders: Record<string, { name: string; phone: string; email: string }>;
};

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (form) setup(form);

function setup(form: HTMLFormElement) {
  const endpoint = form.dataset.endpoint || '';
  const config = JSON.parse(form.dataset.routing ?? '{}') as Routing;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const list = form.querySelector<HTMLUListElement>('[data-error-list]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const interest = form.querySelector<HTMLSelectElement>('[data-interest]');
  const startedAt = Date.now();

  // Preselect the area from ?interesse= (links from solution pages).
  const preset = new URLSearchParams(location.search).get('interesse');
  if (interest && preset && [...interest.options].some((o) => o.value === preset)) interest.value = preset;

  const rules: Record<string, { test: (v: string) => boolean; message: string }> = {
    nome: { test: (v) => v.trim().length >= 2, message: 'Informe seu nome.' },
    email: {
      test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      message: 'Informe um e-mail válido, como nome@empresa.com.br.',
    },
    empresa: { test: (v) => v.trim().length >= 2, message: 'Informe o nome da empresa.' },
    mensagem: { test: (v) => v.trim().length >= 10, message: 'Conte brevemente o seu desafio (pelo menos 10 caracteres).' },
  };

  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;

  function setError(name: string, message: string) {
    const input = field(name);
    const out = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (out) out.textContent = message;
  }

  function validate(): { name: string; message: string }[] {
    const errors: { name: string; message: string }[] = [];
    for (const [name, rule] of Object.entries(rules)) {
      const ok = rule.test(field(name)?.value ?? '');
      setError(name, ok ? '' : rule.message);
      if (!ok) errors.push({ name, message: rule.message });
    }
    return errors;
  }

  // Re-validate a field after the first error is shown, as the user fixes it.
  for (const name of Object.keys(rules)) {
    field(name)?.addEventListener('input', () => {
      if (field(name)?.getAttribute('aria-invalid') === 'true') setError(name, rules[name].test(field(name)!.value) ? '' : rules[name].message);
    });
  }

  function showSummary(errors: { name: string; message: string }[]) {
    list.replaceChildren(
      ...errors.map((e) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${field(e.name)?.id}`;
        a.textContent = e.message;
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          field(e.name)?.focus();
        });
        li.append(a);
        return li;
      }),
    );
    summary.hidden = false;
    summary.focus();
  }

  function compose(data: FormData, founderName: string) {
    const area = interest?.selectedOptions[0]?.textContent?.trim() || 'Ainda não sei';
    const lines = [
      `Olá, ${founderName}! Vim pelo site da TCAN.`,
      '',
      `Nome: ${data.get('nome')}`,
      `Empresa: ${data.get('empresa')}`,
      data.get('cargo') ? `Cargo: ${data.get('cargo')}` : '',
      `E-mail: ${data.get('email')}`,
      data.get('telefone') ? `Telefone: ${data.get('telefone')}` : '',
      `Interesse: ${area}`,
      '',
      String(data.get('mensagem') ?? '').trim(),
    ].filter((l, i, arr) => l !== '' || arr[i - 1] !== '');
    return lines.join('\n').slice(0, 1500);
  }

  const track = (name: string, params: Record<string, unknown>) => {
    const w = window as Window & { gtag?: (...args: unknown[]) => void; tcanConsent?: { get: () => { analytics: boolean } | null } };
    if (w.gtag && w.tcanConsent?.get()?.analytics) w.gtag('event', name, params);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    const errors = validate();
    if (errors.length) {
      showSummary(errors);
      return;
    }
    summary.hidden = true;

    const data = new FormData(form);
    // Spam traps: hidden field filled, or submitted faster than a person could type.
    if (String(data.get('website') ?? '') !== '' || Date.now() - startedAt < 3000) {
      status.textContent = 'Não foi possível enviar agora. Tente novamente em alguns segundos.';
      return;
    }

    if (endpoint) {
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      button?.setAttribute('disabled', '');
      status.textContent = 'Enviando…';
      try {
        const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(String(response.status));
        track('generate_lead', { method: 'form' });
        location.href = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/contato/obrigado/`;
      } catch {
        status.textContent = 'Não conseguimos enviar sua mensagem. Tente novamente ou fale direto com um sócio pelo WhatsApp.';
        button?.removeAttribute('disabled');
      }
      return;
    }

    // Fallback: WhatsApp or e-mail with the message ready to send.
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = submitter?.dataset.channel === 'email' ? 'email' : 'whatsapp';
    const founderId = config.routing[String(data.get('interesse') || 'default')] ?? config.routing.default;
    const founder = config.founders[founderId];
    const text = compose(data, founder.name);
    track('contact_click', { channel, link_location: 'contact-form' });

    if (channel === 'whatsapp') {
      const url = `https://wa.me/${founder.phone}?text=${encodeURIComponent(text)}`;
      const opened = window.open(url, '_blank', 'noopener');
      status.innerHTML = '';
      const msg = document.createElement('span');
      msg.textContent = `Abrimos o WhatsApp de ${founder.name} com a sua mensagem pronta. É só enviar. `;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = opened ? 'Abrir novamente' : 'Abrir o WhatsApp';
      status.append(msg, link);
    } else {
      const subject = `Contato pelo site: ${data.get('empresa')}`;
      location.href = `mailto:${founder.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      status.textContent = `Abrimos o seu aplicativo de e-mail com a mensagem para ${founder.name}. Se nada aconteceu, escreva para ${founder.email}.`;
    }
  });
}
