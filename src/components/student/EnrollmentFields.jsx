import { fieldClass, sectionLabel } from '../../utils/formClasses'
import FieldError from '../ui/FieldError'

export default function EnrollmentFields({ form, fieldErrors, onChange, schoolYears, classLevels, loadingLists }) {
  return (
    <>
      {/* ── Enrollment ── */}
      <p className={sectionLabel}>שיוך לכיתה</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שנת לימודים <span className="text-red-400">*</span>
        </label>
        <select
          name="school_year"
          value={form.school_year}
          onChange={onChange}
          className={fieldClass(fieldErrors.school_year)}
          required
          disabled={loadingLists}
        >
          <option value="">בחר שנת לימודים</option>
          {schoolYears.map(sy => (
            <option key={sy.id} value={sy.id}>{sy.name}</option>
          ))}
        </select>
        <FieldError msg={fieldErrors.school_year} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            שכבה <span className="text-red-400">*</span>
          </label>
          <select
            name="class_level"
            value={form.class_level}
            onChange={onChange}
            className={fieldClass(fieldErrors.class_level)}
            required
            disabled={loadingLists}
          >
            <option value="">בחר שכבה</option>
            {classLevels.map(cl => (
              <option key={cl.id} value={cl.id}>{cl.name}</option>
            ))}
          </select>
          <FieldError msg={fieldErrors.class_level} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            מספר כיתה <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="class_number"
            value={form.class_number}
            onChange={onChange}
            placeholder="1"
            className={`${fieldClass(fieldErrors.class_number)} font-mono`}
            min={1}
            max={99}
            required
          />
          <FieldError msg={fieldErrors.class_number} />
        </div>
      </div>
    </>
  )
}
