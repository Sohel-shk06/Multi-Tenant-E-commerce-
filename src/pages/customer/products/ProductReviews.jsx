import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getReviews, getProduct } from '../../../services/product.service'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import Button from '../../../components/ui/Button'
import { RatingStars } from '../../../components/cards/ProductCard'
import Pagination from '../../../components/pagination/Pagination'

/**
 * ProductReviews — full reviews page for a product.
 *
 * Displays average rating, rating breakdown, paginated review list,
 * and a Write Review button placeholder.
 *
 * No fake reviews are generated. Displays "No reviews available." when empty.
 *
 * TODO: Load reviews from getReviews API when backend is ready.
 * TODO: Implement write review form with submitReview API.
 * TODO: Gate "Write Review" behind auth — only customers who purchased can review.
 * TODO: Add helpful/unhelpful vote action per review.
 */
function ProductReviews() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [ratingBreakdown, setRatingBreakdown] = useState({})
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch product name for breadcrumb
  useEffect(() => {
    if (!productId) return
    let cancelled = false
    getProduct(productId)
      .then(({ data }) => { if (!cancelled) setProduct(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [productId])

  // Fetch reviews
  useEffect(() => {
    if (!productId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    getReviews(productId, { page, limit: 10 })
      .then(({ data }) => {
        if (cancelled) return
        setReviews(data.reviews ?? [])
        setAverageRating(data.averageRating ?? 0)
        setRatingBreakdown(data.ratingBreakdown ?? {})
        setTotal(data.total ?? 0)
        setTotalPages(data.totalPages ?? 0)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load reviews. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [productId, page])

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    ...(product ? [{ label: product.name, to: `/products/${productId}` }] : []),
    { label: 'Reviews' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbs} />

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          {product && (
            <p className="text-sm text-gray-500 mt-1">
              <Link to={`/products/${productId}`} className="hover:text-indigo-600 transition-colors">
                ← Back to {product.name}
              </Link>
            </p>
          )}
        </div>

        {/* Write Review button */}
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            // TODO: Navigate to write-review form once auth and purchase verification is integrated
            // navigate(`/products/${productId}/write-review`)
          }}
          aria-label="Write a review"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Write a Review
        </Button>
      </div>

      {/* ── Rating summary ───────────────────────────────────── */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          {total === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No reviews yet. Be the first to review this product.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Average score */}
              <div className="flex flex-col items-center text-center shrink-0">
                <span className="text-5xl font-extrabold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <RatingStars rating={averageRating} />
                <span className="mt-1 text-xs text-gray-500">
                  {total} review{total !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Rating breakdown bars */}
              <div className="flex-1 w-full flex flex-col gap-1.5" aria-label="Rating breakdown">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingBreakdown[star] ?? 0
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-4 text-right shrink-0">{star}</span>
                      <svg className="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <div
                        className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${star} star: ${pct}%`}
                      >
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right shrink-0 text-gray-400">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── States: loading / error / empty / list ───────────── */}
      {loading && (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading reviews">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gray-100" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/5" />
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
          <p className="sr-only" aria-live="polite">Loading reviews…</p>
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-12 bg-white rounded-xl border border-gray-200">
          No reviews available.
        </p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="flex flex-col gap-4" role="list" aria-label="Customer reviews">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                disabled={loading}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Single review card ───────────────────────────────────────────────── */
function ReviewCard({ review }) {
  const {
    _id,
    authorName,
    rating,
    title,
    body,
    createdAt,
    verified,
  } = review

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <article
      role="listitem"
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
      aria-label={`Review by ${authorName ?? 'Anonymous'}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar placeholder */}
        <div
          className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm shrink-0"
          aria-hidden="true"
        >
          {authorName ? authorName.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {authorName ?? 'Anonymous'}
            </span>
            {verified && (
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <RatingStars rating={rating} />
            {formattedDate && (
              <time dateTime={createdAt} className="text-xs text-gray-400">
                {formattedDate}
              </time>
            )}
          </div>
        </div>
      </div>

      {/* Review content */}
      {title && (
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      )}
      {body && (
        <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
      )}
    </article>
  )
}

export default ProductReviews
