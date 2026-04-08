import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import eyLogo from '../../../assets/EY_logo_Ernst_and_Young-686x705.png'
import { LanguageSwitch } from '../../shared/components/LanguageSwitch'

type AuthFrameProps = {
  title: string
  subtitle: string
  ctaLabel: string
  ctaPath: string
  ctaDescription: string
  children: ReactNode
}

export function AuthFrame({
  title,
  subtitle,
  ctaLabel,
  ctaPath,
  ctaDescription,
  children,
}: AuthFrameProps) {
  const { i18n } = useTranslation('auth')
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  const setLanguage = async (language: 'es' | 'en') => {
    await i18n.changeLanguage(language)
    localStorage.setItem('ddc.lang', language)
  }

  return (
    <main className="auth-stage px-4 py-6 sm:px-6 sm:py-8">
      <div className="absolute right-4 top-4 z-30 sm:right-6 sm:top-6">
        <LanguageSwitch
          value={currentLanguage}
          options={[
            { value: 'es', label: 'ES' },
            { value: 'en', label: 'EN' },
          ]}
          onChange={(language) => {
            void setLanguage(language as 'es' | 'en')
          }}
        />
      </div>

      <section className="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl auth-shell reveal-up">
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,230,0,0.42)_0%,rgba(255,230,0,0)_70%)]" />

        <div className="relative bg-white/70 p-6 sm:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
              <p className="text-sm leading-relaxed text-slate-600">{subtitle}</p>
              <div className="ey-line" />
            </div>

            <img
              src={eyLogo}
              alt="EY"
              className="h-10 w-10 shrink-0 rounded-md object-contain opacity-80"
            />
          </div>

          {children}

          <p className="mt-6 text-sm text-slate-600">
            {ctaDescription}{' '}
            <Link
              className="font-semibold text-slate-900 underline decoration-[var(--ey-yellow)] underline-offset-4"
              to={ctaPath}
            >
              {ctaLabel}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
