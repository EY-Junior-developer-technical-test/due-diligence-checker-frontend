import { useTranslation } from 'react-i18next'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

import type { ScreeningSource as ScreeningSourceId } from '../../model/screening'
import type { SourceOption } from '../../model/screeningUi'

type StepAnalyzingProps = {
  selectedSources: ScreeningSourceId[]
  options: SourceOption[]
  statusLine: string
  isRunning: boolean
}

export function StepAnalyzing({ selectedSources, options, statusLine, isRunning }: StepAnalyzingProps) {
  const { t } = useTranslation('screening')

  return (
    <div className="w-full animate-in fade-in">
      <div className="analyzing-surface relative w-full overflow-hidden rounded-3xl p-12">
        <div className="pointer-events-none absolute inset-0 opacity-80" />

        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="relative">
            <AiOutlineLoading3Quarters
              className="h-16 w-16 animate-spin"
              style={{ color: 'var(--ey-yellow)' }}
              aria-hidden="true"
            />
            <AiOutlineLoading3Quarters
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-spin opacity-35 blur-[0.2px]"
              style={{ color: 'var(--ey-yellow-soft)' }}
              aria-hidden="true"
            />
          </div>

          <h3 className="mt-8 text-2xl font-bold text-slate-50">{t('analyzing.title')}</h3>
          <p className="mt-4 text-lg font-semibold text-slate-100/90">{statusLine}</p>
          <p className="mt-2 text-base text-slate-200/70">{t('analyzing.subtitle')}</p>
          {isRunning && selectedSources.length ? (
            <p className="mt-4 text-sm font-semibold text-yellow-100/80">
              {options
                .filter((opt) => selectedSources.includes(opt.source))
                .map((opt) => opt.label)
                .slice(0, 3)
                .join(' • ')}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
