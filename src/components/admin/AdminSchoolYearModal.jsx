import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createSchoolYear, updateSchoolYear } from '../../api/schoolYears'
import { parseApiErrors } from '../../utils/apiError'

const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
const inputCls =
  'w-full border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700'
const errCls = 'text-xs text-red-500 mt-0.5'

export default function AdminSchoolYearModal({ isOpen, onClose, onSuccess, schoolYear }) {
  const isEdit = !!schoolYear
  const [form, setForm] = useState({ name: '', is_active: false })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    setForm(isEdit ? { name: schoolYear.name, is_active: schoolYear.is_active } : { name: '', is_active: false })
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      if (isEdit) {
        await updateSchoolYear(schoolYear.id, form)
        toast.success('שנת הלימודים עודכנה בהצלחה')
      } else {
        await createSchoolYear(form)
        toast.success('שנת הלימודים נוספה בהצלחה')
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

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        data-testid="admin-school-year-modal"
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {isEdit ? 'עריכת שנת לימודים' : 'הוספת שנת לימודים'}
          </h2>
          <button onClick={onClose} data-testid="admin-school-year-modal-close" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>שם שנת הלימודים <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required data-testid="admin-school-year-name" className={inputCls} placeholder="לדוגמה: 2025-2026" />
            {errors.name && <p className={errCls}>{errors.name}</p>}
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} data-testid="admin-school-year-active" className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">שנה פעילה</span>
          </label>
          {form.is_active && (
            <p className="text-xs text-amber-600 dark:text-amber-400">שים לב: ייתכן שתהיה יותר משנה פעילה אחת במערכת</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} data-testid="admin-school-year-save-btn"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors">
              {saving ? 'שומר...' : isEdit ? 'שמירה' : 'הוספה'}
            </button>
            <button type="button" onClick={onClose} data-testid="admin-school-year-cancel-btn"
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium py-2 rounded-lg transition-colors">
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
