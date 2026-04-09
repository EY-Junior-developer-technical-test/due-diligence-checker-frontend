import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ApiError } from '../services/ApiError'
import eyLogo from '../../../assets/EY_logo_Ernst_and_Young-686x705.png'
import { getAuthSession, clearAuthSession } from '../../auth/services/authStorage'
import { supplierService } from '../../suppliers/services/SupplierService'
import type { Supplier } from '../../suppliers/model/supplier'
import { SuppliersTable } from '../../suppliers/components/SuppliersTable'
import { SuppliersToolbar } from '../../suppliers/components/SuppliersToolbar'
import { UserMenuCard } from './UserMenuCard'
import { DeleteSupplierModal } from '../../suppliers/components/DeleteSupplierModal'

export function HomePage() {
  const { t, i18n } = useTranslation('home')
  const navigate = useNavigate()
  const session = getAuthSession()

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<ApiError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  const fullName = session?.fullname?.trim() || t('user.fallbackName')

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const hasNextPage = page < totalPages || suppliers.length === limit

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchText.trim())
      setPage(1)
    }, 1000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [searchText])

  useEffect(() => {
    let isMounted = true

    const loadSuppliers = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const result = await supplierService.list({
          page,
          limit,
          search: debouncedSearch || undefined,
        })

        if (!isMounted) {
          return
        }

        setSuppliers(result.items)
        setTotal(result.total)
      } catch (error) {
        if (!isMounted) {
          return
        }

        const apiError = error instanceof ApiError ? error : new ApiError(t('errors.loadSuppliers'))
        const message =
          apiError.status === 429 ? t('errors.tooManyRequests') : apiError.message

        setSuppliers([])
        setTotal(0)
        setErrorMessage(message)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadSuppliers()

    return () => {
      isMounted = false
    }
  }, [debouncedSearch, limit, page, reloadKey, t])

  const onLanguageChange = async (language: string) => {
    await i18n.changeLanguage(language)
    localStorage.setItem('ddc.lang', language)
  }

  const onLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  return (
    <main className="home-stage min-h-screen px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="forensic-light-ribbons" />

      <div className="mx-auto w-full max-w-7xl space-y-8">
        <header className="reveal-up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-start gap-3">
                <div className="auth-logo-wrap mt-0.5">
                  <img
                    src={eyLogo}
                    alt="EY"
                    className="h-10 w-10 shrink-0 rounded-md object-contain opacity-90"
                  />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold leading-tight text-slate-100 sm:text-4xl">
                    {t('header.title')}
                  </h1>

                  <div className="ey-line" />
                </div>
              </div>
            </div>

            <div className="mt-1 self-start">
              <UserMenuCard
                fullName={fullName}
                currentLanguage={currentLanguage}
                onLanguageChange={(language) => {
                  void onLanguageChange(language)
                }}
                onLogout={onLogout}
              />
            </div>
          </div>
        </header>

        <section className="mt-6 space-y-2">
          <SuppliersToolbar
            searchText={searchText}
            onSearchChange={setSearchText}
            searchPlaceholder={t('toolbar.searchPlaceholder')}
            addSupplierLabel={t('toolbar.addSupplier')}
            addSupplierHint={t('toolbar.addSupplierSoon')}
            onAddSupplier={() => navigate('/suppliers/new')}
          />

          <p className="pr-1 text-right text-xs font-medium text-slate-400">
            {t('table.count', { count: total })}
          </p>

          <SuppliersTable
            suppliers={suppliers}
            isLoading={isLoading}
            errorMessage={errorMessage}
            page={page}
            hasNextPage={hasNextPage}
            onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
            onNextPage={() => setPage((current) => (hasNextPage ? current + 1 : current))}
            onDeleteSupplier={(supplier) => {
              setSupplierToDelete(supplier)
              setDeleteError(null)
            }}
            onViewSupplier={(supplier) => navigate(`/suppliers/${supplier.id}`)}
          />
        </section>

      </div>

      <DeleteSupplierModal
        title={t('delete.title')}
        subtitle={t('delete.subtitle')}
        primaryText={supplierToDelete?.corporateName ?? ''}
        secondaryLabel={t('delete.taxIdLabel')}
        secondaryValue={supplierToDelete?.taxIdentification ?? ''}
        isOpen={Boolean(supplierToDelete)}
        isSubmitting={isDeleteSubmitting}
        error={deleteError}
        onClose={() => {
          if (!isDeleteSubmitting) {
            setSupplierToDelete(null)
            setDeleteError(null)
          }
        }}
        onConfirm={() => {
          if (!supplierToDelete || isDeleteSubmitting) {
            return
          }

          setIsDeleteSubmitting(true)
          setDeleteError(null)

          supplierService
            .deleteById(supplierToDelete.id)
            .then(() => {
              setSupplierToDelete(null)

              if (suppliers.length <= 1 && page > 1) {
                setPage((current) => Math.max(1, current - 1))
                return
              }

              setReloadKey((current) => current + 1)
            })
            .catch((error) => {
              const apiError = error instanceof ApiError ? error : new ApiError(t('errors.deleteSupplier'))
              setDeleteError(
                apiError.status === 429 ? new ApiError(t('errors.tooManyRequests'), { status: 429 }) : apiError,
              )
            })
            .finally(() => {
              setIsDeleteSubmitting(false)
            })
        }}
        confirmLabel={t('delete.actions.confirm')}
        cancelLabel={t('delete.actions.cancel')}
        submittingLabel={t('delete.actions.deleting')}
      />
    </main>
  )
}
