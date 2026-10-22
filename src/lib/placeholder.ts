/**
 * Client data we don't have yet. Pending values render with a dashed outline
 * (data-pending) and `npm run check:release` refuses to ship while any remain.
 */
export type Pending = { readonly pending: true; readonly label: string; readonly preview: string };
export type Maybe<T> = T | Pending;

export const todo = (label: string, preview = ''): Pending => ({ pending: true, label, preview });

export const isPending = (value: unknown): value is Pending =>
  typeof value === 'object' && value !== null && (value as Pending).pending === true;

/** Plain-text value for attributes and metadata (preview when pending). */
export const text = (value: Maybe<string>): string => (isPending(value) ? value.preview : value);

/** Resolved value or undefined (use where a pending value must simply be omitted). */
export function known<T>(value: Maybe<T> | null | undefined): T | undefined {
  return value === null || value === undefined || isPending(value) ? undefined : value;
}
