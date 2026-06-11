import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getStudents, exportStudentsExcel, archiveStudent } from '../api/students'
import { getClassLevels } from '../api/classLevels'
import AddStudentModal from '../components/AddStudentModal'
import EditStudentModal from '../components/EditStudentModal'
import ImportStudentsModal from '../components/ImportStudentsModal'
import StudentsToolbar from '../components/students/StudentsToolbar'
import StudentsFilterBar from '../components/students/StudentsFilterBar'
import StudentsTable from '../components/students/StudentsTable'

const PAGE_SIZE = 20

export default function StudentsPage() {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [search, setSearch]           = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [classLevel, setClassLevel]   = useState('')
  const [classNumber, setClassNumber] = useState('')
  const [page, setPage]               = useState(1)
  const [classLevels, setClassLevels] = useState([])
  const [showAddModal, setShowAddModal]       = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exporting, setExporting]             = useState(false)
  const [refreshKey, setRefreshKey]           = useState(0)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showEditModal, setShowEditModal]     = useState(false)

  useEffect(() => {
    getClassLevels()
      .then(res => setClassLevels(res.results ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setLoading(true)
    setError(false)
    const params = { page }
    if (debouncedSearch) params.search = debouncedSearch
    if (classLevel)      params.class_level = classLevel
    if (classNumber)     params.class_number = classNumber
    getStudents(params)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [debouncedSearch, classLevel, classNumber, page, refreshKey])

  const handleClassLevelChange = (val) => { setClassLevel(val); setPage(1) }
  const handleClassNumberChange = (val) => { setClassNumber(val); setPage(1) }

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportStudentsExcel()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'תלמידים.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // silent — user will notice nothing downloaded
    } finally {
      setExporting(false)
    }
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setShowEditModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('האם למחוק את התלמיד/ה מהמערכת?')) return
    try {
      await archiveStudent(id)
      toast.success('התלמיד/ה הועבר/ה לארכיון')
      setRefreshKey(k => k + 1)
    } catch {
      toast.error('שגיאה במחיקת התלמיד/ה')
    }
  }

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0

  return (
    <>
      <div>
        <StudentsToolbar
          studentCount={data?.count}
          exporting={exporting}
          onExport={handleExport}
          onImport={() => setShowImportModal(true)}
          onAdd={() => setShowAddModal(true)}
        />

        <StudentsFilterBar
          search={search}
          onSearchChange={setSearch}
          classLevel={classLevel}
          onClassLevelChange={handleClassLevelChange}
          classLevels={classLevels}
          classNumber={classNumber}
          onClassNumberChange={handleClassNumberChange}
        />

        <StudentsTable
          loading={loading}
          error={error}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage(p => p - 1)}
          onNext={() => setPage(p => p + 1)}
        />
      </div>

      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => { setShowAddModal(false); setRefreshKey(k => k + 1) }}
      />
      <EditStudentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => { setShowEditModal(false); setRefreshKey(k => k + 1) }}
        student={selectedStudent}
      />
      <ImportStudentsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />
    </>
  )
}
