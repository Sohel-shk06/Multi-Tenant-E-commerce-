import Button from '../ui/Button'

/**
 * EmptyState — generic empty / zero-data illustration placeholder.
 *
 * Props:
 *  icon       — ReactNode — optional custom icon (defaults to box illustration)
 *  title      — string
 *  message    — string
 *  actionLabel — string | null — label for the CTA button
 *  onAction   — function | null — CTA button handler
 */
function EmptyState({
  icon,
  title = 'Nothing here yet',
  message = '',
  actionLabel = null,
  onAction = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Illustration */}
      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 mb-6" aria-hidden="true">
        {icon ?? (
          <svg
            className="w-12 h-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>

      {message && (
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">{message}</p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
