import { useEffect, useState, useCallback } from 'react'
import { getSchools } from '../../api/schools'
import AdminSchoolModal from '../../components/admin/AdminSchoolModal'

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modal, setModal] = useState({ open: false, school: null })

  const fetchAll = useCallback(() => {
    setLoading(true)
    setError(false)
    getSchools()
      .then(r => setSchools(r.data.results ?? r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const openAdd = () => setModal({ open: true, school: null })
  const openEdit = school => setModal({ open: true, school })
  const closeModal = () => setModal({ open: false, school: null })

  return (
    <div data-testid="admin-schools-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">בתי ספר</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">ניהול בתי הספר במערכת</p>
        </div>
        <button onClick={openAdd} data-testid="admin-schools-add-btn"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + הוספת בית ספר
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">טוען...</div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-red-500 text-sm mb-4">שגיאה בטעינת הנתונים</p>
          <button onClick={fetchAll} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">נסה שוב</button>
        </div>
      ) : schools.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500 text-sm">
          אין בתי ספר רשומים
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">שם</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">קוד מוסד</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">טלפון</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">כתובת</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {schools.map(s => (
                <tr key={s.id} data-testid={`admin-school-row-${s.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.institution_code}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.address ?? '—'}</td>
                  <td className="px-4 py-3 text-end">
                    <button onClick={() => openEdit(s)} data-testid={`admin-school-edit-${s.id}`}
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

      <AdminSchoolModal
        isOpen={modal.open}
        school={modal.school}
        onClose={closeModal}
        onSuccess={() => { closeModal(); fetchAll() }}
      />
    </div>
  )
}
