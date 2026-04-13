export function formatCurrency(value: number) {
  return `${value.toLocaleString('en-US')} VND`
}

export function formatRating(value: number) {
  return value.toFixed(1)
}
