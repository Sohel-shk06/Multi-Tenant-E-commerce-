import { Outlet } from 'react-router-dom'

/**
 * VendorLayout — shell layout for the vendor dashboard portal.
 * TODO: Implement VendorNavbar + VendorSidebar + main content area
 *       once the vendor module is being built.
 */
function VendorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* TODO: Add VendorSidebar here */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* TODO: Add VendorNavbar here */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default VendorLayout
