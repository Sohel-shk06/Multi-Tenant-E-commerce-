import { Link } from 'react-router-dom'

/**
 * Footer — shared footer for all customer-facing pages.
 * TODO: Pull dynamic links/categories from backend CMS or settings API.
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', to: '/products' },
        { label: 'Stores', to: '/stores' },
        { label: 'Categories', to: '/categories' },
        { label: 'New Arrivals', to: '/products?sort=newest' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'My Profile', to: '/profile' },
        { label: 'My Orders', to: '/orders' },
        { label: 'Wishlist', to: '/wishlist' },
        { label: 'My Cart', to: '/cart' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '/help' },
        { label: 'Returns & Refunds', to: '/returns' },
        { label: 'Track Order', to: '/orders/track' },
        { label: 'Contact Us', to: '/contact' },
      ],
    },
  ]

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-indigo-600"
              aria-label="ShopHub home"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13L17 13M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              ShopHub
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Your trusted multi-vendor marketplace. Shop from hundreds of verified stores.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2" role="list">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <p>© {currentYear} ShopHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
