import type {
  SupplierItemDto,
  SupplierListResponseDto,
  SupplierQueryRequestDto,
  SupplierCreateRequestDto,
  SupplierRepresentativeCreateRequestDto,
  SupplierUpdateRequestDto,
} from '../model/supplier.dto'
import type {
  Supplier,
  SupplierCreateCommand,
  SupplierDetails,
  SupplierListResult,
  SupplierSearchQuery,
  SupplierRepresentativeRecord,
  SupplierRepresentative,
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
      representatives: command.representatives?.map((representative) => {
        const normalizedNationality = representative.nationality?.trim().toUpperCase()

        return {
          role: representative.role.trim(),
          firstName: representative.firstName.trim(),
          lastName: representative.lastName.trim(),
          age: representative.age,
          ...(normalizedNationality ? { nationality: normalizedNationality } : {}),
        }
      }),
    }
  }

  static toRepresentativeUpsertRequestDto(
    representative: SupplierRepresentative,
  ): SupplierRepresentativeCreateRequestDto {
    const normalizedNationality = representative.nationality?.trim().toUpperCase()

    return {
      role: representative.role.trim(),
      firstName: representative.firstName.trim(),
      lastName: representative.lastName.trim(),
      age: representative.age,
      ...(normalizedNationality ? { nationality: normalizedNationality } : {}),
    }
  }

  static toUpdateSupplierRequestDto(details: SupplierDetails): SupplierUpdateRequestDto {
    return {
      corporateName: details.corporateName.trim(),
      tradeName: details.tradeName.trim(),
      phoneNumber: details.phoneNumber.trim(),
      email: details.email.trim(),
      webSite: details.webSite.trim(),
      physicalAddress: details.physicalAddress.trim(),
      country: details.country.trim(),
      annualBillingAmount: details.annualBillingAmount,
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

  static toSupplierDetails(dto: SupplierItemDto): SupplierDetails {
    return {
      ...this.toSupplier(dto, 0),
      webSite: this.normalizeText(dto.webSite),
      physicalAddress: this.normalizeText(dto.physicalAddress),
      country: this.normalizeText(dto.country ?? dto.countryName),
      representatives: (dto.representatives ?? []).map((representative, index) =>
        this.toRepresentativeRecord(representative, index),
      ),
    }
  }

  static extractSingle(dto: unknown): SupplierItemDto | null {
    if (!dto || typeof dto !== 'object') {
      return null
    }

    if (Array.isArray(dto)) {
      return null
    }

    const envelope = dto as { data?: unknown }
    if (envelope.data && typeof envelope.data === 'object') {
      const dataValue = envelope.data as any

      if (dataValue && typeof dataValue === 'object' && !Array.isArray(dataValue)) {
        if (dataValue.data && typeof dataValue.data === 'object' && !Array.isArray(dataValue.data)) {
          return dataValue.data as SupplierItemDto
        }

        if (dataValue.id || dataValue.supplierId || dataValue.code) {
          return dataValue as SupplierItemDto
        }
      }
    }

    const direct = dto as any
    if (direct.id || direct.supplierId || direct.code) {
      return direct as SupplierItemDto
    }

    return null
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

  private static toRepresentativeRecord(dto: any, index: number): SupplierRepresentativeRecord {
    const id = String(dto?.representativeId ?? `representative-${index}`)
    const nationalityRaw = dto?.nationality
    const nationality =
      nationalityRaw === undefined || nationalityRaw === null ? undefined : String(nationalityRaw).trim()

    return {
      id,
      role: this.normalizeText(dto?.role),
      firstName: this.normalizeText(dto?.firstName),
      lastName: this.normalizeText(dto?.lastName),
      age: this.normalizeNumber(typeof dto?.age === 'number' ? dto.age : 0),
      ...(nationality ? { nationality } : {}),
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
