export default function StatCard({ label, value, colorClass, icon, urgent }) {
  if (urgent) {
    return (
      <div data-testid="dashboard-stat" data-stat-label={label} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-red-300 dark:border-red-700 p-5 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{value}</p>
          <p className="text-sm text-red-500 dark:text-red-400 mt-0.5">{label}</p>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-red-50 dark:bg-red-950 shrink-0">
          ⚠️
        </div>
      </div>
    )
  }
  return (
    <div data-testid="dashboard-stat" data-stat-label={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 ${colorClass}`}>
        {icon}
      </div>
    </div>
  )
}
