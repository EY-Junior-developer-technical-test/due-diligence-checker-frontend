import { useEffect, useMemo, useRef, useState } from 'react'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import esLocale from 'i18n-iso-countries/langs/es.json'

export type CountryOption = {
  value: string
  label: string
  alpha2: string
  englishLabel: string
}

countries.registerLocale(enLocale)
countries.registerLocale(esLocale)

const OPTIONS_CACHE = new Map<string, CountryOption[]>()
let ENGLISH_NAMES_CACHE: Record<string, string> | null = null

function getEnglishNames() {
  if (ENGLISH_NAMES_CACHE) {
    return ENGLISH_NAMES_CACHE
  }

  const names = countries.getNames('en', { select: 'official' }) as Record<string, string>
  ENGLISH_NAMES_CACHE = names
  return names
}

export function getCountryOptions(locale: 'en' | 'es') {
  const cached = OPTIONS_CACHE.get(locale)
  if (cached) {
    return cached
  }

  const names = countries.getNames(locale, { select: 'official' }) as Record<string, string>
  const englishNames = getEnglishNames()
  const options = Object.entries(names)
    .filter(([code]) => /^[A-Z]{2}$/.test(code))
    .map(([code, label]) => {
      const alpha3 = countries.alpha2ToAlpha3(code)
      if (!alpha3) {
        return null
      }

      const englishLabel = englishNames[code] ?? label
      return { value: alpha3, label, alpha2: code, englishLabel }
    })
    .filter((option): option is CountryOption => option !== null)
    .sort((a, b) => a.label.localeCompare(b.label))

  OPTIONS_CACHE.set(locale, options)
  return options
}

export function normalizeCountryText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase()
}

export function findCountryOption(value: string, options: CountryOption[]) {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const asCode = trimmed.toUpperCase()
  const matchByValue = options.find((option) => option.value.toUpperCase() === asCode)
  if (matchByValue) {
    return matchByValue
  }

  if (/^[A-Z]{2}$/.test(asCode)) {
    const asAlpha3 = countries.alpha2ToAlpha3(asCode)
    if (asAlpha3) {
      const matchByAlpha2 = options.find((option) => option.value.toUpperCase() === asAlpha3)
      if (matchByAlpha2) {
        return matchByAlpha2
      }
    }

    const matchLegacyAlpha2 = options.find((option) => option.alpha2.toUpperCase() === asCode)
    if (matchLegacyAlpha2) {
      return matchLegacyAlpha2
    }
  }

  const normalized = normalizeCountryText(trimmed)
  return (
    options.find((option) => normalizeCountryText(option.label) === normalized) ??
    options.find((option) => normalizeCountryText(option.englishLabel) === normalized) ??
    null
  )
}

function toFlagEmoji(code: string) {
  const normalized = code.trim().toUpperCase()
  const alpha2 = /^[A-Z]{2}$/.test(normalized)
    ? normalized
    : /^[A-Z]{3}$/.test(normalized)
      ? countries.alpha3ToAlpha2(normalized) ?? ''
      : ''

  if (!/^[A-Z]{2}$/.test(alpha2)) {
    return ''
  }

  const [firstChar, secondChar] = alpha2
  const first = 127397 + firstChar.charCodeAt(0)
  const second = 127397 + secondChar.charCodeAt(0)
  return String.fromCodePoint(first, second)
}

type CountrySelectProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  isDisabled?: boolean
  hasError?: boolean
  inputId?: string
  locale: 'en' | 'es'
  output?: 'alpha3' | 'name_en'
}

export function CountryDisplay({
  value,
  className,
  locale,
}: {
  value: string
  className?: string
  locale: 'en' | 'es'
}) {
  const selected = findCountryOption(value, getCountryOptions(locale))

  if (!value.trim()) {
    return <span className={className} />
  }

  if (!selected) {
    return <span className={className}>{value}</span>
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`.trim()}>
      <span>{selected.label}</span>
    </span>
  )
}

export function CountrySelect({
  value,
  onChange,
  placeholder,
  isDisabled,
  hasError,
  inputId,
  locale,
  output = 'alpha3',
}: CountrySelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const didSelectRef = useRef(false)

  const options = useMemo(() => getCountryOptions(locale), [locale])
  const selected = useMemo(() => findCountryOption(value, options), [options, value])

  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState('')

  const displayValue = useMemo(() => {
    if (!value.trim()) {
      return ''
    }

    if (!selected) {
      return value.trim()
    }

    if (output === 'name_en') {
      return `${selected.englishLabel}`.trim()
    }

    const flag = toFlagEmoji(selected.alpha2)
    return `${flag} ${selected.label} (${selected.value})`.trim()
  }, [output, selected, value])

  useEffect(() => {
    if (!isFocused) {
      setQuery(displayValue)
    }
  }, [displayValue, isFocused])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target instanceof Node ? event.target : null
      if (!target) {
        return
      }

      if (containerRef.current && containerRef.current.contains(target)) {
        return
      }

      setIsOpen(false)
      setIsFocused(false)
      inputRef.current?.blur()
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [isOpen])

  const filteredOptions = useMemo(() => {
    const normalized = normalizeCountryText(query)
    if (!normalized) {
      return options.slice(0, 80)
    }

    const byText = options.filter((option) => {
      const displayLabel = output === 'name_en' ? option.englishLabel : option.label
      const labelNormalized = normalizeCountryText(displayLabel)
      const englishNormalized = normalizeCountryText(option.englishLabel)
      const localizedNormalized = normalizeCountryText(option.label)
      const codeNormalized = option.value.toLowerCase()
      const alpha2Normalized = option.alpha2.toLowerCase()

      return (
        labelNormalized.includes(normalized) ||
        englishNormalized.includes(normalized) ||
        localizedNormalized.includes(normalized) ||
        codeNormalized.includes(normalized) ||
        alpha2Normalized.includes(normalized)
      )
    })

    return byText.slice(0, 80)
  }, [options, output, query])

  const formatOptionValue = (option: CountryOption) => {
    if (output === 'name_en') {
      return `${option.englishLabel}`.trim()
    }

    const flag = toFlagEmoji(option.alpha2)
    return `${flag} ${option.label} (${option.value})`.trim()
  }

  const selectOption = (option: CountryOption) => {
    didSelectRef.current = true
    onChange(output === 'name_en' ? option.englishLabel : option.value)
    setQuery(formatOptionValue(option))
    setIsOpen(false)
    setIsFocused(false)
    inputRef.current?.blur()
  }

  const resolveFromQuery = () => {
    const trimmed = query.trim()
    if (!trimmed) {
      onChange('')
      return
    }

    const match = findCountryOption(trimmed, options)
    if (match) {
      onChange(output === 'name_en' ? match.englishLabel : match.value)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <input
        id={inputId}
        ref={inputRef}
        value={query}
        disabled={isDisabled}
        placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true)
          setIsOpen(true)
          setQuery('')
          queueMicrotask(() => inputRef.current?.select())
        }}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            setIsOpen(false)
            setIsFocused(false)
            inputRef.current?.blur()
            return
          }

          if (event.key === 'Enter') {
            event.preventDefault()
            resolveFromQuery()
            setIsOpen(false)
            setIsFocused(false)
            inputRef.current?.blur()
          }
        }}
        onBlur={() => {
          if (didSelectRef.current) {
            didSelectRef.current = false
            return
          }

          resolveFromQuery()
          setIsOpen(false)
          setIsFocused(false)
        }}
        className={`home-search-input w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none ${
          hasError ? 'ring-1 ring-inset ring-red-400/50' : ''
        }`.trim()}
      />

      {isOpen ? (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-white/18 bg-slate-950/95 p-1 text-sm text-slate-100 shadow-xl backdrop-blur">
          <div className="max-h-64 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-slate-300">{locale === 'es' ? 'Sin resultados' : 'No results'}</div>
            ) : null}
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/10"
                onMouseDown={(event) => {
                  event.preventDefault()
                  selectOption(option)
                }}
              >
                <span className="truncate">
                  {output === 'name_en' ? option.englishLabel : `${toFlagEmoji(option.alpha2)} ${option.label}`}
                </span>
                {output === 'alpha3' ? (
                  <span className="shrink-0 text-xs font-semibold text-slate-300">{option.value}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
