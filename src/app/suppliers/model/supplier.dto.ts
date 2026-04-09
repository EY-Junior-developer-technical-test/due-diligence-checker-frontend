export type SupplierQueryRequestDto = {
  page: number
  limit: number
  search?: string
}

export type SupplierItemDto = {
  id?: string | number
  supplierId?: string | number
  code?: string
  corporateName?: string
  tradeName?: string
  taxIdentification?: string
  phoneNumber?: string
  email?: string
  webSite?: string
  physicalAddress?: string
  annualBillingAmount?: number
  createdAt?: string
  updatedAt?: string
  representatives?: SupplierRepresentativeDto[]
  fullname?: string
  name?: string
  legalName?: string
  businessName?: string
  ruc?: string
  taxId?: string
  document?: string
  country?: string
  countryName?: string
  riskLevel?: string
  risk?: string
  status?: string
  complianceStatus?: string
}

export type SupplierRepresentativeDto = {
  representativeId?: number
  role?: string
  firstName?: string
  lastName?: string
  age?: number | null
  nationality?: string | null
}

export type SupplierRepresentativeCreateRequestDto = {
  role: string
  firstName: string
  lastName: string
  age: number
  nationality?: string
}

export type SupplierCreateRequestDto = {
  corporateName: string
  tradeName: string
  taxIdentification: string
  phoneNumber: string
  email: string
  webSite: string
  physicalAddress: string
  country: string
  annualBillingAmount: number
  representatives?: SupplierRepresentativeCreateRequestDto[]
}

export type SupplierUpdateRequestDto = {
  corporateName: string
  tradeName: string
  phoneNumber: string
  email: string
  webSite: string
  physicalAddress: string
  country: string
  annualBillingAmount: number
}

export type SupplierListEnvelopeDto = {
  data?:
    | SupplierItemDto[]
    | {
        data?: SupplierItemDto[]
        items?: SupplierItemDto[]
        results?: SupplierItemDto[]
        total?: number
        totalItems?: number
        totalCount?: number
        totalRecords?: number
        count?: number
        page?: number
        limit?: number
        pagination?: {
          page?: number
          limit?: number
          total?: number
          totalItems?: number
          totalCount?: number
          totalRecords?: number
          count?: number
        }
        meta?: {
          page?: number
          limit?: number
          total?: number
          totalItems?: number
          totalCount?: number
          totalRecords?: number
          count?: number
        }
      }
  items?: SupplierItemDto[]
  results?: SupplierItemDto[]
  total?: number
  totalItems?: number
  totalCount?: number
  totalRecords?: number
  count?: number
  page?: number
  limit?: number
  pagination?: {
    page?: number
    limit?: number
    total?: number
    totalItems?: number
    totalCount?: number
    totalRecords?: number
    count?: number
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalItems?: number
    totalCount?: number
    totalRecords?: number
    count?: number
  }
}

export type SupplierListResponseDto = SupplierItemDto[] | SupplierListEnvelopeDto
