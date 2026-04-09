import { FiArrowLeft } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

import genericLogo from '../../../../assets/OIP.webp'
import type { ScreeningSource as ScreeningSourceId } from '../../model/screening'
import type { SourceOption } from '../../model/screeningUi'

type StepAnalyzingProps = {
  selectedSources: ScreeningSourceId[]
  options: SourceOption[]
  statusLine: string
  isRunning: boolean
  onBack: () => void
}

export function StepAnalyzing({ selectedSources, options, statusLine, isRunning, onBack }: StepAnalyzingProps) {
  const { t } = useTranslation('screening')

  return (
    <div className="w-full animate-in fade-in">
      <div className="w-full rounded-3xl border border-white/14 bg-white/[0.03] p-6 shadow-[0_18px_42px_rgba(2,8,18,0.2)]">
        <div className="flex flex-col items-center justify-center text-center">
        <div className="scan-orbit flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/[0.04]">
          <div className="grid grid-cols-3 gap-2">
            {selectedSources.slice(0, 3).map((source) => {
              const logo = options.find((opt) => opt.source === source)?.logo ?? genericLogo
              return <img key={source} src={logo} alt="" className="h-7 w-7 rounded-xl object-contain opacity-90" />
            })}
          </div>
        </div>

        <h3 className="mt-6 text-lg font-bold text-slate-100">{t('analyzing.title')}</h3>
        <p className="mt-2 max-w-md text-sm text-slate-300">{t('analyzing.subtitle')}</p>

        <div className="mt-6 w-full max-w-md overflow-hidden rounded-full border border-white/14 bg-white/[0.04] p-1">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-[42%] animate-pulse rounded-full bg-gradient-to-r from-yellow-200/60 via-sky-200/50 to-yellow-200/60" />
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-200">{statusLine}</p>

        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1] disabled:opacity-60"
          onClick={onBack}
          disabled={isRunning}
        >
          <FiArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          {t('modal.actions.back')}
        </button>
        </div>
      </div>
    </div>
  )
}
