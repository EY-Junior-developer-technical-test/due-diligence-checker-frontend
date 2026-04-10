import { useEffect, useMemo, useState } from 'react'

type GlobeSize = 'lg' | 'xl'

type ScreeningGlobeProps = {
  logos: string[]
  isActive: boolean
  size?: GlobeSize
  blink?: boolean
}

export function ScreeningGlobe({ logos, isActive, size = 'lg', blink = false }: ScreeningGlobeProps) {
  const count = Math.min(3, logos.length)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    setIsRevealed(false)
    const frame = requestAnimationFrame(() => setIsRevealed(true))
    return () => cancelAnimationFrame(frame)
  }, [count, logos.join('|')])

  const dims = size === 'xl'
    ? {
        globe: 'h-[7.4rem] w-[7.4rem]',
        one: 'h-12 w-12',
        two: 'h-11 w-11',
        three: 'h-10 w-10',
      }
    : {
        globe: 'h-[6.75rem] w-[6.75rem]',
        one: 'h-11 w-11',
        two: 'h-10 w-10',
        three: 'h-9 w-9',
      }

  const slots = useMemo(() => {
    const out: Array<{ key: string; src: string; className: string }> = []

    if (count === 1) {
      out.push({
        key: 'slot-0',
        src: logos[0],
        className: `left-1/2 top-1/2 ${dims.one} -translate-x-1/2 -translate-y-1/2`,
      })
    }

    if (count === 2) {
      out.push(
        {
          key: 'slot-0',
          src: logos[0],
          className: `left-[34%] top-1/2 ${dims.two} -translate-x-1/2 -translate-y-1/2`,
        },
        {
          key: 'slot-1',
          src: logos[1],
          className: `left-[66%] top-1/2 ${dims.two} -translate-x-1/2 -translate-y-1/2`,
        },
      )
    }

    if (count === 3) {
      out.push(
        {
          key: 'slot-0',
          src: logos[0],
          className: `left-1/2 top-[28%] ${dims.three} -translate-x-1/2 -translate-y-1/2`,
        },
        {
          key: 'slot-1',
          src: logos[1],
          className: `left-[35%] top-[66%] ${dims.three} -translate-x-1/2 -translate-y-1/2`,
        },
        {
          key: 'slot-2',
          src: logos[2],
          className: `left-[65%] top-[66%] ${dims.three} -translate-x-1/2 -translate-y-1/2`,
        },
      )
    }

    return out
  }, [count, dims.one, dims.three, dims.two, logos])

  return (
    <div className={`scan-orbit shrink-0 ${blink ? 'globe-blink' : ''}`}>
      <div
        className={`relative ${dims.globe} overflow-hidden rounded-full border bg-white/[0.065] shadow-[0_18px_44px_rgba(2,8,18,0.35)] transition ${
          isActive
            ? 'border-yellow-200/32 ring-1 ring-yellow-200/28 shadow-[0_18px_44px_rgba(2,8,18,0.35),0_0_34px_rgba(255,230,0,0.18)]'
            : 'border-white/18'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/10 via-white/0 to-sky-200/12" />

        {count === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-300/80">
            0
          </div>
        ) : null}

        {slots.map((slot) => (
          <img
            key={`${slot.key}-${count}`}
            src={slot.src}
            alt=""
            className={`absolute rounded-2xl object-contain transition-all duration-500 ease-out ${slot.className} ${
              isRevealed ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

