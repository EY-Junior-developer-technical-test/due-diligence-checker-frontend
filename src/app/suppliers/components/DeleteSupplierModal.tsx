import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiTrash2, FiX } from 'react-icons/fi'

import { ApiError } from '../../shared/services/ApiError'

const OVERLAY_FADE_MS = 160

type DeleteSupplierModalProps = {
  title: string
  subtitle: string
  primaryText: string
  secondaryLabel: string
  secondaryValue: string
  isOpen: boolean
  isSubmitting: boolean
  error: ApiError | null
  onClose: () => void
  onConfirm: () => void
  confirmLabel: string
  cancelLabel: string
  submittingLabel: string
}

export function DeleteSupplierModal({
  title,
  subtitle,
  primaryText,
  secondaryLabel,
  secondaryValue,
  isOpen,
  isSubmitting,
  error,
  onClose,
  onConfirm,
  confirmLabel,
  cancelLabel,
  submittingLabel,
}: DeleteSupplierModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

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
        onClose()
      }
    }

    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [isOpen, onClose])

  if (!isMounted) {
    return null
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[1300] flex items-center justify-center px-4 transition-opacity duration-200 ${
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
        ref={panelRef}
        className={`glass-dialog relative w-full max-w-lg rounded-3xl p-5 transition-transform duration-200 ${
          isVisible ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]'
        }`}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-red-500/18 blur-xl" aria-hidden="true" />
              <span className="absolute inset-0 rounded-full bg-red-500/10 blur-md" aria-hidden="true" />
              <FiTrash2 className="relative h-6 w-6 text-red-200 drop-shadow-[0_0_18px_rgba(255,92,92,0.45)]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{title}</h2>
              <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 transition hover:bg-white/15"
            onClick={onClose}
            aria-label={cancelLabel}
          >
            <FiX className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="relative rounded-2xl border border-white/14 bg-white/[0.04] p-4">
          <p className="text-sm font-semibold text-slate-100">{primaryText}</p>
          <p className="mt-1 text-sm text-slate-300">
            <span className="font-semibold text-slate-200">{secondaryLabel}:</span> {secondaryValue}
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            <p className="font-semibold text-red-50">
              {error.title ?? `Error ${error.status ?? ''}`.trim()}
            </p>
            <p className="mt-1 text-red-100">{error.message}</p>
          </div>
        ) : null}

        <footer className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="home-delete-button inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? submittingLabel : confirmLabel}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
