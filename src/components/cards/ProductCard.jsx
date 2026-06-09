import { Link } from 'react-router-dom'
import Button from '../ui/Button'

/**
 * ProductCard — reusable product tile for grids.
 *
 * Props:
 *  product — object with shape:
 *    { _id, name, storeName, price, description, image, rating, reviewCount, inStock }
 *  onAddToCart    — function(product) — TODO: connect to cart.service
 *  onAddToWishlist — function(product) — TODO: connect to wishlist.service
 *
 * No backend actions are performed. Handlers are passed as props so
 * parent pages control the integration point.
 */
function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  if (!product) return null

  const { _id, name, storeName, price, description, image, rating, reviewCount, inStock } = product

  return (
    <article
      className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      aria-label={`Product: ${name}`}
    >
      {/* Product image */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-14 h-14 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        {/* Wishlist button overlay */}
        <button
          type="button"
          onClick={() => {
            // TODO: Integrate wishlist.service.addToWishlist when backend is ready
            onAddToWishlist?.(product)
          }}
          aria-label={`Add ${name} to wishlist`}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Out of stock badge */}
        {inStock === false && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-800 text-white rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Store name */}
        {storeName && (
          <p className="text-xs font-medium text-indigo-600 truncate">{storeName}</p>
        )}

        {/* Product name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
          <Link
            to={`/products/${_id}`}
            className="hover:text-indigo-600 transition-colors focus:outline-none focus-visible:underline"
          >
            {name}
          </Link>
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Rating placeholder */}
        <div className="flex items-center gap-1.5" aria-label={rating ? `Rated ${rating} out of 5` : 'No ratings yet'}>
          <RatingStars rating={rating} />
          {reviewCount > 0 && (
            <span className="text-xs text-gray-400">({reviewCount})</span>
          )}
          {!rating && (
            <span className="text-xs text-gray-400">No ratings yet</span>
          )}
        </div>

        {/* Price */}
        <p className="text-base font-bold text-gray-900 mt-auto">
          {price != null ? `₹${Number(price).toFixed(2)}` : 'Price unavailable'}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-1">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={inStock === false}
            onClick={() => {
              // TODO: Integrate cart.service.addToCart when backend is ready
              onAddToCart?.(product)
            }}
            aria-label={`Add ${name} to cart`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Add to Cart
          </Button>
          <Link
            to={`/products/${_id}`}
            className="inline-flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`View details for ${name}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ─── Rating stars sub-component ──────────────────────────────────────── */
function RatingStars({ rating }) {
  const max = 5
  const filled = Math.round(rating ?? 0)

  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < filled ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export { RatingStars }
export default ProductCard
