export type SupplierSearchQuery = {
  page: number
  limit: number
  search?: string
}

export type SupplierRepresentative = {
  role: string
  firstName: string
  lastName: string
  age: number
  nationality?: string
}

export type SupplierRepresentativeRecord = SupplierRepresentative & {
  id: string
}

export type SupplierCreateCommand = {
  corporateName: string
  tradeName: string
  taxIdentification: string
  phoneNumber: string
  email: string
  webSite: string
  physicalAddress: string
  country: string
  annualBillingAmount: number
  representatives?: SupplierRepresentative[]
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

export type SupplierDetails = Supplier & {
  webSite: string
  physicalAddress: string
  country: string
  representatives: SupplierRepresentativeRecord[]
}

export type SupplierListResult = {
  items: Supplier[]
  page: number
  limit: number
  total: number
}
