// Formats a Date / ISO string into a value usable by <input type="datetime-local">.
// Returns '' for falsy input. Pass `new Date()` for the current local datetime.
export function toDatetimeLocal(value) {
  if (!value) return ''
  const d = new Date(value)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
