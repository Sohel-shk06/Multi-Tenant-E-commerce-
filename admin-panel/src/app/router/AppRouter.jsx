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
import { VendorDetails } from '../../pages/vendors/VendorDetails';
import { CategoryList } from '../../pages/categories/CategoryList';
import { CreateCategory } from '../../pages/categories/CreateCategory';
import { ProductList } from '../../pages/products/ProductList';
import { CreateProduct } from '../../pages/products/CreateProduct';
import { OrderList } from '../../pages/orders/OrderList';
import { OrderDetails } from '../../pages/orders/OrderDetails';
import { StoreList } from '../../pages/stores/StoreList';
import { CreateStore } from '../../pages/stores/CreateStore';
import { ProductModeration } from '../../pages/products/ProductModeration';
import { Transactions } from '../../pages/payments/Transactions';
import { PaymentDetails } from '../../pages/payments/PaymentDetails';
import { Payouts } from '../../pages/payments/Payouts';
import { Refunds } from '../../pages/payments/Refunds';
import { FailedPayments } from '../../pages/payments/FailedPayments';
import { PaymentAnalytics } from '../../pages/payments/PaymentAnalytics';
import { CommissionList } from '../../pages/commissions/CommissionList';
import { CommissionDetails } from '../../pages/commissions/CommissionDetails';
import { DisputeList } from '../../pages/disputes/DisputeList';
import { DisputeDetails } from '../../pages/disputes/DisputeDetails';
import { OpenDisputes } from '../../pages/disputes/OpenDisputes';
import { ClosedDisputes } from '../../pages/disputes/ClosedDisputes';
import { RevenueAnalytics } from '../../pages/analytics/RevenueAnalytics';
import { VendorAnalytics } from '../../pages/analytics/VendorAnalytics';
import { CustomerAnalytics } from '../../pages/analytics/CustomerAnalytics';
import { SalesAnalytics } from '../../pages/analytics/SalesAnalytics';
import { ProductAnalytics } from '../../pages/analytics/ProductAnalytics';
import { OrderAnalytics } from '../../pages/analytics/OrderAnalytics';
import { CommissionAnalytics } from '../../pages/analytics/CommissionAnalytics';
import { SubscriptionAnalytics } from '../../pages/analytics/SubscriptionAnalytics';
import { GeneralSettings } from '../../pages/settings/GeneralSettings';
import { SecuritySettings } from '../../pages/settings/SecuritySettings';
import { CommissionSettings } from '../../pages/settings/CommissionSettings';
import { PaymentSettings } from '../../pages/settings/PaymentSettings';
import { EmailSettings } from '../../pages/settings/EmailSettings';
import { NotificationSettings } from '../../pages/settings/NotificationSettings';
import { StorageSettings } from '../../pages/settings/StorageSettings';
import { SystemSettings } from '../../pages/settings/SystemSettings';
import { StoreDetails } from '../../pages/stores/StoreDetails';
import { EditStore } from '../../pages/stores/EditStore';
import { StoreAnalytics } from '../../pages/stores/StoreAnalytics';
import { StoreSettings } from '../../pages/stores/StoreSettings';
import { ChangeEmail } from '../../pages/auth/ChangeEmail'; 
import { ChangePassword } from '../../pages/auth/ChangePassword';

// Error Pages
import { NotFound } from '../../pages/errors/NotFound';
import { Unauthorized } from '../../pages/errors/Unauthorized';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>

       
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />

              
              <Route path="/admin/vendors" element={<VendorList />} />
              <Route path="/admin/vendors/pending" element={<VendorList defaultStatus="pending" />} />
              <Route path="/admin/vendors/suspended" element={<VendorList defaultStatus="suspended" />} />
              <Route path="/admin/vendors/:vendorId" element={<VendorDetails />} />

              
              <Route path="/admin/categories" element={<CategoryList />} />
              <Route path="/admin/categories/create" element={<CreateCategory />} />
              <Route path="/admin/categories/edit/:categoryId" element={<CreateCategory />} />

              
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/create" element={<CreateProduct />} />
              <Route path="/admin/products/edit/:productId" element={<CreateProduct />} />
              <Route path="/admin/products/moderation" element={<ProductModeration />} />

              
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/orders/pending" element={<OrderList defaultStatus="pending" />} />
              <Route path="/admin/orders/completed" element={<OrderList defaultStatus="completed" />} />
              <Route path="/admin/orders/cancelled" element={<OrderList defaultStatus="cancelled" />} />
              <Route path="/admin/orders/:orderId" element={<OrderDetails />} />

              
              <Route path="/admin/payments" element={<Transactions />} />
              <Route path="/admin/payments/payouts" element={<Payouts />} />
              <Route path="/admin/payments/refunds" element={<Refunds />} />
              <Route path="/admin/payments/failed" element={<FailedPayments />} />
              <Route path="/admin/payments/analytics" element={<PaymentAnalytics />} />
              <Route path="/admin/payments/:paymentId" element={<PaymentDetails />} />

              
              <Route path="/admin/commissions" element={<CommissionList />} />
              <Route path="/admin/commissions/:commissionId" element={<CommissionDetails />} />

              
              <Route path="/admin/disputes" element={<DisputeList />} />
              <Route path="/admin/disputes/open" element={<OpenDisputes />} />
              <Route path="/admin/disputes/closed" element={<ClosedDisputes />} />
              <Route path="/admin/disputes/:disputeId" element={<DisputeDetails />} />
              
              <Route path="/admin/analytics" element={<RevenueAnalytics />} />
              <Route path="/admin/analytics/revenue" element={<RevenueAnalytics />} />
              <Route path="/admin/analytics/vendors" element={<VendorAnalytics />} />
              <Route path="/admin/analytics/customers" element={<CustomerAnalytics />} />
              <Route path="/admin/analytics/sales" element={<SalesAnalytics />} />
              <Route path="/admin/analytics/products" element={<ProductAnalytics />} />
              <Route path="/admin/analytics/orders" element={<OrderAnalytics />} />
              <Route path="/admin/analytics/commissions" element={<CommissionAnalytics />} />
              <Route path="/admin/analytics/subscriptions" element={<SubscriptionAnalytics />} />
              <Route path="/admin/settings" element={<GeneralSettings />} />
              <Route path="/admin/settings/general" element={<GeneralSettings />} />
              <Route path="/admin/settings/security" element={<SecuritySettings />} />
              <Route path="/admin/settings/commission" element={<CommissionSettings />} />
              <Route path="/admin/settings/payment" element={<PaymentSettings />} />
              <Route path="/admin/settings/email" element={<EmailSettings />} />
              <Route path="/admin/settings/notifications" element={<NotificationSettings />} />
              <Route path="/admin/settings/storage" element={<StorageSettings />} />
              <Route path="/admin/settings/system" element={<SystemSettings />} />
          <Route path="/admin/change-email" element={<ChangeEmail />} />
          <Route path="/admin/change-password" element={<ChangePassword />} />

              
              <Route path="/admin/stores" element={<StoreList />} />
              <Route path="/admin/stores/create" element={<CreateStore />} />
              <Route path="/admin/stores/edit/:storeId" element={<EditStore />} />
              <Route path="/admin/stores/:storeId" element={<StoreDetails />} />
              <Route path="/admin/stores/:storeId/analytics" element={<StoreAnalytics />} />
              <Route path="/admin/stores/:storeId/settings" element={<StoreSettings />} />
            </Route>

            
            <Route element={<RoleRoute allowedRoles={['vendor']} />}>
              <Route path="/vendor/dashboard" element={<Dashboard />} />
            </Route>

            
            <Route element={<RoleRoute allowedRoles={['customer']} />}>
              <Route path="/customer/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="/dashboard" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        
        <Route path="/unauthorized" element={<Unauthorized />} />

        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};