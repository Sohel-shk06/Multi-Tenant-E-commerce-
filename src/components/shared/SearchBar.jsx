import { useState } from 'react'

/**
 * SearchBar — reusable search input with clear button.
 *
 * Props:
 *  placeholder — string
 *  value       — string (controlled)
 *  onChange    — function(value: string)
 *  onSubmit    — function(value: string) — called on Enter or search icon click
 *  className   — extra Tailwind classes for the wrapper
 *
 * TODO: Connect to useSearch hook with useDebounce for live search results.
 */
function SearchBar({
  placeholder = 'Search…',
  value = '',
  onChange,
  onSubmit,
  className = '',
}) {
  const [internal, setInternal] = useState(value)

  const handleChange = (e) => {
    setInternal(e.target.value)
    onChange?.(e.target.value)
  }

  const handleClear = () => {
    setInternal('')
    onChange?.('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit?.(internal)
    }
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <svg
        className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="search"
        role="searchbox"
        aria-label={placeholder}
        value={internal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
      {internal && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchBar
