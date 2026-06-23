export default function EnrollmentHistory({ enrollments }) {
  return (
    <div
      data-testid="enrollment-history"
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-4"
    >
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 text-right">
        היסטוריית כיתות ומחנכים
      </h2>

      {enrollments.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-right">אין נתוני רישום</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="pb-2 font-medium text-gray-500 dark:text-gray-400">שנת לימודים</th>
                <th className="pb-2 font-medium text-gray-500 dark:text-gray-400">כיתה</th>
                <th className="pb-2 font-medium text-gray-500 dark:text-gray-400">מחנכ/ת</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {enrollments.map(e => (
                <tr
                  key={e.id}
                  data-testid="enrollment-history-row"
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-2.5 text-gray-700 dark:text-gray-300">{e.school_year_name}</td>
                  <td className="py-2.5 text-gray-700 dark:text-gray-300">
                    {e.class_level_name
                      ? `${e.class_level_name}׳ ${e.class_number}`
                      : e.class_number ?? '—'}
                  </td>
                  <td className="py-2.5 text-gray-500 dark:text-gray-400">
                    {e.teacher_name || 'לא הוגדר/ה'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
