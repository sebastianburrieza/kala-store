import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

const FILTERS = ['todos', 'ropa', 'accesorios'] as const
type Filter = typeof FILTERS[number]

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState<Filter>('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    fetchProducts()
  }, [])

  const filtered = filter === 'todos'
    ? products
    : products.filter(p => p.category === filter)

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400">
      Cargando productos...
    </div>
  )

  if (error) return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center text-red-500">
      Error: {error}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Catálogo</h1>

      <div className="flex gap-2 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filter === f
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}