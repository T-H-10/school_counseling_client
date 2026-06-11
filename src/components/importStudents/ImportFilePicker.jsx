export default function ImportFilePicker({
  file,
  uploading,
  generalError,
  inputRef,
  onFileChange,
  onUpload,
  onCancel,
}) {
  return (
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
          onChange={onFileChange}
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
          onClick={onUpload}
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
          onClick={onCancel}
          disabled={uploading}
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          ביטול
        </button>
      </div>
    </div>
  )
}
