import { useTranslation } from 'react-i18next'

import type { Supplier } from '../../../suppliers/model/supplier'
import type { ScreeningRunResult, ScreeningSource as ScreeningSourceId } from '../../model/screening'
import type { SourceOption } from '../../model/screeningUi'

type StepResultsProps = {
  supplier: Supplier
  options: SourceOption[]
  selectedSources: ScreeningSourceId[]
  totalHits: number
  result: ScreeningRunResult | null
  filteredFindings: ScreeningRunResult['findings']
  activeTab: ScreeningSourceId | 'all'
  onTabChange: (tab: ScreeningSourceId | 'all') => void
  onBack: () => void
  onClose: () => void
}

export function StepResults({
  supplier,
  options,
  selectedSources,
  totalHits,
  result,
  filteredFindings,
  activeTab,
  onTabChange,
  onBack,
  onClose,
}: StepResultsProps) {
  const { t } = useTranslation('screening')

  return (
    <div className="w-full animate-in fade-in">
      <div className="w-full rounded-3xl border border-white/14 bg-white/[0.03] p-6 shadow-[0_18px_42px_rgba(2,8,18,0.2)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">{t('results.title')}</h3>
            <p className="mt-2 text-sm text-slate-300">{t('results.subtitle', { name: supplier.corporateName })}</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-100">
              {totalHits > 0 ? t('results.summary.hits', { count: totalHits }) : t('results.summary.noHits')}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Tab label={t('results.tabs.all')} active={activeTab === 'all'} onClick={() => onTabChange('all')} />
          {selectedSources.map((source) => {
            const label = options.find((opt) => opt.source === source)?.label ?? String(source)
            return <Tab key={source} label={label} active={activeTab === source} onClick={() => onTabChange(source)} />
          })}
        </div>

        <div className="mt-4 max-h-[12.5rem] space-y-3 overflow-auto pr-1">
          {result && filteredFindings.length === 0 ? (
            <div className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
              {t('results.table.empty')}
            </div>
          ) : null}

          {filteredFindings.map((finding) => (
            <div key={finding.id} className="rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{finding.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{finding.details}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-1 text-xs font-semibold ${
                    finding.risk === 'high'
                      ? 'border-red-300/40 bg-red-500/10 text-red-100'
                      : finding.risk === 'medium'
                        ? 'border-yellow-200/30 bg-yellow-200/10 text-yellow-100'
                        : 'border-sky-200/30 bg-sky-200/10 text-sky-100'
                  }`}
                >
                  {finding.risk.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
            onClick={onBack}
          >
            {t('modal.actions.back')}
          </button>
          <button
            type="button"
            className="home-add-button inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-900"
            onClick={onClose}
          >
            {t('modal.actions.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'border-yellow-200/55 bg-yellow-200/12 text-yellow-50'
          : 'border-white/14 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
