import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

/**
 * NotFound (404) — displayed when a route doesn't exist.
 */
function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div
        className="w-24 h-24 flex items-center justify-center rounded-full bg-indigo-50 mb-6"
        aria-hidden="true"
      >
        <svg
          className="w-12 h-12 text-indigo-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <p className="text-6xl font-extrabold text-indigo-600 mb-2">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="primary" onClick={() => navigate('/')}>
          Go to Home
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </main>
  )
}

export default NotFound
