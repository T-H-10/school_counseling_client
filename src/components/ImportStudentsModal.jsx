import { useState, useRef } from 'react'
import { importStudentsExcel } from '../api/students'

export default function ImportStudentsModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile]           = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult]       = useState(null)
  const [generalError, setGeneralError] = useState(null)
  const inputRef = useRef(null)

  if (!isOpen) return null

  const reset = () => {
    setFile(null)
    setResult(null)
    setGeneralError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleClose = () => {
    if (uploading) return
    reset()
    onClose()
  }

  const handleDone = () => {
    const hadCreated = result?.created > 0
    reset()
    onClose()
    if (hadCreated) onSuccess()
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setGeneralError(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setGeneralError(null)
    try {
      const data = await importStudentsExcel(file)
      setResult(data)
    } catch (err) {
      const msg = err?.response?.data?.error ?? 'שגיאה בייבוא הקובץ. אנא נסה שוב.'
      setGeneralError(msg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !uploading) handleClose() }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">ייבוא תלמידים מ-Excel</h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {result ? (
            /* ── Results view ── */
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">הייבוא הושלם</p>
                  <p className="text-sm text-gray-500">
                    נוצרו <span className="font-semibold text-green-700">{result.created}</span> תלמידים בהצלחה
                    {result.errors.length > 0 && (
                      <span className="text-red-600"> · {result.errors.length} שגיאות</span>
                    )}
                  </p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-52 overflow-y-auto">
                  <p className="text-xs font-semibold text-red-700 mb-2">שורות שנכשלו:</p>
                  <ul className="space-y-1">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-xs text-red-600">
                        <span className="font-mono font-semibold">שורה {err.row}:</span> {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={handleDone}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                  סגור
                </button>
                {result.errors.length > 0 && (
                  <button
                    onClick={reset}
                    className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ייבוא קובץ נוסף
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ── File picker view ── */
            <div>
              <div className="mb-4 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs">
                <p className="font-semibold text-gray-700 mb-2">שורת הכותרת חייבת להכיל:</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['שם מלא','מספר זהות','כיתה','מספר כיתה','שנת לימודים'].map(col => (
                    <span key={col} className="bg-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded-full">
                      {col}
                    </span>
                  ))}
                </div>
                <p className="font-semibold text-gray-500 mb-1">ועמודות אופציונליות:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['שם אם','טלפון אם','שם אב','טלפון אב','כתובת'].map(col => (
                    <span key={col} className="bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                      {col}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 mt-2">
                  ערכי כיתה: א, ב, ג, ד, ה, ו, ז, ח — שנת לימודים לפי הפורמט שבמערכת (לדוג׳ 2025-2026)
                </p>
              </div>

              <label className="block">
                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  file
                    ? 'border-indigo-300 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                }`}>
                  {file ? (
                    <div>
                      <p className="text-sm font-medium text-indigo-700">{file.name}</p>
                      <p className="text-xs text-indigo-400 mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-400">לחץ לבחירת קובץ .xlsx</p>
                    </div>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {generalError && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-600">
                  {generalError}
                </div>
              )}

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                      מייבא...
                    </>
                  ) : (
                    'ייבוא'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={uploading}
                  className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  ביטול
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
