import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Layouts
import { AuthLayout } from '../../layouts/AuthLayout';
import { DashboardLayout } from '../../layouts/DashboardLayout';

// Auth Pages
import { Login } from '../../pages/auth/Login';
import { ForgotPassword } from '../../pages/auth/ForgotPassword';
import { ResetPassword } from '../../pages/auth/ResetPassword';
import { VerifyEmail } from '../../pages/auth/VerifyEmail';

// Dashboard Pages
import { Dashboard } from '../../pages/dashboard/Dashboard';
import { VendorList } from '../../pages/vendors/VendorList';
import { CategoryList } from '../../pages/categories/CategoryList';
import { CreateCategory } from '../../pages/categories/CreateCategory';
import { ProductList } from '../../pages/products/ProductList';
import { CreateProduct } from '../../pages/products/CreateProduct';
import { OrderList } from '../../pages/orders/OrderList';
import { OrderDetails } from '../../pages/orders/OrderDetails';
import { StoreList } from '../../pages/stores/StoreList';
import { CreateStore } from '../../pages/stores/CreateStore';


// Error Pages
import { NotFound } from '../../pages/errors/NotFound';
import { Unauthorized } from '../../pages/errors/Unauthorized';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Routes (Auth Layout - No Sidebar/Navbar) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>

        {/* 2. Protected Routes (Dashboard Layout - With Sidebar/Navbar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            {/* Admin Only Routes */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/vendors" element={<VendorList />} />
              <Route path="/admin/categories" element={<CategoryList />} />
<Route path="/admin/categories/create" element={<CreateCategory />} />
<Route path="/admin/products" element={<ProductList />} />
<Route path="/admin/products/create" element={<CreateProduct />} />
<Route path="/admin/orders" element={<OrderList />} />
<Route path="/admin/orders/:orderId" element={<OrderDetails />} />
<Route path="/admin/stores" element={<StoreList />} />
<Route path="/admin/stores/create" element={<CreateStore />} />
              {/* Baaki admin routes yahan add honge */}
            </Route>

            {/* Vendor Only Routes */}
            <Route element={<RoleRoute allowedRoles={['vendor']} />}>
              <Route path="/vendor/dashboard" element={<Dashboard />} />
            </Route>

            {/* Customer Only Routes */}
            <Route element={<RoleRoute allowedRoles={['customer']} />}>
              <Route path="/customer/dashboard" element={<Dashboard />} />
            </Route>

            {/* Default redirect for authenticated users */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        {/* 3. Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* 4. Catch-all / Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};