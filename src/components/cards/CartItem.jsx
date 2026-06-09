import QuantitySelector from './QuantitySelector'
import Button from '../ui/Button'

/**
 * CartItem — displays a single cart line item.
 *
 * Props:
 *  item       — cart item object { id, name, storeName, description, price, quantity, image }
 *  onRemove   — called with item.id
 *  onQuantity — called with (item.id, newQuantity)
 */
function CartItem({ item, onRemove, onQuantity }) {
  const lineTotal = (item.price * item.quantity).toFixed(2)

  return (
    <article
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
      aria-label={`Cart item: ${item.name}`}
    >
      {/* Product image */}
      <div
        className="w-full sm:w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden"
        aria-hidden="true"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <p className="text-xs font-medium text-indigo-600 truncate">{item.storeName}</p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
        )}
        <p className="text-sm font-medium text-gray-700 mt-0.5">
          ₹{item.price.toFixed(2)} each
        </p>

        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={99}
            onChange={(qty) => onQuantity(item.id, qty)}
          />

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-900">
              ₹{lineTotal}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
              Remove
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default CartItem
