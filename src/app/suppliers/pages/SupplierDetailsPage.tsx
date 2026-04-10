import { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi'
import { LuHistory } from 'react-icons/lu'
import { FaPhone, FaVoicemail } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ApiError } from '../../shared/services/ApiError'
import { ScreeningHistoryModal } from '../../screening/components/ScreeningHistoryModal'
import { supplierService } from '../services/SupplierService'
import type { SupplierDetails, SupplierRepresentativeRecord } from '../model/supplier'
import { RepresentativeCard } from '../components/RepresentativeCard'
import { DeleteSupplierModal } from '../components/DeleteSupplierModal'
import { RepresentativeModal } from '../components/RepresentativeModal'
import type { SupplierRepresentative } from '../model/supplier'

export function SupplierDetailsPage() {
  const { t } = useTranslation('suppliers')
  const navigate = useNavigate()
  const { supplierId } = useParams<{ supplierId: string }>()

  const [supplier, setSupplier] = useState<SupplierDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [isEditingSupplier, setIsEditingSupplier] = useState(false)
  const [supplierDraft, setSupplierDraft] = useState<SupplierDetails | null>(null)
  const [supplierErrors, setSupplierErrors] = useState<Record<string, string>>({})
  const [isSupplierSubmitting, setIsSupplierSubmitting] = useState(false)
  const [supplierSubmitError, setSupplierSubmitError] = useState<ApiError | null>(null)
  const [isScreeningHistoryOpen, setIsScreeningHistoryOpen] = useState(false)

  const [representativeToDelete, setRepresentativeToDelete] =
    useState<SupplierRepresentativeRecord | null>(null)
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<ApiError | null>(null)
  const [isRepresentativeModalOpen, setIsRepresentativeModalOpen] = useState(false)
  const [editingRepresentative, setEditingRepresentative] =
    useState<SupplierRepresentativeRecord | null>(null)
  const [isRepresentativeSubmitting, setIsRepresentativeSubmitting] = useState(false)
  const [representativeError, setRepresentativeError] = useState<ApiError | null>(null)

  const title = supplier?.corporateName ?? t('details.titleFallback')

  const representativeCount = supplier?.representatives.length ?? 0

  const repDeleteTitle = useMemo(() => t('details.deleteRepresentative.title'), [t])
  const repDeleteSubtitle = useMemo(() => t('details.deleteRepresentative.subtitle'), [t])

  useEffect(() => {
    let isMounted = true

    if (!supplierId) {
      setError(new ApiError(t('details.errors.missingId')))
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    supplierService
      .getById(supplierId)
      .then((result) => {
        if (isMounted) {
          setSupplier(result)
        }
      })
      .catch((err) => {
        if (!isMounted) {
          return
        }

        const rawError = err instanceof ApiError ? err : new ApiError(t('details.errors.loadFailed'))
        const apiError =
          rawError.status === 429
            ? new ApiError(t('details.errors.tooManyRequests'), { status: 429 })
            : rawError
        setError(apiError)
        setSupplier(null)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [supplierId, t])

  const reloadSupplier = () => {
    if (!supplierId) {
      return
    }

    setIsLoading(true)
    setError(null)

    supplierService
      .getById(supplierId)
      .then((result) => setSupplier(result))
      .catch((err) => {
        const rawError = err instanceof ApiError ? err : new ApiError(t('details.errors.loadFailed'))
        const apiError =
          rawError.status === 429
            ? new ApiError(t('details.errors.tooManyRequests'), { status: 429 })
            : rawError
        setError(apiError)
      })
      .finally(() => setIsLoading(false))
  }

  const startEditingSupplier = () => {
    if (!supplier) {
      return
    }

    setSupplierDraft({ ...supplier })
    setSupplierErrors({})
    setSupplierSubmitError(null)
    setIsEditingSupplier(true)
  }

  const cancelEditingSupplier = () => {
    setIsEditingSupplier(false)
    setSupplierDraft(null)
    setSupplierErrors({})
    setSupplierSubmitError(null)
  }

  const validateSupplier = (draft: SupplierDetails): Record<string, string> => {
    const nextErrors: Record<string, string> = {}

    const requiredFields: Array<keyof SupplierDetails> = [
      'corporateName',
      'tradeName',
      'phoneNumber',
      'email',
      'webSite',
      'physicalAddress',
      'country',
    ]

    requiredFields.forEach((key) => {
      if (!String(draft[key]).trim()) {
        nextErrors[key] = t('create.errors.required')
      }
    })

    if (!Number.isFinite(draft.annualBillingAmount) || draft.annualBillingAmount < 0) {
      nextErrors.annualBillingAmount = t('create.errors.amount')
    }

    return nextErrors
  }

  const saveSupplier = () => {
    if (!supplierId || !supplierDraft || isSupplierSubmitting) {
      return
    }

    const nextErrors = validateSupplier(supplierDraft)
    setSupplierErrors(nextErrors)
    setSupplierSubmitError(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSupplierSubmitting(true)

    supplierService
      .updateById(supplierId, supplierDraft)
      .then(() => {
        setIsEditingSupplier(false)
        setSupplierDraft(null)
        reloadSupplier()
      })
      .catch((err) => {
        const rawError =
          err instanceof ApiError ? err : new ApiError(t('details.errors.updateSupplierFailed'))
        setSupplierSubmitError(
          rawError.status === 429
            ? new ApiError(t('details.errors.tooManyRequests'), { status: 429 })
            : rawError,
        )
      })
      .finally(() => setIsSupplierSubmitting(false))
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
                  aria-label={t('details.back')}
                  title={t('details.back')}
                >
                  <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>

                <div>
                  <h1 className="text-3xl font-bold leading-tight text-slate-100 sm:text-4xl">
                    {title}
                  </h1>
                  <div className="mt-3 ey-line" />
                  <p className="mt-3 max-w-3xl text-sm text-slate-300">
                    {t('details.description', { name: title })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-1 self-start">
              {!isEditingSupplier && supplier ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/[0.06] text-slate-100 transition hover:bg-white/[0.1]"
                    onClick={() => setIsScreeningHistoryOpen(true)}
                    aria-label={t('details.actions.screeningHistory', { defaultValue: 'Historial de screenings' })}
                    title={t('details.actions.screeningHistory', { defaultValue: 'Historial de screenings' })}
                  >
                    <LuHistory className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/[0.06] text-slate-100 transition hover:bg-white/[0.1]"
                    onClick={startEditingSupplier}
                    aria-label={t('details.actions.editRepresentative')}
                    title={t('details.actions.editRepresentative')}
                  >
                    <FiEdit2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {error ? (
          <div className="home-surface reveal-up rounded-xl border border-red-300/40 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            <p className="font-semibold text-red-50">{error.title ?? `Error ${error.status ?? ''}`.trim()}</p>
            <p className="mt-1 text-red-100">{error.message}</p>
          </div>
        ) : null}

        {supplierSubmitError ? (
          <div className="home-surface reveal-up rounded-xl border border-red-300/40 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            <p className="font-semibold text-red-50">
              {supplierSubmitError.title ?? `Error ${supplierSubmitError.status ?? ''}`.trim()}
            </p>
            <p className="mt-1 text-red-100">{supplierSubmitError.message}</p>
          </div>
        ) : null}

        {isLoading ? (
          <div className="home-surface reveal-up rounded-xl px-5 py-8 text-sm text-slate-200">
            {t('details.loading')}
          </div>
        ) : null}

        {!isLoading && supplier ? (
          <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="reveal-up rounded-xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DataField
                  label={t('details.fields.corporateName')}
                  value={(isEditingSupplier ? supplierDraft?.corporateName : supplier.corporateName) ?? ''}
                  mode={isEditingSupplier ? 'edit' : 'read'}
                  error={supplierErrors.corporateName}
                  onChange={(value) =>
                    setSupplierDraft((current) => (current ? { ...current, corporateName: value } : current))
                  }
                  className="sm:col-span-2"
                />
                <DataField
                  label={t('details.fields.tradeName')}
                  value={(isEditingSupplier ? supplierDraft?.tradeName : supplier.tradeName) ?? ''}
                  mode={isEditingSupplier ? 'edit' : 'read'}
                  error={supplierErrors.tradeName}
                  onChange={(value) =>
                    setSupplierDraft((current) => (current ? { ...current, tradeName: value } : current))
                  }
                  className="sm:col-span-2"
                />
                <DataField
                  label={t('details.fields.taxIdentification')}
                  value={supplier.taxIdentification}
                  mode="read"
                />
                <DataField
                  label={t('details.fields.phoneNumber')}
                  value={(isEditingSupplier ? supplierDraft?.phoneNumber : supplier.phoneNumber) ?? ''}
                  icon={<FaPhone className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />}
                  mode={isEditingSupplier ? 'edit' : 'read'}
                  error={supplierErrors.phoneNumber}
                  onChange={(value) =>
                    setSupplierDraft((current) => (current ? { ...current, phoneNumber: value } : current))
                  }
                />
                <DataField
                  label={t('details.fields.email')}
                  value={(isEditingSupplier ? supplierDraft?.email : supplier.email) ?? ''}
                  icon={<FaVoicemail className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />}
                  mode={isEditingSupplier ? 'edit' : 'read'}
                  error={supplierErrors.email}
                  onChange={(value) =>
                    setSupplierDraft((current) => (current ? { ...current, email: value } : current))
                  }
                />
                <DataField
                  label={t('details.fields.webSite')}
                  value={(isEditingSupplier ? supplierDraft?.webSite : supplier.webSite) ?? ''}
                  mode={isEditingSupplier ? 'edit' : 'read'}
                  error={supplierErrors.webSite}
                  onChange={(value) =>
                    setSupplierDraft((current) => (current ? { ...current, webSite: value } : current))
                  }
                />
                <DataField
                  label={t('details.fields.country')}
                  value={(isEditingSupplier ? supplierDraft?.country : supplier.country) ?? ''}
                  mode={isEditingSupplier ? 'edit' : 'read'}
                  error={supplierErrors.country}
                  onChange={(value) =>
                    setSupplierDraft((current) => (current ? { ...current, country: value } : current))
                  }
                />
                <DataField
                  label={t('details.fields.annualBillingAmount')}
                  value={
                    isEditingSupplier
                      ? String(supplierDraft?.annualBillingAmount ?? '')
                      : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
                          supplier.annualBillingAmount,
                        )
                  }
                  prefix="$"
                  mode={isEditingSupplier ? 'edit-number' : 'read'}
                  error={supplierErrors.annualBillingAmount}
                  onChange={(value) =>
                    setSupplierDraft((current) =>
                      current
                        ? { ...current, annualBillingAmount: Number(value.replace(/[^\d.]/g, '')) }
                        : current,
                    )
                  }
                />
                <DataField
                  label={t('details.fields.physicalAddress')}
                  value={(isEditingSupplier ? supplierDraft?.physicalAddress : supplier.physicalAddress) ?? ''}
                  mode={isEditingSupplier ? 'edit-textarea' : 'read'}
                  error={supplierErrors.physicalAddress}
                  onChange={(value) =>
                    setSupplierDraft((current) => (current ? { ...current, physicalAddress: value } : current))
                  }
                  className="sm:col-span-2"
                />
              </div>

              {isEditingSupplier ? (
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
                    onClick={cancelEditingSupplier}
                    disabled={isSupplierSubmitting}
                  >
                    {t('details.actions.cancelEdit')}
                  </button>
                  <button
                    type="button"
                    className="home-add-button inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
                    onClick={saveSupplier}
                    disabled={isSupplierSubmitting}
                  >
                    {t('details.actions.saveSupplier')}
                  </button>
                </div>
              ) : null}
            </div>

            <aside
              className={`reveal-up rounded-xl border border-white/18 bg-transparent p-5 sm:p-6 ${
                isEditingSupplier ? 'pointer-events-none opacity-45' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                    <FaPeopleGroup className="h-4 w-4 text-slate-300" aria-hidden="true" />
                    <span>
                      {t('details.sections.representatives')} ({representativeCount})
                    </span>
                  </h2>
                </div>

                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-white/[0.06] text-slate-100 transition hover:bg-white/[0.1]"
                  onClick={() => {
                    setEditingRepresentative(null)
                    setRepresentativeError(null)
                    setIsRepresentativeModalOpen(true)
                  }}
                  aria-label={t('details.actions.addRepresentative')}
                  title={t('details.actions.addRepresentative')}
                >
                  <span className="text-lg leading-none">+</span>
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {supplier.representatives.map((representative) => (
                  <RepresentativeCard
                    key={representative.id}
                    representative={representative}
                    onEdit={() => {
                      setEditingRepresentative(representative)
                      setRepresentativeError(null)
                      setIsRepresentativeModalOpen(true)
                    }}
                    onDelete={() => {
                      setRepresentativeToDelete(representative)
                      setDeleteError(null)
                    }}
                  />
                ))}
              </div>

              {representativeError ? (
                <div className="mt-4 rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  <p className="font-semibold text-red-50">
                    {representativeError.title ?? `Error ${representativeError.status ?? ''}`.trim()}
                  </p>
                  <p className="mt-1 text-red-100">{representativeError.message}</p>
                </div>
              ) : null}
            </aside>
          </section>
        ) : null}
      </div>

      <RepresentativeModal
        isOpen={isRepresentativeModalOpen}
        isSubmitting={isRepresentativeSubmitting}
        onClose={() => {
          if (!isRepresentativeSubmitting) {
            setIsRepresentativeModalOpen(false)
            setEditingRepresentative(null)
          }
        }}
        title={
          editingRepresentative ? t('details.actions.editRepresentative') : t('details.actions.addRepresentative')
        }
        initialRepresentative={
          editingRepresentative
            ? {
                role: editingRepresentative.role,
                firstName: editingRepresentative.firstName,
                lastName: editingRepresentative.lastName,
                age: editingRepresentative.age,
                nationality: editingRepresentative.nationality,
              }
            : null
        }
        closeOnSubmit={false}
        onSubmit={(representative: SupplierRepresentative) => {
          if (!supplierId || isRepresentativeSubmitting) {
            return
          }

          setIsRepresentativeSubmitting(true)
          setRepresentativeError(null)

          const action = editingRepresentative
            ? supplierService.updateRepresentativeById(supplierId, editingRepresentative.id, representative)
            : supplierService.createRepresentativeBySupplierId(supplierId, representative)

          action
            .then(() => {
              setIsRepresentativeModalOpen(false)
              setEditingRepresentative(null)
              reloadSupplier()
            })
            .catch((err) => {
              const rawError =
                err instanceof ApiError ? err : new ApiError(t('details.errors.upsertFailed'))
              setRepresentativeError(
                rawError.status === 429
                  ? new ApiError(t('details.errors.tooManyRequests'), { status: 429 })
                  : rawError,
              )
            })
            .finally(() => setIsRepresentativeSubmitting(false))
        }}
      />

      <ScreeningHistoryModal
        isOpen={isScreeningHistoryOpen}
        supplier={supplier}
        onClose={() => setIsScreeningHistoryOpen(false)}
      />

      <DeleteSupplierModal
        title={repDeleteTitle}
        subtitle={repDeleteSubtitle}
        primaryText={
          representativeToDelete
            ? `${representativeToDelete.firstName} ${representativeToDelete.lastName}`.trim()
            : ''
        }
        secondaryLabel={t('details.deleteRepresentative.metaLabel')}
        secondaryValue={representativeToDelete ? representativeToDelete.role : ''}
        isOpen={Boolean(representativeToDelete)}
        isSubmitting={isDeleteSubmitting}
        error={deleteError}
        onClose={() => {
          if (!isDeleteSubmitting) {
            setRepresentativeToDelete(null)
            setDeleteError(null)
          }
        }}
        onConfirm={() => {
          if (!supplierId || !representativeToDelete || isDeleteSubmitting) {
            return
          }

          setIsDeleteSubmitting(true)
          setDeleteError(null)

          supplierService
            .deleteRepresentativeById(supplierId, representativeToDelete.id)
            .then(() => {
              setRepresentativeToDelete(null)
              reloadSupplier()
            })
            .catch((err) => {
              const rawError = err instanceof ApiError ? err : new ApiError(t('details.errors.deleteFailed'))
              setDeleteError(
                rawError.status === 429
                  ? new ApiError(t('details.errors.tooManyRequests'), { status: 429 })
                  : rawError,
              )
            })
            .finally(() => {
              setIsDeleteSubmitting(false)
            })
        }}
        confirmLabel={t('details.deleteRepresentative.actions.confirm')}
        cancelLabel={t('details.deleteRepresentative.actions.cancel')}
        submittingLabel={t('details.deleteRepresentative.actions.deleting')}
      />
    </main>
  )
}

function DataField({
  label,
  value,
  className,
  icon,
  prefix,
  mode,
  onChange,
  error,
}: {
  label: string
  value: string | number
  className?: string
  icon?: React.ReactNode
  prefix?: string
  mode: 'read' | 'edit' | 'edit-number' | 'edit-textarea'
  onChange?: (value: string) => void
  error?: string
}) {
  const showError = Boolean(error)

  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
        {icon ? <span className="inline-flex items-center">{icon}</span> : null}
        <span>{label}</span>
      </label>
      <div className="flex items-center gap-2">
        {prefix ? (
          <span className="text-sm font-semibold text-slate-200">{prefix}</span>
        ) : null}

        {mode === 'read' ? (
          <div className="home-search-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-100">
            {String(value)}
          </div>
        ) : null}

        {mode === 'edit' || mode === 'edit-number' ? (
          <input
            value={String(value)}
            onChange={(event) => onChange?.(event.target.value)}
            inputMode={mode === 'edit-number' ? 'decimal' : undefined}
            className={`home-search-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none ${
              showError ? 'ring-1 ring-inset ring-red-400/50' : ''
            }`}
          />
        ) : null}

        {mode === 'edit-textarea' ? (
          <textarea
            value={String(value)}
            onChange={(event) => onChange?.(event.target.value)}
            rows={2}
            className={`home-search-input w-full resize-none rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none ${
              showError ? 'ring-1 ring-inset ring-red-400/50' : ''
            }`}
          />
        ) : null}
      </div>
      {showError ? <p className="mt-1 text-xs font-medium text-red-200">{error}</p> : null}
    </div>
  )
}
