export const ScreeningSource = {
  Interpol: 1,
  Secop: 2,
  Smv: 3,
} as const

export type ScreeningSource = (typeof ScreeningSource)[keyof typeof ScreeningSource]

export type ScreeningRunCommand = {
  supplierId: string
  sources: ScreeningSource[]
}

export type InterpolHit = {
  familyName: string
  forename: string
  gender?: string
  dateOfBirth?: string
  placeOfBirth?: string
  nationality?: string
  charges?: string
}

export type SmvHit = {
  date?: string
  resolution?: string
  summary?: string
  type?: string
  amount?: string
  withAppeal?: string
  resolutiveResolutionNumber?: string
  resolutiveResolutionDate?: string
}

export type SecopHit = {
  entityName?: string
  entityTaxId?: string
  level?: string
  order?: string
  municipality?: string
  resolutionNumber?: string
  contractNumber?: string
  contractorDocument?: string
  contractorName?: string
  sanctionAmount?: number
  publishedAt?: string
  finalizedAt?: string
  loadedAt?: string
  processUrl?: string
  [key: string]: unknown
}

export type ScreeningRunResult = {
  supplierScreeningId: number
  supplierId: number
  executedAt: string
  hasHits: boolean
  sourcesChecked: string
  interpolHits: InterpolHit[]
  secopHits: SecopHit[]
  smvHits: SmvHit[]
}
