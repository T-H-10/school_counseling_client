import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import QuickActionModal from '../QuickActionModal'
import AddStudentModal from '../AddStudentModal'
import AddSessionModal from '../AddSessionModal'
import AddEventModal from '../AddEventModal'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [quickOpen, setQuickOpen]           = useState(false)
  const [addStudentOpen, setAddStudentOpen] = useState(false)
  const [addSessionOpen, setAddSessionOpen] = useState(false)
  const [eventStudentId, setEventStudentId] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onOpenQuick={() => setQuickOpen(true)}
      />
      <main className="md:mr-64 pt-16 p-6">
        <Outlet />
      </main>

      <QuickActionModal
        isOpen={quickOpen}
        onClose={() => setQuickOpen(false)}
        onActionStudent={() => { setQuickOpen(false); setAddStudentOpen(true) }}
        onActionSession={() => { setQuickOpen(false); setAddSessionOpen(true) }}
        onActionEvent={(id) => { setQuickOpen(false); setEventStudentId(id) }}
      />

      <AddStudentModal
        isOpen={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        onSuccess={() => setAddStudentOpen(false)}
      />

      <AddSessionModal
        isOpen={addSessionOpen}
        onClose={() => setAddSessionOpen(false)}
        onSuccess={() => setAddSessionOpen(false)}
      />

      <AddEventModal
        studentId={eventStudentId}
        isOpen={eventStudentId !== null}
        onClose={() => setEventStudentId(null)}
        onSuccess={() => setEventStudentId(null)}
      />
    </div>
  )
}
