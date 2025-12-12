import { ENDPOINTS } from '@/consts'
import { apiRequest } from './api'
import type { Product } from '@/types'

export type SortOrder = 'asc' | 'desc'

export interface ProductFilters {
  limit?: number
  sort?: SortOrder
  category?: string
}

export async function getAllProducts(filters?: ProductFilters): Promise<Product[]> {
  return apiRequest<Product[]>(ENDPOINTS.PRODUCTS, {
    params: {
      limit: filters?.limit,
      sort: filters?.sort,
    },
  })
}

export async function getCategories(): Promise<string[]> {
  return apiRequest<string[]>(ENDPOINTS.CATEGORIES)
}

export async function getProductsByCategory(category: string, filters?: ProductFilters): Promise<Product[]> {
  return apiRequest<Product[]>(`${ENDPOINTS.PRODUCTS}/category/${category}`, {
    params: {
      limit: filters?.limit,
      sort: filters?.sort,
    },
  })
}

export async function getProduct(id: number): Promise<Product> {
  return apiRequest<Product>(`${ENDPOINTS.PRODUCTS}/${id}`)
}

export async function searchProducts(query: string, filters?: ProductFilters): Promise<Product[]> {
  // FakeStoreAPI non ha endpoint di ricerca, quindi prendiamo tutti i prodotti e filtriamo lato client
  const allProducts = await getAllProducts(filters)
  const lowerQuery = query.toLowerCase()
  return allProducts.filter(product => 
    product.title.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  )
}

export async function createProduct(product: Product): Promise<Product> {
  return apiRequest<Product>(ENDPOINTS.PRODUCTS, {
    method: 'POST',
    body: product,
  })
}

export async function updateProduct(
  id: number,
  product: Partial<Product>,
): Promise<Product> {
  return apiRequest<Product>(`${ENDPOINTS.PRODUCTS}/${id}`, {
    method: 'PUT',
    body: product,
  })
}

export async function deleteProduct(id: number): Promise<Product> {
  return apiRequest<Product>(`${ENDPOINTS.PRODUCTS}/${id}`, {
    method: 'DELETE',
  })
}

