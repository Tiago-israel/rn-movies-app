export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const formattedDate = new Intl.DateTimeFormat("pt-BR").format(date);
  return formattedDate;
}
