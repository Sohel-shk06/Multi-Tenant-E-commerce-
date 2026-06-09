/**
 * Pagination — accessible page navigation control.
 *
 * Props:
 *  currentPage  — number (1-indexed)
 *  totalPages   — number
 *  onPageChange — function(page: number)
 *  disabled     — boolean — disables all controls during loading
 */
function Pagination({ currentPage, totalPages, onPageChange, disabled = false }) {
  if (totalPages <= 1) return null

  // Build visible page range: always show first, last, current ±1
  const getPages = () => {
    const pages = []
    const delta = 1 // pages on each side of current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (
        pages[pages.length - 1] !== '...'
      ) {
        pages.push('...')
      }
    }
    return pages
  }

  const pages = getPages()

  const btnBase =
    'inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 text-sm rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed'

  const activeCls = 'bg-indigo-600 border-indigo-600 text-white font-semibold'
  const inactiveCls = 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 flex-wrap"
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || disabled}
        aria-label="Go to previous page"
        className={`${btnBase} ${inactiveCls}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            disabled={disabled}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`${btnBase} ${page === currentPage ? activeCls : inactiveCls}`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || disabled}
        aria-label="Go to next page"
        className={`${btnBase} ${inactiveCls}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}

export default Pagination
