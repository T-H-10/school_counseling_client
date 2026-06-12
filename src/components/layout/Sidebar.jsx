import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', label: 'דף הבית', emoji: '🏠', end: true },
  { to: '/students', label: 'תלמידים', emoji: '🎒' },
  { to: '/classes', label: 'כיתות', emoji: '🏫' },
  { to: '/sessions', label: 'שיעורים', emoji: '📚' },
  { to: '/calendar', label: 'יומן', emoji: '📅' },
  { to: null, label: 'מסמכים', emoji: '📄', disabled: true },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const username = user?.username ?? ''

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col z-30 transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-700 dark:text-blue-400">EduCare</span>
            <span className="text-xl">🧠</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, emoji, end, disabled }) =>
            disabled ? (
              <span
                key={label}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60 select-none"
              >
                <span className="text-base leading-none">{emoji}</span>
                <span>{label}</span>
                <span className="mr-auto text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded">
                  בקרוב
                </span>
              </span>
            ) : (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`
                }
              >
                <span className="text-base leading-none">{emoji}</span>
                {label}
              </NavLink>
            )
          )}
        </nav>

        {/* User section */}
        {username && (
          <div className="border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="px-4 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 text-sm font-bold shrink-0">
                {username[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{username}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">יועץ/ת בית ספרי</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors border-t border-gray-100 dark:border-gray-800"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              יציאה מהמערכת
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
