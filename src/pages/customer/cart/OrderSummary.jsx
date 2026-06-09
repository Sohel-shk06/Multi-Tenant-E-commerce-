import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../../app/store/cartSlice'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import PriceRow from '../../../components/cards/PriceRow'
import Button from '../../../components/ui/Button'

/**
 * OrderSummary page — confirmation screen shown after a successful checkout.
 *
 * Receives order data via React Router location.state (passed from Checkout.jsx).
 * TODO: Replace location.state data with a real GET /api/orders/:orderId API call.
 * TODO: Send order confirmation email via backend on order creation.
 * TODO: Integrate order tracking link once the orders module is implemented.
 */
function OrderSummary() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Data passed from Checkout page
  const orderData = location.state

  // Clear the Redux cart once the confirmation page mounts
  useEffect(() => {
    if (orderData) {
      // TODO: Backend should already have cleared the cart server-side.
      // This clears client-side Redux state.
      dispatch(clearCart())
    }
  }, [dispatch, orderData])

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Cart', to: '/cart' },
    { label: 'Order Confirmation' },
  ]

  // If page is accessed directly without order data, redirect to home
  if (!orderData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbs} />
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">No order information found.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const {
    orderId,
    shippingAddress,
    paymentMethod,
    items = [],
    subtotal = 0,
    discount = 0,
    shipping = 0,
    tax = 0,
    grandTotal = 0,
  } = orderData

  const isFreeShipping = shipping === 0 && subtotal > 0
  const paymentLabel =
    paymentMethod === 'card'
      ? 'Credit / Debit Card'
      : paymentMethod === 'paypal'
      ? 'PayPal'
      : 'Cash on Delivery'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbs} />

      {/* Success banner */}
      <div className="mt-6 mb-8 flex flex-col sm:flex-row items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-6">
        <div
          className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 shrink-0"
          aria-hidden="true"
        >
          <svg
            className="w-7 h-7 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold text-green-800">Order Placed Successfully!</h1>
          <p className="text-sm text-green-700 mt-1">
            Thank you for your purchase. Your order ID is{' '}
            <span className="font-semibold">{orderId}</span>.
          </p>
          <p className="text-xs text-green-600 mt-0.5">
            A confirmation email will be sent to you shortly.
            {/* TODO: Display the customer's email once auth is integrated */}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Items ordered ──────────────────────────────────── */}
        <section
          aria-labelledby="items-heading"
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:col-span-2"
        >
          <h2 id="items-heading" className="text-sm font-semibold text-gray-900 mb-4">
            Items Ordered
          </h2>

          <ul className="flex flex-col divide-y divide-gray-100" aria-label="Ordered items">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
              >
                {/* Thumbnail */}
                <div
                  className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                      />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-indigo-600 font-medium truncate">{item.storeName}</p>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                  </p>
                </div>

                {/* Line total */}
                <span className="text-sm font-semibold text-gray-900 shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Shipping address ───────────────────────────────── */}
        <section
          aria-labelledby="shipping-heading"
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 id="shipping-heading" className="text-sm font-semibold text-gray-900 mb-3">
            Shipping Address
          </h2>
          {shippingAddress ? (
            <address className="text-sm text-gray-600 not-italic leading-relaxed">
              <p className="font-medium text-gray-800">{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p className="mt-1 text-gray-500">{shippingAddress.phone}</p>
            </address>
          ) : (
            <p className="text-sm text-gray-400">No address on file.</p>
          )}
        </section>

        {/* ── Payment & pricing ──────────────────────────────── */}
        <section
          aria-labelledby="payment-heading"
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <h2 id="payment-heading" className="text-sm font-semibold text-gray-900 mb-3">
            Payment & Pricing
          </h2>

          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">Payment method:</span>
            <span className="text-xs font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
              {paymentLabel}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <PriceRow label={`Subtotal (${items.length} items)`} value={subtotal} />
            {discount > 0 && (
              <PriceRow label="Discount" value={-discount} valueClassName="text-green-600" />
            )}
            <PriceRow
              label="Shipping"
              value={shipping}
              valueOverride={isFreeShipping ? 'Free' : null}
              valueClassName={isFreeShipping ? 'text-green-600' : ''}
            />
            <PriceRow label="Tax (GST 18%)" value={tax} />

            <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Grand Total</span>
              <span className="text-xl font-bold text-indigo-600">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* CTA buttons */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/orders')}
          aria-label="View my orders"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View My Orders
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/products')}
          aria-label="Continue shopping"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}

export default OrderSummary
