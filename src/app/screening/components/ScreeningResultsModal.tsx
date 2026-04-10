import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import { BsIncognito } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'

import type { Supplier } from '../../suppliers/model/supplier'
import { ScreeningSource, type ScreeningRunResult, type ScreeningSource as ScreeningSourceId } from '../model/screening'
import { getScreeningSourceOptions } from '../model/sourceOptions'
import { StepResults } from './steps/StepResults'

const OVERLAY_FADE_MS = 180

type ScreeningResultsModalProps = {
  isOpen: boolean
  supplier: Supplier | null
  result: ScreeningRunResult | null
  onClose: () => void
}

export function ScreeningResultsModal({
  isOpen,
  supplier,
  result,
  onClose,
}: ScreeningResultsModalProps) {
  const { t } = useTranslation('screening')
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<ScreeningSourceId>(ScreeningSource.Interpol)

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

  const options = useMemo(() => getScreeningSourceOptions(t), [t])
  const selectedSources = useMemo(() => inferSelectedSources(result), [result])
  const modalTitle = supplier?.corporateName?.trim() || t('results.title')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setActiveTab(selectedSources[0] ?? ScreeningSource.Interpol)
  }, [isOpen, result, selectedSources])

  if (!isMounted || !supplier || !result) {
    return null
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[1500] flex items-center justify-center px-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-modal="true"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      <div
        className={`glass-dialog-bright relative w-[min(98vw,82rem)] rounded-[2rem] p-8 shadow-[0_56px_120px_rgba(2,8,18,0.72)] transition-transform duration-200 ${
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
                  <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">{modalTitle}</h2>
                  <div className="mt-2 ey-line" />
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                {t('results.title')}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 transition hover:bg-white/15"
              onClick={onClose}
              aria-label={t('modal.actions.close')}
            >
              <FiX className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <StepResults
            options={options}
            selectedSources={selectedSources}
            result={result}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onBack={onClose}
            onClose={onClose}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

function inferSelectedSources(result: ScreeningRunResult | null): ScreeningSourceId[] {
  if (!result) {
    return []
  }

  const sourcesChecked = (result.sourcesChecked ?? '').toLowerCase()
  const inferred: ScreeningSourceId[] = []

  if (sourcesChecked.includes('interpol') || (result.interpolHits ?? []).length > 0) {
    inferred.push(ScreeningSource.Interpol)
  }

  if (sourcesChecked.includes('secop') || (result.secopHits ?? []).length > 0) {
    inferred.push(ScreeningSource.Secop)
  }

  if (sourcesChecked.includes('smv') || (result.smvHits ?? []).length > 0) {
    inferred.push(ScreeningSource.Smv)
  }

  if (inferred.length > 0) {
    return inferred
  }

  return [ScreeningSource.Interpol, ScreeningSource.Secop, ScreeningSource.Smv]
}
