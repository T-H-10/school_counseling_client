export default function StudentsToolbar({ studentCount, exporting, onExport, onImport, onAdd }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">תלמידים</h1>
        {studentCount !== undefined && (
          <p className="text-sm text-gray-400 mt-1">{studentCount} תלמידים סה״כ</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          disabled={exporting}
          className="border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {exporting ? 'מייצא...' : 'ייצוא ל-Excel'}
        </button>
        <button
          onClick={onImport}
          className="border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          ייבוא מ-Excel
        </button>
        <button
          onClick={onAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          + הוסף תלמיד
        </button>
      </div>
    </div>
  )
}
