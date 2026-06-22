import { useState } from 'react'
import DocumentRow from './DocumentRow'
import UploadDocumentModal from './UploadDocumentModal'

export default function DocumentList({ documents, loading, onRefresh, defaultCategory, compact }) {
  const [editingDoc, setEditingDoc] = useState(null)

  const handleDeleted = (id) => {
    onRefresh()
  }

  const handleEditSuccess = () => {
    setEditingDoc(null)
    onRefresh()
  }

  if (loading) {
    return (
      <div className="space-y-2" data-testid="document-list-loading">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!documents.length) {
    return (
      <div
        className={`text-center py-${compact ? '6' : '10'} text-gray-400 dark:text-gray-500`}
        data-testid="document-list-empty"
      >
        <p className="text-3xl mb-2">📂</p>
        <p className="text-sm">אין מסמכים להצגה</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2" data-testid="document-list">
        {documents.map(doc => (
          <DocumentRow
            key={doc.id}
            doc={doc}
            onEdit={setEditingDoc}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      <UploadDocumentModal
        isOpen={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        onSuccess={handleEditSuccess}
        document={editingDoc}
        defaultCategory={defaultCategory}
      />
    </>
  )
}
