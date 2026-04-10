import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthFrame } from '../components/AuthFrame'
import { ApiError } from '../../shared/services/ApiError'
import { authService } from '../services/AuthService'

export function RegisterPage() {
  const { t } = useTranslation('auth')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const response = await authService.signUp({ fullname, email, password })
      setSuccessMessage(response.message)
      setFullname('')
      setEmail('')
      setPassword('')
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(t('errors.unexpected'))
      setErrorMessage(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthFrame
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      ctaDescription={t('register.ctaDescription')}
      ctaLabel={t('register.ctaLabel')}
      ctaPath="/login"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="auth-label" htmlFor="fullName">
            {t('register.fullnameLabel')}
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className="auth-input"
            placeholder={t('register.fullnamePlaceholder')}
            value={fullname}
            onChange={(event) => setFullname(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="auth-label" htmlFor="registerEmail">
            {t('register.emailLabel')}
          </label>
          <input
            id="registerEmail"
            type="email"
            autoComplete="email"
            className="auth-input"
            placeholder={t('register.emailPlaceholder')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="auth-label" htmlFor="registerPassword">
            {t('register.passwordLabel')}
          </label>
          <input
            id="registerPassword"
            type="password"
            autoComplete="new-password"
            className="auth-input"
            placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {successMessage ? (
          <p className="auth-alert-success rounded-lg px-3 py-2 text-sm">{successMessage}</p>
        ) : null}

        {errorMessage ? (
          <p className="auth-alert-error rounded-lg px-3 py-2 text-sm">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          className="auth-button w-full px-5 py-2.5 text-sm font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('register.submitting') : t('register.submit')}
        </button>
      </form>
    </AuthFrame>
  )
}
