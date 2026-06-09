import { useState, useEffect, useCallback } from 'react'
import { getProducts } from '../services/product.service'

/**
 * useProducts — fetches and manages paginated product list state.
 *
 * Returns empty arrays when backend is unavailable.
 * TODO: Replace with TanStack Query (useQuery) once QueryProvider is wired up.
 *
 * @param {{ page?: number, limit?: number, sort?: string, category?: string, search?: string }} params
 */
function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { page = 1, limit = 12, sort = '', category = '', search = '' } = params

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Integrate backend API — product.service.getProducts
      const { data } = await getProducts({ page, limit, sort, category, search })
      setProducts(data.products ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 0)
    } catch (err) {
      // TODO: Handle specific error codes (401, 404, 500) from backend
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [page, limit, sort, category, search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, total, totalPages, loading, error, refetch: fetchProducts }
}

export default useProducts
