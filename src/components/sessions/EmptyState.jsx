export default function EmptyState({ onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium mb-1">אין שיעורים עדיין</p>
      <p className="text-sm text-gray-400 mb-4">הוסף שיעור ראשון לתחילת המעקב</p>
      <button
        onClick={onAdd}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        + הוסף שיעור
      </button>
    </div>
  )
}
