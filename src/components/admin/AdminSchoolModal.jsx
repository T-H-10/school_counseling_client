import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createSchool, updateSchool } from '../../api/schools'
import { parseApiErrors } from '../../utils/apiError'

const EMPTY = { name: '', institution_code: '', address: '', phone: '' }

const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
const inputCls =
  'w-full border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700'
const errCls = 'text-xs text-red-500 mt-0.5'

export default function AdminSchoolModal({ isOpen, onClose, onSuccess, school }) {
  const isEdit = !!school
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    setForm(isEdit ? { name: school.name, institution_code: school.institution_code, address: school.address ?? '', phone: school.phone ?? '' } : EMPTY)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      if (isEdit) {
        await updateSchool(school.id, form)
        toast.success('בית הספר עודכן בהצלחה')
      } else {
        await createSchool(form)
        toast.success('בית הספר נוסף בהצלחה')
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
        data-testid="admin-school-modal"
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {isEdit ? 'עריכת בית ספר' : 'הוספת בית ספר'}
          </h2>
          <button onClick={onClose} data-testid="admin-school-modal-close" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>שם <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required data-testid="admin-school-name" className={inputCls} placeholder="שם בית הספר" />
            {errors.name && <p className={errCls}>{errors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>קוד מוסד <span className="text-red-400">*</span></label>
            <input type="text" value={form.institution_code} onChange={e => set('institution_code', e.target.value)} required data-testid="admin-school-institution-code" className={inputCls} placeholder="123456" />
            {errors.institution_code && <p className={errCls}>{errors.institution_code}</p>}
          </div>
          <div>
            <label className={labelCls}>כתובת</label>
            <input type="text" value={form.address} onChange={e => set('address', e.target.value)} data-testid="admin-school-address" className={inputCls} placeholder="רחוב, עיר" />
            {errors.address && <p className={errCls}>{errors.address}</p>}
          </div>
          <div>
            <label className={labelCls}>טלפון</label>
            <input type="text" value={form.phone} onChange={e => set('phone', e.target.value)} data-testid="admin-school-phone" className={inputCls} placeholder="05XXXXXXXX" />
            {errors.phone && <p className={errCls}>{errors.phone}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} data-testid="admin-school-save-btn"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors">
              {saving ? 'שומר...' : isEdit ? 'שמירה' : 'הוספה'}
            </button>
            <button type="button" onClick={onClose} data-testid="admin-school-cancel-btn"
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium py-2 rounded-lg transition-colors">
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
