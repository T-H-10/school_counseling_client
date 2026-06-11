import { CARDS } from './cards'

export default function SelectStep({ onCardClick, onClose }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-6">
        {CARDS.map(card => (
          <div
            key={card.id}
            onClick={() => onCardClick(card)}
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
  )
}
