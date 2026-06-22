export const DOCUMENT_CATEGORY_OPTIONS = [
  { value: 'general', label: 'כללי' },
  { value: 'class',   label: 'כיתתי' },
  { value: 'student', label: 'תלמיד' },
]

export const DOCUMENT_CATEGORY_MAP = {
  general: { label: 'כללי',   classes: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  class:   { label: 'כיתתי', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  student: { label: 'תלמיד', classes: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' },
}

// Maps file extension -> emoji icon for display in document rows.
export const FILE_TYPE_ICON = {
  pdf:  '📄',
  doc:  '📝',
  docx: '📝',
  xls:  '📊',
  xlsx: '📊',
  ppt:  '📋',
  pptx: '📋',
  png:  '🖼️',
  jpg:  '🖼️',
  jpeg: '🖼️',
  gif:  '🖼️',
  txt:  '📃',
}

export function fileIcon(filename) {
  const ext = (filename ?? '').split('.').pop().toLowerCase()
  return FILE_TYPE_ICON[ext] ?? '📎'
}

export function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
