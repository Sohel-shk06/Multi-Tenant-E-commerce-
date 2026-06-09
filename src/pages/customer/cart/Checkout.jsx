import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCart from '../../../hooks/useCart'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import Button from '../../../components/ui/Button'
import PriceRow from '../../../components/cards/PriceRow'

/**
 * Checkout page — collects shipping address and payment method,
 * then places the order.
 *
 * All state is local mock data.
 * TODO: Replace shippingForm with data from the user's AddressBook (GET /api/profile/addresses).
 * TODO: Replace payment section with a real payment gateway (Stripe, PayPal, etc.).
 * TODO: On submit call cart.service.checkout(payload) → redirect to /order-summary.
 * TODO: Clear Redux cart state after a successful order.
 * TODO: Handle API error responses and display field-level validation messages.
 */

const INITIAL_ADDRESS = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'cod', label: 'Cash on Delivery' },
]

function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, discount, shipping, tax, grandTotal, isFreeShipping, itemCount } =
    useCart()

  const [shippingForm, setShippingForm] = useState(INITIAL_ADDRESS)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [placing, setPlacing] = useState(false)
  const [errors, setErrors] = useState({})

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Cart', to: '/cart' },
    { label: 'Checkout' },
  ]

  // Redirect back to cart if it is empty
  if (items.length === 0) {
    navigate('/cart', { replace: true })
    return null
  }

  /* ── Field change handler ─────────────────────────────────────── */
  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setShippingForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /* ── Client-side validation ───────────────────────────────────── */
  const validate = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode']
    const next = {}
    required.forEach((field) => {
      if (!shippingForm[field].trim()) {
        next[field] = 'This field is required.'
      }
    })
    return next
  }

  /* ── Submit handler ───────────────────────────────────────────── */
  const handlePlaceOrder = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Scroll to first error
      const firstKey = Object.keys(validationErrors)[0]
      document.getElementById(firstKey)?.focus()
      return
    }

    setPlacing(true)
    try {
      // TODO: Replace with real API call:
      // const { data } = await checkout({ shippingAddress: shippingForm, paymentMethod })
      // navigate('/order-summary', { state: { orderId: data.orderId } })

      // Mock 1-second delay to simulate API call
      await new Promise((res) => setTimeout(res, 1000))
      navigate('/order-summary', {
        state: {
          orderId: `ORD-${Date.now()}`,
          shippingAddress: shippingForm,
          paymentMethod,
          items,
          subtotal,
          discount,
          shipping,
          tax,
          grandTotal,
        },
      })
    } catch {
      // TODO: Display error toast / message from backend response
      setErrors({ submit: 'Failed to place order. Please try again.' })
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbs} />

      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── Left: Forms ──────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Shipping address */}
          <section
            aria-labelledby="shipping-heading"
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
          >
            <h2
              id="shipping-heading"
              className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold" aria-hidden="true">
                1
              </span>
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="fullName"
                label="Full Name"
                name="fullName"
                value={shippingForm.fullName}
                onChange={handleFieldChange}
                error={errors.fullName}
                placeholder="Jane Smith"
                required
              />
              <FormField
                id="phone"
                label="Phone Number"
                name="phone"
                type="tel"
                value={shippingForm.phone}
                onChange={handleFieldChange}
                error={errors.phone}
                placeholder="+1 (555) 000-0000"
                required
              />
              <div className="sm:col-span-2">
                <FormField
                  id="addressLine1"
                  label="Address Line 1"
                  name="addressLine1"
                  value={shippingForm.addressLine1}
                  onChange={handleFieldChange}
                  error={errors.addressLine1}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <FormField
                  id="addressLine2"
                  label="Address Line 2"
                  name="addressLine2"
                  value={shippingForm.addressLine2}
                  onChange={handleFieldChange}
                  placeholder="Apt, suite, floor (optional)"
                />
              </div>
              <FormField
                id="city"
                label="City"
                name="city"
                value={shippingForm.city}
                onChange={handleFieldChange}
                error={errors.city}
                placeholder="New York"
                required
              />
              <FormField
                id="state"
                label="State / Province"
                name="state"
                value={shippingForm.state}
                onChange={handleFieldChange}
                error={errors.state}
                placeholder="NY"
                required
              />
              <FormField
                id="postalCode"
                label="Postal Code"
                name="postalCode"
                value={shippingForm.postalCode}
                onChange={handleFieldChange}
                error={errors.postalCode}
                placeholder="10001"
                required
              />
              <FormField
                id="country"
                label="Country"
                name="country"
                value={shippingForm.country}
                onChange={handleFieldChange}
                placeholder="United States"
              />
            </div>
          </section>

          {/* Payment method */}
          <section
            aria-labelledby="payment-heading"
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
          >
            <h2
              id="payment-heading"
              className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold" aria-hidden="true">
                2
              </span>
              Payment Method
            </h2>

            <fieldset>
              <legend className="sr-only">Select payment method</legend>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-indigo-600 w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {method.label}
                    </span>
                    {/* TODO: Add payment gateway icons */}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Card details placeholder */}
            {paymentMethod === 'card' && (
              <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700">
                  <strong>TODO:</strong> Integrate Stripe / payment gateway card element here.
                  Card details will be collected securely by the payment provider.
                </p>
              </div>
            )}
          </section>

          {/* Submit error */}
          {errors.submit && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {errors.submit}
            </p>
          )}
        </div>

        {/* ── Right: Order summary ──────────────────────────────── */}
        <div className="lg:sticky lg:top-24">
          <aside
            aria-label="Order summary"
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4"
          >
            <h2 className="text-base font-semibold text-gray-900">
              Order Summary
            </h2>

            {/* Items mini-list */}
            <ul className="flex flex-col gap-2 border-b border-gray-100 pb-4" aria-label="Items in your order">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-gray-700 flex-1 leading-snug line-clamp-2">
                    {item.name}{' '}
                    <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900 shrink-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Price breakdown */}
            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
              <PriceRow label={`Subtotal (${itemCount} items)`} value={subtotal} />
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
            </div>

            {/* Grand total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Grand Total</span>
              <span className="text-xl font-bold text-indigo-600">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePlaceOrder}
              disabled={placing}
              aria-label={placing ? 'Placing your order…' : 'Place order'}
            >
              {placing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Placing Order…
                </>
              ) : (
                'Place Order'
              )}
            </Button>

            <p className="text-xs text-center text-gray-400">
              By placing your order you agree to our{' '}
              <a href="/terms" className="underline hover:text-indigo-600">
                Terms of Service
              </a>
              .
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ─── FormField helper ─────────────────────────────────────────────────── */
function FormField({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-gray-700">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          error
            ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-300'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

export default Checkout
