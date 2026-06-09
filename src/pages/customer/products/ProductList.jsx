import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useProducts from '../../../hooks/useProducts'
import useCart from '../../../hooks/useCart'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import Button from '../../../components/ui/Button'
import SearchBar from '../../../components/shared/SearchBar'
import ProductCard from '../../../components/cards/ProductCard'
import Pagination from '../../../components/pagination/Pagination'
import EmptyState from '../../../components/shared/EmptyState'

/**
 * ProductList — customer-facing product catalogue page.
 *
 * Displays a responsive grid of products with search, filter, sort,
 * and pagination. All data comes from the backend via useProducts hook.
 *
 * TODO: Connect filter panel to real category/store data from backend.
 * TODO: Persist sort/filter state in URL search params for shareability.
 * TODO: Integrate wishlist add action once wishlist module is implemented.
 */

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
]

function ProductList() {
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { products, total, totalPages, loading, error } = useProducts({
    page,
    limit: 12,
    sort,
    search,
  })

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Products' },
  ]

  const handleSearch = (value) => {
    setSearch(value.trim())
    setPage(1)
  }

  const handleSortChange = (e) => {
    setSort(e.target.value)
    setPage(1)
  }

  const handleAddToCart = (product) => {
    // TODO: Integrate backend cart.service.addToCart when API is ready
    addItem({
      productId: product._id,
      name: product.name,
      storeName: product.storeName ?? '',
      description: product.description ?? '',
      price: product.price,
      quantity: 1,
      image: product.image ?? null,
    })
  }

  const handleAddToWishlist = (product) => {
    // TODO: Integrate wishlist.service.addToWishlist when backend is ready
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Page header */}
      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        {!loading && total > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {total} product{total !== 1 ? 's' : ''} available
          </p>
        )}
      </div>

      {/* Toolbar: search + filter + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <SearchBar
          placeholder="Search products…"
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={handleSearch}
          className="flex-1"
        />

        {/* Filter button placeholder */}
        <Button
          variant="secondary"
          size="md"
          aria-label="Open filters"
          onClick={() => {
            // TODO: Open filter panel / drawer once category & filter API is ready
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
        </Button>

        {/* Sort dropdown */}
        <div className="relative">
          <label htmlFor="sort-select" className="sr-only">Sort products</label>
          <select
            id="sort-select"
            value={sort}
            onChange={handleSortChange}
            className="appearance-none h-[38px] pl-3 pr-8 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Active search label */}
      {search && (
        <div className="flex items-center gap-2 mb-5">
          <p className="text-sm text-gray-600">
            Showing results for <span className="font-medium text-gray-900">"{search}"</span>
          </p>
          <button
            type="button"
            onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
            className="text-xs text-indigo-600 hover:underline"
            aria-label="Clear search"
          >
            Clear
          </button>
        </div>
      )}

      {/* States: loading / error / empty / grid */}
      {loading && <ProductGridSkeleton />}

      {!loading && error && (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="No products available."
          message="Check back soon — new products are added regularly."
          icon={
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          }
        />
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            role="list"
            aria-label="Product list"
          >
            {products.map((product) => (
              <div key={product._id} role="listitem">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                disabled={loading}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ─── Skeleton loader for the product grid ───────────────────────────── */
function ProductGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-100" />
          <div className="p-4 flex flex-col gap-3">
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-5 bg-gray-100 rounded w-1/4 mt-1" />
            <div className="h-8 bg-gray-100 rounded mt-1" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductList
