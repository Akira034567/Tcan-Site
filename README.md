# Site TCAN Assessoria de Negócios

Site institucional da TCAN: estático, rápido, acessível (WCAG 2.2 AA) e preparado para LGPD.

- **Stack:** Astro 7 (HTML estático), CSS próprio com tokens, three.js (cartão 3D, carregado sob demanda).
- **Hospedagem:** qualquer host estático (recomendado: Cloudflare Pages).

## Rodar localmente

```bash
npm install
npm run dev        # desenvolvimento: http://localhost:4321
npm run build      # gera dist/
npm run serve      # serve dist/ em http://localhost:4321
```

Requer Node 22.12 ou superior. Para os testes, rode `npx playwright install chromium` uma vez.

## Verificações

| Comando | O que faz |
|---|---|
| `npm run check` | Tipos (astro check) |
| `npm run validate:html` | Validação do HTML gerado |
| `npm run check:jsonld` | Dados estruturados (schema.org) de todas as páginas |
| `npm run check:budgets` | Orçamento de performance (JS, CSS, fontes, chunk 3D) |
| `npm run test:e2e` | Playwright: acessibilidade (axe), consentimento de cookies, cartão 3D, formulário e SEO, em desktop e celular |
| `npm run verify` | Tudo acima |
| `npm run check:release` | Bloqueia a publicação enquanto houver pendências (veja abaixo) |

## Onde editar o conteúdo

| Arquivo | Conteúdo |
|---|---|
| `src/data/company.ts` | Dados da empresa (razão social, CNPJ, endereço, e-mails, redes), slogans e roteamento do contato |
| `src/data/founders.ts` | Sócios: bios, formação, telefones, e-mails, LinkedIn |
| `src/data/pillars.ts` | As 4 frentes e as 12 soluções (texto, entregas, formatos, resultados, FAQ, SEO) |
| `src/data/content.ts` | Números de destaque, método, diferenciais e FAQ geral |
| `src/data/pages.ts` | Título e descrição de cada página (SEO e redes sociais) |
| `src/data/cookies.ts` | Lista de cookies exibida no aviso e na política |
| `src/lib/card/faces.ts` | Arte do cartão (frente e versos), gerada em SVG no build |

Valores ainda não informados usam `todo('Rótulo', 'prévia')`. No site eles aparecem com contorno tracejado laranja, e o `check:release` falha até serem preenchidos.

## Regras de conteúdo (importante)

- **Parceiros nunca aparecem no site:** nem nomes, nem logos, nem fotos. As soluções descrevem o que é entregue com texto original. Não copie textos dos sites dos parceiros, por direito autoral (Lei 9.610/98) e por SEO (conteúdo duplicado).
- **Logos de clientes** só entram com autorização por escrito de cada cliente.
- **Propostas comerciais** (como a da apresentação) são confidenciais.
- **Sem promessas numéricas** de resultado (CDC art. 37).
- A pasta `apresentacao/` (gerador da apresentação) e a pasta `.private/` (pesquisa e lista de termos proibidos) ficam fora do git. O `check:release` usa `.private/denylist.txt` para garantir que nenhum nome de parceiro ou cliente vá ao ar.

## Pendências para publicar

1. Razão social, CNPJ, endereço completo e CEP.
2. E-mail geral (ex.: contato@) e canal de privacidade (ex.: privacidade@). O encarregado (DPO) é opcional para agente de pequeno porte, mas o canal é obrigatório.
3. Prazo de resposta ao contato.
4. LinkedIn e Instagram da empresa. Para omitir uma rede, use `null`.
5. ID do Google Analytics 4 (`PUBLIC_GA4_ID`).
6. Aprovação dos textos pelos sócios: marcar `reviewStatus: 'approved'` em `src/data/pillars.ts`.
7. Revisão jurídica das políticas (Privacidade, Cookies, Termos): marcar `legalReviewed: true` em `company.ts`.
8. Autorização escrita de uso de imagem dos sócios e de publicação dos telefones.
9. Desejável:
   - fotos em alta resolução da Trícia;
   - arquivo de impressão do cartão (logo vetorial);
   - sites oficiais dos parceiros não localizados na pesquisa.

## Variáveis de ambiente

Copie `.env.example` para `.env`.

- `SITE_URL`: URL final, por exemplo `https://www.tcan.com.br`.
- `PUBLIC_INDEXING=true`: só em produção. Sem ela o site sai com `noindex` e o `robots.txt` bloqueia buscadores (bom para prévias).
- `PUBLIC_GA4_ID`: ID do Google Analytics 4.
- `PUBLIC_CONTACT_ENDPOINT`: endereço que recebe o formulário. Vazio: o formulário abre o WhatsApp ou o e-mail do sócio com a mensagem pronta.

## Publicação (quando chegar a hora)

O domínio `tcan.com.br` **já está registrado** no Registro.br, em nome da Trícia, com vencimento em 07/03/2027. Ele já hospeda o e-mail Microsoft 365, então não há domínio a comprar. Atenção: ao mexer no DNS, preserve os registros do e-mail.

Roteiro recomendado (Cloudflare Pages, gratuito e com uso comercial permitido):

1. Criar a conta Cloudflare **em nome da TCAN** e conectar este repositório, ou enviar `dist/`.
2. No Registro.br, antes de tudo, **anotar ou fotografar todos os registros DNS atuais**. Hoje são:
   - MX `tcan-com-br.mail.protection.outlook.com`;
   - TXT SPF `v=spf1 include:spf.protection.outlook.com -all`;
   - CNAME `autodiscover` → `autodiscover.outlook.com`.
3. Adicionar o domínio no Cloudflare e conferir se todos esses registros foram importados.
4. No Registro.br: **desligar o DNSSEC** e trocar os servidores DNS pelos indicados pelo Cloudflare.
5. Após a propagação, religar o DNSSEC (o Cloudflare fornece o registro DS).
6. Em Pages, adicionar os domínios `tcan.com.br` e `www.tcan.com.br`, definindo um deles como principal com redirecionamento 301.
7. Variáveis de produção:
   - `SITE_URL`;
   - `PUBLIC_INDEXING=true`;
   - `PUBLIC_GA4_ID`;
   - opcionalmente `PUBLIC_CONTACT_ENDPOINT`. Exemplo: uma Pages Function enviando por Resend, a partir do subdomínio `send.tcan.com.br`.
8. Testar envio e recebimento de e-mail do Microsoft 365.
9. Cadastrar o site no Google Search Console e no Bing Webmaster Tools e enviar `sitemap-index.xml`.
10. No GA4:
    - retenção de dados de 2 meses;
    - Google Signals desligado;
    - redação de dados ativada;
    - `generate_lead` como evento-chave.

O arquivo `public/_headers` já traz os cabeçalhos de segurança (HSTS, CSP, X-Frame-Options e outros) no formato Cloudflare Pages/Netlify.

## Cookies e LGPD (resumo)

- **Necessário:** `tcan_consent` guarda a escolha do visitante por 6 meses. Dispensa consentimento, mas é informado.
- **Estatísticos:** `_ga` e `_ga_<ID>` (Google Analytics 4, 13 meses). Só são carregados depois do "Aceitar", conforme o Guia de Cookies da ANPD:
  - nada vem pré-marcado;
  - "Rejeitar" tem o mesmo destaque que "Aceitar";
  - a preferência é por categoria;
  - a escolha pode ser revogada a qualquer momento pelo rodapé.
- **Revogação:** desativa o GA e apaga os cookies `_ga*`.
- **Formulário:** base legal art. 7º, V e IX (sem checkbox de consentimento), com aviso de privacidade junto ao botão.
