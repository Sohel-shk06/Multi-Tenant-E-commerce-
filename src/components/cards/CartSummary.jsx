import PriceRow from './PriceRow'
import Button from '../ui/Button'

/**
 * CartSummary — order pricing summary panel for the cart page.
 *
 * Props:
 *  subtotal       — number
 *  discount       — number
 *  shipping       — number (0 = free)
 *  tax            — number
 *  grandTotal     — number
 *  isFreeShipping — boolean
 *  itemCount      — number
 *  onCheckout     — function — called when "Proceed to Checkout" is clicked
 *  onContinue     — function — called when "Continue Shopping" is clicked
 *  disabled       — boolean — disables checkout button (empty cart)
 */
function CartSummary({
  subtotal,
  discount,
  shipping,
  tax,
  grandTotal,
  isFreeShipping,
  itemCount,
  onCheckout,
  onContinue,
  disabled = false,
}) {
  return (
    <aside
      aria-label="Order summary"
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4"
    >
      <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>

      {/* Price breakdown */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
        <PriceRow label={`Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})`} value={subtotal} />
        {discount > 0 && (
          <PriceRow label="Discount" value={-discount} valueClassName="text-green-600" />
        )}
        <PriceRow
          label="Shipping"
          value={shipping}
          valueOverride={isFreeShipping ? 'Free' : shipping === 0 && itemCount === 0 ? '—' : null}
          valueClassName={isFreeShipping ? 'text-green-600' : ''}
        />
        <PriceRow label={`Tax (GST 18%)`} value={tax} />
      </div>

      {/* Grand total */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">Grand Total</span>
        <span className="text-xl font-bold text-indigo-600">
          ₹{grandTotal.toFixed(2)}
        </span>
      </div>

      {/* Free shipping notice */}
      {!isFreeShipping && itemCount > 0 && (
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-lg px-3 py-2">
          Add{' '}
          <span className="font-semibold text-indigo-600">
            ₹{(500 - subtotal).toFixed(2)}
          </span>{' '}
          more to unlock free shipping!
        </p>
      )}
      {isFreeShipping && (
        <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
          🎉 You qualify for free shipping!
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-1">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={disabled}
          onClick={onCheckout}
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Button>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={onContinue}
          aria-label="Continue shopping"
        >
          Continue Shopping
        </Button>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-100">
        {[
          { icon: '🔒', label: 'Secure Checkout' },
          { icon: '↩️', label: 'Easy Returns' },
          { icon: '🚚', label: 'Fast Delivery' },
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-0.5">
            <span className="text-base" aria-hidden="true">{badge.icon}</span>
            <span className="text-xs text-gray-400">{badge.label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default CartSummary
