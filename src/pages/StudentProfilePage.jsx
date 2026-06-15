import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStudent, getStudentTimeline } from '../api/studentProfile'
import { archiveStudent } from '../api/students'
import AddEventModal from '../components/AddEventModal'
import EditEventModal from '../components/EditEventModal'
import EditStudentModal from '../components/EditStudentModal'
import SkeletonProfile from '../components/studentProfile/SkeletonProfile'
import ProfileHeader from '../components/studentProfile/ProfileHeader'
import ContactCard from '../components/studentProfile/ContactCard'
import Timeline from '../components/studentProfile/Timeline'

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

  return (
    <div className="max-w-2xl mx-auto" data-testid="student-profile-page">
      {/* Back link */}
      <button
        onClick={() => navigate('/students')}
        data-testid="student-profile-back"
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
          <ProfileHeader
            student={student}
            onAddEvent={() => setShowModal(true)}
            onEdit={() => setShowEditModal(true)}
            archiveConfirm={archiveConfirm}
            setArchiveConfirm={setArchiveConfirm}
            onArchive={handleArchive}
            archiving={archiving}
            archiveError={archiveError}
          />
          <ContactCard student={student} />
          <Timeline timeline={timeline} onEdit={setEditingEvent} />
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
