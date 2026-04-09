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

export type ScreeningFinding = {
  id: string
  source: ScreeningSource
  title: string
  details: string
  risk: 'low' | 'medium' | 'high'
}

export type ScreeningRunResult = {
  supplierId: string
  startedAt: string
  completedAt: string
  sources: ScreeningSource[]
  findings: ScreeningFinding[]
}

