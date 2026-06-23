import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createCounselor, updateCounselor, resetCounselorPassword } from '../../api/counselors'
import { getSchools } from '../../api/schools'
import { parseApiErrors } from '../../utils/apiError'

const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
const inputCls =
  'w-full border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700'
const errCls = 'text-xs text-red-500 mt-0.5'

export default function AdminCounselorModal({ isOpen, onClose, onSuccess, counselor }) {
  const isEdit = !!counselor
  const [form, setForm] = useState({ full_name: '', username: '', password: '', school: '' })
  const [schools, setSchools] = useState([])
  const [resetPw, setResetPw] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSchools().then(r => setSchools(r.data.results ?? r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    setShowReset(false)
    setResetPw('')
    setForm(isEdit
      ? { full_name: counselor.full_name, username: '', password: '', school: counselor.school }
      : { full_name: '', username: '', password: '', school: '' })
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const payload = isEdit
        ? { full_name: form.full_name, school: form.school }
        : form
      if (isEdit) {
        await updateCounselor(counselor.id, payload)
        toast.success('היועץ/ת עודכן בהצלחה')
      } else {
        await createCounselor(payload)
        toast.success('היועץ/ת נוסף בהצלחה')
      }
      onSuccess()
    } catch (err) {
      const { fields, general } = parseApiErrors(err)
      setErrors(fields)
      if (general) toast.error(general)
    } finally {
      setSaving(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetPw.trim()) return
    setSaving(true)
    try {
      await resetCounselorPassword(counselor.id, resetPw)
      toast.success('הסיסמה אופסה בהצלחה')
      setShowReset(false)
      setResetPw('')
    } catch {
      toast.error('שגיאה באיפוס הסיסמה')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        data-testid="admin-counselor-modal"
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {isEdit ? 'עריכת יועץ/ת' : 'הוספת יועץ/ת'}
          </h2>
          <button onClick={onClose} data-testid="admin-counselor-modal-close" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>שם מלא <span className="text-red-400">*</span></label>
            <input type="text" value={form.full_name} onChange={e => set('full_name', e.target.value)} required data-testid="admin-counselor-fullname" className={inputCls} placeholder="שם פרטי ושם משפחה" />
            {errors.full_name && <p className={errCls}>{errors.full_name}</p>}
          </div>

          {!isEdit && (
            <>
              <div>
                <label className={labelCls}>שם משתמש <span className="text-red-400">*</span></label>
                <input type="text" value={form.username} onChange={e => set('username', e.target.value)} required data-testid="admin-counselor-username" className={inputCls} placeholder="שם משתמש לכניסה" />
                {errors.username && <p className={errCls}>{errors.username}</p>}
              </div>
              <div>
                <label className={labelCls}>סיסמה <span className="text-red-400">*</span></label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required data-testid="admin-counselor-password" className={inputCls} placeholder="סיסמה ראשונית" />
                {errors.password && <p className={errCls}>{errors.password}</p>}
              </div>
            </>
          )}

          <div>
            <label className={labelCls}>בית ספר <span className="text-red-400">*</span></label>
            <select value={form.school} onChange={e => set('school', e.target.value)} required data-testid="admin-counselor-school" className={inputCls}>
              <option value="">-- בחר בית ספר --</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.school && <p className={errCls}>{errors.school}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} data-testid="admin-counselor-save-btn"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors">
              {saving ? 'שומר...' : isEdit ? 'שמירה' : 'הוספה'}
            </button>
            <button type="button" onClick={onClose} data-testid="admin-counselor-cancel-btn"
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium py-2 rounded-lg transition-colors">
              ביטול
            </button>
          </div>
        </form>

        {/* Reset password section — edit mode only */}
        {isEdit && (
          <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800 pt-4">
            {!showReset ? (
              <button onClick={() => setShowReset(true)} data-testid="admin-counselor-reset-pw-toggle"
                className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium transition-colors">
                איפוס סיסמה
              </button>
            ) : (
              <div className="space-y-2">
                <label className={labelCls}>סיסמה חדשה</label>
                <input type="password" value={resetPw} onChange={e => setResetPw(e.target.value)} data-testid="admin-counselor-new-pw" className={inputCls} placeholder="הזן סיסמה חדשה" />
                <div className="flex gap-2 pt-1">
                  <button onClick={handleResetPassword} disabled={saving || !resetPw.trim()} data-testid="admin-counselor-reset-pw-btn"
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
                    איפוס
                  </button>
                  <button onClick={() => setShowReset(false)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">ביטול</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
