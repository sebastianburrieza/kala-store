import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import type { Product } from '../types'

// Equivalent to a ViewModel in iOS
// All logic lives here — the page only renders
export function useProductDetail(id: string | undefined) {
  const addItem = useCartStore(state => state.addItem)
  const { showToast } = useToastStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

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

  function handleAddToCart() {
    if (product && selectedSize) {
      addItem(product, selectedSize)
      showToast('Producto agregado al carrito ✓')
    }
  }

  // Like @Published properties exposed to the View
  return { product, loading, selectedSize, setSelectedSize, handleAddToCart }
}
