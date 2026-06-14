import { useState, useEffect } from 'react'
import SelectStep from './quickAction/SelectStep'
import PickStudentStep from './quickAction/PickStudentStep'

export default function QuickActionModal({
  isOpen,
  onClose,
  onActionStudent,
  onActionLesson,
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
    if (card.id === 'lesson') { onActionLesson(); return }
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
          <SelectStep onCardClick={handleCardClick} onClose={onClose} />
        )}

        {/* Body — step: pick-student */}
        {step === 'pick-student' && (
          <PickStudentStep
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            onClose={onClose}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  )
}
