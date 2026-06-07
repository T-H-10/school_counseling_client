import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStudent, getStudentTimeline } from '../api/studentProfile'
import { archiveStudent } from '../api/students'
import AddEventModal from '../components/AddEventModal'
import EditEventModal from '../components/EditEventModal'
import EditStudentModal from '../components/EditStudentModal'

const EVENT_TYPE_MAP = {
  meeting:        { label: 'פגישה',       classes: 'bg-indigo-100 text-indigo-700' },
  call:           { label: 'שיחה',        classes: 'bg-blue-100 text-blue-700' },
  teacher_report: { label: 'דיווח מורה', classes: 'bg-amber-100 text-amber-700' },
  other:          { label: 'אחר',         classes: 'bg-gray-100 text-gray-600' },
}

function EventTypeBadge({ type }) {
  const { label, classes } = EVENT_TYPE_MAP[type] ?? EVENT_TYPE_MAP.other
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${classes}`}>
      {label}
    </span>
  )
}

function SkeletonProfile() {
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 animate-pulse">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 pt-1">
            <div className="h-6 bg-gray-200 rounded w-44 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-28 mb-4" />
            <div className="h-9 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-52 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-44 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-36" />
      </div>
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 bg-gray-200 rounded-full w-16" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-1.5" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StudentProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [student, setStudent]   = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [showModal, setShowModal]           = useState(false)
  const [showEditModal, setShowEditModal]   = useState(false)
  const [editingEvent, setEditingEvent]     = useState(null)
  const [archiveConfirm, setArchiveConfirm] = useState(false)
  const [archiving, setArchiving]           = useState(false)
  const [archiveError, setArchiveError]     = useState(null)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(false)
    Promise.all([getStudent(id), getStudentTimeline(id)])
      .then(([studentData, timelineData]) => {
        setStudent(studentData)
        setTimeline(timelineData.timeline)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleArchive = async () => {
    setArchiving(true)
    setArchiveError(null)
    try {
      await archiveStudent(id)
      navigate('/students')
    } catch {
      setArchiveError('שגיאה במחיקת התלמיד. אנא נסה שוב.')
      setArchiving(false)
      setArchiveConfirm(false)
    }
  }

  const hasContact = student && (
    student.mother_name || student.mother_phone ||
    student.father_name || student.father_phone ||
    student.address
  )

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate('/students')}
        className="mb-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <span>→</span>
        <span>חזרה לרשימת התלמידים</span>
      </button>

      {loading ? (
        <SkeletonProfile />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-red-500 text-sm mb-4">שגיאה בטעינת פרופיל התלמיד</p>
          <button
            onClick={() => navigate('/students')}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            חזרה לרשימה
          </button>
        </div>
      ) : (
        <>
          {/* Header card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-indigo-600">
                  {student.full_name?.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-gray-800">{student.full_name}</h1>
                  {student.current_class_level && (
                    <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                      כיתה {student.current_class_level}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-mono mb-4">ת.ז. {student.id_number}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    + הוסף פגישה
                  </button>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    עריכה
                  </button>
                  {!archiveConfirm ? (
                    <button
                      onClick={() => setArchiveConfirm(true)}
                      className="border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-400 hover:text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      מחיקה
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-red-700">האם למחוק את התלמיד? הוא לא יופיע יותר במערכת.</span>
                      <button
                        onClick={handleArchive}
                        disabled={archiving}
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

          {/* Contact card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
              פרטי קשר
            </h2>
            {hasContact ? (
              <dl className="space-y-2">
                {(student.mother_name || student.mother_phone) && (
                  <div className="flex items-center gap-3 text-sm">
                    <dt className="text-gray-400 w-8 flex-shrink-0">אמא</dt>
                    <dd className="text-gray-700">
                      {[student.mother_name, student.mother_phone].filter(Boolean).join('  ·  ')}
                    </dd>
                  </div>
                )}
                {(student.father_name || student.father_phone) && (
                  <div className="flex items-center gap-3 text-sm">
                    <dt className="text-gray-400 w-8 flex-shrink-0">אבא</dt>
                    <dd className="text-gray-700">
                      {[student.father_name, student.father_phone].filter(Boolean).join('  ·  ')}
                    </dd>
                  </div>
                )}
                {student.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <dt className="text-gray-400 w-8 flex-shrink-0">כתובת</dt>
                    <dd className="text-gray-700">{student.address}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-gray-400">אין פרטי קשר</p>
            )}
          </div>

          {/* Timeline */}
          <h2 className="text-base font-semibold text-gray-700 mb-4">היסטוריית מפגשים</h2>

          {timeline.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <p className="text-gray-400 text-sm">אין פגישות רשומות עדיין</p>
            </div>
          ) : (
            <div className="relative pr-10">
              {/* Vertical line on the physical right (RTL start side) */}
              <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200" />

              {timeline.map(item => (
                <div key={item.id} className="relative mb-5">
                  {/* Dot centered on the line */}
                  <div className="absolute right-2.5 top-4 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <EventTypeBadge type={item.event_type} />
                        <span className="text-xs text-gray-400 font-mono">{item.display_date}</span>
                      </div>
                      <button
                        onClick={() => setEditingEvent(item)}
                        className="text-xs text-gray-400 hover:text-indigo-600 transition-colors px-2 py-0.5 rounded hover:bg-indigo-50"
                      >
                        עריכה
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    {item.agenda && (
                      <p className="text-sm text-indigo-600 mt-1 leading-relaxed">
                        <span className="font-medium text-indigo-400 text-xs">מטרה: </span>
                        {item.agenda}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {item.agenda && (
                          <span className="font-medium text-gray-400 text-xs">סיכום: </span>
                        )}
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AddEventModal
        studentId={id}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchData() }}
      />
      <EditStudentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => { setShowEditModal(false); fetchData() }}
        student={student}
      />
      <EditEventModal
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSuccess={() => { setEditingEvent(null); fetchData() }}
      />
    </div>
  )
}
