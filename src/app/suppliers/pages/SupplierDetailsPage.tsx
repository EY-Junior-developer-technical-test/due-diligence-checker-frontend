import { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { FaPhone, FaVoicemail } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ApiError } from '../../shared/services/ApiError'
import { supplierService } from '../services/SupplierService'
import type { SupplierDetails, SupplierRepresentativeRecord } from '../model/supplier'
import { RepresentativeCard } from '../components/RepresentativeCard'
import { DeleteSupplierModal } from '../components/DeleteSupplierModal'

export function SupplierDetailsPage() {
  const { t } = useTranslation('suppliers')
  const navigate = useNavigate()
  const { supplierId } = useParams<{ supplierId: string }>()

  const [supplier, setSupplier] = useState<SupplierDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const [representativeToDelete, setRepresentativeToDelete] =
    useState<SupplierRepresentativeRecord | null>(null)
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<ApiError | null>(null)

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

        const apiError = err instanceof ApiError ? err : new ApiError(t('details.errors.loadFailed'))
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
        const apiError = err instanceof ApiError ? err : new ApiError(t('details.errors.loadFailed'))
        setError(apiError)
      })
      .finally(() => setIsLoading(false))
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
                </div>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="home-surface reveal-up rounded-xl border border-red-300/40 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            <p className="font-semibold text-red-50">{error.title ?? `Error ${error.status ?? ''}`.trim()}</p>
            <p className="mt-1 text-red-100">{error.message}</p>
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
                <ReadOnlyField
                  label={t('details.fields.corporateName')}
                  value={supplier.corporateName}
                  className="sm:col-span-2"
                />
                <ReadOnlyField
                  label={t('details.fields.tradeName')}
                  value={supplier.tradeName}
                  className="sm:col-span-2"
                />
                <ReadOnlyField
                  label={t('details.fields.taxIdentification')}
                  value={supplier.taxIdentification}
                />
                <ReadOnlyField
                  label={t('details.fields.phoneNumber')}
                  value={supplier.phoneNumber}
                  icon={<FaPhone className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />}
                />
                <ReadOnlyField
                  label={t('details.fields.email')}
                  value={supplier.email}
                  icon={<FaVoicemail className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />}
                />
                <ReadOnlyField
                  label={t('details.fields.webSite')}
                  value={supplier.webSite}
                />
                <ReadOnlyField
                  label={t('details.fields.country')}
                  value={supplier.country}
                />
                <ReadOnlyField
                  label={t('details.fields.annualBillingAmount')}
                  value={new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
                    supplier.annualBillingAmount,
                  )}
                  prefix="$"
                />
                <ReadOnlyField
                  label={t('details.fields.physicalAddress')}
                  value={supplier.physicalAddress}
                  className="sm:col-span-2"
                />
              </div>
            </div>

            <aside className="reveal-up rounded-xl border border-white/18 bg-transparent p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                    <FaPeopleGroup className="h-4 w-4 text-slate-300" aria-hidden="true" />
                    <span>
                      {t('details.sections.representatives')} ({representativeCount})
                    </span>
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {supplier.representatives.map((representative) => (
                  <RepresentativeCard
                    key={representative.id}
                    representative={representative}
                    onEdit={() => {
                      window.alert(t('details.editRepresentativeSoon'))
                    }}
                    onDelete={() => {
                      setRepresentativeToDelete(representative)
                      setDeleteError(null)
                    }}
                  />
                ))}
              </div>
            </aside>
          </section>
        ) : null}
      </div>

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
              const apiError = err instanceof ApiError ? err : new ApiError(t('details.errors.deleteFailed'))
              setDeleteError(apiError)
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

function ReadOnlyField({
  label,
  value,
  className,
  icon,
  prefix,
}: {
  label: string
  value: string | number
  className?: string
  icon?: React.ReactNode
  prefix?: string
}) {
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
        <div className="home-search-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-100">
          {String(value)}
        </div>
      </div>
    </div>
  )
}
