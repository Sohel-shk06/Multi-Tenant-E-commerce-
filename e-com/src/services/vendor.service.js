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

    // ===== Product Management =====
    getVendorProducts: async (params) => {
        console.log('📡 Fetching vendor products with params:', params);
        const response = await api.get('/vendor/products', { params });
        console.log('✅ Response:', response.data);
        return response.data.data;
    },

    getVendorProduct: async (productId) => {
        const response = await api.get(`/vendor/products/${productId}`);
        return response.data.data;
    },

    // ✅ UPDATED: createVendorProduct with FormData for image upload
    createVendorProduct: async (productData) => {
        const formData = new FormData();
        
        // Text fields
        formData.append('title', productData.title);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('comparePrice', productData.comparePrice || 0);
        formData.append('category', productData.category);
        formData.append('store', productData.store);
        formData.append('stock', productData.stock || 0);
        formData.append('sku', productData.sku || '');
        
        // Tags
        if (productData.tags && productData.tags.length > 0) {
            productData.tags.forEach(tag => formData.append('tags[]', tag));
        }
        
        // Variants
        if (productData.variants && productData.variants.length > 0) {
            formData.append('variants', JSON.stringify(productData.variants));
        }
        
        // ✅ Multiple images
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach(file => {
                formData.append('images', file);
            });
        }

        const response = await api.post('/vendor/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    },

updateVendorProduct: async (productId, productData) => {
    const formData = new FormData();
    
    // Text fields
    if (productData.title !== undefined) formData.append('title', productData.title);
    if (productData.description !== undefined) formData.append('description', productData.description);
    if (productData.price !== undefined) formData.append('price', productData.price);
    if (productData.comparePrice !== undefined) formData.append('comparePrice', productData.comparePrice);
    if (productData.category !== undefined) formData.append('category', productData.category);
    if (productData.store !== undefined) formData.append('store', productData.store);
    if (productData.stock !== undefined) formData.append('stock', productData.stock);
    if (productData.sku !== undefined) formData.append('sku', productData.sku);
    if (productData.status !== undefined) formData.append('status', productData.status);
    
    // Tags
    if (productData.tags && productData.tags.length > 0) {
        productData.tags.forEach(tag => formData.append('tags[]', tag));
    }
    
    // Variants
    if (productData.variants && productData.variants.length > 0) {
        formData.append('variants', JSON.stringify(productData.variants));
    }
    
    // ✅ EXISTING IMAGES (jo vendor ne rakhi hain)
    if (productData.existingImages !== undefined) {
        formData.append('existingImages', JSON.stringify(productData.existingImages));
    }
    
    // ✅ NEW IMAGES (jo vendor ne add kiye hain)
    if (productData.images && productData.images.length > 0) {
        productData.images.forEach(file => {
            if (file instanceof File) {
                formData.append('images', file);
            }
        });
    }

    // ✅ CORRECT URL: /vendor/products/:productId
    const response = await api.patch(`/vendor/products/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
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
        const response = await api.post('/stores', storeData);
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
// ===== Order Management =====
// ✅ FIXED: Empty parameters filter karo
getVendorOrders: async (params) => {
    // Empty/invalid parameters ko filter karein
    const cleanParams = {};
    if (params) {
        Object.keys(params).forEach(key => {
            const value = params[key];
            // Sirf valid values add karein
            if (value !== undefined && value !== null && value !== '') {
                cleanParams[key] = value;
            }
        });
    }
    
    console.log('📡 Fetching vendor orders with params:', cleanParams);
    const response = await api.get('/vendor/orders', { params: cleanParams });
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