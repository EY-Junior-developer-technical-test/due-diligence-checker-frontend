import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import { BsIncognito } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'

import interpolLogo from '../../../assets/interpol-logo-768x768.png'
import secopLogo from '../../../assets/GovColombiaMultas.png'
import smvLogo from '../../../assets/OIP.webp'

import { ApiError } from '../../shared/services/ApiError'
import { supplierService } from '../../suppliers/services/SupplierService'
import type { Supplier, SupplierDetails } from '../../suppliers/model/supplier'
import { ScreeningSource, type ScreeningRunResult, type ScreeningSource as ScreeningSourceId } from '../model/screening'
import type { SourceOption } from '../model/screeningUi'
import { screeningService } from '../services/ScreeningService'
import { StepSelect } from './steps/StepSelect'
import { StepAnalyzing } from './steps/StepAnalyzing'
import { StepResults } from './steps/StepResults'

const OVERLAY_FADE_MS = 180

type ScreeningModalStep = 1 | 2 | 3

type ScreeningModalProps = {
  isOpen: boolean
  supplier: Supplier | null
  onClose: () => void
}

export function ScreeningModal({ isOpen, supplier, onClose }: ScreeningModalProps) {
  const { t } = useTranslation('screening')
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState<ScreeningModalStep>(1)

  const [supplierDetails, setSupplierDetails] = useState<SupplierDetails | null>(null)
  const [supplierError, setSupplierError] = useState<ApiError | null>(null)

  const [selectedSources, setSelectedSources] = useState<ScreeningSourceId[]>([
    ScreeningSource.Interpol,
    ScreeningSource.Secop,
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<ScreeningRunResult | null>(null)
  const [activeTab, setActiveTab] = useState<ScreeningSourceId | 'all'>('all')
  const [statusLine, setStatusLine] = useState(t('analyzing.status.preparing'))

  const options: SourceOption[] = useMemo(
    () => [
      { source: ScreeningSource.Interpol, label: t('modal.sources.interpol'), logo: interpolLogo },
      { source: ScreeningSource.Secop, label: t('modal.sources.secop'), logo: secopLogo },
      { source: ScreeningSource.Smv, label: t('modal.sources.smv'), logo: smvLogo },
    ],
    [t],
  )

  const close = useCallback(() => {
    if (!isRunning) {
      onClose()
    }
  }, [isRunning, onClose])

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

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [isOpen, close])

  useEffect(() => {
    if (!isOpen || !supplier) {
      return
    }

    setStep(1)
    setResult(null)
    setActiveTab('all')
    setIsRunning(false)
    setSupplierError(null)
    setSupplierDetails(null)

    supplierService
      .getById(supplier.id)
      .then((details) => setSupplierDetails(details))
      .catch((error) => {
        const rawError = error instanceof ApiError ? error : new ApiError(t('errors.loadSupplier'))
        setSupplierError(
          rawError.status === 429
            ? new ApiError(t('errors.tooManyRequests'), { status: 429 })
            : rawError,
        )
      })
  }, [isOpen, supplier, t])

  const toggleSource = (source: ScreeningSourceId) => {
    setSelectedSources((current) => {
      if (current.includes(source)) {
        return current.filter((value) => value !== source)
      }
      return [...current, source]
    })
  }

  const start = async () => {
    if (!supplier || selectedSources.length === 0 || isRunning) {
      return
    }

    setIsRunning(true)
    setStep(2)
    setStatusLine(t('analyzing.status.preparing'))

    let statusTimer: number | null = null

    try {
      const sequence = selectedSources.slice(0, 3)
      let idx = 0

      statusTimer = window.setInterval(() => {
        const currentSource = sequence[idx % sequence.length]
        const label = options.find((opt) => opt.source === currentSource)?.label ?? String(currentSource)
        setStatusLine(t('analyzing.status.scanning', { source: label }))
        idx += 1
      }, 1400)

      const runResult = await screeningService.run({
        supplierId: supplier.id,
        sources: selectedSources,
      })

      setStatusLine(t('analyzing.status.finalizing'))

      await new Promise((resolve) => window.setTimeout(resolve, 500))

      setResult(runResult)
      setStep(3)
    } finally {
      if (statusTimer) {
        window.clearInterval(statusTimer)
      }
      setIsRunning(false)
    }
  }

  const filteredFindings = useMemo(() => {
    if (!result) {
      return []
    }

    if (activeTab === 'all') {
      return result.findings
    }

    return result.findings.filter((finding) => finding.source === activeTab)
  }, [activeTab, result])

  const totalHits = result?.findings.length ?? 0
  const supplierName = supplier?.corporateName ?? ''

  const header = useMemo(() => {
    if (step === 2) {
      return { title: t('analyzing.title'), subtitle: t('analyzing.subtitle') }
    }

    if (step === 3) {
      return {
        title: t('results.title'),
        subtitle: t('results.subtitle', { name: supplierName }),
      }
    }

    return { title: t('modal.forensicTitle'), subtitle: t('modal.subtitle') }
  }, [step, supplierName, t])

  if (!isMounted || !supplier) {
    return null
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[1400] flex items-center justify-center px-4 transition-opacity duration-200 ${
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
                  className="h-7 w-7 text-ey-yellow drop-shadow-[0_0_22px_rgba(255,230,0,0.34)]"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">{header.title}</h2>
                  <div className="mt-2 ey-line" />
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">{header.subtitle}</p>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 transition hover:bg-white/15 disabled:opacity-60"
              onClick={close}
              aria-label={t('modal.actions.close')}
              disabled={isRunning}
            >
              <FiX className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <div className="relative mt-6">
            <div className="w-full">
              {step === 1 ? (
                <StepSelect
                  supplier={supplier}
                  supplierDetails={supplierDetails}
                  supplierError={supplierError}
                  options={options}
                  selectedSources={selectedSources}
                  isRunning={isRunning}
                  onToggleSource={toggleSource}
                  onStart={() => void start()}
                />
              ) : null}

              {step === 2 ? (
                <StepAnalyzing
                  selectedSources={selectedSources}
                  options={options}
                  statusLine={statusLine}
                  isRunning={isRunning}
                  onBack={() => setStep(1)}
                />
              ) : null}

              {step === 3 ? (
                <StepResults
                  supplier={supplier}
                  options={options}
                  selectedSources={selectedSources}
                  totalHits={totalHits}
                  result={result}
                  filteredFindings={filteredFindings}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onBack={() => setStep(1)}
                  onClose={close}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
