import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiArrowLeft, FiArrowRight, FiX } from 'react-icons/fi'
import { BsIncognito } from 'react-icons/bs'
import { CgDanger } from 'react-icons/cg'
import { useTranslation } from 'react-i18next'

import { ApiError } from '../../shared/services/ApiError'
import type { Supplier } from '../../suppliers/model/supplier'
import type { ScreeningRunResult } from '../model/screening'
import { screeningService } from '../services/ScreeningService'
import { ScreeningResultsModal } from './ScreeningResultsModal'

const OVERLAY_FADE_MS = 180
const PAGE_LIMIT = 4

type ScreeningHistoryModalProps = {
  isOpen: boolean
  supplier: Supplier | null
  onClose: () => void
}

export function ScreeningHistoryModal({ isOpen, supplier, onClose }: ScreeningHistoryModalProps) {
  const { t } = useTranslation('screening')
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [items, setItems] = useState<ScreeningRunResult[]>([])
  const [selected, setSelected] = useState<ScreeningRunResult | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false)
      const timeout = window.setTimeout(() => setIsMounted(false), OVERLAY_FADE_MS)
      return () => window.clearTimeout(timeout)
    }

    setIsMounted(true)
    requestAnimationFrame(() => setIsVisible(true))
    return
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    setPage(1)
    setItems([])
    setError(null)
    setSelected(null)
  }, [isOpen, supplier?.id])

  const load = useCallback(() => {
    if (!supplier || !isOpen) {
      return
    }

    setIsLoading(true)
    setError(null)

    screeningService
      .listBySupplierId(supplier.id, { page, limit: PAGE_LIMIT })
      .then((result) => setItems(result))
      .catch((err) => {
        const apiError = err instanceof ApiError ? err : new ApiError('No se pudo cargar el historial de screenings.')
        setError(apiError)
      })
      .finally(() => setIsLoading(false))
  }, [isOpen, page, supplier])

  useEffect(() => {
    load()
  }, [load])

  const hasNextPage = items.length >= PAGE_LIMIT

  const close = useCallback(() => {
    if (!isLoading) {
      onClose()
    }
  }, [isLoading, onClose])

  const summary = useMemo(() => {
    if (!items.length) {
      return ''
    }
    return `${items.length} registro${items.length === 1 ? '' : 's'}`
  }, [items.length])

  if (!isMounted || !supplier) {
    return null
  }

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[1450] flex items-center justify-center px-4 transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-modal="true"
        role="dialog"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            close()
          }
        }}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

        <div
          className={`glass-dialog-bright relative w-[min(94vw,56rem)] rounded-[2rem] p-8 shadow-[0_56px_120px_rgba(2,8,18,0.72)] transition-transform duration-200 ${
            isVisible ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]'
          }`}
        >
          <div className="relative z-10">
            <header className="mb-7 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <BsIncognito
                    className="h-8 w-8 drop-shadow-[0_0_28px_rgba(255,230,0,0.5)]"
                    style={{ color: 'var(--ey-yellow)' }}
                    aria-hidden="true"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">
                      {t('history.title', { defaultValue: 'Historial de screenings' })}
                    </h2>
                    <div className="mt-2 ey-line" />
                  </div>
                </div>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  {supplier.corporateName}
                  {summary ? ` · ${summary}` : ''}
                </p>
              </div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 transition hover:bg-white/15 disabled:opacity-60"
                onClick={close}
                aria-label={t('modal.actions.close')}
                disabled={isLoading}
              >
                <FiX className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <div className="w-full rounded-3xl border border-white/14 bg-white/[0.03] p-6 shadow-[0_18px_42px_rgba(2,8,18,0.2)]">
              {error ? (
                <div className="mb-4 rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  <p className="font-semibold text-red-50">{error.title ?? `Error ${error.status ?? ''}`.trim()}</p>
                  <p className="mt-1 text-red-100">{error.message}</p>
                </div>
              ) : null}

              <div className="ey-scrollbar max-h-[26rem] space-y-3 overflow-auto pr-1">
                {isLoading ? (
                  <div className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                    {t('table.loading', { ns: 'home', defaultValue: 'Cargando…' })}
                  </div>
                ) : null}

                {!isLoading && items.length === 0 ? (
                  <div className="rounded-2xl border border-white/14 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                    {t('history.empty', { defaultValue: 'Aún no hay screenings ejecutados.' })}
                  </div>
                ) : null}

                {!isLoading
                  ? items.map((item) => (
                      <button
                        key={item.supplierScreeningId}
                        type="button"
                        className="w-full rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-3 text-left transition hover:bg-white/[0.07]"
                        onClick={() => setSelected(item)}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-100">
                              #{item.supplierScreeningId} · {item.sourcesChecked || 'Fuentes'}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {item.executedAt ? `Ejecutado: ${formatExecutedAt(item.executedAt)}` : null}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.hasHits ? (
                              <span
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-300/30 bg-red-500/10 text-red-200 shadow-[0_0_18px_rgba(255,58,58,0.22)]"
                                aria-label="Con hits"
                                title="Con hits"
                              >
                                <CgDanger className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                            <span className="rounded-full border border-white/14 bg-white/[0.03] px-2 py-1 text-xs font-semibold text-slate-200">
                              {formatHitCounts(item)}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  : null}
              </div>

              <footer className="mt-5 flex items-center justify-end gap-1.5 border-t border-white/10 pt-4">
                <span className="mr-0.5 text-[11px] font-semibold text-slate-400">
                  {t('pagination.page', { ns: 'home', page, defaultValue: `Página ${page}` })}
                </span>
                <button
                  type="button"
                  className="rounded-md border border-white/20 p-1.5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || isLoading}
                  aria-label={t('pagination.previous', { ns: 'home', defaultValue: 'Anterior' })}
                >
                  <FiArrowLeft className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="rounded-md border border-white/20 p-1.5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                  onClick={() => setPage((current) => (hasNextPage ? current + 1 : current))}
                  disabled={!hasNextPage || isLoading}
                  aria-label={t('pagination.next', { ns: 'home', defaultValue: 'Siguiente' })}
                >
                  <FiArrowRight className="h-3 w-3" />
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <ScreeningResultsModal
        isOpen={Boolean(selected)}
        supplier={supplier}
        result={selected}
        onClose={() => setSelected(null)}
      />
    </>,
    document.body,
  )
}

function formatHitCounts(item: ScreeningRunResult): string {
  const interpol = item.interpolHits?.length ?? 0
  const secop = item.secopHits?.length ?? 0
  const smv = item.smvHits?.length ?? 0
  const total = interpol + secop + smv

  return total > 0 ? `${total} hit${total === 1 ? '' : 's'}` : '0 hits'
}

function formatExecutedAt(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) {
    return trimmed
  }

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
