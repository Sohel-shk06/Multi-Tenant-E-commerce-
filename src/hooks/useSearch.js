import { useState, useCallback } from 'react'
import { searchProducts } from '../services/product.service'

/**
 * useSearch — manages product search state and results.
 *
 * Returns empty arrays when backend is unavailable.
 * TODO: Replace with TanStack Query (useQuery) once QueryProvider is wired up.
 * TODO: Integrate useDebounce for live search-as-you-type.
 */
function useSearch() {
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const search = useCallback(async (params = {}) => {
    if (!params.query?.trim()) return
    setLoading(true)
    setError(null)
    setHasSearched(true)
    try {
      // TODO: Integrate backend API — product.service.searchProducts
      const { data } = await searchProducts(params)
      setResults(data.products ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 0)
    } catch (err) {
      // TODO: Handle specific error codes from backend
      setError('Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResults([])
    setTotal(0)
    setTotalPages(0)
    setError(null)
    setHasSearched(false)
  }, [])

  return { results, total, totalPages, loading, error, hasSearched, search, reset }
}

export default useSearch
