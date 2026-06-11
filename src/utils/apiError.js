// Extracts a single human-readable error message from a DRF error response.
export function parseApiError(err) {
  const data = err?.response?.data
  if (!data) return 'שגיאה בשמירה, אנא נסה שוב'
  if (typeof data === 'string') return data
  const first = Object.values(data)[0]
  if (Array.isArray(first)) return first[0]
  if (typeof first === 'string') return first
  return 'שגיאה בשמירה, אנא נסה שוב'
}

// Splits a DRF error response into per-field messages and a general message.
export function parseApiErrors(err) {
  const data = err?.response?.data
  if (!data) return { fields: {}, general: 'שגיאה בשמירה, אנא נסה שוב' }
  if (typeof data === 'string') return { fields: {}, general: data }
  if (typeof data === 'object') {
    const fields = {}
    let general = null
    for (const [key, val] of Object.entries(data)) {
      const msg = Array.isArray(val) ? val[0] : val
      const str = typeof msg === 'string' ? msg : JSON.stringify(msg)
      if (key === 'non_field_errors' || key === 'detail') {
        general = str
      } else {
        fields[key] = str
      }
    }
    return { fields, general: general ?? (Object.keys(fields).length === 0 ? 'שגיאה בשמירה, אנא נסה שוב' : null) }
  }
  return { fields: {}, general: 'שגיאה בשמירה, אנא נסה שוב' }
}
