import { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import { getStudents } from '../api/students'

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#a5b4fc' : '#e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: state.isFocused ? '0 0 0 2px #c7d2fe' : 'none',
    fontSize: '0.875rem',
    minHeight: '38px',
    '&:hover': { borderColor: '#a5b4fc' },
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#eef2ff' : 'white',
    color: '#374151',
    fontSize: '0.875rem',
  }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
  singleValue: (base) => ({ ...base, fontSize: '0.875rem' }),
}

// RTL grid-cols-2: DOM[0]→right, DOM[1]→left. Pairs reversed so פגישה lands left and תלמידה right — matching the design.
const CARDS = [
  {
    id: 'student',
    label: 'תלמידה',
    icon: '🧒',
    iconBg: 'bg-blue-100',
    cardBg: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
  },
  {
    id: 'meeting',
    label: 'פגישה',
    icon: '📅',
    iconBg: 'bg-green-100',
    cardBg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-2 border-green-400 dark:border-green-600',
  },
  {
    id: 'session',
    label: 'שיעור',
    icon: '📚',
    iconBg: 'bg-purple-100',
    cardBg: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
  },
  {
    id: 'document',
    label: 'מסמך',
    icon: '📄',
    iconBg: 'bg-orange-100',
    cardBg: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
    disabled: true,
  },
]

async function loadStudentOptions(inputValue) {
  if (!inputValue || inputValue.length < 2) return []
  try {
    const data = await getStudents({ search: inputValue, page: 1 })
    return (data.results ?? []).map(s => ({
      value: s.id,
      label: `${s.full_name} | ${s.id_number}`,
    }))
  } catch {
    return []
  }
}

export default function QuickActionModal({
  isOpen,
  onClose,
  onActionStudent,
  onActionSession,
  onActionEvent,
}) {
  const [step, setStep] = useState('select')
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setStep('select')
      setSelectedStudent(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  function handleCardClick(card) {
    if (card.disabled) return
    if (card.id === 'meeting') { setStep('pick-student'); return }
    if (card.id === 'student') { onActionStudent(); return }
    if (card.id === 'session') { onActionSession(); return }
  }

  function handleContinue() {
    if (!selectedStudent) return
    onActionEvent(selectedStudent.value)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-600 px-5 py-4">
          {step === 'pick-student' ? (
            <button
              onClick={() => setStep('select')}
              className="text-blue-200 hover:text-white transition-colors"
              aria-label="חזרה"
            >
              {/* Chevron-right mirrored for RTL "back" */}
              <svg className="w-5 h-5 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <span className="text-white text-lg font-light">+</span>
          )}

          <h2 className="text-white font-bold text-base">
            {step === 'pick-student' ? 'בחר תלמיד/ה' : 'פעולה מהירה'}
          </h2>

          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white transition-colors"
            aria-label="סגור"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — step: select */}
        {step === 'select' && (
          <>
            <div className="grid grid-cols-2 gap-4 p-6">
              {CARDS.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`relative rounded-2xl p-6 flex flex-col items-center gap-3 transition-all select-none
                    ${card.cardBg} ${card.border}
                    ${card.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
                    }`}
                >
                  {card.disabled && (
                    <span className="absolute top-2 end-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
                      בקרוב
                    </span>
                  )}
                  <div className={`w-14 h-14 rounded-full ${card.iconBg} flex items-center justify-center text-2xl`}>
                    {card.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-3">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                ביטול
              </button>
            </div>
          </>
        )}

        {/* Body — step: pick-student */}
        {step === 'pick-student' && (
          <>
            <div className="px-6 pt-5 pb-4">
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
                onClick={handleContinue}
                disabled={!selectedStudent}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                המשך
                <svg className="w-4 h-4 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
