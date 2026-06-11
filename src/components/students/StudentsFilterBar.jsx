export default function StudentsFilterBar({ search, onSearchChange, classLevel, onClassLevelChange, classLevels }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-52">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="חיפוש חכם (שם, טלפון, ת״ז)..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pr-9 pl-3 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
        />
      </div>
      <select
        value={classLevel}
        onChange={e => onClassLevelChange(e.target.value)}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
      >
        <option value="">כל השכבות</option>
        {classLevels.map(cl => (
          <option key={cl.id} value={cl.id}>שכבה {cl.name}</option>
        ))}
      </select>
    </div>
  )
}
