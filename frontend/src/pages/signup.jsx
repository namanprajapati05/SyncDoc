import { useState } from 'react'
import api from '../services/api'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await api.post('/user/signup', { name, email, password })
      window.location.href = '/login?created=1'
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="signup-title">
        <div className="signup-heading">
          <span className="signup-mark" aria-hidden="true">+</span>
          <p className="eyebrow">Welcome to SyncDoc</p>
          <h1 id="signup-title">Create your account</h1>
          <p className="signup-subtitle">Start organizing and syncing your documents today.</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Full Name</span>
            <input type="text" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="form-field">
            <span>Email Address</span>
            <input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input type="password" name="password" autoComplete="new-password" required minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="signup-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="login-prompt">Already have an account? <a href="/login">Login</a></p>
      </section>
    </main>
  )
}

export default Signup
