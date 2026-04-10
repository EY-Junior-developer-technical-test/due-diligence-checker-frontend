import {
  type ScreeningRunCommand,
  type ScreeningRunResult,
} from '../model/screening'
import { BaseService } from '../../shared/services/BaseService'

type ScreeningRunRequestDto = {
  sources: ScreeningRunCommand['sources']
}

class ScreeningService extends BaseService {
  constructor() {
    super('/suppliers')
  }

  async run(command: ScreeningRunCommand): Promise<ScreeningRunResult> {
    const payload: ScreeningRunRequestDto = { sources: command.sources }
    return this.post<ScreeningRunResult, ScreeningRunRequestDto>(
      `/${encodeURIComponent(command.supplierId)}/screenings`,
      payload,
    )
  }

  async listBySupplierId(
    supplierId: string,
    query: { page: number; limit: number },
  ): Promise<ScreeningRunResult[]> {
    const params = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit),
    })

    return this.get<ScreeningRunResult[]>(
      `/${encodeURIComponent(supplierId)}/screenings?${params.toString()}`,
    )
  }
}

export const screeningService = new ScreeningService()
