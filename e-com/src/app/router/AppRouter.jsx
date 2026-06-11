import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import { AuthLayout } from '../../layouts/AuthLayout';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { VendorLayout } from '../../layouts/VendorLayout';

// Auth Pages
import { Login } from '../../pages/auth/Login';
import { Register } from '../../pages/auth/Register';
import { ForgotPassword } from '../../pages/auth/ForgotPassword';
import { ResetPassword } from '../../pages/auth/ResetPassword';
import { VerifyEmail } from '../../pages/auth/VerifyEmail';

// Customer Pages
import { Home } from '../../pages/customer/home/Home';
import { ProductList } from '../../pages/customer/products/ProductList';
import { ProductDetails } from '../../pages/customer/products/ProductDetails';
import { Cart } from '../../pages/customer/cart/Cart';
import { Checkout } from '../../pages/customer/cart/Checkout';
import { MyOrders } from '../../pages/customer/orders/MyOrders';

// Vendor Pages
import { Dashboard as VendorDashboard } from '../../pages/vendor/dashboard/Dashboard';
import { ProductList as VendorProductList } from '../../pages/vendor/products/ProductList';
import { CreateProduct as VendorCreateProduct } from '../../pages/vendor/products/CreateProduct';
import { StoreList as VendorStoreList } from '../../pages/vendor/stores/StoreList';
import { CreateStore as VendorCreateStore } from '../../pages/vendor/stores/CreateStore';
import { EditStore } from '../../pages/vendor/stores/EditStore';
import { OrderList as VendorOrderList } from '../../pages/vendor/orders/OrderList';
import { OrderDetails as VendorOrderDetails } from '../../pages/vendor/orders/OrderDetails';

// Protected Route Component
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRouter = () => {
  const { user, token } = useSelector((state) => state.auth);

  const getHomeRoute = () => {
    if (!token) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'vendor') return '/vendor/dashboard';
    return '/';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={token ? <Navigate to={getHomeRoute()} replace /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>

        {/* ✅ PUBLIC Customer Routes (No Auth Required) */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} /> {/* ✅ Checkout yahan hai */}
        </Route>

        {/* ✅ PROTECTED Customer Routes (Auth Required) */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:orderId" element={<div className="p-6">Order Details (Coming Soon)</div>} />
          <Route path="wishlist" element={<div className="p-6">Wishlist Page (Coming Soon)</div>} />
          <Route path="profile" element={<div className="p-6">Profile Page (Coming Soon)</div>} />
          <Route path="stores" element={<div className="p-6">Stores Page (Coming Soon)</div>} />
        </Route>

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<VendorProductList />} />
          <Route path="products/create" element={<VendorCreateProduct />} />
          <Route path="stores" element={<VendorStoreList />} />
          <Route path="stores/create" element={<VendorCreateStore />} />
          <Route path="stores/edit/:storeId" element={<EditStore />} />
          <Route path="orders" element={<VendorOrderList />} />
          <Route path="orders/:orderId" element={<VendorOrderDetails />} />
          <Route path="earnings" element={<div className="p-6">Earnings Page (Coming Soon)</div>} />
          <Route path="reviews" element={<div className="p-6">Reviews Page (Coming Soon)</div>} />
          <Route path="analytics" element={<div className="p-6">Analytics Page (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-6">Settings Page (Coming Soon)</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={<div className="p-6">Admin Panel is in separate project (admin-panel)</div>} />

        {/* Default Redirects */}
        <Route path="/customer/home" element={<Navigate to="/" replace />} />
        <Route path="/customer/products" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  );
};