import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../utils/formatPrice'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 text-lg mb-6">Tu carrito está vacío</p>
        <Link to="/catalog"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors">
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Tu carrito</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.size}`}
            className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">

            {/* Imagen */}
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80?text=?' }}
              className="w-20 h-20 object-cover rounded-lg bg-gray-100"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.product.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">Talle: {item.size}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {formatPrice(item.product.price)}
              </p>
            </div>

            {/* Cantidad */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                +
              </button>
            </div>

            {/* Eliminar */}
            <button
              onClick={() => removeItem(item.product.id, item.size)}
              className="text-gray-400 hover:text-red-500 transition-colors text-sm ml-2">
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Total y checkout */}
      <div className="mt-8 border-t border-gray-200 pt-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-semibold text-gray-900">{formatPrice(total())}</p>
        </div>
        <button className="bg-black text-white px-8 py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors">
          Confirmar compra
        </button>
      </div>
    </div>
  )
}