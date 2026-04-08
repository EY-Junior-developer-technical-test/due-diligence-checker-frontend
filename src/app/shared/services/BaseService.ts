import type { AxiosInstance, AxiosRequestConfig } from 'axios'

import { httpClient } from '../infrastructure/httpClient'
import { toApiError } from './ApiError'

type RequestOptions = {
  retryCount?: number
}

export abstract class BaseService {
  private readonly resourceEndpoint: string
  protected readonly client: AxiosInstance

  protected constructor(resourceEndpoint: string, client: AxiosInstance = httpClient) {
    this.resourceEndpoint = resourceEndpoint
    this.client = client
  }

  protected resourcePath(path = ''): string {
    return `${this.resourceEndpoint}${path}`
  }

  protected async get<TResponse>(
    path = '',
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>({
      method: 'GET',
      url: this.resourcePath(path),
    }, options)
  }

  protected async post<TResponse, TBody>(
    path: string,
    body: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>(
      {
        method: 'POST',
        url: this.resourcePath(path),
        data: body,
      },
      options,
    )
  }

  protected async put<TResponse, TBody>(
    path: string,
    body: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>(
      {
        method: 'PUT',
        url: this.resourcePath(path),
        data: body,
      },
      options,
    )
  }

  protected async delete<TResponse>(
    path: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>(
      {
        method: 'DELETE',
        url: this.resourcePath(path),
      },
      options,
    )
  }

  private async request<TResponse>(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const retryCount = options?.retryCount ?? 0

    for (let attempt = 0; attempt <= retryCount; attempt += 1) {
      try {
        const response = await this.client.request<TResponse>(config)
        return response.data
      } catch (error) {
        const apiError = toApiError(error)
        const shouldRetry =
          attempt < retryCount && (apiError.status === undefined || apiError.status >= 500)

        if (!shouldRetry) {
          throw apiError
        }
      }
    }

    throw toApiError(new Error('Unexpected request flow'))
  }
}
