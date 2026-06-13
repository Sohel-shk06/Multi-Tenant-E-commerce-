import api from './api';

export const vendorService = {
    // Dashboard Stats
    getDashboardStats: async () => {
        const response = await api.get('/vendor/dashboard/stats');
        return response.data.data;
    },

    // Revenue Chart Data
    getRevenueChart: async () => {
        const response = await api.get('/vendor/dashboard/revenue-chart');
        return response.data.data;
    },

    // Recent Orders
    getRecentOrders: async () => {
        const response = await api.get('/vendor/dashboard/recent-orders');
        return response.data.data;
    },

    // Existing dashboard functions ke baad ye add karein:

    // ===== Product Management =====
    getVendorProducts: async (params) => {
        console.log('📡 Fetching vendor products with params:', params);
        const response = await api.get('/vendor/products', { params });
        console.log('✅ Response:', response.data);
        return response.data.data; // ✅ Ensure ye `.data.data` return kar raha hai
    },

    getVendorProduct: async (productId) => {
        const response = await api.get(`/vendor/products/${productId}`);
        return response.data.data;
    },

    createVendorProduct: async (productData) => {
        const response = await api.post('/vendor/products', productData);
        return response.data.data;
    },

    updateVendorProduct: async (productId, productData) => {
        const response = await api.patch(`/vendor/products/${productId}`, productData);
        return response.data.data;
    },

    deleteVendorProduct: async (productId) => {
        const response = await api.delete(`/vendor/products/${productId}`);
        return response.data.data;
    },

    getVendorStores: async () => {
        const response = await api.get('/vendor/stores/list');
        return response.data.data;
    },


    createStore: async (storeData) => {
        const response = await api.post('/stores', storeData); // /stores route already handles vendor ID internally
        return response.data.data;
    },

    // ===== Store Management =====
    getVendorStoresFull: async (params) => {
        const response = await api.get('/vendor/stores', { params });
        return response.data.data;
    },

    getVendorStore: async (storeId) => {
        const response = await api.get(`/vendor/stores/${storeId}`);
        return response.data.data;
    },

    createVendorStore: async (storeData) => {
        const response = await api.post('/vendor/stores', storeData);
        return response.data.data;
    },

    updateVendorStore: async (storeId, storeData) => {
        const response = await api.patch(`/vendor/stores/${storeId}`, storeData);
        return response.data.data;
    },

    deleteVendorStore: async (storeId) => {
        const response = await api.delete(`/vendor/stores/${storeId}`);
        return response.data.data;
    },


    // ===== Order Management =====
    getVendorOrders: async (params) => {
        const response = await api.get('/vendor/orders', { params });
        return response.data.data;
    },

    getVendorOrder: async (orderId) => {
        const response = await api.get(`/vendor/orders/${orderId}`);
        return response.data.data;
    },

    updateVendorOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/vendor/orders/${orderId}/status`, { status });
        return response.data.data;
    },


    // ===== Earnings & Payouts =====
    getEarningsOverview: async () => {
        const response = await api.get('/vendor/earnings/overview');
        return response.data.data;
    },

    getPayoutHistory: async (params) => {
        const response = await api.get('/vendor/earnings/payouts', { params });
        return response.data.data;
    },

    requestPayout: async (amount) => {
        const response = await api.post('/vendor/earnings/payouts', { amount });
        return response.data.data;
    },

    getMonthlyEarnings: async () => {
        const response = await api.get('/vendor/earnings/monthly');
        return response.data.data;
    },

    // ===== Review Management =====
    getVendorReviews: async (params) => {
        const response = await api.get('/vendor/reviews', { params });
        return response.data.data;
    },

    getVendorReview: async (reviewId) => {
        const response = await api.get(`/vendor/reviews/${reviewId}`);
        return response.data.data;
    },

    replyToReview: async (reviewId, reply) => {
        const response = await api.post(`/vendor/reviews/${reviewId}/reply`, { reply });
        return response.data.data;
    },

    deleteVendorReply: async (reviewId) => {
        const response = await api.delete(`/vendor/reviews/${reviewId}/reply`);
        return response.data.data;
    },

    getReviewAnalytics: async () => {
        const response = await api.get('/vendor/reviews/analytics');
        return response.data.data;
    },


    // ===== Analytics =====
    getRevenueAnalytics: async (params) => {
        const response = await api.get('/vendor/analytics/revenue', { params });
        return response.data.data;
    },

    getProductAnalytics: async () => {
        const response = await api.get('/vendor/analytics/products');
        return response.data.data;
    },

    getOrderAnalytics: async () => {
        const response = await api.get('/vendor/analytics/orders');
        return response.data.data;
    },

    getCustomerAnalytics: async () => {
        const response = await api.get('/vendor/analytics/customers');
        return response.data.data;
    },

    getSalesAnalytics: async () => {
        const response = await api.get('/vendor/analytics/sales');
        return response.data.data;
    },
};