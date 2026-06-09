/**
 * cart.service.js — Cart API service layer.
 *
 * All functions currently return mock Promise responses.
 * TODO: Replace mock implementations with real API calls using api.js (Axios instance).
 * TODO: Update base URLs from environment variables (import.meta.env.VITE_API_BASE_URL).
 */

// TODO: import api from './api'

/**
 * Fetch the current user's cart from the backend.
 * TODO: GET /api/cart
 */
export async function getCart() {
  // TODO: return api.get('/cart')
  return Promise.resolve({ data: { items: [] } })
}

/**
 * Add an item to the cart.
 * @param {{ productId: string, quantity: number }} payload
 * TODO: POST /api/cart/items
 */
export async function addToCart(payload) {
  // TODO: return api.post('/cart/items', payload)
  return Promise.resolve({ data: { success: true, item: payload } })
}

/**
 * Remove an item from the cart by cart item ID.
 * @param {string} cartItemId
 * TODO: DELETE /api/cart/items/:cartItemId
 */
export async function removeFromCart(cartItemId) {
  // TODO: return api.delete(`/cart/items/${cartItemId}`)
  return Promise.resolve({ data: { success: true } })
}

/**
 * Update the quantity of a cart item.
 * @param {string} cartItemId
 * @param {number} quantity
 * TODO: PATCH /api/cart/items/:cartItemId
 */
export async function updateQuantity(cartItemId, quantity) {
  // TODO: return api.patch(`/cart/items/${cartItemId}`, { quantity })
  return Promise.resolve({ data: { success: true } })
}

/**
 * Submit the checkout order.
 * @param {{ shippingAddress: object, paymentMethod: object }} payload
 * TODO: POST /api/orders/checkout
 */
export async function checkout(payload) {
  // TODO: return api.post('/orders/checkout', payload)
  return Promise.resolve({
    data: {
      success: true,
      orderId: `ORD-${Date.now()}`,
      message: 'Order placed successfully.',
    },
  })
}

/**
 * Apply a discount coupon code.
 * @param {string} couponCode
 * TODO: POST /api/cart/coupon
 */
export async function applyCoupon(couponCode) {
  // TODO: return api.post('/cart/coupon', { couponCode })
  return Promise.resolve({
    data: { discount: 10, type: 'percentage' },
  })
}
