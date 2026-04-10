import { FiEdit2, FiTrash2 } from 'react-icons/fi'

import type { SupplierRepresentativeRecord } from '../model/supplier'

type RepresentativeCardProps = {
  representative: SupplierRepresentativeRecord
  onEdit: () => void
  onDelete: () => void
}

export function RepresentativeCard({ representative, onEdit, onDelete }: RepresentativeCardProps) {
  const metaParts = [
    representative.role,
    typeof representative.age === 'number' ? String(representative.age) : '',
    representative.nationality,
  ].filter((value) => typeof value === 'string' && value.trim().length > 0)

  return (
    <div className="rounded-2xl border border-white/14 bg-white/[0.04] p-4 shadow-[0_12px_26px_rgba(2,8,18,0.3)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-100">
            {representative.firstName} {representative.lastName}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {metaParts.join(' · ')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-white/[0.04] text-slate-100 transition hover:bg-white/[0.08]"
            onClick={onEdit}
            aria-label="Edit representative"
            title="Edit"
          >
            <FiEdit2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-900/70 bg-red-950/30 text-red-200 transition hover:bg-red-950/40"
            onClick={onDelete}
            aria-label="Delete representative"
            title="Delete"
          >
            <FiTrash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
