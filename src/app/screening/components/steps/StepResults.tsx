import type { ReactNode } from 'react'
import { FiCheckCircle, FiDollarSign, FiXCircle } from 'react-icons/fi'
import { RiBuilding2Fill, RiFolder2Fill, RiKnifeBloodFill } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'

import { ScreeningSource, type ScreeningRunResult, type ScreeningSource as ScreeningSourceId } from '../../model/screening'
import type { SourceOption } from '../../model/screeningUi'
import { ScreeningSummaryBar } from '../ScreeningSummaryBar'

type StepResultsProps = {
  options: SourceOption[]
  selectedSources: ScreeningSourceId[]
  result: ScreeningRunResult | null
  activeTab: ScreeningSourceId
  onTabChange: (tab: ScreeningSourceId) => void
  onBack: () => void
  onClose: () => void
}

export function StepResults({
  options,
  selectedSources,
  result,
  activeTab,
  onTabChange,
  onBack,
  onClose,
}: StepResultsProps) {
  const { t } = useTranslation('screening')

  const hits = buildHits(result)
  const filteredHits = hits.filter((hit) => hit.source === activeTab)
  const theme = getSourceTheme(activeTab)

  return (
    <div className="w-full animate-in fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {selectedSources.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            {selectedSources.map((source) => {
              const label = options.find((opt) => opt.source === source)?.label ?? String(source)
              const tabTheme = getSourceTheme(source)

              return (
                <Tab
                  key={source}
                  label={label}
                  active={activeTab === source}
                  icon={tabTheme.icon}
                  activeClassName={tabTheme.tabActive}
                  onClick={() => onTabChange(source)}
                />
              )
            })}
          </div>
        ) : (
          <div />
        )}

        <ScreeningSummaryBar result={result} />
      </div>

      <div
        className={`ey-scrollbar relative mt-4 max-h-[calc(100vh-22rem)] overflow-auto rounded-3xl border bg-white/[0.02] shadow-[0_22px_56px_rgba(2,8,18,0.24)] ${theme.containerBorder}`}
      >
        <div className={`pointer-events-none absolute inset-0 opacity-80 ${theme.containerBackdrop}`} />

        {result && filteredHits.length === 0 ? (
          <div className="relative px-6 py-6 text-sm text-slate-300">{t('results.table.empty')}</div>
        ) : null}

        <div className="relative divide-y divide-white/10">
          {filteredHits.map((hit) => (
            <HitRow key={hit.id} hit={hit} />
          ))}
        </div>
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
  )
}

type InterpolHitDisplay = {
  kind: 'interpol'
  id: string
  source: typeof ScreeningSource.Interpol
  fullName: string
  gender?: string
  dateOfBirth?: string
  placeOfBirth?: string
  nationality?: string
  charges?: string
}

type SecopHitDisplay = {
  kind: 'secop'
  id: string
  source: typeof ScreeningSource.Secop
  contractNumber?: string
  contractorName?: string
  contractorDocument?: string
  entityName?: string
  municipality?: string
  resolutionNumber?: string
  publishedAt?: string
  finalizedAt?: string
  processUrl?: string
}

type SmvHitDisplay = {
  kind: 'smv'
  id: string
  source: typeof ScreeningSource.Smv
  resolution?: string
  date?: string
  type?: string
  amount?: string
  withAppeal?: string
  resolutiveResolutionNumber?: string
  resolutiveResolutionDate?: string
  summary?: string
}

type HitDisplay = InterpolHitDisplay | SecopHitDisplay | SmvHitDisplay

function buildHits(result: ScreeningRunResult | null): HitDisplay[] {
  if (!result) {
    return []
  }

  const interpolHits = (result.interpolHits ?? []).map((hit, index) => {
    return {
      kind: 'interpol',
      id: `interpol-${index}-${hit.forename ?? ''}-${hit.familyName ?? ''}`,
      source: ScreeningSource.Interpol,
      fullName: `${hit.forename ?? ''} ${hit.familyName ?? ''}`.trim() || 'Coincidencia Interpol',
      gender: hit.gender,
      dateOfBirth: hit.dateOfBirth,
      placeOfBirth: hit.placeOfBirth,
      nationality: hit.nationality,
      charges: hit.charges,
    } satisfies InterpolHitDisplay
  })

  const secopHits = (result.secopHits ?? []).map((hit, index) => {
    return {
      kind: 'secop',
      id: `secop-${index}-${String(hit.contractNumber ?? '')}`,
      source: ScreeningSource.Secop,
      contractNumber: typeof hit.contractNumber === 'string' ? hit.contractNumber : undefined,
      contractorName: typeof hit.contractorName === 'string' ? hit.contractorName : undefined,
      contractorDocument: typeof hit.contractorDocument === 'string' ? hit.contractorDocument : undefined,
      entityName: typeof hit.entityName === 'string' ? hit.entityName : undefined,
      municipality: typeof hit.municipality === 'string' ? hit.municipality : undefined,
      resolutionNumber: typeof hit.resolutionNumber === 'string' ? hit.resolutionNumber : undefined,
      publishedAt: typeof hit.publishedAt === 'string' ? hit.publishedAt : undefined,
      finalizedAt: typeof hit.finalizedAt === 'string' ? hit.finalizedAt : undefined,
      processUrl: typeof hit.processUrl === 'string' ? hit.processUrl : undefined,
    } satisfies SecopHitDisplay
  })

  const smvHits = (result.smvHits ?? []).map((hit, index) => {
    return {
      kind: 'smv',
      id: `smv-${index}-${String(hit.resolution ?? '')}`,
      source: ScreeningSource.Smv,
      resolution: hit.resolution,
      date: hit.date,
      type: hit.type,
      amount: hit.amount,
      withAppeal: hit.withAppeal,
      resolutiveResolutionNumber: hit.resolutiveResolutionNumber,
      resolutiveResolutionDate: hit.resolutiveResolutionDate,
      summary: hit.summary,
    } satisfies SmvHitDisplay
  })

  return [...interpolHits, ...secopHits, ...smvHits]
}

function HitRow({ hit }: { hit: HitDisplay }) {
  if (hit.kind === 'interpol') {
    return <InterpolRow hit={hit} />
  }

  if (hit.kind === 'secop') {
    return <SecopRow hit={hit} />
  }

  return <SmvRow hit={hit} />
}

function InterpolRow({ hit }: { hit: InterpolHitDisplay }) {
  return (
    <div className="relative px-6 py-5 transition hover:bg-white/[0.02]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-red-300/60 via-red-500/20 to-transparent" />

      <div className="min-w-0">
        <div className="flex items-start gap-4">
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-300/30 bg-red-500/10 shadow-[0_0_26px_rgba(255,58,58,0.18)]"
            aria-hidden="true"
          >
            <RiKnifeBloodFill className="h-6 w-6 text-red-100" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-wide text-slate-50">{hit.fullName}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {hit.nationality ? <MetaPill label={hit.nationality} tone="red" /> : null}
              {hit.gender ? <MetaPill label={hit.gender} tone="red" /> : null}
              {hit.dateOfBirth ? <MetaPill label={hit.dateOfBirth} tone="red" /> : null}
            </div>
          </div>
        </div>

        {hit.placeOfBirth ? (
          <p className="mt-3 text-sm text-slate-200/80">
            <span className="font-semibold text-slate-100/90">Lugar:</span> {hit.placeOfBirth}
          </p>
        ) : null}

        {hit.charges ? (
          <p className="mt-3 text-sm leading-relaxed text-red-50/90">
            <span className="font-semibold text-red-50">Cargos:</span> {hit.charges}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function SecopRow({ hit }: { hit: SecopHitDisplay }) {
  return (
    <div className="relative px-6 py-5 transition hover:bg-white/[0.02]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-yellow-200/60 via-yellow-200/10 to-transparent" />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-yellow-200/25 bg-yellow-200/10 shadow-[0_0_26px_rgba(255,230,0,0.14)]"
              aria-hidden="true"
            >
              <RiBuilding2Fill className="h-6 w-6 text-yellow-50" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-50">
                {hit.contractNumber || hit.resolutionNumber || 'Registro Secop'}
              </p>
              <p className="mt-1 text-sm text-slate-200/80">
                {[hit.entityName, hit.municipality].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-slate-200/80 sm:grid-cols-2">
            {hit.contractorName ? (
              <p className="min-w-0 truncate">
                <span className="font-semibold text-slate-100/90">Contratista:</span> {hit.contractorName}
              </p>
            ) : null}
            {hit.contractorDocument ? (
              <p className="min-w-0 truncate">
                <span className="font-semibold text-slate-100/90">Documento:</span> {hit.contractorDocument}
              </p>
            ) : null}
          </div>

          {(hit.publishedAt || hit.finalizedAt) ? (
            <p className="mt-3 text-xs font-semibold text-slate-200/70">
              {hit.publishedAt ? `Publicado: ${formatIsoDate(hit.publishedAt)}` : null}
              {hit.publishedAt && hit.finalizedAt ? ' · ' : null}
              {hit.finalizedAt ? `Finalizado: ${formatIsoDate(hit.finalizedAt)}` : null}
            </p>
          ) : null}
        </div>

        {hit.processUrl ? (
          <a
            href={hit.processUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center self-start rounded-full border border-yellow-200/25 bg-yellow-200/10 px-4 py-2 text-xs font-semibold text-yellow-50 transition hover:bg-yellow-200/15"
          >
            Ver proceso
          </a>
        ) : null}
      </div>
    </div>
  )
}

function SmvRow({ hit }: { hit: SmvHitDisplay }) {
  const appeal = (hit.withAppeal ?? '').trim().toLowerCase()
  const appealKnown = appeal === 'si' || appeal === 'sí' || appeal === 'no'

  return (
    <div className="relative px-6 py-5 transition hover:bg-white/[0.02]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-sky-200/70 via-sky-200/10 to-transparent" />
      {hit.date ? (
        <span className="absolute right-6 top-5 rounded-full border border-white/14 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-slate-100/85">
          {hit.date}
        </span>
      ) : null}

      <div className="grid gap-5 md:grid-cols-[12rem_1fr]">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200/25 bg-sky-200/10 shadow-[0_0_26px_rgba(126,212,255,0.16)]"
              aria-hidden="true"
            >
              <RiFolder2Fill className="h-6 w-6 text-sky-50" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/70">SMV</p>
            </div>
          </div>

          <p className="inline-flex items-center gap-2 text-lg font-semibold text-slate-50">
            <FiDollarSign className="h-5 w-5 text-sky-100/80" aria-hidden="true" />
            {hit.amount ? formatMoney(hit.amount) : '—'}
          </p>

          <div className="flex flex-wrap gap-2">
            {hit.type ? <MetaPill label={hit.type} tone="sky" /> : null}
            {appealKnown ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${
                  appeal === 'no'
                    ? 'border-white/14 bg-white/[0.03] text-slate-200'
                    : 'border-sky-200/25 bg-sky-200/10 text-sky-50'
                }`}
                title={`Apelación: ${appeal}`}
              >
                {appeal === 'no' ? (
                  <FiXCircle className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{`Apelación: ${appeal === 'no' ? 'No' : 'Sí'}`}</span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-50">{hit.resolution || 'Registro SMV'}</p>
          {hit.summary ? <p className="mt-2 text-sm leading-relaxed text-slate-200/80">{hit.summary}</p> : null}

          <div className="mt-3 grid gap-2 text-xs text-slate-200/70 sm:grid-cols-2">
            {hit.resolutiveResolutionNumber ? (
              <p className="min-w-0 truncate">
                <span className="font-semibold text-slate-100/85">Res. apelación:</span> {hit.resolutiveResolutionNumber}
              </p>
            ) : null}
            {hit.resolutiveResolutionDate ? (
              <p className="min-w-0 truncate">
                <span className="font-semibold text-slate-100/85">Fecha apelación:</span> {hit.resolutiveResolutionDate}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaPill({ label, tone }: { label: string; tone: 'red' | 'sky' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ${
        tone === 'red'
          ? 'border-red-300/20 bg-red-500/10 text-red-50'
          : 'border-sky-200/20 bg-sky-200/10 text-sky-50'
      }`}
    >
      {label}
    </span>
  )
}

function formatMoney(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return '—'
  }

  const normalized = trimmed.replace(/,/g, '')
  const numeric = Number(normalized)
  if (!Number.isFinite(numeric)) {
    return `S/ ${trimmed}`
  }

  return `S/ ${numeric.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatIsoDate(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  const match = /^\d{4}-\d{2}-\d{2}/.exec(trimmed)
  return match ? match[0] : trimmed
}

function getSourceTheme(source: ScreeningSourceId): {
  icon: ReactNode
  tabActive: string
  containerBorder: string
  containerBackdrop: string
} {
  if (source === ScreeningSource.Interpol) {
    return {
      icon: <RiKnifeBloodFill className="h-4 w-4" />,
      tabActive: 'border-red-300/30 bg-red-500/10 text-red-50 shadow-[0_0_18px_rgba(255,58,58,0.18)]',
      containerBorder: 'border-red-300/14',
      containerBackdrop:
        'bg-[radial-gradient(circle_at_18%_20%,rgba(255,58,58,0.16),transparent_55%),radial-gradient(circle_at_72%_18%,rgba(255,230,0,0.08),transparent_60%)]',
    }
  }

  if (source === ScreeningSource.Secop) {
    return {
      icon: <RiBuilding2Fill className="h-4 w-4" />,
      tabActive: 'border-yellow-200/30 bg-yellow-200/10 text-yellow-50 shadow-[0_0_18px_rgba(255,230,0,0.16)]',
      containerBorder: 'border-yellow-200/14',
      containerBackdrop:
        'bg-[radial-gradient(circle_at_16%_24%,rgba(255,230,0,0.14),transparent_58%),radial-gradient(circle_at_84%_24%,rgba(126,212,255,0.10),transparent_60%)]',
    }
  }

  return {
    icon: <RiFolder2Fill className="h-4 w-4" />,
    tabActive: 'border-sky-200/30 bg-sky-200/10 text-sky-50 shadow-[0_0_18px_rgba(126,212,255,0.18)]',
    containerBorder: 'border-sky-200/14',
    containerBackdrop:
      'bg-[radial-gradient(circle_at_18%_24%,rgba(126,212,255,0.16),transparent_58%),radial-gradient(circle_at_86%_24%,rgba(255,230,0,0.08),transparent_60%)]',
  }
}

function Tab({
  label,
  active,
  icon,
  activeClassName,
  onClick,
}: {
  label: string
  active: boolean
  icon: ReactNode
  activeClassName: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
        active ? activeClassName : 'border-white/14 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]'
      }`}
      onClick={onClick}
    >
      <span className="opacity-90">{icon}</span>
      {label}
    </button>
  )
}
