import { inputClass } from '../../utils/formClasses'

export default function SessionFields({
  schoolYear,
  setSchoolYear,
  classLevel,
  setClassLevel,
  activeYears,
  otherYears,
  classLevels,
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שנת לימודים <span className="text-red-400">*</span>
        </label>
        <select
          value={schoolYear}
          onChange={e => setSchoolYear(e.target.value)}
          className={inputClass}
          required
        >
          <option value="">בחר שנה</option>
          {activeYears.map(y => (
            <option key={y.id} value={y.id}>{y.name} (פעיל)</option>
          ))}
          {otherYears.map(y => (
            <option key={y.id} value={y.id}>{y.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          כיתה <span className="text-red-400">*</span>
        </label>
        <select
          value={classLevel}
          onChange={e => setClassLevel(e.target.value)}
          className={inputClass}
          required
        >
          <option value="">בחר כיתה</option>
          {classLevels.map(cl => (
            <option key={cl.id} value={cl.id}>{cl.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
