/**
 * product.service.js — Product API service layer.
 *
 * All functions return empty Promise responses as placeholders.
 * TODO: Replace with real API calls using the Axios instance in api.js.
 * TODO: Set VITE_API_BASE_URL in .env and import api from './api'.
 */

// TODO: import api from './api'

/**
 * Fetch a paginated list of products.
 * @param {{ page?: number, limit?: number, sort?: string, category?: string, search?: string }} params
 * TODO: GET /api/products
 */
export async function getProducts(params = {}) {
  // TODO: return api.get('/products', { params })
  return Promise.resolve({ data: { products: [], total: 0, page: 1, totalPages: 0 } })
}

/**
 * Fetch a single product by its ID or slug.
 * @param {string} productId
 * TODO: GET /api/products/:productId
 */
export async function getProduct(productId) {
  // TODO: return api.get(`/products/${productId}`)
  return Promise.resolve({ data: null })
}

/**
 * Search products by query string.
 * @param {{ query: string, page?: number, limit?: number, sort?: string, category?: string }} params
 * TODO: GET /api/products/search
 */
export async function searchProducts(params = {}) {
  // TODO: return api.get('/products/search', { params })
  return Promise.resolve({ data: { products: [], total: 0, page: 1, totalPages: 0 } })
}

/**
 * Fetch related products for a given product.
 * @param {string} productId
 * TODO: GET /api/products/:productId/related
 */
export async function getRelatedProducts(productId) {
  // TODO: return api.get(`/products/${productId}/related`)
  return Promise.resolve({ data: { products: [] } })
}

/**
 * Fetch all reviews for a product.
 * @param {string} productId
 * @param {{ page?: number, limit?: number }} params
 * TODO: GET /api/products/:productId/reviews
 */
export async function getReviews(productId, params = {}) {
  // TODO: return api.get(`/products/${productId}/reviews`, { params })
  return Promise.resolve({ data: { reviews: [], total: 0, averageRating: 0, ratingBreakdown: {} } })
}

/**
 * Submit a new review for a product.
 * @param {string} productId
 * @param {{ rating: number, title: string, body: string }} payload
 * TODO: POST /api/products/:productId/reviews
 */
export async function submitReview(productId, payload) {
  // TODO: return api.post(`/products/${productId}/reviews`, payload)
  return Promise.resolve({ data: { success: true } })
}
