import { FiPlus, FiSearch } from 'react-icons/fi'

type SuppliersToolbarProps = {
  searchText: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  addSupplierLabel: string
  addSupplierHint: string
}

export function SuppliersToolbar({
  searchText,
  onSearchChange,
  searchPlaceholder,
  addSupplierLabel,
  addSupplierHint,
}: SuppliersToolbarProps) {
  return (
    <section className="home-floating-toolbar reveal-up pt-1 sm:pt-2">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
        <label className="relative block w-full sm:w-[52%] sm:min-w-[24rem] sm:max-w-[38rem]" htmlFor="supplier-search-input">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-200" />
          <input
            id="supplier-search-input"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            className="home-search-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 outline-none"
            placeholder={searchPlaceholder}
          />
        </label>

        <button
          type="button"
          className="home-add-button inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900"
          title={addSupplierHint}
          aria-label={addSupplierLabel}
        >
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          <span>{addSupplierLabel}</span>
        </button>
      </div>
    </section>
  )
}
