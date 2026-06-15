export default function StudentsToolbar({ studentCount, exporting, onExport, onImport, onAdd }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">תלמידים</h1>
        {studentCount !== undefined && (
          <p className="text-sm text-gray-400 mt-1" data-testid="students-count">{studentCount} תלמידים סה״כ</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          disabled={exporting}
          data-testid="students-export"
          className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          <span>📤</span>
          {exporting ? 'מייצא...' : 'יצוא'}
        </button>
        <button
          onClick={onImport}
          data-testid="students-import"
          className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          <span>📥</span>
          יבוא
        </button>
        <button
          onClick={onAdd}
          data-testid="students-add"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          <span className="text-base leading-none">+</span>
          תלמיד/ה חדש/ה
        </button>
      </div>
    </div>
  )
}
