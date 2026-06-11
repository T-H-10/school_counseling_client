import { fieldClass, sectionLabel } from '../../utils/formClasses'
import FieldError from '../ui/FieldError'

export default function ParentFields({ form, fieldErrors, onChange }) {
  return (
    <>
      {/* ── Parent details ── */}
      <p className={sectionLabel}>פרטי הורים</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">שם אם</label>
          <input
            type="text"
            name="mother_name"
            value={form.mother_name}
            onChange={onChange}
            placeholder="שם האם"
            className={fieldClass(fieldErrors.mother_name)}
            maxLength={100}
          />
          <FieldError msg={fieldErrors.mother_name} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">טלפון אם</label>
          <input
            type="tel"
            name="mother_phone"
            value={form.mother_phone}
            onChange={onChange}
            placeholder="05X-XXXXXXX"
            className={`${fieldClass(fieldErrors.mother_phone)} font-mono`}
            maxLength={20}
          />
          <FieldError msg={fieldErrors.mother_phone} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">שם אב</label>
          <input
            type="text"
            name="father_name"
            value={form.father_name}
            onChange={onChange}
            placeholder="שם האב"
            className={fieldClass(fieldErrors.father_name)}
            maxLength={100}
          />
          <FieldError msg={fieldErrors.father_name} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">טלפון אב</label>
          <input
            type="tel"
            name="father_phone"
            value={form.father_phone}
            onChange={onChange}
            placeholder="05X-XXXXXXX"
            className={`${fieldClass(fieldErrors.father_phone)} font-mono`}
            maxLength={20}
          />
          <FieldError msg={fieldErrors.father_phone} />
        </div>
      </div>
    </>
  )
}
