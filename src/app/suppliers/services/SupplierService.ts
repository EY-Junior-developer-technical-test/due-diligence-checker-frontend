import type { SupplierListResponseDto } from '../model/supplier.dto'
import type { SupplierListResult, SupplierSearchQuery } from '../model/supplier'
import { BaseService } from '../../shared/services/BaseService'
import { SupplierAdapter } from './SupplierAdapter'

class SupplierService extends BaseService {
  constructor() {
    super('/suppliers')
  }

  async list(query: SupplierSearchQuery): Promise<SupplierListResult> {
    const queryDto = SupplierAdapter.toQueryDto(query)
    const params = new URLSearchParams({
      page: String(queryDto.page),
      limit: String(queryDto.limit),
    })

    if (queryDto.search) {
      params.set('search', queryDto.search)
    }

    const response = await this.get<SupplierListResponseDto>(`?${params.toString()}`)
    return SupplierAdapter.toListResult(response, query)
  }
}

export const supplierService = new SupplierService()
