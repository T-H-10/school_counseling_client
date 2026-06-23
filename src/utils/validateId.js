export function validateIsraeliId(value) {
  if (!value || !/^\d{8,9}$/.test(value)) return false
  const padded = value.padStart(9, '0')
  let total = 0
  for (let i = 0; i < 9; i++) {
    let product = parseInt(padded[i]) * (i % 2 === 0 ? 1 : 2)
    if (product >= 10) product -= 9
    total += product
  }
  return total % 10 === 0
}
