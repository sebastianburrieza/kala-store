import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatPrice } from '../utils/formatPrice'
import { useCartStore } from '../store/cartStore'
import { supabase } from '../lib/supabase'
import { useToastStore } from '../store/toastStore'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams()
  const addItem = useCartStore(state => state.addItem)
  const { showToast } = useToastStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      setProduct(data as Product ?? null)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return <div className="text-center py-20 text-gray-400 text-sm">Cargando...</div>
  }

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

      {/* Imagen */}
      <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
        <img
          src={product.images?.[0]}
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
        {product.sizes?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Talle</p>
            <div className="flex gap-2 flex-wrap">
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
        )}

        {/* Botón agregar */}
        <button
          onClick={() => {
            if (selectedSize) {
              addItem(product, selectedSize)
              showToast('Producto agregado al carrito ✓')
            }
          }}
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
