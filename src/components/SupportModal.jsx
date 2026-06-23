import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createSupportRequest } from '../api/support'
import { parseApiError } from '../utils/apiError'

const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
const inputCls =
  'w-full border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700'

export default function SupportModal({ isOpen, onClose }) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setSubject('')
    setMessage('')
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await createSupportRequest({ subject, message })
      toast.success('פנייתך נשלחה בהצלחה')
      onClose()
    } catch (err) {
      toast.error(parseApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        data-testid="support-modal"
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">פנייה למנהל המערכת</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">הפנייה תישלח למנהל המערכת</p>
          </div>
          <button onClick={onClose} data-testid="support-modal-close" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>נושא <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              data-testid="support-modal-subject"
              className={inputCls}
              placeholder="תאר את הבעיה בקצרה"
            />
          </div>
          <div>
            <label className={labelCls}>תוכן הפנייה <span className="text-red-400">*</span></label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={4}
              data-testid="support-modal-message"
              className={`${inputCls} resize-none`}
              placeholder="פרט את הבעיה או הבקשה..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} data-testid="support-modal-submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors">
              {saving ? 'שולח...' : 'שלח פנייה'}
            </button>
            <button type="button" onClick={onClose} data-testid="support-modal-cancel"
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium py-2 rounded-lg transition-colors">
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
