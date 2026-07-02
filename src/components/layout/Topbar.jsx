import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useDebouncedValue } from '../../utils/useDebouncedValue'
import { globalSearch } from '../../api/search'

const EMPTY_RESULTS = { students: [], classes: [], documents: [], lessons: [] }

export default function Topbar({ onToggleSidebar, onOpenQuick }) {
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState(EMPTY_RESULTS)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebouncedValue(searchQuery, 350)

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (!trimmed) return

    const controller = new AbortController()
    setLoading(true)
    globalSearch(trimmed, { signal: controller.signal })
      .then(data => setResults(data))
      .catch(err => { if (err.code !== 'ERR_CANCELED') setResults(EMPTY_RESULTS) })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function closeAndClear() {
    setIsOpen(false)
    setSearchQuery('')
    setResults(EMPTY_RESULTS)
  }

  function goToStudent(item) {
    navigate(`/students/${item.id}`)
    closeAndClear()
  }

  function goToClass(item) {
    navigate(`/classes/${item.class_level}/${item.class_number}`, {
      state: { levelName: item.class_level_name },
    })
    closeAndClear()
  }

  function goToDocument() {
    navigate('/documents')
    closeAndClear()
  }

  function goToLesson(item) {
    navigate(`/lessons/${item.id}`)
    closeAndClear()
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    navigate(`/students?search=${encodeURIComponent(trimmed)}`)
    closeAndClear()
  }

  const hasResults = Object.values(results).some(list => list.length > 0)

  return (
    <header data-testid="topbar" className="fixed top-0 right-0 md:right-64 left-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 px-4 md:px-6 z-10">

      {/* Dark mode toggle — rightmost in topbar (first in RTL DOM) */}
      <button
        onClick={toggle}
        aria-label={isDark ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
        data-testid="theme-toggle"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>

      {/* Search bar — flex-1, fills the center */}
      <div ref={containerRef} className="flex-1 relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400"
              aria-label="חיפוש"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setIsOpen(true) }}
              onFocus={() => setIsOpen(true)}
              placeholder="חיפוש תלמיד, כיתה, מסמך, שיעור..."
              data-testid="topbar-search"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pr-9 pl-4 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
            />
          </div>
        </form>

        {isOpen && searchQuery.trim() && (
          <div
            data-testid="topbar-search-results"
            className="absolute top-full right-0 left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg dark:shadow-black/30 max-h-96 overflow-y-auto z-20 py-1"
          >
            {loading && (
              <div className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">מחפש...</div>
            )}
            {!loading && !hasResults && (
              <div data-testid="topbar-search-no-results" className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                אין תוצאות
              </div>
            )}
            {!loading && results.students.length > 0 && (
              <SearchSection label="תלמידים">
                {results.students.map(s => (
                  <SearchResultRow
                    key={s.id}
                    testId={`topbar-search-result-student-${s.id}`}
                    onClick={() => goToStudent(s)}
                  >
                    {s.full_name}
                  </SearchResultRow>
                ))}
              </SearchSection>
            )}
            {!loading && results.classes.length > 0 && (
              <SearchSection label="כיתות">
                {results.classes.map(c => (
                  <SearchResultRow
                    key={`${c.class_level}-${c.class_number}`}
                    testId={`topbar-search-result-class-${c.class_level}-${c.class_number}`}
                    onClick={() => goToClass(c)}
                  >
                    {`כיתה ${c.class_level_name}׳${c.class_number}`}
                  </SearchResultRow>
                ))}
              </SearchSection>
            )}
            {!loading && results.documents.length > 0 && (
              <SearchSection label="מסמכים">
                {results.documents.map(d => (
                  <SearchResultRow
                    key={d.id}
                    testId={`topbar-search-result-document-${d.id}`}
                    onClick={() => goToDocument(d)}
                  >
                    {d.title}
                  </SearchResultRow>
                ))}
              </SearchSection>
            )}
            {!loading && results.lessons.length > 0 && (
              <SearchSection label="שיעורים">
                {results.lessons.map(l => (
                  <SearchResultRow
                    key={l.id}
                    testId={`topbar-search-result-lesson-${l.id}`}
                    onClick={() => goToLesson(l)}
                  >
                    {l.title}
                  </SearchResultRow>
                ))}
              </SearchSection>
            )}
          </div>
        )}
      </div>

      {/* Left group — quick action + mobile hamburger (last in RTL DOM = leftmost) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenQuick}
          data-testid="quick-action-button"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <span className="text-base leading-none">+</span>
          <span className="hidden sm:inline">פעולה מהירה</span>
        </button>

        <button
          onClick={onToggleSidebar}
          data-testid="sidebar-toggle"
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="תפריט"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}

function SearchSection({ label, children }) {
  return (
    <div>
      <div className="px-4 pt-2 pb-1 text-xs font-medium text-gray-400 dark:text-gray-500">{label}</div>
      {children}
    </div>
  )
}

function SearchResultRow({ testId, onClick, children }) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className="w-full text-start px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      {children}
    </button>
  )
}
