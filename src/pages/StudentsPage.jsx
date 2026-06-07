import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudents } from '../api/students'
import { getClassLevels } from '../api/classLevels'

const PAGE_SIZE = 20

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-36" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-12" /></td>
    </tr>
  )
}

export default function StudentsPage() {
  const navigate = useNavigate()

  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [search, setSearch]           = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [classLevel, setClassLevel]   = useState('')
  const [page, setPage]               = useState(1)
  const [classLevels, setClassLevels] = useState([])

  // Fetch class levels once on mount for the dropdown
  useEffect(() => {
    getClassLevels()
      .then(res => setClassLevels(res.results ?? []))
      .catch(() => {})
  }, [])

  // Debounce search — reset to page 1 when the query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch students whenever any filter param changes
  useEffect(() => {
    setLoading(true)
    setError(false)
    const params = { page }
    if (debouncedSearch) params.search = debouncedSearch
    if (classLevel)      params.class_level = classLevel
    getStudents(params)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [debouncedSearch, classLevel, page])

  const handleClassLevelChange = (val) => {
    setClassLevel(val)
    setPage(1)
  }

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">תלמידים</h1>
        {data && (
          <p className="text-sm text-gray-400 mt-1">{data.count} תלמידים סה״כ</p>
        )}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="חיפוש לפי שם / ת.ז."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg py-2 pr-9 pl-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <select
          value={classLevel}
          onChange={e => handleClassLevelChange(e.target.value)}
          className="border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        >
          <option value="">כל הכיתות</option>
          {classLevels.map(cl => (
            <option key={cl.id} value={cl.id}>כיתה {cl.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-right px-4 py-3 font-semibold text-gray-600">שם מלא</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">ת.ז.</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">כיתה</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-red-500">
                  שגיאה בטעינת התלמידים. אנא רענן את הדף.
                </td>
              </tr>
            ) : data?.results.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-gray-400">
                  לא נמצאו תלמידים
                </td>
              </tr>
            ) : (
              data?.results.map(student => (
                <tr
                  key={student.id}
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{student.full_name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono tracking-wide">{student.id_number}</td>
                  <td className="px-4 py-3">
                    {student.current_class_level ? (
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        כיתה {student.current_class_level}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && !error && data && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={!data.previous}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              הקודם
            </button>
            <span className="text-sm text-gray-500">
              עמוד {page} מתוך {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!data.next}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              הבא
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
