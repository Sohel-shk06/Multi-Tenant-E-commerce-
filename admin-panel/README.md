# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



src/
│
├── app/
│   ├── store/
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── vendorSlice.js
│   │   ├── storeSlice.js
│   │   ├── categorySlice.js
│   │   ├── productSlice.js
│   │   ├── orderSlice.js
│   │   ├── paymentSlice.js
│   │   ├── subscriptionSlice.js
│   │   ├── commissionSlice.js
│   │   ├── analyticsSlice.js
│   │   ├── disputeSlice.js
│   │   ├── notificationSlice.js
│   │   └── settingSlice.js
│   │
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── GuestRoute.jsx
│   │   └── RoleRoute.jsx
│   │
│   └── providers/
│       ├── ThemeProvider.jsx
│       ├── QueryProvider.jsx
│       └── AuthProvider.jsx
│
├── layouts/
│   ├── DashboardLayout.jsx
│   ├── AuthLayout.jsx
│   ├── ErrorLayout.jsx
│   └── EmptyLayout.jsx
│
├── pages/
│
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── VerifyEmail.jsx
│   │   └── ChangePassword.jsx
│
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   └── DashboardStats.jsx
│
│   ├── vendors/
│   │   ├── VendorList.jsx
│   │   ├── VendorDetails.jsx
│   │   ├── CreateVendor.jsx
│   │   ├── EditVendor.jsx
│   │   ├── VendorStores.jsx
│   │   ├── VendorOrders.jsx
│   │   ├── VendorPayments.jsx
│   │   ├── VendorSubscription.jsx
│   │   └── SuspendedVendors.jsx
│
│   ├── stores/
│   │   ├── StoreList.jsx
│   │   ├── StoreDetails.jsx
│   │   ├── CreateStore.jsx
│   │   ├── EditStore.jsx
│   │   ├── StoreAnalytics.jsx
│   │   └── StoreSettings.jsx
│
│   ├── categories/
│   │   ├── CategoryList.jsx
│   │   ├── CreateCategory.jsx
│   │   ├── EditCategory.jsx
│   │   └── CategoryDetails.jsx
│
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── ProductImages.jsx
│   │   ├── ProductVariants.jsx
│   │   ├── ProductReviews.jsx
│   │   ├── ProductModeration.jsx
│   │   └── ProductAnalytics.jsx
│
│   ├── inventory/
│   │   ├── InventoryList.jsx
│   │   ├── LowStockProducts.jsx
│   │   ├── StockHistory.jsx
│   │   └── InventoryAnalytics.jsx
│
│   ├── orders/
│   │   ├── OrderList.jsx
│   │   ├── OrderDetails.jsx
│   │   ├── PendingOrders.jsx
│   │   ├── CompletedOrders.jsx
│   │   ├── CancelledOrders.jsx
│   │   ├── ReturnedOrders.jsx
│   │   ├── RefundOrders.jsx
│   │   └── OrderInvoices.jsx
│
│   ├── payments/
│   │   ├── Transactions.jsx
│   │   ├── PaymentDetails.jsx
│   │   ├── Payouts.jsx
│   │   ├── Refunds.jsx
│   │   ├── FailedPayments.jsx
│   │   └── PaymentAnalytics.jsx
│
│   ├── subscriptions/
│   │   ├── Plans.jsx
│   │   ├── CreatePlan.jsx
│   │   ├── EditPlan.jsx
│   │   ├── ActiveSubscriptions.jsx
│   │   ├── ExpiredSubscriptions.jsx
│   │   ├── BillingHistory.jsx
│   │   └── SubscriptionAnalytics.jsx
│
│   ├── commissions/
│   │   ├── CommissionList.jsx
│   │   ├── CommissionSettings.jsx
│   │   ├── VendorCommission.jsx
│   │   ├── CommissionHistory.jsx
│   │   └── CommissionAnalytics.jsx
│
│   ├── disputes/
│   │   ├── DisputeList.jsx
│   │   ├── DisputeDetails.jsx
│   │   ├── OpenDisputes.jsx
│   │   ├── ClosedDisputes.jsx
│   │   └── ResolveDispute.jsx
│
│   ├── customers/
│   │   ├── CustomerList.jsx
│   │   ├── CustomerDetails.jsx
│   │   ├── CustomerOrders.jsx
│   │   ├── CustomerReviews.jsx
│   │   └── CustomerAnalytics.jsx
│
│   ├── reviews/
│   │   ├── ReviewList.jsx
│   │   ├── ReviewDetails.jsx
│   │   ├── ReportedReviews.jsx
│   │   └── ReviewModeration.jsx
│
│   ├── notifications/
│   │   ├── NotificationList.jsx
│   │   ├── SendNotification.jsx
│   │   ├── EmailTemplates.jsx
│   │   ├── PushNotifications.jsx
│   │   └── NotificationLogs.jsx
│
│   ├── analytics/
│   │   ├── RevenueAnalytics.jsx
│   │   ├── VendorAnalytics.jsx
│   │   ├── CustomerAnalytics.jsx
│   │   ├── SalesAnalytics.jsx
│   │   ├── ProductAnalytics.jsx
│   │   ├── OrderAnalytics.jsx
│   │   ├── CommissionAnalytics.jsx
│   │   └── SubscriptionAnalytics.jsx
│
│   ├── reports/
│   │   ├── SalesReport.jsx
│   │   ├── RevenueReport.jsx
│   │   ├── VendorReport.jsx
│   │   ├── CustomerReport.jsx
│   │   └── ExportReport.jsx
│
│   ├── settings/
│   │   ├── GeneralSettings.jsx
│   │   ├── SecuritySettings.jsx
│   │   ├── CommissionSettings.jsx
│   │   ├── PaymentSettings.jsx
│   │   ├── EmailSettings.jsx
│   │   ├── NotificationSettings.jsx
│   │   ├── StorageSettings.jsx
│   │   └── SystemSettings.jsx
│
│   ├── profile/
│   │   ├── AdminProfile.jsx
│   │   ├── EditProfile.jsx
│   │   └── ChangePassword.jsx
│
│   └── errors/
│       ├── NotFound.jsx
│       ├── Unauthorized.jsx
│       ├── Forbidden.jsx
│       └── ServerError.jsx
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   ├── cards/
│   ├── modals/
│   ├── sidebar/
│   ├── navbar/
│   ├── loaders/
│   ├── pagination/
│   ├── filters/
│   ├── breadcrumbs/
│   └── shared/
│
├── services/
│   ├── api.js
│   ├── auth.service.js
│   ├── vendor.service.js
│   ├── store.service.js
│   ├── category.service.js
│   ├── product.service.js
│   ├── inventory.service.js
│   ├── order.service.js
│   ├── payment.service.js
│   ├── subscription.service.js
│   ├── commission.service.js
│   ├── review.service.js
│   ├── dispute.service.js
│   ├── analytics.service.js
│   ├── report.service.js
│   └── notification.service.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useVendor.js
│   ├── useProduct.js
│   ├── useOrder.js
│   ├── usePagination.js
│   ├── useDebounce.js
│   └── usePermissions.js
│
├── utils/
│   ├── constants.js
│   ├── permissions.js
│   ├── validators.js
│   ├── formatters.js
│   ├── date.js
│   ├── storage.js
│   └── helpers.js
│
├── assets/
├── styles/
│
├── App.jsx
└── main.jsx