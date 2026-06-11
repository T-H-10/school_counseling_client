import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudents, exportStudentsExcel } from '../api/students'
import { getClassLevels } from '../api/classLevels'
import AddStudentModal from '../components/AddStudentModal'
import ImportStudentsModal from '../components/ImportStudentsModal'
import StudentsToolbar from '../components/students/StudentsToolbar'
import StudentsFilterBar from '../components/students/StudentsFilterBar'
import StudentsTable from '../components/students/StudentsTable'

const PAGE_SIZE = 20

export default function StudentsPage() {
  const navigate = useNavigate()

  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [search, setSearch]           = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [classLevel, setClassLevel]   = useState('')
  const [page, setPage]               = useState(1)
  const [classLevels, setClassLevels] = useState([])
  const [showAddModal, setShowAddModal]       = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exporting, setExporting]             = useState(false)
  const [refreshKey, setRefreshKey]           = useState(0)

  // Fetch class levels once on mount for the dropdown
  useEffect(() => {
    getClassLevels()
      .then(res => setClassLevels(res.results ?? []))
      .catch(() => {})
  }, [])

  // Debounce search — reset to page 1 when the query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch students whenever any filter param changes
  useEffect(() => {
    setLoading(true)
    setError(false)
    const params = { page }
    if (debouncedSearch) params.search = debouncedSearch
    if (classLevel)      params.class_level = classLevel
    getStudents(params)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [debouncedSearch, classLevel, page, refreshKey])

  const handleClassLevelChange = (val) => {
    setClassLevel(val)
    setPage(1)
  }

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
      />

      <StudentsTable
        loading={loading}
        error={error}
        data={data}
        onRowClick={(sid) => navigate(`/students/${sid}`)}
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
    <ImportStudentsModal
      isOpen={showImportModal}
      onClose={() => setShowImportModal(false)}
      onSuccess={() => setRefreshKey(k => k + 1)}
    />
    </>
  )
}
