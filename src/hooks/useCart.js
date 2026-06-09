import { useDispatch, useSelector } from 'react-redux'
import {
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  selectCartLoading,
  selectCartError,
} from '../app/store/cartSlice'

/**
 * useCart — centralised hook for all cart operations.
 *
 * Provides computed pricing values and action dispatchers so
 * page components stay free of direct Redux boilerplate.
 *
 * Pricing constants — these will eventually come from backend settings.
 * TODO: Fetch shipping threshold and tax rate from /api/settings.
 */
const SHIPPING_THRESHOLD = 500  // Free shipping above ₹500 subtotal
const FLAT_SHIPPING_FEE = 49    // ₹49 flat shipping fee
const TAX_RATE = 0.18           // 18% GST — TODO: make dynamic per category/state

function useCart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const itemCount = useSelector(selectCartItemCount)
  const subtotal = useSelector(selectCartSubtotal)
  const loading = useSelector(selectCartLoading)
  const error = useSelector(selectCartError)

  // Derived pricing
  const discount = 0                       // TODO: Apply coupon discount from cartSlice
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_FEE
  const taxableAmount = subtotal - discount
  const tax = parseFloat((taxableAmount * TAX_RATE).toFixed(2))
  const grandTotal = parseFloat((taxableAmount + shipping + tax).toFixed(2))
  const isFreeShipping = subtotal >= SHIPPING_THRESHOLD && subtotal > 0

  const handleAddItem = (item) => dispatch(addItem(item))
  const handleRemoveItem = (id) => dispatch(removeItem(id))
  const handleUpdateQuantity = (id, quantity) =>
    dispatch(updateItemQuantity({ id, quantity }))
  const handleClearCart = () => dispatch(clearCart())

  return {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    grandTotal,
    isFreeShipping,
    loading,
    error,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  }
}

export default useCart
