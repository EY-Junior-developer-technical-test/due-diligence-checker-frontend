import { AxiosError } from 'axios'

export class ApiError extends Error {
  status?: number
  code?: string
  details?: unknown

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.code = options?.code
    this.details = options?.details
  }
}

type BackendErrorPayload = {
  message?: string
  code?: string
  errors?: unknown
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof AxiosError) {
    const payload = error.response?.data as BackendErrorPayload | undefined
    return new ApiError(
      payload?.message ?? error.message ?? 'Unexpected backend error',
      {
        status: error.response?.status,
        code: payload?.code,
        details: payload?.errors ?? payload,
      },
    )
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError('Unexpected error')
}
