import AsyncSelect from 'react-select/async'
import { selectStyles } from '../../utils/selectStyles'
import { loadStudentOptions } from '../../utils/studentOptions'

export default function PickStudentStep({ selectedStudent, setSelectedStudent, onClose, onContinue }) {
  return (
    <>
      <div className="px-6 pt-5 pb-4" data-testid="quick-action-student-select">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          בחר תלמיד/ה לפגישה
        </label>
        <AsyncSelect
          value={selectedStudent}
          onChange={setSelectedStudent}
          loadOptions={loadStudentOptions}
          placeholder="חפש לפי שם או ת.ז."
          noOptionsMessage={({ inputValue }) =>
            !inputValue || inputValue.length < 2
              ? 'הקלד לפחות 2 תווים'
              : 'לא נמצאו תלמידים'
          }
          styles={selectStyles}
          isClearable
        />
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          ביטול
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedStudent}
          data-testid="quick-action-continue"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          המשך
          <svg className="w-4 h-4 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  )
}
