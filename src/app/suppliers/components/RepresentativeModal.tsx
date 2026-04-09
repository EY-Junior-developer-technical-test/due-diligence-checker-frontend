import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

import type { SupplierRepresentative } from '../model/supplier'

type RepresentativeModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (representative: SupplierRepresentative) => void
  title?: string
  initialRepresentative?: Partial<SupplierRepresentative> | null
  closeOnSubmit?: boolean
  isSubmitting?: boolean
}

type RepresentativeFormState = {
  role: string
  firstName: string
  lastName: string
  age: string
  nationality: string
}

type RepresentativeFormErrors = Partial<Record<keyof RepresentativeFormState, string>>
type RepresentativeFormTouched = Partial<Record<keyof RepresentativeFormState, boolean>>

const OVERLAY_FADE_MS = 160

export function RepresentativeModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialRepresentative,
  closeOnSubmit = true,
  isSubmitting = false,
}: RepresentativeModalProps) {
  const { t } = useTranslation('suppliers')
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [form, setForm] = useState<RepresentativeFormState>({
    role: '',
    firstName: '',
    lastName: '',
    age: '',
    nationality: '',
  })
  const [errors, setErrors] = useState<RepresentativeFormErrors>({})
  const [touched, setTouched] = useState<RepresentativeFormTouched>({})

  const normalizedNationality = useMemo(() => form.nationality.trim().toUpperCase(), [form.nationality])

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

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setForm({
      role: initialRepresentative?.role ?? '',
      firstName: initialRepresentative?.firstName ?? '',
      lastName: initialRepresentative?.lastName ?? '',
      age: typeof initialRepresentative?.age === 'number' ? String(initialRepresentative.age) : '',
      nationality: initialRepresentative?.nationality ?? '',
    })
    setErrors({})
    setTouched({})
  }, [initialRepresentative, isOpen])

  const validateField = (key: keyof RepresentativeFormState, value: string): string | undefined => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return t('create.errors.required')
    }

    if (key === 'age') {
      const ageValue = Number(trimmedValue)
      if (!Number.isFinite(ageValue) || ageValue < 18) {
        return t('create.errors.age')
      }
    }

    if (key === 'nationality') {
      if (!/^[A-Z]{2}$/.test(trimmedValue.toUpperCase())) {
        return t('create.errors.nationality')
      }
    }

    return
  }

  const validateAll = (): RepresentativeFormErrors => {
    const nextErrors: RepresentativeFormErrors = {}

    ;(['role', 'firstName', 'lastName', 'age', 'nationality'] as const).forEach((key) => {
      const error = validateField(key, form[key])
      if (error) {
        nextErrors[key] = error
      }
    })

    return nextErrors
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setErrors((current) => {
      const nextErrors: RepresentativeFormErrors = { ...current }
      ;(Object.keys(touched) as Array<keyof RepresentativeFormTouched>).forEach((key) => {
        if (!touched[key]) {
          return
        }

        const error = validateField(key as keyof RepresentativeFormState, form[key as keyof RepresentativeFormState])
        if (error) {
          nextErrors[key as keyof RepresentativeFormState] = error
        } else {
          delete nextErrors[key as keyof RepresentativeFormState]
        }
      })

      return nextErrors
    })
  }, [form, isOpen, touched])

  const handleSubmit = () => {
    const nextErrors = validateAll()
    setErrors(nextErrors)
    setTouched({
      role: true,
      firstName: true,
      lastName: true,
      age: true,
      nationality: true,
    })

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit({
      role: form.role.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      age: Number(form.age),
      nationality: normalizedNationality,
    })

    if (closeOnSubmit) {
      onClose()
    }
  }

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
        className={`relative w-full max-w-lg rounded-3xl border border-white/18 bg-white/[0.06] p-5 shadow-[0_28px_60px_rgba(2,8,18,0.62)] backdrop-blur-xl transition-transform duration-200 ${
          isVisible ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.98]'
        }`}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {title ?? t('create.actions.addRepresentative')}
            </h2>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 transition hover:bg-white/15"
            onClick={onClose}
            aria-label={t('create.actions.cancel')}
            disabled={isSubmitting}
          >
            <FiX className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label={t('create.representativeFields.role')}
            value={form.role}
            error={errors.role}
            disabled={isSubmitting}
            onChange={(value) => {
              setTouched((current) => ({ ...current, role: true }))
              setForm((current) => ({ ...current, role: value }))
            }}
          />
          <Field
            label={t('create.representativeFields.age')}
            value={form.age}
            inputMode="numeric"
            error={errors.age}
            disabled={isSubmitting}
            onChange={(value) => {
              setTouched((current) => ({ ...current, age: true }))
              setForm((current) => ({ ...current, age: value.replace(/[^\d]/g, '') }))
            }}
          />
          <Field
            label={t('create.representativeFields.firstName')}
            value={form.firstName}
            error={errors.firstName}
            disabled={isSubmitting}
            onChange={(value) => {
              setTouched((current) => ({ ...current, firstName: true }))
              setForm((current) => ({ ...current, firstName: value }))
            }}
          />
          <Field
            label={t('create.representativeFields.lastName')}
            value={form.lastName}
            error={errors.lastName}
            disabled={isSubmitting}
            onChange={(value) => {
              setTouched((current) => ({ ...current, lastName: true }))
              setForm((current) => ({ ...current, lastName: value }))
            }}
          />
          <Field
            label={t('create.representativeFields.nationality')}
            value={form.nationality}
            error={errors.nationality}
            disabled={isSubmitting}
            onChange={(value) => {
              setTouched((current) => ({ ...current, nationality: true }))
              setForm((current) => ({ ...current, nationality: value.toUpperCase() }))
            }}
            className="sm:col-span-2"
            placeholder="PE"
          />
        </div>

        <footer className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('create.actions.cancel')}
          </button>
          <button
            type="button"
            className="home-add-button inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-900"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {t('create.actions.saveRepresentative')}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  className,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  className?: string
  disabled?: boolean
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        disabled={disabled}
        className={`home-search-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none ${
          error ? 'ring-1 ring-inset ring-red-400/50' : ''
        }`}
      />
      {error ? <p className="mt-1 text-xs font-medium text-red-200">{error}</p> : null}
    </div>
  )
}
