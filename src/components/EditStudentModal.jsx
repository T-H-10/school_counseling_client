import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { updateStudent } from '../api/students'
import { parseApiErrors } from '../utils/apiError'
import { validateIsraeliId } from '../utils/validateId'
import PersonalFields from './student/PersonalFields'
import ParentFields from './student/ParentFields'

export default function EditStudentModal({ isOpen, onClose, onSuccess, student }) {
  const [form, setForm]               = useState({})
  const [saving, setSaving]           = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!isOpen || !student) return
    setForm({
      full_name:      student.full_name      ?? '',
      id_number:      student.id_number      ?? '',
      address:        student.address        ?? '',
      notes:          student.notes          ?? '',
      mother_name:    student.mother_name    ?? '',
      mother_phone:   student.mother_phone   ?? '',
      father_name:    student.father_name    ?? '',
      father_phone:   student.father_phone   ?? '',
      parents_status: student.parents_status ?? '',
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

    if (!validateIsraeliId(form.id_number)) {
      setFieldErrors({ id_number: ['מספר תעודת זהות לא תקין'] })
      setSaving(false)
      return
    }

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
        data-testid="edit-student-modal"
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-800">עריכת פרטי תלמיד</h2>
          <button
            onClick={onClose}
            disabled={saving}
            data-testid="edit-student-close"
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          <PersonalFields form={form} fieldErrors={fieldErrors} onChange={handleChange} />

          <ParentFields form={form} fieldErrors={fieldErrors} onChange={handleChange} />

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              data-testid="edit-student-submit"
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
              data-testid="edit-student-cancel"
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
