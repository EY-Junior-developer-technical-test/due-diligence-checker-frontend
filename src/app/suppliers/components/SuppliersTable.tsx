import { FiArrowLeft, FiArrowRight, FiEdit2, FiEye, FiSearch, FiTrash2 } from 'react-icons/fi'
import { FaPhone } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

import type { Supplier } from '../model/supplier'

type SuppliersTableProps = {
  suppliers: Supplier[]
  isLoading: boolean
  errorMessage: string | null
  page: number
  totalPages: number
  onPreviousPage: () => void
  onNextPage: () => void
}

export function SuppliersTable({
  suppliers,
  isLoading,
  errorMessage,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
}: SuppliersTableProps) {
  const { t } = useTranslation('home')

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section className="home-surface overflow-hidden rounded-xl reveal-up">
      {errorMessage ? (
        <div className="mx-5 mt-5 rounded-xl border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm text-red-100 sm:mx-6">
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-black/10 text-xs uppercase tracking-[0.14em] text-slate-300">
              <th className="px-5 py-3 font-semibold sm:px-6">{t('table.headers.corporateName')}</th>
              <th className="px-5 py-3 font-semibold sm:px-6">{t('table.headers.taxIdentification')}</th>
              <th className="px-5 py-3 font-semibold sm:px-6">
                <span className="inline-flex items-center gap-1.5">
                  <FaPhone className="h-3 w-3" aria-hidden="true" />
                  <span>{t('table.headers.phoneNumber')}</span>
                </span>
              </th>
              <th className="px-5 py-3 font-semibold sm:px-6">{t('table.headers.email')}</th>
              <th className="px-5 py-3 font-semibold sm:px-6">{t('table.headers.annualBillingAmount')}</th>
              <th className="px-5 py-3 font-semibold sm:px-6">{t('table.headers.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-5 py-8 text-sm text-slate-300 sm:px-6" colSpan={6}>
                  {t('table.loading')}
                </td>
              </tr>
            ) : null}

            {!isLoading && suppliers.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-sm text-slate-300 sm:px-6" colSpan={6}>
                  {t('table.empty')}
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-white/10 text-sm text-slate-100 last:border-b-0">
                    <td className="px-5 py-3.5 sm:px-6">
                      <p className="max-w-[17rem] break-words font-semibold leading-snug text-slate-100">
                        {supplier.corporateName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{supplier.tradeName}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-200 sm:px-6">{supplier.taxIdentification}</td>
                    <td className="px-5 py-3.5 text-slate-200 sm:px-6">{supplier.phoneNumber}</td>
                    <td className="px-5 py-3.5 text-slate-200 sm:px-6">{supplier.email}</td>
                    <td className="px-5 py-3.5 text-slate-200 sm:px-6">$ {formatAmount(supplier.annualBillingAmount)}</td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/22 text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_14px_rgba(238,247,255,0.22)]"
                          aria-label={t('table.actions.view')}
                        >
                          <FiEye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/22 text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_14px_rgba(238,247,255,0.22)]"
                          aria-label={t('table.actions.edit')}
                        >
                          <FiEdit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/22 text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/10 hover:text-white hover:shadow-[0_0_14px_rgba(238,247,255,0.22)]"
                          aria-label={t('table.actions.screening')}
                        >
                          <FiSearch className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-900/80 bg-red-950/35 text-red-300 transition duration-200 hover:-translate-y-0.5 hover:border-red-700/90 hover:bg-red-900/45 hover:text-red-200 hover:shadow-[0_0_14px_rgba(151,46,46,0.35)]"
                          aria-label={t('table.actions.delete')}
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-end gap-1.5 border-t border-white/10 px-5 py-2.5 sm:px-6">
        <span className="mr-0.5 text-[11px] font-semibold text-slate-400">
          {t('pagination.page', { page })}
        </span>
        <button
          type="button"
          className="rounded-md border border-white/20 p-1.5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          onClick={onPreviousPage}
          disabled={page <= 1 || isLoading}
          aria-label={t('pagination.previous')}
        >
          <FiArrowLeft className="h-3 w-3" />
        </button>
        <button
          type="button"
          className="rounded-md border border-white/20 p-1.5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          onClick={onNextPage}
          disabled={page >= totalPages || isLoading}
          aria-label={t('pagination.next')}
        >
          <FiArrowRight className="h-3 w-3" />
        </button>
      </footer>
    </section>
  )
}
