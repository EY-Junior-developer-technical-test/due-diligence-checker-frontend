import { useMemo, useState } from 'react'
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ApiError } from '../../shared/services/ApiError'
import { supplierService } from '../services/SupplierService'
import type { SupplierCreateCommand, SupplierRepresentative } from '../model/supplier'
import { RepresentativeModal } from '../components/RepresentativeModal'

type SupplierFormState = {
  corporateName: string
  tradeName: string
  taxIdentification: string
  phoneNumber: string
  email: string
  webSite: string
  physicalAddress: string
  country: string
  annualBillingAmount: string
}

type SupplierFormErrors = Partial<Record<keyof SupplierFormState, string>>

const REQUIRED_FIELDS: Array<keyof SupplierFormState> = [
  'corporateName',
  'tradeName',
  'taxIdentification',
  'phoneNumber',
  'email',
  'webSite',
  'physicalAddress',
  'country',
  'annualBillingAmount',
]

export function CreateSupplierPage() {
  const { t } = useTranslation('suppliers')
  const navigate = useNavigate()

  const [form, setForm] = useState<SupplierFormState>({
    corporateName: '',
    tradeName: '',
    taxIdentification: '',
    phoneNumber: '',
    email: '',
    webSite: '',
    physicalAddress: '',
    country: '',
    annualBillingAmount: '',
  })

  const [errors, setErrors] = useState<SupplierFormErrors>({})
  const [representatives, setRepresentatives] = useState<SupplierRepresentative[]>([])
  const [isRepresentativeModalOpen, setIsRepresentativeModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<ApiError | null>(null)

  const annualBillingAmountNumber = useMemo(() => Number(form.annualBillingAmount), [form.annualBillingAmount])

  const setField = <TKey extends keyof SupplierFormState>(key: TKey, value: SupplierFormState[TKey]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const validate = (): SupplierFormErrors => {
    const nextErrors: SupplierFormErrors = {}

    REQUIRED_FIELDS.forEach((key) => {
      if (!String(form[key]).trim()) {
        nextErrors[key] = t('create.errors.required')
      }
    })

    if (form.taxIdentification.trim() && !/^\d{11}$/.test(form.taxIdentification.trim())) {
      nextErrors.taxIdentification = t('create.errors.taxId')
    }

    if (form.annualBillingAmount.trim()) {
      if (!Number.isFinite(annualBillingAmountNumber) || annualBillingAmountNumber < 0) {
        nextErrors.annualBillingAmount = t('create.errors.amount')
      }
    }

    return nextErrors
  }

  const submit = async () => {
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const command: SupplierCreateCommand = {
      corporateName: form.corporateName,
      tradeName: form.tradeName,
      taxIdentification: form.taxIdentification,
      phoneNumber: form.phoneNumber,
      email: form.email,
      webSite: form.webSite,
      physicalAddress: form.physicalAddress,
      country: form.country,
      annualBillingAmount: annualBillingAmountNumber,
      representatives: representatives.length > 0 ? representatives : undefined,
    }

    setIsSubmitting(true)
    try {
      await supplierService.create(command)
      navigate('/home')
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(t('create.errors.createFailed'))
      setSubmitError(apiError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="home-stage min-h-screen px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="forensic-light-ribbons" />

      <div className="mx-auto w-full max-w-7xl space-y-8">
        <header className="reveal-up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="home-add-button inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-900 shadow-[0_18px_34px_rgba(2,8,18,0.35)]"
                  onClick={() => navigate('/home')}
                  aria-label={t('create.back')}
                  title={t('create.back')}
                >
                  <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>

                <div>
                  <h1 className="text-3xl font-bold leading-tight text-slate-100 sm:text-4xl">
                    {t('create.title')}
                  </h1>
                  <div className="mt-3 ey-line" />
                  <p className="mt-3 max-w-2xl text-sm text-slate-300">{t('create.subtitle')}</p>
                </div>
              </div>

            </div>
          </div>
        </header>

        {submitError ? (
          <div className="home-surface reveal-up rounded-xl border border-red-300/40 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            <p className="font-semibold text-red-50">
              {submitError.title ?? `Error ${submitError.status ?? ''}`.trim()}
            </p>
            <p className="mt-1 text-red-100">{submitError.message}</p>
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="home-surface home-surface-soft reveal-up rounded-xl p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
              {t('create.sections.supplier')}
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label={t('create.fields.corporateName')}
                value={form.corporateName}
                error={errors.corporateName}
                onChange={(value) => setField('corporateName', value)}
                className="sm:col-span-2"
              />
              <InputField
                label={t('create.fields.tradeName')}
                value={form.tradeName}
                error={errors.tradeName}
                onChange={(value) => setField('tradeName', value)}
                className="sm:col-span-2"
              />
              <InputField
                label={t('create.fields.taxIdentification')}
                value={form.taxIdentification}
                error={errors.taxIdentification}
                onChange={(value) => setField('taxIdentification', value.replace(/\D/g, ''))}
                inputMode="numeric"
                placeholder="20100012345"
              />
              <InputField
                label={t('create.fields.phoneNumber')}
                value={form.phoneNumber}
                error={errors.phoneNumber}
                onChange={(value) => setField('phoneNumber', value)}
                placeholder="+51 999 999 999"
              />
              <InputField
                label={t('create.fields.email')}
                value={form.email}
                error={errors.email}
                onChange={(value) => setField('email', value)}
                placeholder="contact@example.com"
              />
              <InputField
                label={t('create.fields.webSite')}
                value={form.webSite}
                error={errors.webSite}
                onChange={(value) => setField('webSite', value)}
                placeholder="https://example.com"
              />
              <InputField
                label={t('create.fields.country')}
                value={form.country}
                error={errors.country}
                onChange={(value) => setField('country', value)}
                placeholder={t('create.placeholders.country')}
              />
              <InputField
                label={t('create.fields.annualBillingAmount')}
                value={form.annualBillingAmount}
                error={errors.annualBillingAmount}
                onChange={(value) => setField('annualBillingAmount', value.replace(/[^\d.]/g, ''))}
                inputMode="decimal"
                placeholder={t('create.placeholders.annualBillingAmount')}
              />
              <TextAreaField
                label={t('create.fields.physicalAddress')}
                value={form.physicalAddress}
                error={errors.physicalAddress}
                onChange={(value) => setField('physicalAddress', value)}
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
                onClick={() => navigate('/home')}
              >
                {t('create.actions.cancel')}
              </button>
              <button
                type="button"
                className="home-add-button inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
                onClick={() => void submit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('create.actions.submitting') : t('create.actions.submit')}
              </button>
            </div>
          </div>

          <aside className="reveal-up rounded-xl border border-white/18 bg-transparent p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {t('create.sections.representatives')}
                </h2>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
                onClick={() => setIsRepresentativeModalOpen(true)}
              >
                <FiPlus className="h-4 w-4" aria-hidden="true" />
                {t('create.actions.addRepresentative')}
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {representatives.map((representative, index) => (
                <div
                  key={`${representative.firstName}-${representative.lastName}-${index}`}
                  className="rounded-2xl border border-white/14 bg-white/[0.04] p-4 shadow-[0_12px_26px_rgba(2,8,18,0.3)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">
                        {representative.firstName} {representative.lastName}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {[representative.role, representative.age, representative.nationality]
                          .filter((value) => value !== undefined && value !== null && String(value).trim().length > 0)
                          .join(' · ')}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-900/70 bg-red-950/30 text-red-200 transition hover:bg-red-950/40"
                      onClick={() =>
                        setRepresentatives((current) => current.filter((_, itemIndex) => itemIndex !== index))
                      }
                      aria-label={t('create.actions.removeRepresentative')}
                      title={t('create.actions.removeRepresentative')}
                    >
                      <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>

      <RepresentativeModal
        isOpen={isRepresentativeModalOpen}
        onClose={() => setIsRepresentativeModalOpen(false)}
        onSubmit={(representative) => setRepresentatives((current) => [...current, representative])}
      />
    </main>
  )
}

function InputField({
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  className?: string
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
        className={`home-search-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none ${
          error ? 'ring-1 ring-inset ring-red-400/50' : ''
        }`}
      />
      {error ? <p className="mt-1 text-xs font-medium text-red-200">{error}</p> : null}
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  error,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className={`home-search-input w-full resize-none rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none ${
          error ? 'ring-1 ring-inset ring-red-400/50' : ''
        }`}
      />
      {error ? <p className="mt-1 text-xs font-medium text-red-200">{error}</p> : null}
    </div>
  )
}
