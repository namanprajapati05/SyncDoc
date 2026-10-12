import { useState } from 'react'
import api from '../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const { data } = await api.post('/user/login', { email, password })
      localStorage.setItem('syncdoc-access-token', data.data.accessToken)
      window.location.href = '/dashboard'
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="login-title">
        <div className="signup-heading">
          <span className="signup-mark" aria-hidden="true">S</span>
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Log in to SyncDoc</h1>
          <p className="signup-subtitle">Continue working on the documents your team trusts.</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email Address</span>
            <input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="signup-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="login-prompt">New to SyncDoc? <a href="/signup">Create an account</a></p>
      </section>
    </main>
  )
}

export default Login
