import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const totalItems = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900">
          kala
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <Link to="/catalog" className="hover:text-gray-900 transition-colors">Catálogo</Link>
          <Link to="/cart" className="relative hover:text-gray-900 transition-colors">
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-900 font-medium">{user.name}</span>
              <Link to="/orders" className="hover:text-gray-900 transition-colors">
                Mis pedidos
              </Link>
              {user.is_admin && (
                <Link to="/admin" className="hover:text-gray-900 transition-colors">
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="hover:text-gray-900 transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-gray-900 transition-colors">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}