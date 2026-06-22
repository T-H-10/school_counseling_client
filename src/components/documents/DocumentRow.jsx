import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteDocument, getDocumentContent, downloadDocument } from '../../api/documents'
import { downloadBlob } from '../../utils/downloadBlob'
import { DOCUMENT_CATEGORY_MAP, fileIcon, formatFileSize } from '../../constants/documentCategories'
import { parseApiError } from '../../utils/apiError'
import ConfirmDeleteModal from '../ConfirmDeleteModal'

export default function DocumentRow({ doc, onEdit, onDeleted, compact }) {
  const [deleting, setDeleting]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [viewing, setViewing]       = useState(false)
  const [downloading, setDownloading] = useState(false)

  const badge = DOCUMENT_CATEGORY_MAP[doc.category] ?? DOCUMENT_CATEGORY_MAP.general

  // C1: open tab synchronously before any await so popup blockers don't kill it
  const handleView = () => {
    const w = window.open('', '_blank')
    if (!w) { toast.error('הדפדפן חסם את פתיחת הכרטיסייה'); return }
    setViewing(true)
    getDocumentContent(doc.id)
      .then(resp => {
        const mime = resp.headers['content-type'] || 'application/octet-stream'
        const blob = new Blob([resp.data], { type: mime })
        const url = URL.createObjectURL(blob)
        w.location = url
        setTimeout(() => URL.revokeObjectURL(url), 60_000)
      })
      .catch(() => { w.close(); toast.error('שגיאה בטעינת הקובץ') })
      .finally(() => setViewing(false))
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const resp = await downloadDocument(doc.id)
      const mime = resp.headers['content-type'] || 'application/octet-stream'
      const blob = new Blob([resp.data], { type: mime })
      const ext  = (doc.file_name || '').split('.').pop()
      downloadBlob(blob, `${doc.title}.${ext}`)
    } catch {
      toast.error('שגיאה בהורדת הקובץ')
    } finally {
      setDownloading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteDocument(doc.id)
      toast.success('המסמך נמחק')
      setShowConfirm(false)
      onDeleted(doc.id)
    } catch (err) {
      toast.error(parseApiError(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div
        data-testid="document-row"
        data-document-id={doc.id}
        className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
      >
        {/* File icon */}
        <span className="text-2xl shrink-0">{fileIcon(doc.file_name)}</span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{doc.title}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
            {doc.file_name}
            {doc.file_size ? ` · ${formatFileSize(doc.file_size)}` : ''}
            {!compact && doc.category === 'class' && doc.class_level_name &&
              ` · כיתה ${doc.class_level_name}׳${doc.class_number ? ` ${doc.class_number}` : ''}`}
            {!compact && doc.category === 'student' && doc.student_name &&
              ` · ${doc.student_name}${doc.student_id_number ? ` | ${doc.student_id_number}` : ''}`}
          </p>
        </div>

        {/* Category badge — hidden in compact (embedded) mode where category is always the same */}
        {!compact && (
          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${badge.classes}`}>
            {badge.label}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleView}
            disabled={viewing}
            data-testid="document-view"
            title="צפייה"
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-40"
          >
            {viewing ? <span className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin inline-block" /> : '👁'}
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            data-testid="document-download"
            title="הורדה"
            className="p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-40"
          >
            {downloading ? <span className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin inline-block" /> : '⬇️'}
          </button>

          <button
            onClick={() => onEdit(doc)}
            data-testid="document-edit"
            title="עריכה"
            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ✏️
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            data-testid="document-delete"
            title="מחיקה"
            className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        confirming={deleting}
        message={`למחוק את המסמך "${doc.title}"? הפעולה ניתנת לשחזור על ידי מנהל.`}
      />
    </>
  )
}
