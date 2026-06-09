import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useSearch from '../../../hooks/useSearch'
import useCart from '../../../hooks/useCart'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import Button from '../../../components/ui/Button'
import SearchBar from '../../../components/shared/SearchBar'
import ProductCard from '../../../components/cards/ProductCard'
import Pagination from '../../../components/pagination/Pagination'

/**
 * ProductSearch — dedicated search results page.
 *
 * Reads ?q= query param from URL so search results are deep-linkable.
 * Supports sort and category filter placeholders.
 *
 * No fake results are generated.
 * Displays "No products found." when search returns empty.
 *
 * TODO: Connect filter options to real category list from backend.
 * TODO: Persist filter/sort state in URL search params.
 * TODO: Implement useDebounce for live search-as-you-type.
 */

const SORT_OPTIONS = [
  { value: '', label: 'Most Relevant' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
]

function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [inputValue, setInputValue] = useState(searchParams.get('q') ?? '')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  const { results, total, totalPages, loading, error, hasSearched, search } = useSearch()

  const currentQuery = searchParams.get('q') ?? ''

  // Re-run search when URL query or page changes
  useEffect(() => {
    if (currentQuery.trim()) {
      search({ query: currentQuery, page, sort })
    }
  }, [currentQuery, page, sort, search])

  const handleSubmit = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setPage(1)
    setSearchParams({ q: trimmed })
  }

  const handleSortChange = (e) => {
    setSort(e.target.value)
    setPage(1)
  }

  const handleAddToCart = (product) => {
    // TODO: Integrate cart.service.addToCart when backend is ready
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

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Search' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbs} />

      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">Search Products</h1>

      {/* Search form */}
      <form
        role="search"
        aria-label="Product search"
        onSubmit={(e) => { e.preventDefault(); handleSubmit(inputValue) }}
        className="flex gap-2 mb-6"
      >
        <SearchBar
          placeholder="Search for products, brands, stores…"
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          aria-label="Search"
        >
          Search
        </Button>
      </form>

      {/* Toolbar: filter + sort — shown only once a search is made */}
      {hasSearched && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            {/* Results count */}
            {!loading && !error && (
              <p className="text-sm text-gray-600">
                {total > 0
                  ? `${total} result${total !== 1 ? 's' : ''} for `
                  : 'No results for '}
                <span className="font-medium text-gray-900">"{currentQuery}"</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter placeholder */}
            <Button
              variant="secondary"
              size="sm"
              aria-label="Open filters"
              onClick={() => {
                // TODO: Open filter drawer when category/price filter backend is ready
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
            </Button>

            {/* Sort dropdown */}
            <div className="relative">
              <label htmlFor="search-sort" className="sr-only">Sort results</label>
              <select
                id="search-sort"
                value={sort}
                onChange={handleSortChange}
                className="appearance-none h-[34px] pl-3 pr-8 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
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
        </div>
      )}

      {/* Pre-search prompt */}
      {!hasSearched && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-5" aria-hidden="true">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Enter a search term above to find products.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" aria-busy="true" aria-label="Loading search results">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-5 bg-gray-100 rounded w-1/4 mt-1" />
                <div className="h-8 bg-gray-100 rounded mt-1" />
              </div>
            </div>
          ))}
          <p className="sr-only" aria-live="polite">Searching…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div role="alert" className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* No results */}
      {!loading && !error && hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-5" aria-hidden="true">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">No products found.</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            We couldn't find anything matching "{currentQuery}". Try different keywords or browse all products.
          </p>
          <Button
            variant="secondary"
            size="md"
            className="mt-5"
            onClick={() => navigate('/products')}
          >
            Browse All Products
          </Button>
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && results.length > 0 && (
        <>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            role="list"
            aria-label="Search results"
          >
            {results.map((product) => (
              <div key={product._id} role="listitem">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={() => {
                    // TODO: Integrate wishlist.service.addToWishlist
                  }}
                />
              </div>
            ))}
          </div>

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

export default ProductSearch
