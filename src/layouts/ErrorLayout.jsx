import { Outlet } from 'react-router-dom'

/**
 * ErrorLayout — bare layout for error pages (404, 500, etc.).
 * No navbar or footer — keeps error pages clean and focused.
 */
function ErrorLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  )
}

export default ErrorLayout
