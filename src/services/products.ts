import { ENDPOINTS } from '@/consts'
import { apiRequest } from './api'
import type { Product } from '@/types'

export async function getAllProducts(): Promise<Product[]> {
  return apiRequest<Product[]>(ENDPOINTS.PRODUCTS)
}

export async function getProduct(id: number): Promise<Product> {
  return apiRequest<Product>(`${ENDPOINTS.PRODUCTS}/${id}`)
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

