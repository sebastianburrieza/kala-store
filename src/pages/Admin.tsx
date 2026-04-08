import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { Product } from '../types'

type NewProduct = Omit<Product, 'id'>

const emptyProduct: NewProduct = {
  name: '',
  description: '',
  price: 0,
  category: 'ropa',
  sizes: [],
  images: [],
  stock: 0,
}

export default function Admin() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<NewProduct>(emptyProduct)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/')
      return
    }
    fetchProducts()
  }, [user])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data as Product[])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = editingId
      ? await supabase.from('products').update(form).eq('id', editingId)
      : await supabase.from('products').insert(form)

    setLoading(false)
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage(editingId ? 'Producto actualizado' : 'Producto agregado')
      setForm(emptyProduct)
      setEditingId(null)
      fetchProducts()
    }
  }

  function handleEdit(product: Product) {
    const { id, ...rest } = product
    setEditingId(id)
    setForm(rest)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(emptyProduct)
    setMessage(null)
  }

  async function handleDelete(id: string) {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (error) {
      setMessage(`Error subiendo imagen: ${error.message}`)
      setUploadingImage(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(data.path)

    setForm(prev => ({ ...prev, images: [...prev.images, publicUrl] }))
    setUploadingImage(false)
    // Clear the input so the same file can be re-selected if needed
    e.target.value = ''
  }

  function handleRemoveImage(index: number) {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Admin Panel</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">
            {editingId ? 'Editar producto' : 'Agregar producto'}
          </h2>
          {editingId && (
            <button type="button" onClick={handleCancelEdit}
              className="text-sm text-gray-400 hover:text-gray-600">
              Cancelar
            </button>
          )}
        </div>

        <input placeholder="Nombre" required value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />

        <textarea placeholder="Descripción" value={form.description ?? ''}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 resize-none h-24" />

        <div className="flex gap-4">
          <input type="number" placeholder="Precio" required value={form.price || ''}
            onChange={e => setForm({ ...form, price: Number(e.target.value) })}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />

          <select value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value as 'ropa' | 'accesorios' })}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400">
            <option value="ropa">Ropa</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>

        <input placeholder="Talles (separados por coma: XS,S,M,L)" value={form.sizes.join(',')}
          onChange={e => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />

        <input type="number" placeholder="Stock" value={form.stock || ''}
          onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600 font-medium">Fotos del producto</label>
          <label className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-4 cursor-pointer hover:border-gray-400 transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="text-sm text-gray-500">
              {uploadingImage ? 'Subiendo...' : '+ Agregar foto'}
            </span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {form.images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`preview-${i}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => handleRemoveImage(i)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {message && <p className="text-sm text-center text-gray-600">{message}</p>}

        <button type="submit" disabled={loading}
          className="bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? 'Guardando...' : editingId ? 'Actualizar producto' : 'Agregar producto'}
        </button>
      </form>

      {/* Product list */}
      <h2 className="text-lg font-medium text-gray-800 mb-4">Productos</h2>
      <div className="flex flex-col gap-3">
        {products.map(p => (
          <div key={p.id} className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
            <div>
              <p className="font-medium text-gray-900 text-sm">{p.name}</p>
              <p className="text-xs text-gray-500">${p.price.toLocaleString('es-AR')} · {p.category}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(p)}
                className="text-blue-400 hover:text-blue-600 text-sm transition-colors">
                Editar
              </button>
              <button onClick={() => handleDelete(p.id)}
                className="text-red-400 hover:text-red-600 text-sm transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}