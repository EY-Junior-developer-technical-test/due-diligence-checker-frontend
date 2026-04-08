import { useNavigate } from 'react-router-dom'

import { clearAuthToken } from '../../auth/services/authStorage'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <main style={{ padding: 24, textAlign: 'left' }}>
      <h1>Home</h1>
      <p>Pantalla plana (placeholder).</p>

      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => {
            clearAuthToken()
            navigate('/login')
          }}
        >
          Logout
        </button>
      </div>
    </main>
  )
}
