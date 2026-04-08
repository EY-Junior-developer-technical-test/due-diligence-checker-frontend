import { Link } from 'react-router-dom'

export function RegisterPage() {
  return (
    <main style={{ padding: 24, textAlign: 'left' }}>
      <h1>Register</h1>
      <p>Pantalla plana (placeholder).</p>

      <div style={{ marginTop: 16 }}>
        <Link to="/login">Volver a login</Link>
      </div>
    </main>
  )
}
