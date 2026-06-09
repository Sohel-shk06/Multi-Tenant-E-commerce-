import { Outlet } from 'react-router-dom'

/**
 * AuthLayout — minimal layout for login, register, and password reset pages.
 * Centres the form card vertically and horizontally on a light background.
 * TODO: Add auth-specific branding/header if required.
 */
function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
