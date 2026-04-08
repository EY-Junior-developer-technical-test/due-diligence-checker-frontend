type LanguageSwitchOption = {
  value: string
  label: string
}

type LanguageSwitchProps = {
  value: string
  options: LanguageSwitchOption[]
  onChange: (value: string) => void
  className?: string
}

export function LanguageSwitch({ value, options, onChange, className }: LanguageSwitchProps) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const segmentWidth = 100 / options.length

  return (
    <div
      className={`relative inline-flex rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm backdrop-blur-sm ${className ?? ''}`.trim()}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <div
        className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-full bg-slate-900 shadow-sm transition-transform duration-300 ease-out"
        style={{
          width: `calc(${segmentWidth}% - 0.25rem)`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            className={`relative z-10 min-w-12 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
