import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getSupportRequests, resolveSupportRequest } from '../../api/support'

const TABS = [
  { key: 'open', label: 'פתוח' },
  { key: 'resolved', label: 'טופל' },
  { key: 'all', label: 'הכל' },
]

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminSupportPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState('open')
  const [resolving, setResolving] = useState(null)

  const fetchAll = useCallback(() => {
    setLoading(true)
    setError(false)
    getSupportRequests()
      .then(r => setRequests(r.data.results ?? r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleResolve = async (id) => {
    setResolving(id)
    try {
      await resolveSupportRequest(id)
      toast.success('הפנייה סומנה כטופלה')
      fetchAll()
    } catch {
      toast.error('שגיאה בעדכון הפנייה')
    } finally {
      setResolving(null)
    }
  }

  const filtered = requests.filter(r => tab === 'all' ? true : r.status === tab)

  return (
    <div data-testid="admin-support-page">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">פניות</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">פניות שהתקבלו מיועצים</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            data-testid={`admin-support-tab-${key}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === key
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">טוען...</div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-red-500 text-sm mb-4">שגיאה בטעינת הנתונים</p>
          <button onClick={fetchAll} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">נסה שוב</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500 text-sm">
          אין פניות להצגה
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <div key={req.id} data-testid={`admin-support-row-${req.id}`}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{req.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {req.counselor_name ?? 'לא ידוע'} · {req.school_name ?? ''} · {formatDate(req.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {req.status === 'open' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">פתוח</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">טופל</span>
                  )}
                  {req.status === 'open' && (
                    <button
                      onClick={() => handleResolve(req.id)}
                      disabled={resolving === req.id}
                      data-testid={`admin-support-resolve-${req.id}`}
                      className="text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-3 py-1 rounded-lg transition-colors"
                    >
                      {resolving === req.id ? '...' : 'סמן כטופל'}
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{req.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
