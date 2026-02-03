export function formatToYMD(value?: string | null): string {
  if (!value) return '';
  // If contains 'T', take left of it
  const tIndex = value.indexOf('T');
  if (tIndex !== -1) return value.substring(0, tIndex);
  // Otherwise, fallback to first 10 chars if available
  return value.length >= 10 ? value.substring(0, 10) : value;
}
