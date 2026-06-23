import { useEffect, useState, useCallback } from 'react'
import { getCounselors } from '../../api/counselors'
import { getSchools } from '../../api/schools'
import AdminCounselorModal from '../../components/admin/AdminCounselorModal'

export default function AdminCounselorsPage() {
  const [counselors, setCounselors] = useState([])
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modal, setModal] = useState({ open: false, counselor: null })

  const fetchAll = useCallback(() => {
    setLoading(true)
    setError(false)
    Promise.all([getCounselors(), getSchools()])
      .then(([cr, sr]) => {
        setCounselors(cr.data.results ?? cr.data)
        setSchools(sr.data.results ?? sr.data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const schoolName = id => schools.find(s => s.id === id)?.name ?? id

  const openAdd = () => setModal({ open: true, counselor: null })
  const openEdit = counselor => setModal({ open: true, counselor })
  const closeModal = () => setModal({ open: false, counselor: null })

  return (
    <div data-testid="admin-counselors-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">יועצים</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">ניהול יועצי בית הספר</p>
        </div>
        <button onClick={openAdd} data-testid="admin-counselors-add-btn"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + הוספת יועץ/ת
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">טוען...</div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-red-500 text-sm mb-4">שגיאה בטעינת הנתונים</p>
          <button onClick={fetchAll} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">נסה שוב</button>
        </div>
      ) : counselors.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500 text-sm">
          אין יועצים רשומים
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">שם מלא</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">שם משתמש</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">בית ספר</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {counselors.map(c => (
                <tr key={c.id} data-testid={`admin-counselor-row-${c.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{c.full_name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.username ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{schoolName(c.school)}</td>
                  <td className="px-4 py-3 text-end">
                    <button onClick={() => openEdit(c)} data-testid={`admin-counselor-edit-${c.id}`}
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

      <AdminCounselorModal
        isOpen={modal.open}
        counselor={modal.counselor}
        onClose={closeModal}
        onSuccess={() => { closeModal(); fetchAll() }}
      />
    </div>
  )
}
