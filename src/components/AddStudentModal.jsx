import { useState, useEffect } from 'react'
import { createStudent } from '../api/students'

function parseApiError(err) {
  const data = err?.response?.data
  if (!data) return 'שגיאה בשמירה, אנא נסה שוב'
  if (typeof data === 'string') return data
  const first = Object.values(data)[0]
  if (Array.isArray(first)) return first[0]
  if (typeof first === 'string') return first
  return 'שגיאה בשמירה, אנא נסה שוב'
}

const INITIAL_FORM = {
  full_name: '',
  id_number: '',
  address: '',
  mother_name: '',
  mother_phone: '',
  father_name: '',
  father_phone: '',
}

const inputClass =
  'w-full border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white'

export default function AddStudentModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm]         = useState(INITIAL_FORM)
  const [saving, setSaving]     = useState(false)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM)
      setApiError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setApiError(null)
    const payload = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== '')
    )
    try {
      await createStudent(payload)
      onSuccess()
    } catch (err) {
      setApiError(parseApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-800">הוספת תלמיד</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">פרטי תלמיד</p>

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
              className={inputClass}
              maxLength={150}
              required
            />
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
              className={`${inputClass} font-mono`}
              maxLength={9}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="כתובת מגורים"
              className={inputClass}
              maxLength={255}
            />
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1">פרטי הורים</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם אם</label>
              <input
                type="text"
                name="mother_name"
                value={form.mother_name}
                onChange={handleChange}
                placeholder="שם האם"
                className={inputClass}
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">טלפון אם</label>
              <input
                type="tel"
                name="mother_phone"
                value={form.mother_phone}
                onChange={handleChange}
                placeholder="05X-XXXXXXX"
                className={`${inputClass} font-mono`}
                maxLength={20}
              />
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
                className={inputClass}
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">טלפון אב</label>
              <input
                type="tel"
                name="father_phone"
                value={form.father_phone}
                onChange={handleChange}
                placeholder="05X-XXXXXXX"
                className={`${inputClass} font-mono`}
                maxLength={20}
              />
            </div>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

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
