import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartItemCount } from '../../app/store/cartSlice'

/**
 * CustomerNavbar — top navigation bar for the customer-facing storefront.
 * Includes: logo, main nav links, cart icon with badge, mobile menu toggle.
 * TODO: Add search bar integration (useSearch hook).
 * TODO: Add user avatar / login dropdown when auth is integrated.
 * TODO: Add notification bell when notification module is implemented.
 */
function CustomerNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = useSelector(selectCartItemCount)
  const navigate = useNavigate()

  const navLinks = [
    { label: 'Home', to: '/home' },
    { label: 'Products', to: '/products' },
    { label: 'Stores', to: '/stores' },
    { label: 'Categories', to: '/categories' },
  ]

  const activeCls = 'text-indigo-600 font-medium'
  const inactiveCls = 'text-gray-600 hover:text-indigo-600 transition-colors'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-indigo-600 shrink-0"
            aria-label="ShopHub home"
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13L17 13M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            ShopHub
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm ${isActive ? activeCls : inactiveCls}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={`Shopping cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full"
                  aria-hidden="true"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* TODO: Replace with user avatar + dropdown once auth is integrated */}
            <Link
              to="/login"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Sign In
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-100 px-4 pb-4"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 mt-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/login"
                className="block px-3 py-2 mt-1 rounded-lg text-sm font-medium text-center text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default CustomerNavbar
