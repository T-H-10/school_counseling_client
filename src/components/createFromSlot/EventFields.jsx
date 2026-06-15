import AsyncSelect from 'react-select/async'
import { EVENT_TYPE_OPTIONS } from '../../constants/eventTypes'
import { inputClass } from '../../utils/formClasses'
import { selectStyles } from '../../utils/selectStyles'
import { loadStudentOptions } from '../../utils/studentOptions'

export default function EventFields({ student, setStudent, eventType, setEventType }) {
  return (
    <>
      <div data-testid="create-student-select">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          תלמיד <span className="text-red-400">*</span>
        </label>
        <AsyncSelect
          value={student}
          onChange={setStudent}
          loadOptions={loadStudentOptions}
          placeholder="הקלד שם או ת.ז. לחיפוש..."
          noOptionsMessage={({ inputValue }) =>
            !inputValue || inputValue.length < 2
              ? 'הקלד לפחות 2 תווים'
              : 'לא נמצאו תלמידים'
          }
          loadingMessage={() => 'מחפש...'}
          styles={selectStyles}
          isRtl
          isClearable
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          סוג אירוע <span className="text-red-400">*</span>
        </label>
        <select
          value={eventType}
          onChange={e => setEventType(e.target.value)}
          data-testid="create-event-type"
          className={inputClass}
          required
        >
          {EVENT_TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </>
  )
}
