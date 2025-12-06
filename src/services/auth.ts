import { apiRequest } from './api'
import type { LoginPayload, LoginResponse } from '@/types'
import { ENDPOINTS } from '@/consts'

export async function login(credentials: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: credentials,
  })
}

