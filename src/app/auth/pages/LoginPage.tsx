import { Link, useNavigate } from 'react-router-dom'

import { setAuthToken } from '../services/authStorage'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <main style={{ padding: 24, textAlign: 'left' }}>
      <h1>Login</h1>
      <p>Pantalla plana (placeholder).</p>

      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <button
          type="button"
          onClick={() => {
            setAuthToken('dev-token')
            navigate('/home')
          }}
        >
          Entrar
        </button>

        <Link to="/register">Ir a register</Link>
      </div>
    </main>
  )
}
