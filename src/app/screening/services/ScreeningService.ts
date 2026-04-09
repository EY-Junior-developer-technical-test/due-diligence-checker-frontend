import {
  ScreeningSource,
  type ScreeningFinding,
  type ScreeningRunCommand,
  type ScreeningRunResult,
  type ScreeningSource as ScreeningSourceId,
} from '../model/screening'

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

function generateFindings(sources: ScreeningSourceId[]): ScreeningFinding[] {
  const base: Record<ScreeningSourceId, ScreeningFinding[]> = {
    [ScreeningSource.Interpol]: [
      {
        id: 'interpol-1',
        source: ScreeningSource.Interpol,
        title: 'Possible match found',
        details: 'Name similarity exceeded threshold and requires manual review.',
        risk: 'high',
      },
    ],
    [ScreeningSource.Secop]: [
      {
        id: 'secop-1',
        source: ScreeningSource.Secop,
        title: 'Contract participation detected',
        details: 'Supplier appears in procurement records with matching tax ID.',
        risk: 'medium',
      },
    ],
    [ScreeningSource.Smv]: [
      {
        id: 'smv-1',
        source: ScreeningSource.Smv,
        title: 'Regulatory mention',
        details: 'Entry found in public market supervision bulletin.',
        risk: 'low',
      },
    ],
  }

  return sources.flatMap((source) => {
    const hits = base[source] ?? []
    if (Math.random() < 0.45) {
      return hits
    }
    return []
  })
}

class ScreeningService {
  async run(command: ScreeningRunCommand): Promise<ScreeningRunResult> {
    const startedAt = new Date().toISOString()

    await delay(2200)
    await delay(900)

    const findings = generateFindings(command.sources)
    const completedAt = new Date().toISOString()

    return {
      supplierId: command.supplierId,
      startedAt,
      completedAt,
      sources: command.sources,
      findings,
    }
  }
}

export const screeningService = new ScreeningService()
