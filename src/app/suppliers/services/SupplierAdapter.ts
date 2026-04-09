import type {
  SupplierItemDto,
  SupplierListResponseDto,
  SupplierQueryRequestDto,
  SupplierCreateRequestDto,
} from '../model/supplier.dto'
import type {
  Supplier,
  SupplierCreateCommand,
  SupplierListResult,
  SupplierSearchQuery,
} from '../model/supplier'

const DEFAULT_VALUE = '-'

export class SupplierAdapter {
  static toQueryDto(query: SupplierSearchQuery): SupplierQueryRequestDto {
    return {
      page: query.page,
      limit: query.limit,
      search: query.search?.trim() || undefined,
    }
  }

  static toCreateRequestDto(command: SupplierCreateCommand): SupplierCreateRequestDto {
    return {
      corporateName: command.corporateName.trim(),
      tradeName: command.tradeName.trim(),
      taxIdentification: command.taxIdentification.trim(),
      phoneNumber: command.phoneNumber.trim(),
      email: command.email.trim(),
      webSite: command.webSite.trim(),
      physicalAddress: command.physicalAddress.trim(),
      country: command.country.trim(),
      annualBillingAmount: command.annualBillingAmount,
      representatives: command.representatives?.map((representative) => ({
        role: representative.role.trim(),
        firstName: representative.firstName.trim(),
        lastName: representative.lastName.trim(),
        age: representative.age,
        nationality: representative.nationality.trim().toUpperCase(),
      })),
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

    const dataEnvelope = dto.data && !Array.isArray(dto.data) ? dto.data : undefined

    return {
      items,
      page:
        dto.page ??
        dataEnvelope?.page ??
        dto.meta?.page ??
        dataEnvelope?.meta?.page ??
        dto.pagination?.page ??
        dataEnvelope?.pagination?.page ??
        query.page,
      limit:
        dto.limit ??
        dataEnvelope?.limit ??
        dto.meta?.limit ??
        dataEnvelope?.meta?.limit ??
        dto.pagination?.limit ??
        dataEnvelope?.pagination?.limit ??
        query.limit,
      total:
        dto.total ??
        dto.totalItems ??
        dto.totalCount ??
        dto.totalRecords ??
        dto.count ??
        dataEnvelope?.total ??
        dataEnvelope?.totalItems ??
        dataEnvelope?.totalCount ??
        dataEnvelope?.totalRecords ??
        dataEnvelope?.count ??
        dto.meta?.total ??
        dto.meta?.totalItems ??
        dto.meta?.totalCount ??
        dto.meta?.totalRecords ??
        dto.meta?.count ??
        dataEnvelope?.meta?.total ??
        dataEnvelope?.meta?.totalItems ??
        dataEnvelope?.meta?.totalCount ??
        dataEnvelope?.meta?.totalRecords ??
        dataEnvelope?.meta?.count ??
        dto.pagination?.total ??
        dto.pagination?.totalItems ??
        dto.pagination?.totalCount ??
        dto.pagination?.totalRecords ??
        dto.pagination?.count ??
        dataEnvelope?.pagination?.total ??
        dataEnvelope?.pagination?.totalItems ??
        dataEnvelope?.pagination?.totalCount ??
        dataEnvelope?.pagination?.totalRecords ??
        dataEnvelope?.pagination?.count ??
        items.length,
    }
  }

  private static extractItems(dto: SupplierListResponseDto): SupplierItemDto[] {
    if (Array.isArray(dto)) {
      return dto
    }

    if (Array.isArray(dto.data)) {
      return dto.data
    }

    if (dto.data && !Array.isArray(dto.data)) {
      if (Array.isArray(dto.data.data)) {
        return dto.data.data
      }

      if (Array.isArray(dto.data.items)) {
        return dto.data.items
      }

      if (Array.isArray(dto.data.results)) {
        return dto.data.results
      }
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
