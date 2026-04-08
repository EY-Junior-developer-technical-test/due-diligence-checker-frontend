import { useNavigate } from 'react-router-dom'

import { clearAuthSession } from '../../auth/services/authStorage'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto w-full max-w-md space-y-4 text-left">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-sm text-slate-600">Pantalla plana (placeholder).</p>

        <button
          type="button"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
          onClick={() => {
            clearAuthSession()
            navigate('/login')
          }}
        >
          Logout
        </button>
      </div>
    </main>
  )
}
