// Shared Tailwind class strings for form controls.

export const inputClass =
  'w-full border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white'

export const sectionLabel = 'text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1'

export function fieldClass(err) {
  return `w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 bg-white ${
    err
      ? 'border-red-400 focus:ring-red-200 text-gray-700'
      : 'border-gray-200 focus:ring-indigo-300 text-gray-700'
  }`
}
