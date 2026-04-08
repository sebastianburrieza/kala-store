import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

interface OrderItem {
  productId: string
  name: string
  size: string
  quantity: number
  price: number
}

interface Order {
  id: string
  created_at: string
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  items: OrderItem[]
}

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
}

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
}

export default function Orders() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data as Order[])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-sm text-gray-400">Cargando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">Todavía no hiciste ningún pedido.</p>
          <Link to="/catalog"
            className="inline-block bg-black text-white text-sm px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden">
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('es-AR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    ${order.total.toLocaleString('es-AR')}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              {/* Order items */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">Talle {item.size} · x{item.quantity}</p>
                    </div>
                    <p className="text-sm text-gray-700">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
