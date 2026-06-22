import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getStudents, exportStudentsExcel, archiveStudent } from '../api/students'
import { downloadBlob } from '../utils/downloadBlob'
import { getClassLevels } from '../api/classLevels'
import AddStudentModal from '../components/AddStudentModal'
import EditStudentModal from '../components/EditStudentModal'
import ImportStudentsModal from '../components/ImportStudentsModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import StudentsToolbar from '../components/students/StudentsToolbar'
import StudentsFilterBar from '../components/students/StudentsFilterBar'
import StudentsTable from '../components/students/StudentsTable'

export default function StudentsPage() {
  const [searchParams] = useSearchParams()
  const [students, setStudents]       = useState([])
  const [totalCount, setTotalCount]   = useState(0)
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]             = useState(false)
  const [hasMore, setHasMore]         = useState(false)
  const [search, setSearch]           = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [classLevel, setClassLevel]   = useState(() => searchParams.get('class_level') || '')
  const [classNumber, setClassNumber] = useState(() => searchParams.get('class_number') || '')
  const [classLevels, setClassLevels] = useState([])
  const [showAddModal, setShowAddModal]       = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exporting, setExporting]             = useState(false)
  const [refreshKey, setRefreshKey]           = useState(0)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showEditModal, setShowEditModal]     = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [deleting, setDeleting]               = useState(false)
  const currentPage = useRef(1)

  useEffect(() => {
    getClassLevels()
      .then(res => setClassLevels(res.results ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  // Filter change — always resets to page 1 and replaces results
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setStudents([])
    setHasMore(false)
    currentPage.current = 1

    const params = { page: 1 }
    if (debouncedSearch) params.search = debouncedSearch
    if (classLevel)      params.class_level = classLevel
    if (classNumber)     params.class_number = classNumber

    getStudents(params)
      .then(data => {
        if (cancelled) return
        setStudents(data.results)
        setTotalCount(data.count)
        setHasMore(!!data.next)
      })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [debouncedSearch, classLevel, classNumber, refreshKey])

  // Stable load-more callback — only changes when filters or pagination state changes
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return
    const pg = currentPage.current + 1
    setLoadingMore(true)

    const params = { page: pg }
    if (debouncedSearch) params.search = debouncedSearch
    if (classLevel)      params.class_level = classLevel
    if (classNumber)     params.class_number = classNumber

    try {
      const data = await getStudents(params)
      setStudents(prev => [...prev, ...data.results])
      setTotalCount(data.count)
      setHasMore(!!data.next)
      currentPage.current = pg
    } catch {
      // silent — user can scroll back to retry
    } finally {
      setLoadingMore(false)
    }
  }, [debouncedSearch, classLevel, classNumber, hasMore, loadingMore])

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportStudentsExcel()
      downloadBlob(blob, 'תלמידים.xlsx')
    } catch {
      // silent
    } finally {
      setExporting(false)
    }
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setShowEditModal(true)
  }

  const handleDelete = (id) => setPendingDeleteId(id)

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await archiveStudent(pendingDeleteId)
      toast.success('התלמיד/ה נמחק/ה מהמערכת')
      setPendingDeleteId(null)
      setRefreshKey(k => k + 1)
    } catch {
      toast.error('שגיאה במחיקת התלמיד/ה')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div data-testid="students-page">
        <StudentsToolbar
          studentCount={totalCount}
          exporting={exporting}
          onExport={handleExport}
          onImport={() => setShowImportModal(true)}
          onAdd={() => setShowAddModal(true)}
        />

        <StudentsFilterBar
          search={search}
          onSearchChange={setSearch}
          classLevel={classLevel}
          onClassLevelChange={val => setClassLevel(val)}
          classLevels={classLevels}
          classNumber={classNumber}
          onClassNumberChange={val => setClassNumber(val)}
        />

        <StudentsTable
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
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
      <ConfirmDeleteModal
        isOpen={!!pendingDeleteId}
        confirming={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  )
}
