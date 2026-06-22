import { useState, useEffect, useRef } from 'react'
import AsyncSelect from 'react-select/async'
import toast from 'react-hot-toast'
import { createDocument, updateDocument } from '../../api/documents'
import { getClassLevels } from '../../api/classLevels'
import { loadStudentOptions } from '../../utils/studentOptions'
import { selectStyles } from '../../utils/selectStyles'
import { parseApiErrors } from '../../utils/apiError'
import { DOCUMENT_CATEGORY_OPTIONS } from '../../constants/documentCategories'

const ACCEPTED = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.txt'

const INITIAL = { category: 'general', title: '', description: '', class_number: '' }

export default function UploadDocumentModal({ isOpen, onClose, onSuccess, document: doc, defaultCategory, presetStudent, presetClassLevel, presetClassNumber }) {
  const isEdit = !!doc

  const [form, setForm]             = useState(INITIAL)
  const [file, setFile]             = useState(null)
  const [classLevels, setClassLevels] = useState([])
  const [selectedClassLevel, setSelectedClassLevel] = useState(null)
  const [selectedStudent, setSelectedStudent]       = useState(null)
  const [errors, setErrors]         = useState({})
  const [saving, setSaving]         = useState(false)
  const fileRef                     = useRef()

  // Load class levels once
  useEffect(() => {
    getClassLevels()
      .then(d => setClassLevels(Array.isArray(d) ? d : d.results ?? []))
      .catch(() => {})
  }, [])

  // Reset form when opened
  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''

    if (isEdit) {
      setForm({
        category:     doc.category,
        title:        doc.title,
        description:  doc.description ?? '',
        class_number: doc.class_number ?? '',
      })
      setSelectedClassLevel(
        doc.class_level
          ? { value: doc.class_level, label: doc.class_level_name ?? String(doc.class_level) }
          : null
      )
      setSelectedStudent(
        doc.student
          ? { value: doc.student, label: doc.student_name ?? String(doc.student) }
          : null
      )
    } else {
      setForm({ ...INITIAL, category: defaultCategory ?? 'general', class_number: presetClassNumber ?? '' })
      setSelectedClassLevel(presetClassLevel ?? null)
      setSelectedStudent(presetStudent ?? null)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  const set = (name, value) => setForm(f => ({ ...f, [name]: value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    const fd = new FormData()
    fd.append('category', form.category)
    fd.append('title', form.title)
    if (form.description) fd.append('description', form.description)
    if (form.category === 'class') {
      if (selectedClassLevel) fd.append('class_level', selectedClassLevel.value)
      if (form.class_number)  fd.append('class_number', form.class_number)
    }
    if (form.category === 'student' && selectedStudent) {
      fd.append('student', selectedStudent.value)
    }
    if (file) fd.append('file', file)

    try {
      if (isEdit) {
        await updateDocument(doc.id, fd)
        toast.success('המסמך עודכן בהצלחה')
      } else {
        await createDocument(fd)
        toast.success('המסמך הועלה בהצלחה')
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

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
  const inputCls   = 'w-full border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700'
  const errCls     = 'text-xs text-red-500 mt-0.5'

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        data-testid="upload-document-modal"
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {isEdit ? 'עריכת מסמך' : 'העלאת מסמך'}
          </h2>
          <button
            onClick={onClose}
            data-testid="upload-document-close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg leading-none"
          >✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Category */}
          <div>
            <label className={labelClass}>קטגוריה <span className="text-red-400">*</span></label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              data-testid="upload-document-category"
              className={inputCls}
              required
            >
              {DOCUMENT_CATEGORY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>כותרת <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="שם המסמך"
              data-testid="upload-document-title"
              className={inputCls}
              maxLength={255}
              required
            />
            {errors.title && <p className={errCls}>{errors.title}</p>}
          </div>

          {/* Class fields */}
          {form.category === 'class' && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelClass}>כיתה <span className="text-red-400">*</span></label>
                {presetClassLevel ? (
                  <p
                    data-testid="upload-document-class-level-preset"
                    className={`${inputCls} cursor-default text-gray-500 dark:text-gray-400`}
                  >
                    {presetClassLevel.label}׳
                  </p>
                ) : (
                  <select
                    value={selectedClassLevel?.value ?? ''}
                    onChange={e => {
                      const cl = classLevels.find(c => String(c.id) === e.target.value)
                      setSelectedClassLevel(cl ? { value: cl.id, label: cl.name } : null)
                    }}
                    data-testid="upload-document-class-level"
                    className={inputCls}
                    required
                  >
                    <option value="">בחר כיתה</option>
                    {classLevels.map(cl => (
                      <option key={cl.id} value={cl.id}>{cl.name}׳</option>
                    ))}
                  </select>
                )}
                {errors.class_level && <p className={errCls}>{errors.class_level}</p>}
              </div>
              <div className="w-28">
                <label className={labelClass}>מס׳ כיתה</label>
                {presetClassNumber ? (
                  <p
                    data-testid="upload-document-class-number-preset"
                    className={`${inputCls} cursor-default text-gray-500 dark:text-gray-400`}
                  >
                    {presetClassNumber}
                  </p>
                ) : (
                  <input
                    type="number"
                    value={form.class_number}
                    onChange={e => set('class_number', e.target.value)}
                    placeholder="1"
                    data-testid="upload-document-class-number"
                    className={inputCls}
                    min={1}
                  />
                )}
              </div>
            </div>
          )}

          {/* Student field */}
          {form.category === 'student' && (
            <div>
              <label className={labelClass}>תלמיד <span className="text-red-400">*</span></label>
              {presetStudent ? (
                <p
                  data-testid="upload-document-student-preset"
                  className={`${inputCls} cursor-default text-gray-500 dark:text-gray-400`}
                >
                  {presetStudent.label}
                </p>
              ) : (
                <AsyncSelect
                  loadOptions={loadStudentOptions}
                  onChange={setSelectedStudent}
                  value={selectedStudent}
                  placeholder="חפש תלמיד..."
                  noOptionsMessage={({ inputValue }) =>
                    inputValue.length < 2 ? 'הקלד לפחות 2 תווים לחיפוש' : 'לא נמצאו תלמידים'
                  }
                  styles={selectStyles}
                  inputId="upload-document-student"
                  data-testid="upload-document-student"
                />
              )}
              {errors.student && <p className={errCls}>{errors.student}</p>}
            </div>
          )}

          {/* Description */}
          <div>
            <label className={labelClass}>תיאור</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={2}
              placeholder="תיאור קצר (אופציונלי)"
              data-testid="upload-document-description"
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* File picker */}
          <div>
            <label className={labelClass}>
              {isEdit ? 'קובץ חדש (השאר ריק לשמירת הקובץ הנוכחי)' : <>קובץ <span className="text-red-400">*</span></>}
            </label>
            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {file ? (
                <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{file.name}</p>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {isEdit ? 'לחץ לבחירת קובץ חלופי' : 'לחץ לבחירת קובץ'}
                </p>
              )}
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">PDF, Word, Excel, PowerPoint, תמונות, טקסט · מקסימום 10MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED}
              onChange={e => setFile(e.target.files[0] ?? null)}
              data-testid="upload-document-file"
              className="hidden"
            />
            {errors.file && <p className={errCls}>{errors.file}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              data-testid="upload-document-submit"
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  שומר...
                </>
              ) : isEdit ? 'עדכן' : 'העלה'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              data-testid="upload-document-cancel"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
