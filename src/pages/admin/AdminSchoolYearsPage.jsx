import { useEffect, useState, useCallback } from 'react'
import { getSchoolYears } from '../../api/schoolYears'
import AdminSchoolYearModal from '../../components/admin/AdminSchoolYearModal'

export default function AdminSchoolYearsPage() {
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modal, setModal] = useState({ open: false, schoolYear: null })

  const fetchAll = useCallback(() => {
    setLoading(true)
    setError(false)
    getSchoolYears()
      .then(d => setYears(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const openAdd = () => setModal({ open: true, schoolYear: null })
  const openEdit = schoolYear => setModal({ open: true, schoolYear })
  const closeModal = () => setModal({ open: false, schoolYear: null })

  return (
    <div data-testid="admin-school-years-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">שנות לימודים</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">ניהול שנות הלימודים במערכת</p>
        </div>
        <button onClick={openAdd} data-testid="admin-school-years-add-btn"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + הוספת שנה
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">טוען...</div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-red-500 text-sm mb-4">שגיאה בטעינת הנתונים</p>
          <button onClick={fetchAll} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">נסה שוב</button>
        </div>
      ) : years.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500 text-sm">
          אין שנות לימודים רשומות
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">שנה</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">סטטוס</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {years.map(y => (
                <tr key={y.id} data-testid={`admin-school-year-row-${y.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{y.name}</td>
                  <td className="px-4 py-3">
                    {y.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">פעיל</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">לא פעיל</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button onClick={() => openEdit(y)} data-testid={`admin-school-year-edit-${y.id}`}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors">
                      עריכה
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminSchoolYearModal
        isOpen={modal.open}
        schoolYear={modal.schoolYear}
        onClose={closeModal}
        onSuccess={() => { closeModal(); fetchAll() }}
      />
    </div>
  )
}
