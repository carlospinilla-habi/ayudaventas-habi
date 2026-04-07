import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './DashboardLoginPage.css'

export function DashboardLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas')
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="dash-login">
      <form className="dash-login__card" onSubmit={handleSubmit}>
        <div className="dash-login__logo">
          <div className="dash-login__logo-icon">
            <img src="/2bc36bdde701d513cede283c7a15271c0c1b36bf.svg" alt="Habi" />
          </div>
          <span className="dash-login__logo-text">
            Ayuda<span>ventas</span>
          </span>
        </div>

        <h1 className="dash-login__title">Dashboard</h1>
        <p className="dash-login__subtitle">Ingresa tus credenciales para acceder</p>

        {error && <div className="dash-login__error">{error}</div>}

        <div className="dash-login__field">
          <label className="dash-login__label" htmlFor="email">Email</label>
          <input
            id="email"
            className="dash-login__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ayudaventas.co"
            required
          />
        </div>

        <div className="dash-login__field">
          <label className="dash-login__label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="dash-login__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="dash-login__btn" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
