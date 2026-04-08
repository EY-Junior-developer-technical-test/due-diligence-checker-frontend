import { Link } from 'react-router-dom'

import { AuthFrame } from '../components/AuthFrame'

export function RegisterPage() {
  return (
    <AuthFrame
      title="Create Account"
      subtitle="Configura tu acceso para iniciar evaluaciones de due diligence."
      ctaDescription="¿Ya tienes cuenta?"
      ctaLabel="Iniciar sesión"
      ctaPath="/login"
    >
      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className="auth-input"
            placeholder="Jane Miller"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="registerEmail">
            Email
          </label>
          <input
            id="registerEmail"
            type="email"
            autoComplete="email"
            className="auth-input"
            placeholder="jane.miller@company.com"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="registerPassword"
          >
            Contraseña
          </label>
          <input
            id="registerPassword"
            type="password"
            autoComplete="new-password"
            className="auth-input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="button"
          className="auth-button w-full px-5 py-2.5 text-sm font-semibold"
        >
          Crear cuenta (demo)
        </button>

        <p className="text-xs text-slate-500">
          El registro aún no está conectado a API. Esta vista es visual.
        </p>

        <Link className="inline-block text-sm text-slate-700 underline" to="/login">
          Volver a login
        </Link>
      </form>
    </AuthFrame>
  )
}
