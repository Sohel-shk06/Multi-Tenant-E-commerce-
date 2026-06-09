/**
 * ErrorMessage — inline error display for API or form errors.
 *
 * Props:
 *  message — string
 *  onRetry — optional function — if provided, shows a Retry button
 */
function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
    >
      <svg
        className="w-5 h-5 text-red-500 shrink-0 mt-0.5 sm:mt-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-red-600 underline hover:text-red-700 font-medium shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
