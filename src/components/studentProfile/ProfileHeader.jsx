export default function ProfileHeader({
  student,
  onAddEvent,
  onEdit,
  archiveConfirm,
  setArchiveConfirm,
  onArchive,
  archiving,
  archiveError,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-indigo-600">
            {student.full_name?.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-gray-800" data-testid="student-profile-name">{student.full_name}</h1>
            {student.current_class_level && (
              <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                כיתה {student.current_class_level}׳ {student.current_class_number}
              </span>
            )}
            {student.is_graduated && (
              <span
                data-testid="student-profile-graduated-badge"
                className="bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
              >
                בוגר/ת {student.graduation_year ?? ''}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-mono mb-1" data-testid="student-profile-id">ת.ז. {student.id_number}</p>
          {student.current_teacher && (
            <p className="text-sm text-gray-400 mb-4">מחנכ/ת: {student.current_teacher}</p>
          )}
          {!student.current_teacher && <div className="mb-4" />}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onAddEvent}
              data-testid="student-profile-add-event"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + הוסף פגישה
            </button>
            <button
              onClick={onEdit}
              data-testid="student-profile-edit"
              className="border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              עריכה
            </button>
            {!archiveConfirm ? (
              <button
                onClick={() => setArchiveConfirm(true)}
                data-testid="student-profile-delete"
                className="border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-400 hover:text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                מחיקה
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                <span className="text-xs text-red-700">האם למחוק את התלמיד? הוא לא יופיע יותר במערכת.</span>
                <button
                  onClick={onArchive}
                  disabled={archiving}
                  data-testid="student-profile-delete-confirm"
                  className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 px-3 py-1 rounded-md transition-colors flex items-center gap-1"
                >
                  {archiving && (
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  )}
                  כן, מחק
                </button>
                <button
                  onClick={() => setArchiveConfirm(false)}
                  disabled={archiving}
                  data-testid="student-profile-delete-cancel"
                  className="text-xs text-red-600 hover:text-red-800 disabled:opacity-40 px-2 py-1 rounded-md transition-colors"
                >
                  ביטול
                </button>
              </div>
            )}
          </div>
          {archiveError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-600">
              {archiveError}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
