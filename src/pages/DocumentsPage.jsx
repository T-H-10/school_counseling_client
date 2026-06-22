import { useEffect, useState, useCallback } from 'react'
import { getDocuments } from '../api/documents'
import DocumentList from '../components/documents/DocumentList'
import UploadDocumentModal from '../components/documents/UploadDocumentModal'

const TABS = [
  { key: 'general', label: 'כללי' },
  { key: 'class',   label: 'כיתתי' },
  { key: 'student', label: 'תלמיד' },
]

export default function DocumentsPage() {
  const [activeTab, setActiveTab]   = useState('general')
  const [documents, setDocuments]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const fetchAll = useCallback(() => {
    setLoading(true)
    setError(false)
    getDocuments({ category: activeTab })
      .then(d => setDocuments(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [activeTab])

  useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <div data-testid="documents-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">מסמכים</h1>
          <p className="text-sm text-gray-400 mt-0.5">העלאה וניהול מסמכים לפי קטגוריה</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          data-testid="documents-upload-btn"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + העלאת מסמך
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setDocuments([]); setLoading(true); setActiveTab(key) }}
            data-testid={`documents-tab-${key}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === key
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-red-500 text-sm mb-4">שגיאה בטעינת המסמכים</p>
          <button
            onClick={fetchAll}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            נסה שוב
          </button>
        </div>
      ) : (
        <DocumentList
          documents={documents}
          loading={loading}
          onRefresh={fetchAll}
          defaultCategory={activeTab}
        />
      )}

      <UploadDocumentModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={() => { setShowUpload(false); fetchAll() }}
        defaultCategory={activeTab}
      />
    </div>
  )
}
