export default function StudentsFilterBar({ search, onSearchChange, classLevel, onClassLevelChange, classLevels }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-52">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="חיפוש לפי שם / ת.ז."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg py-2 pr-9 pl-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>
      <select
        value={classLevel}
        onChange={e => onClassLevelChange(e.target.value)}
        className="border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
      >
        <option value="">כל הכיתות</option>
        {classLevels.map(cl => (
          <option key={cl.id} value={cl.id}>כיתה {cl.name}</option>
        ))}
      </select>
    </div>
  )
}
