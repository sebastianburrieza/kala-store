export interface Product {
  id: string
  name: string
  price: number
  category: 'ropa' | 'accesorios'
  sizes: string[]
  images: string[]
  stock: number
  description: string
}

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

export interface User {
  id: string
  email: string
  name: string
  is_admin: boolean
}

export type ProductDraft = Partial<Product>
export type ProductSummary = Pick<Product, 'id' | 'name' | 'price'>
export type NewProduct = Omit<Product, 'id'>