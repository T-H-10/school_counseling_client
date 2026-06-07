import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createStudent } from '../api/students'
import { getClassLevels } from '../api/classLevels'
import { getSchoolYears } from '../api/schoolYears'

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

const INITIAL_FORM = {
  full_name: '',
  id_number: '',
  address: '',
  school_year: '',
  class_level: '',
  class_number: '',
  mother_name: '',
  mother_phone: '',
  father_name: '',
  father_phone: '',
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

export default function AddStudentModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm]               = useState(INITIAL_FORM)
  const [saving, setSaving]           = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [schoolYears, setSchoolYears] = useState([])
  const [classLevels, setClassLevels] = useState([])
  const [loadingLists, setLoadingLists] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setForm(INITIAL_FORM)
    setFieldErrors({})
    setLoadingLists(true)
    Promise.all([getSchoolYears(), getClassLevels()])
      .then(([sy, cl]) => {
        setSchoolYears(sy.results ?? sy)
        setClassLevels(cl.results ?? cl)
      })
      .catch(() => {})
      .finally(() => setLoadingLists(false))
  }, [isOpen])

  if (!isOpen) return null

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
    if (payload.class_number) {
      payload.class_number = parseInt(payload.class_number, 10)
    }

    try {
      await createStudent(payload)
      toast.success('התלמיד נוסף בהצלחה')
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
          <h2 className="text-base font-semibold text-gray-800">הוספת תלמיד</h2>
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

          {/* ── Enrollment ── */}
          <p className={sectionLabel}>שיוך לכיתה</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שנת לימודים <span className="text-red-400">*</span>
            </label>
            <select
              name="school_year"
              value={form.school_year}
              onChange={handleChange}
              className={fieldClass(fieldErrors.school_year)}
              required
              disabled={loadingLists}
            >
              <option value="">בחר שנת לימודים</option>
              {schoolYears.map(sy => (
                <option key={sy.id} value={sy.id}>{sy.name}</option>
              ))}
            </select>
            <FieldError msg={fieldErrors.school_year} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שכבה <span className="text-red-400">*</span>
              </label>
              <select
                name="class_level"
                value={form.class_level}
                onChange={handleChange}
                className={fieldClass(fieldErrors.class_level)}
                required
                disabled={loadingLists}
              >
                <option value="">בחר שכבה</option>
                {classLevels.map(cl => (
                  <option key={cl.id} value={cl.id}>{cl.name}</option>
                ))}
              </select>
              <FieldError msg={fieldErrors.class_level} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מספר כיתה <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="class_number"
                value={form.class_number}
                onChange={handleChange}
                placeholder="1"
                className={`${fieldClass(fieldErrors.class_number)} font-mono`}
                min={1}
                max={99}
                required
              />
              <FieldError msg={fieldErrors.class_number} />
            </div>
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
              disabled={saving || loadingLists}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  שומר...
                </>
              ) : (
                'הוסף תלמיד'
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
