import ProductCard from '../components/ProductCard'
import { useCatalog, FILTERS } from '../hooks/useCatalog'

// Like a placeholder UITableViewCell while data loads
function SkeletonCard() {
  return (
    <div>
      <div className="bg-gray-200 rounded-xl aspect-square mb-3 animate-pulse" />
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2 animate-pulse" />
      <div className="bg-gray-200 rounded h-3 w-1/2 animate-pulse" />
    </div>
  )
}

// Only the View — zero logic here
export default function Catalog() {
  const { filtered, filter, setFilter, loading, error } = useCatalog()

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-full h-8 w-20 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
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
