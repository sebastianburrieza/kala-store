import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { formatPrice } from '../utils/formatPrice'
import { useCartStore } from '../store/cartStore'

// Por ahora los mismos mock products — después vendrán de Supabase
const mockProducts = [
  {
    id: '1',
    name: 'Camisa lino beige',
    price: 25000,
    category: 'ropa' as const,
    sizes: ['XS', 'S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
    stock: 10,
    description: 'Camisa de lino liviana, perfecta para el verano.',
  },
  {
    id: '2',
    name: 'Bolso cuero negro',
    price: 48000,
    category: 'accesorios' as const,
    sizes: ['única'],
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
    stock: 5,
    description: 'Bolso de cuero genuino con compartimentos internos.',
  },
  {
    id: '3',
    name: 'Vestido floral',
    price: 32000,
    category: 'ropa' as const,
    sizes: ['XS', 'S', 'M'],
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'],
    stock: 8,
    description: 'Vestido liviano con estampado floral.',
  },
  {
    id: '4',
    name: 'Cinturón trenzado',
    price: 15000,
    category: 'accesorios' as const,
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800'],
    stock: 0,
    description: 'Cinturón trenzado a mano en cuero marrón.',
  },
]

export default function ProductDetail() {
  const { id } = useParams()
  const product = mockProducts.find(p => p.id === id)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Producto no encontrado.</p>
        <Link to="/catalog" className="text-black underline mt-4 inline-block">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const addItem = useCartStore(state => state.addItem)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

      {/* Imagen */}
      <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/800x800?text=Sin+imagen'
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-medium text-gray-700 mt-2">{formatPrice(product.price)}</p>
        </div>

        <p className="text-gray-500">{product.description}</p>

        {/* Selector de talle */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-3">Talle</p>
          <div className="flex gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Botón agregar */}
        <button
          onClick={() => selectedSize && addItem(product, selectedSize)}
          disabled={product.stock === 0 || !selectedSize}
          className="bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Sin stock' : !selectedSize ? 'Seleccioná un talle' : 'Agregar al carrito'}
        </button>

        <Link to="/catalog" className="text-sm text-gray-400 hover:text-gray-600 text-center">
          ← Volver al catálogo
        </Link>
      </div>

    </div>
  )
}