import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getClasses, setClassTeacher, promoteStudents } from '../api/enrollments'
import { getSchoolYears } from '../api/schoolYears'

function classKey(room) {
  return `${room.class_level}-${room.class_number}`
}

export default function ClassesPage() {
  const [classGroups, setClassGroups] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)

  const [editingKey, setEditingKey]     = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const [savingKey, setSavingKey]       = useState(null)

  const [showPromote, setShowPromote]   = useState(false)
  const [schoolYears, setSchoolYears]   = useState([])
  const [promoteToYear, setPromoteToYear] = useState('')
  const [promoting, setPromoting]       = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      getClasses(),
      getSchoolYears(),
    ])
      .then(([classes, yearsData]) => {
        setClassGroups(classes)
        setSchoolYears(yearsData.results ?? yearsData)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const activeYear = schoolYears.find(y => y.is_active)
  const otherYears = schoolYears.filter(y => !y.is_active)

  const handleCardClick = (room, e) => {
    if (editingKey === classKey(room)) return
    navigate(`/classes/${room.class_level}/${room.class_number}`, {
      state: { levelName: room.class_level__name },
    })
  }

  const startEdit = (room, e) => {
    e.stopPropagation()
    setEditingKey(classKey(room))
    setEditingValue(room.teacher_name || '')
  }

  const cancelEdit = (e) => {
    e?.stopPropagation()
    setEditingKey(null)
    setEditingValue('')
  }

  const saveTeacher = async (room, e) => {
    e?.stopPropagation()
    const key = classKey(room)
    setSavingKey(key)
    try {
      await setClassTeacher({
        school_year: room.school_year,
        class_level: room.class_level,
        class_number: room.class_number,
        teacher_name: editingValue.trim(),
      })
      setClassGroups(prev =>
        prev.map(r => classKey(r) === key ? { ...r, teacher_name: editingValue.trim() } : r)
      )
      setEditingKey(null)
      toast.success('שם המחנכ/ת עודכן')
    } catch {
      toast.error('שגיאה בשמירת שם המחנכ/ת')
    } finally {
      setSavingKey(null)
    }
  }

  const handlePromote = async () => {
    if (!activeYear || !promoteToYear) return
    setPromoting(true)
    try {
      const result = await promoteStudents({
        from_year: activeYear.id,
        to_year: Number(promoteToYear),
      })
      toast.success(`הועברו ${result.created} תלמידים לשנה הבאה (${result.skipped} דולגו)`)
      setShowPromote(false)
      setPromoteToYear('')
    } catch {
      toast.error('שגיאה בקידום התלמידים')
    } finally {
      setPromoting(false)
    }
  }

  return (
    <div data-testid="classes-page">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">כיתות</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {classGroups.length} כיתות
              {activeYear ? ` · שנת לימודים ${activeYear.name}` : ''}
            </p>
          )}
        </div>

        {/* Promote button */}
        {!loading && !error && activeYear && otherYears.length > 0 && (
          <div className="relative">
            {!showPromote ? (
              <button
                onClick={() => setShowPromote(true)}
                data-testid="classes-promote"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <span>📈</span>
                קדם תלמידים לשנה הבאה
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg px-4 py-2.5 shadow-sm">
                <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">מ: {activeYear.name} → אל:</span>
                <select
                  value={promoteToYear}
                  onChange={e => setPromoteToYear(e.target.value)}
                  data-testid="classes-promote-year"
                  className="text-sm border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">בחר שנה</option>
                  {otherYears.map(y => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
                <button
                  onClick={handlePromote}
                  disabled={!promoteToYear || promoting}
                  data-testid="classes-promote-confirm"
                  className="text-sm font-medium px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md transition-colors flex items-center gap-1"
                >
                  {promoting && <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  קדם
                </button>
                <button
                  onClick={() => { setShowPromote(false); setPromoteToYear('') }}
                  className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="mt-4 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400" data-testid="classes-error">
          <p className="text-lg">שגיאה בטעינת הכיתות</p>
        </div>
      )}

      {!loading && !error && classGroups.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400" data-testid="classes-empty">
          <p className="text-4xl mb-3">🏫</p>
          <p className="text-lg font-medium">אין תלמידים רשומים לשנה הפעילה</p>
          <p className="text-sm mt-1">הוסף תלמידים ושייך אותם לכיתה כדי להציג את רשימת הכיתות</p>
        </div>
      )}

      {!loading && !error && classGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classGroups.map(room => {
            const key = classKey(room)
            const isEditing = editingKey === key
            const isSaving = savingKey === key

            return (
              <div
                key={key}
                onClick={e => handleCardClick(room, e)}
                data-testid="class-card"
                data-class-level={room.class_level}
                data-class-number={room.class_number}
                className={`bg-white dark:bg-gray-800 rounded-xl border p-5 transition-all duration-150 group cursor-pointer ${
                  isEditing
                    ? 'border-blue-400 dark:border-blue-500 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
                }`}
              >
                {/* Top row: class name + student count */}
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
                    {room.student_count} תלמידים
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {room.class_level__name}׳ {room.class_number}
                  </span>
                </div>

                {/* Teacher row */}
                <div className="mt-3" onClick={e => e.stopPropagation()}>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveTeacher(room, e)
                          if (e.key === 'Escape') cancelEdit(e)
                        }}
                        placeholder="שם המחנכ/ת"
                        data-testid="class-card-teacher-input"
                        className="flex-1 text-sm border border-blue-300 dark:border-blue-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        onClick={e => saveTeacher(room, e)}
                        disabled={isSaving}
                        data-testid="class-card-teacher-save"
                        className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-md disabled:opacity-50 transition-colors"
                        title="שמור"
                      >
                        {isSaving
                          ? <span className="w-3 h-3 border-2 border-green-400/40 border-t-green-400 rounded-full animate-spin" />
                          : '✓'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title="ביטול"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {room.teacher_name ? `מחנכ/ת: ${room.teacher_name}` : 'מחנכ/ת לא הוגדר/ה'}
                      </span>
                      <button
                        onClick={e => startEdit(room, e)}
                        data-testid="class-card-edit-teacher"
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all shrink-0"
                        title="עריכת מחנכ/ת"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
