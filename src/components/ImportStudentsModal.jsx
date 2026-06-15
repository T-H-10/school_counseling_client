import { useState, useRef } from 'react'
import { importStudentsExcel } from '../api/students'
import ImportResultsView from './importStudents/ImportResultsView'
import ImportFilePicker from './importStudents/ImportFilePicker'

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
        data-testid="import-students-modal"
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">ייבוא תלמידים מ-Excel</h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            data-testid="import-students-close"
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {result ? (
            <ImportResultsView result={result} onDone={handleDone} onReset={reset} />
          ) : (
            <ImportFilePicker
              file={file}
              uploading={uploading}
              generalError={generalError}
              inputRef={inputRef}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              onCancel={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}
