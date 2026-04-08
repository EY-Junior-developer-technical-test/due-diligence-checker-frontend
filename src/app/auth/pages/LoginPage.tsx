import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AuthFrame } from '../components/AuthFrame'
import { ApiError } from '../../shared/services/ApiError'
import { authService } from '../services/AuthService'
import { setAuthSession } from '../services/authStorage'

export function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const session = await authService.signIn({ email, password })
      setAuthSession(session)
      navigate('/home')
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(t('errors.unexpected'))
      setErrorMessage(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFrame
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      ctaDescription={t('login.ctaDescription')}
      ctaLabel={t('login.ctaLabel')}
      ctaPath="/register"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            {t('login.emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="auth-input"
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="password"
          >
            {t('login.passwordLabel')}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="pt-2">
          <button
            type="submit"
            className="auth-button w-full px-5 py-2.5 text-sm font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('login.submitting') : t('login.submit')}
          </button>
        </div>
      </form>
    </AuthFrame>
  )
}
