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
      <div className="absolute left-4 top-4 z-30 sm:left-6 sm:top-6">
        <span className="auth-meta-pill">Forensic Session</span>
      </div>

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
        <div className="forensic-light-ribbons" />

        <div className="relative p-3 sm:p-4">
          <div className="auth-panel p-6 sm:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="auth-title">
                {title}
              </h1>
              <p className="auth-subtitle text-sm">{subtitle}</p>
              <div className="ey-line" />
            </div>

            <div className="auth-logo-wrap">
              <img
                src={eyLogo}
                alt="EY"
                className="h-10 w-10 shrink-0 rounded-md object-contain opacity-90"
              />
            </div>
          </div>

          {children}

          <p className="auth-link-line mt-6 text-sm">
            {ctaDescription}{' '}
            <Link
              className="font-semibold text-slate-100 underline decoration-[var(--ey-yellow)] underline-offset-4"
              to={ctaPath}
            >
              {ctaLabel}
            </Link>
          </p>
          </div>
        </div>
      </section>
    </main>
  )
}
