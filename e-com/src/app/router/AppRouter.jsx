// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// // Layouts
// import { AuthLayout } from '../../layouts/AuthLayout';
// import { CustomerLayout } from '../../layouts/CustomerLayout';
// import { VendorLayout } from '../../layouts/VendorLayout';
// import { MyReviews } from '../../pages/customer/reviews/MyReviews';
// import { WriteReview } from '../../pages/customer/reviews/WriteReview';
// import { EditReview } from '../../pages/customer/reviews/EditReview';

// // Auth Pages
// import { Login } from '../../pages/auth/Login';
// import { Register } from '../../pages/auth/Register';
// import { ForgotPassword } from '../../pages/auth/ForgotPassword';
// import { ResetPassword } from '../../pages/auth/ResetPassword';
// import { VerifyEmail } from '../../pages/auth/VerifyEmail';

// // Customer Pages
// import { Home } from '../../pages/customer/home/Home';
// import { ProductList } from '../../pages/customer/products/ProductList';
// import { ProductDetails } from '../../pages/customer/products/ProductDetails';
// import { Cart } from '../../pages/customer/cart/Cart';
// import { Checkout } from '../../pages/customer/cart/Checkout';
// import { MyOrders } from '../../pages/customer/orders/MyOrders';
// import { StoreList } from '../../pages/customer/stores/StoreList';
// import { StoreDetails } from '../../pages/customer/stores/StoreDetails';
// import { Wishlist } from '../../pages/customer/wishlist/Wishlist';
// import { OrderDetails } from '../../pages/customer/orders/OrderDetails';
// import { Profile } from '../../pages/customer/profile/MyProfile';
// import { NotificationList } from '../../pages/customer/notifications/NotificationList';

// // Vendor Pages
// import { Dashboard as VendorDashboard } from '../../pages/vendor/dashboard/Dashboard';
// import { ProductList as VendorProductList } from '../../pages/vendor/products/ProductList';
// import { EditProduct as VendorEditProduct } from '../../pages/vendor/products/EditProduct';
// import { CreateProduct as VendorCreateProduct } from '../../pages/vendor/products/CreateProduct';
// import { StoreList as VendorStoreList } from '../../pages/vendor/stores/StoreList';
// import { CreateStore as VendorCreateStore } from '../../pages/vendor/stores/CreateStore';
// import { EditStore } from '../../pages/vendor/stores/EditStore';
// import { OrderList as VendorOrderList } from '../../pages/vendor/orders/OrderList';
// import { OrderDetails as VendorOrderDetails } from '../../pages/vendor/orders/OrderDetails';
// import { EarningsOverview } from '../../pages/vendor/earnings/EarningsOverview';
// import { PayoutHistory } from '../../pages/vendor/earnings/PayoutHistory';
// import { Transactions } from '../../pages/vendor/earnings/Transactions';
// import { CommissionHistory } from '../../pages/vendor/earnings/CommissionHistory';
// import { ReviewList as VendorReviewList } from '../../pages/vendor/reviews/ReviewList';
// import { ReviewDetails as VendorReviewDetails } from '../../pages/vendor/reviews/ReviewDetails';
// import { ReplyReview as VendorReplyReview } from '../../pages/vendor/reviews/ReplyReview';
// import { ReviewAnalytics as VendorReviewAnalytics } from '../../pages/vendor/reviews/ReviewAnalytics';
// import { AnalyticsDashboard } from '../../pages/vendor/analytics/AnalyticsDashboard';
// import { RevenueAnalytics } from '../../pages/vendor/analytics/RevenueAnalytics';
// import { SalesAnalytics } from '../../pages/vendor/analytics/SalesAnalytics';
// import { ProductAnalytics } from '../../pages/vendor/analytics/ProductAnalytics';
// import { OrderAnalytics } from '../../pages/vendor/analytics/OrderAnalytics';
// import { CustomerAnalytics } from '../../pages/vendor/analytics/CustomerAnalytics';
// import { VendorSettings } from '../../pages/vendor/settings/VendorSettings';
// // Vendor Pages section mein add karo
// import { NotificationList as VendorNotificationList } from '../../pages/vendor/notifications/NotificationList';

// // Protected Route Component
// const ProtectedRoute = ({ allowedRoles, children }) => {
//     const { user, token } = useSelector((state) => state.auth);

//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     if (allowedRoles && !allowedRoles.includes(user?.role)) {
//         if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
//         if (user?.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />;
//         return <Navigate to="/" replace />;
//     }

//     return children;
// };

// export const AppRouter = () => {
//     const { user, token } = useSelector((state) => state.auth);

//     const getHomeRoute = () => {
//         if (!token) return '/login';
//         if (user?.role === 'admin') return '/admin/dashboard';
//         if (user?.role === 'vendor') return '/vendor/dashboard';
//         return '/';
//     };

//     return (
//         <BrowserRouter>
//             <Routes>
//                 {/* ===== PUBLIC AUTH ROUTES ===== */}
//                 <Route element={<AuthLayout />}>
//                     <Route path="/login" element={token ? <Navigate to={getHomeRoute()} replace /> : <Login />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/forgot-password" element={<ForgotPassword />} />
//                     <Route path="/reset-password/:token" element={<ResetPassword />} />
//                     <Route path="/verify-email/:token" element={<VerifyEmail />} />
//                 </Route>

//                 {/* ===== ✅ PUBLIC CUSTOMER ROUTES (No Auth Required) ===== */}
//                 <Route element={<CustomerLayout />}>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/products" element={<ProductList />} />
//                     <Route path="/products/:productId" element={<ProductDetails />} />
//                     <Route path="/cart" element={<Cart />} />
//                     <Route path="/checkout" element={<Checkout />} />
//                     <Route path="/stores" element={<StoreList />} />           {/* ✅ YAHAN ADD KIYA */}
//                     <Route path="/stores/:storeId" element={<StoreDetails />} /> {/* ✅ YAHAN ADD KIYA */}
//                     <Route path="/wishlist" element={<Wishlist />} />
//                 </Route>

//                 {/* ===== ✅ PROTECTED CUSTOMER ROUTES (Auth Required) ===== */}
//                 <Route
//                     path="/customer"
//                     element={
//                         <ProtectedRoute allowedRoles={['customer']}>
//                             <CustomerLayout />
//                         </ProtectedRoute>
//                     }
//                 >
//                     {/* ✅ Sirf RELATIVE paths (bina / ke) */}
//                     <Route path="home" element={<Home />} />
//                     <Route path="orders" element={<MyOrders />} />
//                     <Route path="orders/:orderId" element={<OrderDetails />} />

//                     <Route path="profile" element={<Profile />} />
//                     <Route path="notifications" element={<NotificationList />} />
//                     <Route path="reviews" element={<MyReviews />} />
//                     <Route path="reviews/write" element={<WriteReview />} />
//                     <Route path="reviews/edit/:reviewId" element={<EditReview />} />

//                 </Route>

//                 {/* ===== VENDOR ROUTES ===== */}
//                 <Route
//                     path="/vendor"
//                     element={
//                         <ProtectedRoute allowedRoles={['vendor']}>
//                             <VendorLayout />
//                         </ProtectedRoute>
//                     }
//                 >
//                     <Route path="dashboard" element={<VendorDashboard />} />
//                     <Route path="products" element={<VendorProductList />} />
//                     <Route path="products/create" element={<VendorCreateProduct />} />
//                     <Route path="products/edit/:productId" element={<VendorEditProduct />} />
//                     <Route path="stores" element={<VendorStoreList />} />
//                     <Route path="stores/create" element={<VendorCreateStore />} />
//                     <Route path="stores/edit/:storeId" element={<EditStore />} />
//                     <Route path="orders" element={<VendorOrderList />} />
//                     <Route path="orders/:orderId" element={<VendorOrderDetails />} />
//                     <Route path="earnings" element={<EarningsOverview />} /> {/* Default overview page */}
//                     <Route path="earnings/payouts" element={<PayoutHistory />} />
//                     <Route path="earnings/transactions" element={<Transactions />} />
//                     <Route path="earnings/commission" element={<CommissionHistory />} />
//                     <Route path="reviews" element={<VendorReviewList />} />
//                     <Route path="reviews/analytics" element={<VendorReviewAnalytics />} />
//                     <Route path="reviews/:reviewId" element={<VendorReviewDetails />} />
//                     <Route path="reviews/:reviewId/reply" element={<VendorReplyReview />} />
//                     <Route path="analytics" element={<AnalyticsDashboard />} />
//                     <Route path="analytics/revenue" element={<RevenueAnalytics />} />
//                     <Route path="analytics/sales" element={<SalesAnalytics />} />
//                     <Route path="analytics/products" element={<ProductAnalytics />} />
//                     <Route path="analytics/orders" element={<OrderAnalytics />} />
//                     <Route path="analytics/customers" element={<CustomerAnalytics />} />
//                     <Route path="settings" element={<VendorSettings />} /> 
//                     <Route path="notifications" element={<VendorNotificationList />} />
//                 </Route>

//                 {/* ===== ADMIN ROUTES ===== */}
//                 <Route path="/admin/*" element={<div className="p-6">Admin Panel is in separate project (admin-panel)</div>} />

//                 {/* ===== DEFAULT REDIRECTS ===== */}
//                 <Route path="/customer/home" element={<Navigate to="/" replace />} />
//                 <Route path="/customer/products" element={<Navigate to="/products" replace />} />
//                 <Route path="/customer/stores" element={<Navigate to="/stores" replace />} />
//                 <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
//             </Routes>
//         </BrowserRouter>
//     );
// };









import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import { AuthLayout } from '../../layouts/AuthLayout';
import { CustomerLayout } from '../../layouts/CustomerLayout';
import { VendorLayout } from '../../layouts/VendorLayout';
import { MyReviews } from '../../pages/customer/reviews/MyReviews';
import { WriteReview } from '../../pages/customer/reviews/WriteReview';
import { EditReview } from '../../pages/customer/reviews/EditReview';

// Auth Pages
import { Login } from '../../pages/auth/Login';
import { Register } from '../../pages/auth/Register';
import { ForgotPassword } from '../../pages/auth/ForgotPassword';
import { ResetPassword } from '../../pages/auth/ResetPassword';
import { VerifyEmail } from '../../pages/auth/VerifyEmail';

// ✅ NEW: Account Settings Pages (Customer/Vendor ke liye)
import { ChangeEmail } from '../../pages/auth/ChangeEmail';
import { ChangePassword } from '../../pages/auth/ChangePassword';

// Customer Pages
import { Home } from '../../pages/customer/home/Home';
import { ProductList } from '../../pages/customer/products/ProductList';
import { ProductDetails } from '../../pages/customer/products/ProductDetails';
import { Cart } from '../../pages/customer/cart/Cart';
import { Checkout } from '../../pages/customer/cart/Checkout';
import { MyOrders } from '../../pages/customer/orders/MyOrders';
import { StoreList } from '../../pages/customer/stores/StoreList';
import { StoreDetails } from '../../pages/customer/stores/StoreDetails';
import { Wishlist } from '../../pages/customer/wishlist/Wishlist';
import { OrderDetails } from '../../pages/customer/orders/OrderDetails';
import { Profile } from '../../pages/customer/profile/MyProfile';
import { NotificationList } from '../../pages/customer/notifications/NotificationList';

// Vendor Pages
import { Dashboard as VendorDashboard } from '../../pages/vendor/dashboard/Dashboard';
import { ProductList as VendorProductList } from '../../pages/vendor/products/ProductList';
import { EditProduct as VendorEditProduct } from '../../pages/vendor/products/EditProduct';
import { CreateProduct as VendorCreateProduct } from '../../pages/vendor/products/CreateProduct';
import { StoreList as VendorStoreList } from '../../pages/vendor/stores/StoreList';
import { CreateStore as VendorCreateStore } from '../../pages/vendor/stores/CreateStore';
import { EditStore } from '../../pages/vendor/stores/EditStore';
import { OrderList as VendorOrderList } from '../../pages/vendor/orders/OrderList';
import { OrderDetails as VendorOrderDetails } from '../../pages/vendor/orders/OrderDetails';
import { EarningsOverview } from '../../pages/vendor/earnings/EarningsOverview';
import { PayoutHistory } from '../../pages/vendor/earnings/PayoutHistory';
import { Transactions } from '../../pages/vendor/earnings/Transactions';
import { CommissionHistory } from '../../pages/vendor/earnings/CommissionHistory';
import { ReviewList as VendorReviewList } from '../../pages/vendor/reviews/ReviewList';
import { ReviewDetails as VendorReviewDetails } from '../../pages/vendor/reviews/ReviewDetails';
import { ReplyReview as VendorReplyReview } from '../../pages/vendor/reviews/ReplyReview';
import { ReviewAnalytics as VendorReviewAnalytics } from '../../pages/vendor/reviews/ReviewAnalytics';
import { AnalyticsDashboard } from '../../pages/vendor/analytics/AnalyticsDashboard';
import { RevenueAnalytics } from '../../pages/vendor/analytics/RevenueAnalytics';
import { SalesAnalytics } from '../../pages/vendor/analytics/SalesAnalytics';
import { ProductAnalytics } from '../../pages/vendor/analytics/ProductAnalytics';
import { OrderAnalytics } from '../../pages/vendor/analytics/OrderAnalytics';
import { CustomerAnalytics } from '../../pages/vendor/analytics/CustomerAnalytics';
import { VendorSettings } from '../../pages/vendor/settings/VendorSettings';
import { NotificationList as VendorNotificationList } from '../../pages/vendor/notifications/NotificationList';

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
                {/* ===== PUBLIC AUTH ROUTES ===== */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={token ? <Navigate to={getHomeRoute()} replace /> : <Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />
                </Route>

                {/* ===== ✅ PUBLIC CUSTOMER ROUTES (No Auth Required) ===== */}
                <Route element={<CustomerLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:productId" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/stores" element={<StoreList />} />
                    <Route path="/stores/:storeId" element={<StoreDetails />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                </Route>

                {/* ===== ✅ PROTECTED CUSTOMER ROUTES (Auth Required) ===== */}
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
                    <Route path="orders/:orderId" element={<OrderDetails />} />

                    <Route path="profile" element={<Profile />} />
                    <Route path="notifications" element={<NotificationList />} />
                    <Route path="reviews" element={<MyReviews />} />
                    <Route path="reviews/write" element={<WriteReview />} />
                    <Route path="reviews/edit/:reviewId" element={<EditReview />} />

                    {/* ✅ NEW: Customer Account Settings */}
                    <Route path="change-email" element={<ChangeEmail />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>

                {/* ===== VENDOR ROUTES ===== */}
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
                    <Route path="products/edit/:productId" element={<VendorEditProduct />} />
                    <Route path="stores" element={<VendorStoreList />} />
                    <Route path="stores/create" element={<VendorCreateStore />} />
                    <Route path="stores/edit/:storeId" element={<EditStore />} />
                    <Route path="orders" element={<VendorOrderList />} />
                    <Route path="orders/:orderId" element={<VendorOrderDetails />} />
                    <Route path="earnings" element={<EarningsOverview />} />
                    <Route path="earnings/payouts" element={<PayoutHistory />} />
                    <Route path="earnings/transactions" element={<Transactions />} />
                    <Route path="earnings/commission" element={<CommissionHistory />} />
                    <Route path="reviews" element={<VendorReviewList />} />
                    <Route path="reviews/analytics" element={<VendorReviewAnalytics />} />
                    <Route path="reviews/:reviewId" element={<VendorReviewDetails />} />
                    <Route path="reviews/:reviewId/reply" element={<VendorReplyReview />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="analytics/revenue" element={<RevenueAnalytics />} />
                    <Route path="analytics/sales" element={<SalesAnalytics />} />
                    <Route path="analytics/products" element={<ProductAnalytics />} />
                    <Route path="analytics/orders" element={<OrderAnalytics />} />
                    <Route path="analytics/customers" element={<CustomerAnalytics />} />
                    <Route path="settings" element={<VendorSettings />} /> 
                    <Route path="notifications" element={<VendorNotificationList />} />

                    {/* ✅ NEW: Vendor Account Settings */}
                    <Route path="change-email" element={<ChangeEmail />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>

                {/* ===== ADMIN ROUTES ===== */}
                <Route path="/admin/*" element={<div className="p-6">Admin Panel is in separate project (admin-panel)</div>} />

                {/* ===== DEFAULT REDIRECTS ===== */}
                <Route path="/customer/home" element={<Navigate to="/" replace />} />
                <Route path="/customer/products" element={<Navigate to="/products" replace />} />
                <Route path="/customer/stores" element={<Navigate to="/stores" replace />} />
                <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
            </Routes>
        </BrowserRouter>
    );
};