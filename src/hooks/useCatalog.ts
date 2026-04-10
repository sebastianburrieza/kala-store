import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

const FILTERS = ['todos', 'ropa', 'accesorios'] as const
export type Filter = typeof FILTERS[number]
export { FILTERS }

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState<Filter>('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setProducts(data as Product[])
    }
    setLoading(false)
  }

  const filtered = filter === 'todos'
    ? products
    : products.filter(p => p.category === filter)

  return { filtered, filter, setFilter, loading, error }
}
