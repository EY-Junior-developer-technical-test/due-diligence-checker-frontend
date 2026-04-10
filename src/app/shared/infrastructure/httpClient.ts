import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

import { getAuthToken } from '../../auth/services/authStorage'

export const httpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
