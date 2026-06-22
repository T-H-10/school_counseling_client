import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { getStudents } from '../api/students'
import { getDocuments } from '../api/documents'
import { getClassLevels } from '../api/classLevels'
import DocumentList from '../components/documents/DocumentList'
import UploadDocumentModal from '../components/documents/UploadDocumentModal'

export default function ClassDetailPage() {
  const { level, number } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Use router state when navigating from ClassesPage (instant); fall back to API for direct URL.
  const [levelName, setLevelName]     = useState(location.state?.levelName ?? null)
  const [students, setStudents]       = useState([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [documents, setDocuments]     = useState([])
  const [docsLoading, setDocsLoading] = useState(true)
  const [docsError, setDocsError]     = useState(false)
  const [showUpload, setShowUpload]   = useState(false)

  // Only fetch class levels when the name wasn't already available from router state.
  useEffect(() => {
    if (levelName) return
    getClassLevels()
      .then(d => {
        const all = Array.isArray(d) ? d : d.results ?? []
        const match = all.find(cl => String(cl.id) === String(level))
        if (match) setLevelName(match.name)
      })
      .catch(() => {})
  }, [level]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch all pages so the full roster is shown for classes with > 20 students.
  useEffect(() => {
    let cancelled = false
    setStudentsLoading(true)

    const fetchAll = async () => {
      let results = []
      let page = 1
      while (true) {
        const data = await getStudents({ class_level: level, class_number: number, page })
        results = [...results, ...(data.results ?? [])]
        if (!data.next) break
        page++
      }
      return results
    }

    fetchAll()
      .then(list => { if (!cancelled) setStudents(list) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setStudentsLoading(false) })

    return () => { cancelled = true }
  }, [level, number])

  const fetchDocs = useCallback(() => {
    setDocsLoading(true)
    setDocsError(false)
    getDocuments({ category: 'class', class_level: level, class_number: number })
      .then(d => setDocuments(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => setDocsError(true))
      .finally(() => setDocsLoading(false))
  }, [level, number])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  const displayName = levelName ? `${levelName}׳ ${number}` : `${number}`
  const presetClassLevel = levelName
    ? { value: Number(level), label: levelName }
    : null

  return (
    <div data-testid="class-detail-page">
      <button
        onClick={() => navigate('/classes')}
        data-testid="class-detail-back"
        className="mb-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 transition-colors"
      >
        <span>→</span>
        <span>חזרה לכיתות</span>
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          כיתה {displayName}
        </h1>
        {!studentsLoading && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{students.length} תלמידים</p>
        )}
      </div>

      {/* Roster */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6" data-testid="class-detail-roster">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          רשימת תלמידים
        </h2>

        {studentsLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-2">אין תלמידים רשומים לכיתה זו</p>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {students.map((s, idx) => (
              <li key={s.id} data-testid="class-detail-student-row" data-student-id={s.id}>
                <Link
                  to={`/students/${s.id}`}
                  className="flex items-center gap-3 py-2.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <span className="text-xs text-gray-300 dark:text-gray-600 w-6 text-left shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {s.full_name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">←</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5" data-testid="class-detail-documents">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 mb-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">מסמכים</h2>
          <button
            onClick={() => setShowUpload(true)}
            data-testid="class-detail-upload-btn"
            className="text-xs text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            + העלאת מסמך
          </button>
        </div>

        {docsError ? (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm mb-2">שגיאה בטעינת המסמכים</p>
            <button
              onClick={fetchDocs}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 transition-colors"
            >
              נסה שוב
            </button>
          </div>
        ) : (
          <DocumentList
            documents={documents}
            loading={docsLoading}
            onRefresh={fetchDocs}
            defaultCategory="class"
            compact
          />
        )}
      </div>

      <UploadDocumentModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={() => { setShowUpload(false); fetchDocs() }}
        defaultCategory="class"
        presetClassLevel={presetClassLevel}
        presetClassNumber={number}
      />
    </div>
  )
}
