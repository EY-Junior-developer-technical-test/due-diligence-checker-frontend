import interpolLogo from '../../../assets/interpol-logo-768x768.png'
import secopLogo from '../../../assets/GovColombiaMultas.png'
import smvLogo from '../../../assets/OIP.png'

import { ScreeningSource } from './screening'
import type { SourceOption } from './screeningUi'

export function getScreeningSourceOptions(t: (key: string, options?: any) => string): SourceOption[] {
  return [
    { source: ScreeningSource.Interpol, label: t('modal.sources.interpol'), logo: interpolLogo },
    { source: ScreeningSource.Secop, label: t('modal.sources.secop'), logo: secopLogo },
    { source: ScreeningSource.Smv, label: t('modal.sources.smv'), logo: smvLogo },
  ]
}
