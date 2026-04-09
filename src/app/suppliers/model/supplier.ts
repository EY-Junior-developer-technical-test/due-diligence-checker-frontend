export type SupplierSearchQuery = {
  page: number
  limit: number
  search?: string
}

export type Supplier = {
  id: string
  corporateName: string
  tradeName: string
  taxIdentification: string
  phoneNumber: string
  email: string
  annualBillingAmount: number
}

export type SupplierListResult = {
  items: Supplier[]
  page: number
  limit: number
  total: number
}
