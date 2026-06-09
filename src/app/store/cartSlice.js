import { createSlice } from '@reduxjs/toolkit'

/**
 * Cart slice — manages cart items in Redux state.
 * All async operations are handled via cart.service.js.
 * TODO: Integrate backend API when available.
 */

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // TODO: Replace with async thunks when backend API is ready
    addItem(state, action) {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId,
      )
      if (existing) {
        existing.quantity += action.payload.quantity ?? 1
      } else {
        state.items.push({ ...action.payload, id: Date.now().toString() })
      }
    },

    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    updateItemQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((item) => item.id === id)
      if (item && quantity > 0) {
        item.quantity = quantity
      }
    },

    clearCart(state) {
      state.items = []
    },

    setLoading(state, action) {
      state.loading = action.payload
    },

    setError(state, action) {
      state.error = action.payload
    },
  },
})

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartLoading = (state) => state.cart.loading
export const selectCartError = (state) => state.cart.error

export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

export default cartSlice.reducer
