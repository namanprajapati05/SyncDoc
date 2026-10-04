import { useState } from 'react'

const MailIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
const LockIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const created = new URLSearchParams(window.location.search).get('created') === '1'

	const handleSubmit = (event) => {
		event.preventDefault()
		const savedUser = JSON.parse(localStorage.getItem('syncdoc-user') || 'null')
		if (!savedUser || savedUser.email !== email.trim().toLowerCase() || savedUser.password !== password) {
			setError('Those details do not match a SyncDoc account.')
			return
		}
		localStorage.setItem('syncdoc-session', JSON.stringify({ email: savedUser.email, name: savedUser.name }))
		window.location.href = '/'
	}

	return <main className="signup-page"><section className="signup-card" aria-labelledby="login-title"><div className="signup-heading"><span className="signup-mark" aria-hidden="true">S</span><p className="eyebrow">Welcome back</p><h1 id="login-title">Log in to SyncDoc</h1><p className="signup-subtitle">Continue working on the documents your team trusts.</p></div><form className="signup-form" onSubmit={handleSubmit}><label className="form-field"><span>Email Address</span><span className="input-wrap"><MailIcon /><input type="email" name="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></span></label><label className="form-field"><span>Password</span><span className="input-wrap"><LockIcon /><input type="password" name="password" placeholder="Enter your password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></span></label>{created && <p className="form-success" role="status">Account created. You can log in now.</p>}{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="signup-submit">Log In</button></form><p className="login-prompt">New to SyncDoc? <a href="/signup">Create an account</a></p></section></main>
}

export default Login