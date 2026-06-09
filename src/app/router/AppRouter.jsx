import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerLayout from '../../layouts/CustomerLayout'

// Cart module
import Cart from '../../pages/customer/cart/Cart'
import Checkout from '../../pages/customer/cart/Checkout'
import OrderSummary from '../../pages/customer/cart/OrderSummary'

// Product module
import ProductList from '../../pages/customer/products/ProductList'
import ProductDetails from '../../pages/customer/products/ProductDetails'
import ProductReviews from '../../pages/customer/products/ProductReviews'
import ProductSearch from '../../pages/customer/products/ProductSearch'

// Errors
import NotFound from '../../pages/errors/NotFound'

/**
 * AppRouter — central route configuration for the e-com application.
 *
 * TODO: Apply CustomerRoute / ProtectedRoute guards once backend auth is integrated.
 * TODO: Add lazy loading (React.lazy + Suspense) for code splitting on each route.
 * TODO: Add remaining customer routes: /home, /stores, /categories, /wishlist,
 *       /orders, /profile, /notifications.
 * TODO: Add vendor routes wrapped with VendorLayout + VendorRoute.
 * TODO: Add auth routes: /login, /register, /forgot-password wrapped with AuthLayout.
 */
function AppRouter() {
  return (
    <Routes>
      {/* ── Customer routes ─────────────────────────────────────── */}
      <Route element={<CustomerLayout />}>
        {/* Default — redirect to products as the landing page */}
        <Route index element={<Navigate to="/products" replace />} />

        {/* Product module */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/search" element={<ProductSearch />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/products/:productId/reviews" element={<ProductReviews />} />

        {/* Cart module */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-summary" element={<OrderSummary />} />

        {/* TODO: Add remaining routes as modules are implemented:
            /home
            /stores
            /stores/:storeId
            /categories
            /categories/:categoryId
            /wishlist
            /orders
            /orders/:orderId
            /profile
            /notifications
        */}
      </Route>

      {/* ── Vendor routes ────────────────────────────────────────── */}
      {/* TODO: Add vendor routes wrapped with VendorLayout + VendorRoute */}

      {/* ── Auth routes ──────────────────────────────────────────── */}
      {/* TODO: Add /login, /register, /forgot-password wrapped with AuthLayout */}

      {/* ── Error routes ─────────────────────────────────────────── */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRouter
