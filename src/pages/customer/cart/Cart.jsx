import { useNavigate } from 'react-router-dom'
import useCart from '../../../hooks/useCart'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import CartItem from '../../../components/cards/CartItem'
import CartSummary from '../../../components/cards/CartSummary'
import EmptyState from '../../../components/shared/EmptyState'
import Button from '../../../components/ui/Button'

/**
 * Cart page — displays all cart items with quantity controls,
 * a sticky order summary panel, and an empty state.
 *
 * TODO: On mount, call cart.service.getCart() and hydrate Redux state
 *       once the backend API is connected.
 * TODO: Show a toast notification on remove / quantity change.
 */
function Cart() {
  const navigate = useNavigate()
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    grandTotal,
    isFreeShipping,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart()

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Cart' },
  ]

  const handleClearCart = () => {
    // TODO: Call cart.service.removeFromCart for each item via backend API
    clearCart()
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbs} />
        <EmptyCartState onContinue={() => navigate('/products')} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCart}
          aria-label="Clear all items from cart"
          className="text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          Clear Cart
        </Button>
      </div>

      {/* Two-column layout: items left, summary right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Cart items list */}
        <section
          aria-label="Cart items"
          className="lg:col-span-2 flex flex-col gap-3"
        >
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={(id) => {
                // TODO: Call cart.service.removeFromCart(id) when backend is connected
                removeItem(id)
              }}
              onQuantity={(id, qty) => {
                // TODO: Call cart.service.updateQuantity(id, qty) when backend is connected
                updateQuantity(id, qty)
              }}
            />
          ))}
        </section>

        {/* Order summary — sticky on desktop */}
        <div className="lg:sticky lg:top-24">
          <CartSummary
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            tax={tax}
            grandTotal={grandTotal}
            isFreeShipping={isFreeShipping}
            itemCount={itemCount}
            onCheckout={() => navigate('/checkout')}
            onContinue={() => navigate('/products')}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Empty cart state ─────────────────────────────────────────────────── */
function EmptyCartState({ onContinue }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* SVG illustration */}
      <div
        className="w-32 h-32 flex items-center justify-center rounded-full bg-indigo-50 mb-6"
        aria-hidden="true"
      >
        <svg
          className="w-16 h-16 text-indigo-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Your cart is empty
      </h1>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-8">
        Looks like you haven&apos;t added anything yet. Browse our products and find something you love.
      </p>

      <Button
        variant="primary"
        size="lg"
        onClick={onContinue}
        aria-label="Continue shopping"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Continue Shopping
      </Button>
    </div>
  )
}

export default Cart
