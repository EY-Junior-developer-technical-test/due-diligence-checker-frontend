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

export type SupplierListEnvelopeDto = {
  data?: SupplierItemDto[]
  items?: SupplierItemDto[]
  results?: SupplierItemDto[]
  total?: number
  totalItems?: number
  count?: number
  page?: number
  limit?: number
  pagination?: {
    page?: number
    limit?: number
    total?: number
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

export type SupplierListResponseDto = SupplierItemDto[] | SupplierListEnvelopeDto
