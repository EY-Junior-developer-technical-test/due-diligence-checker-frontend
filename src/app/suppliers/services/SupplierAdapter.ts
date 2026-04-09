import type {
  SupplierItemDto,
  SupplierListResponseDto,
  SupplierQueryRequestDto,
} from '../model/supplier.dto'
import type { Supplier, SupplierListResult, SupplierSearchQuery } from '../model/supplier'

const DEFAULT_VALUE = '-'

export class SupplierAdapter {
  static toQueryDto(query: SupplierSearchQuery): SupplierQueryRequestDto {
    return {
      page: query.page,
      limit: query.limit,
      search: query.search?.trim() || undefined,
    }
  }

  static toListResult(dto: SupplierListResponseDto, query: SupplierSearchQuery): SupplierListResult {
    const items = this.extractItems(dto).map((supplier, index) => this.toSupplier(supplier, index))

    if (Array.isArray(dto)) {
      return {
        items,
        page: query.page,
        limit: query.limit,
        total: items.length,
      }
    }

    return {
      items,
      page: dto.page ?? dto.meta?.page ?? dto.pagination?.page ?? query.page,
      limit: dto.limit ?? dto.meta?.limit ?? dto.pagination?.limit ?? query.limit,
      total:
        dto.total ?? dto.totalItems ?? dto.count ?? dto.meta?.total ?? dto.pagination?.total ?? items.length,
    }
  }

  private static extractItems(dto: SupplierListResponseDto): SupplierItemDto[] {
    if (Array.isArray(dto)) {
      return dto
    }

    if (Array.isArray(dto.data)) {
      return dto.data
    }

    if (Array.isArray(dto.items)) {
      return dto.items
    }

    if (Array.isArray(dto.results)) {
      return dto.results
    }

    return []
  }

  private static toSupplier(dto: SupplierItemDto, index: number): Supplier {
    const id = String(dto.id ?? dto.supplierId ?? dto.code ?? `supplier-${index}`)

    return {
      id,
      corporateName: this.normalizeText(
        dto.corporateName ?? dto.legalName ?? dto.businessName ?? dto.fullname ?? dto.name,
      ),
      tradeName: this.normalizeText(dto.tradeName ?? dto.name),
      taxIdentification: this.normalizeText(
        dto.taxIdentification ?? dto.ruc ?? dto.taxId ?? dto.document,
      ),
      phoneNumber: this.normalizeText(dto.phoneNumber),
      email: this.normalizeText(dto.email),
      annualBillingAmount: this.normalizeNumber(dto.annualBillingAmount),
    }
  }

  private static normalizeNumber(value?: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 0
    }

    return value
  }

  private static normalizeText(value?: string | number): string {
    if (value === undefined || value === null) {
      return DEFAULT_VALUE
    }

    const normalizedValue = String(value).trim()
    return normalizedValue.length > 0 ? normalizedValue : DEFAULT_VALUE
  }
}
