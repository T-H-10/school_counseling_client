import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { updateStudent } from '../api/students'

function parseApiErrors(err) {
  const data = err?.response?.data
  if (!data) return { fields: {}, general: 'שגיאה בשמירה, אנא נסה שוב' }
  if (typeof data === 'string') return { fields: {}, general: data }
  if (typeof data === 'object') {
    const fields = {}
    let general = null
    for (const [key, val] of Object.entries(data)) {
      const msg = Array.isArray(val) ? val[0] : val
      const str = typeof msg === 'string' ? msg : JSON.stringify(msg)
      if (key === 'non_field_errors' || key === 'detail') {
        general = str
      } else {
        fields[key] = str
      }
    }
    return { fields, general: general ?? (Object.keys(fields).length === 0 ? 'שגיאה בשמירה, אנא נסה שוב' : null) }
  }
  return { fields: {}, general: 'שגיאה בשמירה, אנא נסה שוב' }
}

const sectionLabel = 'text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1'

function fieldClass(err) {
  return `w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 bg-white ${
    err
      ? 'border-red-400 focus:ring-red-200 text-gray-700'
      : 'border-gray-200 focus:ring-indigo-300 text-gray-700'
  }`
}

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-xs text-red-500 mt-1">{msg}</p>
}

export default function EditStudentModal({ isOpen, onClose, onSuccess, student }) {
  const [form, setForm]               = useState({})
  const [saving, setSaving]           = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!isOpen || !student) return
    setForm({
      full_name:    student.full_name    ?? '',
      id_number:    student.id_number    ?? '',
      address:      student.address      ?? '',
      mother_name:  student.mother_name  ?? '',
      mother_phone: student.mother_phone ?? '',
      father_name:  student.father_name  ?? '',
      father_phone: student.father_phone ?? '',
    })
    setFieldErrors({})
  }, [isOpen, student])

  if (!isOpen || !student) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[name]; return next })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFieldErrors({})

    const payload = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== '')
    )

    try {
      await updateStudent(student.id, payload)
      toast.success('פרטי התלמיד עודכנו בהצלחה')
      onSuccess()
    } catch (err) {
      const { fields, general } = parseApiErrors(err)
      setFieldErrors(fields)
      if (general) toast.error(general)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-800">עריכת פרטי תלמיד</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* ── Personal details ── */}
          <p className={sectionLabel}>פרטי תלמיד</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם מלא <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="שם פרטי ושם משפחה"
              className={fieldClass(fieldErrors.full_name)}
              maxLength={150}
              required
            />
            <FieldError msg={fieldErrors.full_name} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תעודת זהות <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="id_number"
              value={form.id_number}
              onChange={handleChange}
              placeholder="8–9 ספרות"
              className={`${fieldClass(fieldErrors.id_number)} font-mono`}
              maxLength={9}
              required
            />
            <FieldError msg={fieldErrors.id_number} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="כתובת מגורים"
              className={fieldClass(fieldErrors.address)}
              maxLength={255}
            />
            <FieldError msg={fieldErrors.address} />
          </div>

          {/* ── Parent details ── */}
          <p className={sectionLabel}>פרטי הורים</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם אם</label>
              <input
                type="text"
                name="mother_name"
                value={form.mother_name}
                onChange={handleChange}
                placeholder="שם האם"
                className={fieldClass(fieldErrors.mother_name)}
                maxLength={100}
              />
              <FieldError msg={fieldErrors.mother_name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">טלפון אם</label>
              <input
                type="tel"
                name="mother_phone"
                value={form.mother_phone}
                onChange={handleChange}
                placeholder="05X-XXXXXXX"
                className={`${fieldClass(fieldErrors.mother_phone)} font-mono`}
                maxLength={20}
              />
              <FieldError msg={fieldErrors.mother_phone} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם אב</label>
              <input
                type="text"
                name="father_name"
                value={form.father_name}
                onChange={handleChange}
                placeholder="שם האב"
                className={fieldClass(fieldErrors.father_name)}
                maxLength={100}
              />
              <FieldError msg={fieldErrors.father_name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">טלפון אב</label>
              <input
                type="tel"
                name="father_phone"
                value={form.father_phone}
                onChange={handleChange}
                placeholder="05X-XXXXXXX"
                className={`${fieldClass(fieldErrors.father_phone)} font-mono`}
                maxLength={20}
              />
              <FieldError msg={fieldErrors.father_phone} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  שומר...
                </>
              ) : (
                'שמור שינויים'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
