import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatPrice } from '../utils/formatPrice'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/product/${product.id}`}
      aria-label={`Ver producto: ${product.name}`}
      className={`group ${product.stock === 0 ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x400?text=Sin+imagen'
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-medium text-gray-900">{product.name}</h3>
      <p className="text-gray-500 text-sm mt-1">{formatPrice(product.price)}</p>
      {product.stock === 0 && (
        <span className="text-xs text-red-500 mt-1 block">Sin stock</span>
      )}
    </Link>
  )
}