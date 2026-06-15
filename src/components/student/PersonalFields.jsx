import { fieldClass, sectionLabel } from '../../utils/formClasses'
import FieldError from '../ui/FieldError'

export default function PersonalFields({ form, fieldErrors, onChange }) {
  return (
    <>
      {/* ── Personal details ── */}
      <p className={sectionLabel}>פרטי תלמיד</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שם מלא <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={onChange}
          placeholder="שם פרטי ושם משפחה"
          data-testid="student-full-name"
          className={fieldClass(fieldErrors.full_name)}
          maxLength={150}
          required
        />
        <FieldError msg={fieldErrors.full_name} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          תעודת זהות <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="id_number"
          value={form.id_number}
          onChange={onChange}
          placeholder="8–9 ספרות"
          data-testid="student-id-number"
          className={`${fieldClass(fieldErrors.id_number)} font-mono`}
          maxLength={9}
          required
        />
        <FieldError msg={fieldErrors.id_number} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={onChange}
          placeholder="כתובת מגורים"
          data-testid="student-address"
          className={fieldClass(fieldErrors.address)}
          maxLength={255}
        />
        <FieldError msg={fieldErrors.address} />
      </div>
    </>
  )
}
