import { apiRequest } from './api'
import type { Cart } from '@/types'
import { ENDPOINTS } from '@/consts'

export async function getAllCarts(): Promise<Cart[]> {
  return apiRequest<Cart[]>(ENDPOINTS.CART)
}

export async function getCart(id: number): Promise<Cart> {
  return apiRequest<Cart>(`${ENDPOINTS.CART}/${id}`)
}

export async function getUserCarts(
  userId: number,
): Promise<Cart[]> {
  return apiRequest<Cart[]>(`${ENDPOINTS.CART}/user/${userId}`)
}

export async function createCart(cart: Cart): Promise<Cart> {
  return apiRequest<Cart>(ENDPOINTS.CART, {
    method: 'POST',
    body: cart,
  })
}

export async function updateCart(id: number, cart: Partial<Cart>): Promise<Cart> {
  return apiRequest<Cart>(`${ENDPOINTS.CART}/${id}`, {
    method: 'PUT',
    body: cart,
  })
}

export async function deleteCart(id: number): Promise<Cart> {
  return apiRequest<Cart>(`${ENDPOINTS.CART}/${id}`, {
    method: 'DELETE',
  })
}

