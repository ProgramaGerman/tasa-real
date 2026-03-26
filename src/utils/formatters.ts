export function formatCurrency(value: number, currency: string = 'VES'): string {
  return `${currency} ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function formatNumber(value: number): string {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function parseNumber(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
