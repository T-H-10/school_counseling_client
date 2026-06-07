import { useAuth } from '../../context/AuthContext'

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 right-64 left-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        יציאה
      </button>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">
            שלום, {user?.username}
          </p>
          <p className="text-xs text-gray-400">יועץ בית ספרי</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
          {user?.username?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  )
}
