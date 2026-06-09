import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduct, getRelatedProducts } from '../../../services/product.service'
import useCart from '../../../hooks/useCart'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import Button from '../../../components/ui/Button'
import ProductCard from '../../../components/cards/ProductCard'
import { RatingStars } from '../../../components/cards/ProductCard'
import EmptyState from '../../../components/shared/EmptyState'

/**
 * ProductDetails — full product detail page.
 *
 * Loads a single product by :productId URL param.
 * Shows image gallery placeholder, product info, quantity selector,
 * add-to-cart / wishlist actions, reviews preview, and related products.
 *
 * TODO: Replace getProduct / getRelatedProducts calls with real backend API.
 * TODO: Load review summary from getReviews API.
 * TODO: Connect Add to Cart with cart.service once backend is ready.
 * TODO: Connect Add to Wishlist with wishlist.service.
 * TODO: Implement image thumbnail gallery when multiple images are supported.
 */
function ProductDetails() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedLoading, setRelatedLoading] = useState(false)

  // Fetch product
  useEffect(() => {
    if (!productId) return
    let cancelled = false

    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        // TODO: Integrate backend — product.service.getProduct(productId)
        const { data } = await getProduct(productId)
        if (!cancelled) setProduct(data)
      } catch {
        if (!cancelled) setError('Failed to load product. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [productId])

  // Fetch related products
  useEffect(() => {
    if (!productId) return
    let cancelled = false

    const fetch = async () => {
      setRelatedLoading(true)
      try {
        // TODO: Integrate backend — product.service.getRelatedProducts(productId)
        const { data } = await getRelatedProducts(productId)
        if (!cancelled) setRelatedProducts(data.products ?? [])
      } catch {
        if (!cancelled) setRelatedProducts([])
      } finally {
        if (!cancelled) setRelatedLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    // TODO: Integrate cart.service.addToCart when backend is ready
    addItem({
      productId: product._id,
      name: product.name,
      storeName: product.storeName ?? '',
      description: product.description ?? '',
      price: product.price,
      quantity,
      image: product.images?.[0] ?? null,
    })
  }

  const handleAddToWishlist = () => {
    // TODO: Integrate wishlist.service.addToWishlist when backend is ready
  }

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: product?.name ?? 'Product Details' },
  ]

  /* ── Loading ────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-4 bg-gray-100 rounded w-48 mb-8 animate-pulse" aria-hidden="true" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" aria-hidden="true" />
          <div className="flex flex-col gap-4">
            {[60, 40, 30, 80, 50, 40].map((w, i) => (
              <div key={i} className={`h-4 bg-gray-100 rounded animate-pulse`} style={{ width: `${w}%` }} aria-hidden="true" />
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">Loading product details…</p>
      </div>
    )
  }

  /* ── Error ──────────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }]} />
        <div
          role="alert"
          className="mt-8 flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate('/products')}>
            ← Back to Products
          </Button>
        </div>
      </div>
    )
  }

  /* ── No product found ───────────────────────────────────────────── */
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }]} />
        <EmptyState
          title="Product not found."
          message="This product may have been removed or is no longer available."
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
        />
      </div>
    )
  }

  const images = product.images?.length ? product.images : [null]
  const inStock = product.inStock !== false

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbs} />

      {/* ── Main product section ─────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Image gallery */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="aspect-square rounded-xl border border-gray-200 bg-gray-100 overflow-hidden flex items-center justify-center">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div aria-hidden="true" className="flex flex-col items-center gap-2 text-gray-300">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                </svg>
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnails — shown only when multiple images exist */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="listitem"
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={selectedImage === idx}
                  className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors ${
                    selectedImage === idx ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {img ? (
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-4">
          {/* Store name */}
          {product.storeName && (
            <p className="text-sm font-medium text-indigo-600">{product.storeName}</p>
          )}

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* Rating summary */}
          <div className="flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="text-sm text-gray-600">
              {product.rating
                ? `${product.rating} out of 5`
                : 'No ratings yet'}
            </span>
            {product.reviewCount > 0 && (
              <Link
                to={`/products/${productId}/reviews`}
                className="text-sm text-indigo-600 hover:underline"
              >
                {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}
              </Link>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {product.price != null ? `₹${Number(product.price).toFixed(2)}` : 'Price unavailable'}
            </span>
            {/* TODO: Show original price / discount when backend provides it */}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                inStock ? 'text-green-700' : 'text-red-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}
                aria-hidden="true"
              />
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            {/* TODO: Show quantity count when backend provides stock level */}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <label htmlFor="qty-input" className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || !inStock}
                aria-label="Decrease quantity"
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </button>
              <input
                id="qty-input"
                type="text"
                inputMode="numeric"
                value={quantity}
                readOnly
                aria-label="Quantity"
                className="w-10 h-9 text-center text-sm font-medium text-gray-900 border-x border-gray-300 bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={!inStock}
                aria-label="Increase quantity"
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button
              variant="primary"
              size="lg"
              disabled={!inStock}
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className="flex-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleAddToWishlist}
              aria-label={`Add ${product.name} to wishlist`}
              className="flex-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* ── Reviews preview ──────────────────────────────────── */}
      <section aria-labelledby="reviews-heading" className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 id="reviews-heading" className="text-lg font-semibold text-gray-900">
            Customer Reviews
          </h2>
          <Link
            to={`/products/${productId}/reviews`}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            {/* TODO: Show review count from backend */}
            See all reviews →
          </Link>
        </div>

        {/* TODO: Load review summary from getReviews API when backend is ready */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">
            No reviews available.
          </p>
          <Link
            to={`/products/${productId}/reviews`}
            className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            Be the first to write a review
          </Link>
        </div>
      </section>

      {/* ── Related products ─────────────────────────────────── */}
      <section aria-labelledby="related-heading" className="mt-12">
        <h2 id="related-heading" className="text-lg font-semibold text-gray-900 mb-4">
          Related Products
        </h2>

        {relatedLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" aria-busy="true" aria-label="Loading related products">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!relatedLoading && relatedProducts.length === 0 && (
          <p className="text-sm text-gray-500 bg-white rounded-xl border border-gray-200 p-6 text-center">
            No related products available.
          </p>
        )}

        {!relatedLoading && relatedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={() => {
                  addItem({
                    productId: p._id,
                    name: p.name,
                    storeName: p.storeName ?? '',
                    description: p.description ?? '',
                    price: p.price,
                    quantity: 1,
                    image: p.image ?? null,
                  })
                }}
                onAddToWishlist={() => {
                  // TODO: Integrate wishlist.service.addToWishlist
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default ProductDetails
