# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



page v dosrc/
│
├── app/
│   ├── store/
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── productSlice.js
│   │   ├── categorySlice.js
│   │   ├── cartSlice.js
│   │   ├── wishlistSlice.js
│   │   ├── orderSlice.js
│   │   ├── reviewSlice.js
│   │   ├── notificationSlice.js
│   │   ├── storeSlice.js
│   │   ├── inventorySlice.js
│   │   ├── payoutSlice.js
│   │   ├── analyticsSlice.js
│   │   └── subscriptionSlice.js
│   │
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── CustomerRoute.jsx
│   │   └── VendorRoute.jsx
│   │
│   └── providers/
│       ├── AuthProvider.jsx
│       ├── QueryProvider.jsx
│       └── ThemeProvider.jsx
│
├── layouts/
│   ├── CustomerLayout.jsx
│   ├── VendorLayout.jsx
│   ├── AuthLayout.jsx
│   └── ErrorLayout.jsx
│
├── pages/
│
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── VerifyEmail.jsx
│   │   └── ChangePassword.jsx
│
│   ├────────────────────────────
│   │       CUSTOMER
│   ├────────────────────────────
│
│   ├── customer/
│   │
│   │   ├── home/
│   │   │   ├── Home.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── TrendingProducts.jsx
│   │   │   └── NewArrivals.jsx
│   │   │
│   │   ├── categories/
│   │   │   ├── CategoryList.jsx
│   │   │   └── CategoryProducts.jsx
│   │   │
│   │   ├── products/
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── ProductReviews.jsx
│   │   │   └── ProductSearch.jsx
│   │   │
│   │   ├── stores/
│   │   │   ├── StoreList.jsx
│   │   │   └── StoreDetails.jsx
│   │   │
│   │   ├── wishlist/
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── OrderSummary.jsx
│   │   │
│   │   ├── orders/
│   │   │   ├── MyOrders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── TrackOrder.jsx
│   │   │   ├── CancelOrder.jsx
│   │   │   ├── ReturnOrder.jsx
│   │   │   └── Invoice.jsx
│   │   │
│   │   ├── reviews/
│   │   │   ├── MyReviews.jsx
│   │   │   ├── WriteReview.jsx
│   │   │   └── EditReview.jsx
│   │   │
│   │   ├── profile/
│   │   │   ├── MyProfile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── AddressBook.jsx
│   │   │   ├── SavedCards.jsx
│   │   │   └── ChangePassword.jsx
│   │   │
│   │   └── notifications/
│   │       ├── NotificationList.jsx
│   │       └── NotificationSettings.jsx
│
│
│   ├────────────────────────────
│   │         VENDOR
│   ├────────────────────────────
│
│   ├── vendor/
│   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── DashboardStats.jsx
│   │   │
│   │   ├── stores/
│   │   │   ├── StoreList.jsx
│   │   │   ├── CreateStore.jsx
│   │   │   ├── EditStore.jsx
│   │   │   ├── StoreDetails.jsx
│   │   │   └── StoreSettings.jsx
│   │   │
│   │   ├── products/
│   │   │   ├── ProductList.jsx
│   │   │   ├── CreateProduct.jsx
│   │   │   ├── EditProduct.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── ProductImages.jsx
│   │   │   ├── ProductVariants.jsx
│   │   │   └── ProductAnalytics.jsx
│   │   │
│   │   ├── inventory/
│   │   │   ├── InventoryList.jsx
│   │   │   ├── LowStockProducts.jsx
│   │   │   ├── StockHistory.jsx
│   │   │   └── InventoryAnalytics.jsx
│   │   │
│   │   ├── orders/
│   │   │   ├── OrderList.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── PendingOrders.jsx
│   │   │   ├── ConfirmedOrders.jsx
│   │   │   ├── ShippedOrders.jsx
│   │   │   ├── DeliveredOrders.jsx
│   │   │   ├── CancelledOrders.jsx
│   │   │   └── Invoices.jsx
│   │   │
│   │   ├── reviews/
│   │   │   ├── ReviewList.jsx
│   │   │   ├── ReviewDetails.jsx
│   │   │   ├── ReplyReview.jsx
│   │   │   └── ReviewAnalytics.jsx
│   │   │
│   │   ├── earnings/
│   │   │   ├── EarningsOverview.jsx
│   │   │   ├── PayoutHistory.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── CommissionHistory.jsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── RevenueAnalytics.jsx
│   │   │   ├── SalesAnalytics.jsx
│   │   │   ├── ProductAnalytics.jsx
│   │   │   ├── CustomerAnalytics.jsx
│   │   │   └── OrderAnalytics.jsx
│   │   │
│   │   ├── subscriptions/
│   │   │   ├── CurrentPlan.jsx
│   │   │   ├── UpgradePlan.jsx
│   │   │   ├── BillingHistory.jsx
│   │   │   └── SubscriptionDetails.jsx
│   │   │
│   │   ├── profile/
│   │   │   ├── VendorProfile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   └── ChangePassword.jsx
│   │   │
│   │   └── notifications/
│   │       ├── NotificationList.jsx
│   │       └── NotificationSettings.jsx
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
│   ├── cards/
│   ├── charts/
│   ├── modals/
│   ├── navbar/
│   ├── sidebar/
│   ├── loaders/
│   ├── pagination/
│   └── shared/
│
├── services/
│   ├── api.js
│   ├── auth.service.js
│   ├── product.service.js
│   ├── category.service.js
│   ├── cart.service.js
│   ├── wishlist.service.js
│   ├── order.service.js
│   ├── review.service.js
│   ├── store.service.js
│   ├── inventory.service.js
│   ├── analytics.service.js
│   ├── payout.service.js
│   └── notification.service.js
│
├── hooks/
├── utils/
├── assets/
├── styles/
│
├── App.jsx
└── main.jsx