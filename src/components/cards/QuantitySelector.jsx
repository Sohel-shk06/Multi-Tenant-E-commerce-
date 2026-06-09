import { useState } from 'react'

/**
 * QuantitySelector — accessible +/- quantity control.
 *
 * Props:
 *  value    — current quantity (controlled)
 *  min      — minimum allowed value (default: 1)
 *  max      — maximum allowed value (default: 99)
 *  onChange — called with the new quantity number
 */
function QuantitySelector({ value, min = 1, max = 99, onChange }) {
  const [inputValue, setInputValue] = useState(String(value))

  const handleDecrement = () => {
    const next = Math.max(min, value - 1)
    setInputValue(String(next))
    onChange(next)
  }

  const handleIncrement = () => {
    const next = Math.min(max, value + 1)
    setInputValue(String(next))
    onChange(next)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10)
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed))
      setInputValue(String(clamped))
      onChange(clamped)
    } else {
      setInputValue(String(value))
    }
  }

  return (
    <div
      className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden"
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>

      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        aria-label="Quantity"
        className="w-10 h-8 text-center text-sm font-medium text-gray-900 border-x border-gray-300 focus:outline-none focus:bg-indigo-50"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}

export default QuantitySelector
