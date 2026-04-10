import { AxiosError } from 'axios'

export class ApiError extends Error {
  status?: number
  code?: string
  title?: string
  details?: unknown

  constructor(message: string, options?: { status?: number; code?: string; title?: string; details?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.code = options?.code
    this.title = options?.title
    this.details = options?.details
  }
}

type BackendErrorPayload = {
  message?: string
  title?: string
  detail?: string
  code?: string
  errors?: unknown
  status?: number
  instance?: string
  traceId?: string
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof AxiosError) {
    const payload = error.response?.data as BackendErrorPayload | undefined
    const message = payload?.detail ?? payload?.message ?? payload?.title ?? error.message ?? 'Unexpected backend error'
    return new ApiError(
      message,
      {
        status: error.response?.status ?? payload?.status,
        code: payload?.code,
        title: payload?.title,
        details: payload?.errors ?? payload,
      },
    )
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError('Unexpected error')
}
