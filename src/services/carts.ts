import { apiRequest } from './api'
import type { Cart } from '@/types'

const ENDPOINT = '/carts'

export async function getAllCarts(): Promise<Cart[]> {
  return apiRequest<Cart[]>(ENDPOINT)
}

export async function getCart(id: number): Promise<Cart> {
  return apiRequest<Cart>(`${ENDPOINT}/${id}`)
}

export async function getUserCarts(
  userId: number,
): Promise<Cart[]> {
  return apiRequest<Cart[]>(`${ENDPOINT}/user/${userId}`)
}

export async function createCart(cart: Cart): Promise<Cart> {
  return apiRequest<Cart>(ENDPOINT, {
    method: 'POST',
    body: cart,
  })
}

export async function updateCart(id: number, cart: Partial<Cart>): Promise<Cart> {
  return apiRequest<Cart>(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    body: cart,
  })
}

export async function deleteCart(id: number): Promise<Cart> {
  return apiRequest<Cart>(`${ENDPOINT}/${id}`, {
    method: 'DELETE',
  })
}

