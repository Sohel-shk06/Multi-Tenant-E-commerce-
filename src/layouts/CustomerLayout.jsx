import { Outlet } from 'react-router-dom'
import CustomerNavbar from '../components/navbar/CustomerNavbar'
import Footer from '../components/shared/Footer'

/**
 * CustomerLayout — wraps all customer-facing pages.
 * Structure: Navbar → <main> Page Content (Outlet) → Footer
 *
 * The layout is full-height flex column so the footer always
 * stays at the bottom even on short pages.
 */
function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CustomerNavbar />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default CustomerLayout
