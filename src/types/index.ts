export interface Product {
  id: string
  name: string
  description?: string
  price: number
  comparePrice?: number
  sku: string
  stock: number
  isActive: boolean
  categoryId: string
  createdAt: string
  updatedAt: string
  category: Category
  images: ProductImage[]
  variants?: ProductVariant[]
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  altText?: string
  isPrimary: boolean
  productId: string
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  priceAdjust: number
  stock: number
  productId: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: 'CUSTOMER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  subtotal: number
  tax: number
  shipping: number
  total: number
  userId?: string
  addressId?: string
  paymentMethod?: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  orderId: string
  productId: string
  variantId?: string
  createdAt: string
  updatedAt: string
  product: Product
  variant?: ProductVariant
}

export interface CartItem {
  id: string
  quantity: number
  userId?: string
  sessionId?: string
  productId: string
  variantId?: string
  createdAt: string
  updatedAt: string
  product: Product
  variant?: ProductVariant
}