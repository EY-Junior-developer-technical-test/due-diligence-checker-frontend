import { CgDanger } from 'react-icons/cg'

import type { ScreeningRunResult } from '../model/screening'

export function ScreeningSummaryBar({ result }: { result: ScreeningRunResult | null }) {
  if (!result) {
    return null
  }

  const totalHits = (result.interpolHits?.length ?? 0) + (result.secopHits?.length ?? 0) + (result.smvHits?.length ?? 0)

  return (
    <div className="pointer-events-none flex items-center gap-2">
      {result.hasHits ? (
        <span
          className="inline-flex h-11 w-11 animate-pulse items-center justify-center rounded-full border border-red-100/60 bg-red-500/30 text-red-50 shadow-[0_0_40px_rgba(255,0,0,0.62)]"
          aria-label="Con coincidencias"
          title="Con coincidencias"
        >
          <CgDanger className="h-7 w-7" aria-hidden="true" />
        </span>
      ) : null}

      <span className="rounded-full border border-white/18 bg-black/20 px-3 py-2 text-xs font-semibold text-slate-50 backdrop-blur-sm">
        {totalHits} hallazgo{totalHits === 1 ? '' : 's'}
      </span>
    </div>
  )
}
