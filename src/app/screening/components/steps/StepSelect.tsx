import { useMemo } from 'react'
import { FiCheck } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

import type { ApiError } from '../../../shared/services/ApiError'
import type { Supplier, SupplierDetails } from '../../../suppliers/model/supplier'
import type { ScreeningSource as ScreeningSourceId } from '../../model/screening'
import type { SourceOption } from '../../model/screeningUi'
import { ScreeningGlobe } from '../ScreeningGlobe'

type StepSelectProps = {
  supplier: Supplier
  supplierDetails: SupplierDetails | null
  supplierError: ApiError | null
  screeningError?: ApiError | null
  options: SourceOption[]
  selectedSources: ScreeningSourceId[]
  isRunning: boolean
  onToggleSource: (source: ScreeningSourceId) => void
  onStart: () => void
}

export function StepSelect({
  supplier,
  supplierDetails,
  supplierError,
  screeningError,
  options,
  selectedSources,
  isRunning,
  onToggleSource,
  onStart,
}: StepSelectProps) {
  const { t } = useTranslation('screening')

  const selectedOptionLogos = selectedSources
    .map((source) => options.find((opt) => opt.source === source)?.logo)
    .filter((logo): logo is string => Boolean(logo))

  const representativesPreview = useMemo(() => {
    const reps = supplierDetails?.representatives ?? []
    if (reps.length === 0) {
      return null
    }

    const names = reps
      .slice(0, 2)
      .map((rep) => `${rep.firstName} ${rep.lastName}`.trim())
      .filter(Boolean)
      .join(' • ')

    return `${names}${reps.length > 2 ? ' …' : ''}`
  }, [supplierDetails])

  return (
    <div className="w-full animate-in fade-in">
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/26 bg-white/[0.09] p-7 shadow-[0_36px_96px_rgba(2,8,18,0.52)] ring-1 ring-white/14 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-200/10 via-white/0 to-sky-200/12" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-slate-50">{supplier.corporateName}</p>
            <p className="mt-1 text-sm text-slate-200/80">
              <span className="font-semibold text-slate-200">{t('modal.supplierMeta.taxId')}:</span>{' '}
              {supplier.taxIdentification}
            </p>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
              {t('modal.supplierMeta.representatives')}
            </p>
            {representativesPreview ? <p className="mt-2 truncate text-sm text-slate-100/90">{representativesPreview}</p> : null}
          </div>
        </div>

        {supplierError ? (
          <div className="mt-4 rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            <p className="font-semibold text-red-50">
              {supplierError.title ?? `Error ${supplierError.status ?? ''}`.trim()}
            </p>
            <p className="mt-1 text-red-100">{supplierError.message}</p>
          </div>
        ) : null}

        {screeningError ? (
          <div className="mt-4 rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            <p className="font-semibold text-red-50">
              {screeningError.title ?? `Error ${screeningError.status ?? ''}`.trim()}
            </p>
            <p className="mt-1 text-red-100">{screeningError.message}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 w-full rounded-3xl border border-white/14 bg-white/[0.03] p-6 shadow-[0_18px_42px_rgba(2,8,18,0.2)]">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {t('modal.sources.title')}
              </h3>
              <p className="text-xs font-semibold text-slate-300">{`${selectedSources.length} / ${options.length}`}</p>
            </div>

            <p className="mt-2 text-base font-semibold text-slate-100">Fuentes a analizar</p>

            <div className="mt-4 w-full max-w-md space-y-2">
              {options.map((option) => {
                const checked = selectedSources.includes(option.source)
                return (
                  <label
                    key={option.source}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 transition hover:bg-white/[0.04]"
                  >
                    <span className="text-sm font-semibold text-slate-100">{option.label}</span>
                    <span className="relative inline-flex h-6 w-6 items-center justify-center">
                      <input
                        type="checkbox"
                        className="absolute inset-0 opacity-0"
                        checked={checked}
                        onChange={() => onToggleSource(option.source)}
                      />
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition ${
                          checked
                            ? 'border-yellow-200/60 bg-yellow-200/15 text-yellow-100 shadow-[0_0_0_1px_rgba(255,230,0,0.18),0_0_22px_rgba(255,230,0,0.14)]'
                            : 'border-white/18 bg-white/[0.02] text-slate-300'
                        }`}
                        aria-hidden="true"
                      >
                        <FiCheck className={`h-4 w-4 transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <ScreeningGlobe logos={selectedOptionLogos} isActive={selectedOptionLogos.length > 0} size="lg" />
            <button
              type="button"
              className="home-add-button inline-flex items-center justify-center rounded-xl px-7 py-3 text-base font-semibold text-slate-900 disabled:opacity-60"
              onClick={onStart}
              disabled={selectedSources.length === 0 || isRunning}
            >
              {t('modal.actions.start')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
