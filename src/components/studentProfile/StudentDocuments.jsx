import { useEffect, useState, useCallback } from 'react'
import { getDocuments } from '../../api/documents'
import DocumentList from '../documents/DocumentList'
import UploadDocumentModal from '../documents/UploadDocumentModal'

export default function StudentDocuments({ studentId, studentName }) {
  const [documents, setDocuments]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const fetchDocs = useCallback(() => {
    setLoading(true)
    setError(false)
    getDocuments({ category: 'student', student: studentId })
      .then(d => setDocuments(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [studentId])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  const presetStudent = studentId
    ? { value: studentId, label: studentName ?? String(studentId) }
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6" data-testid="student-documents">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
        <h2 className="text-sm font-semibold text-gray-700">מסמכים</h2>
        <button
          onClick={() => setShowUpload(true)}
          data-testid="student-documents-upload-btn"
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          + העלאת מסמך
        </button>
      </div>

      {error ? (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm mb-2">שגיאה בטעינת המסמכים</p>
          <button
            onClick={fetchDocs}
            className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            נסה שוב
          </button>
        </div>
      ) : (
        <DocumentList
          documents={documents}
          loading={loading}
          onRefresh={fetchDocs}
          defaultCategory="student"
          compact
        />
      )}

      <UploadDocumentModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={() => { setShowUpload(false); fetchDocs() }}
        defaultCategory="student"
        presetStudent={presetStudent}
      />
    </div>
  )
}
