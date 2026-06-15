import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createStudent } from '../api/students'
import { getClassLevels } from '../api/classLevels'
import { getSchoolYears } from '../api/schoolYears'
import { parseApiErrors } from '../utils/apiError'
import PersonalFields from './student/PersonalFields'
import EnrollmentFields from './student/EnrollmentFields'
import ParentFields from './student/ParentFields'

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
        data-testid="add-student-modal"
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-800">הוספת תלמיד</h2>
          <button
            onClick={onClose}
            disabled={saving}
            data-testid="add-student-close"
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          <PersonalFields form={form} fieldErrors={fieldErrors} onChange={handleChange} />

          <EnrollmentFields
            form={form}
            fieldErrors={fieldErrors}
            onChange={handleChange}
            schoolYears={schoolYears}
            classLevels={classLevels}
            loadingLists={loadingLists}
          />

          <ParentFields form={form} fieldErrors={fieldErrors} onChange={handleChange} />

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || loadingLists}
              data-testid="add-student-submit"
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
              data-testid="add-student-cancel"
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
