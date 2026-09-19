import { useState } from 'react'

const UserIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<circle cx="12" cy="8" r="3.5" />
		<path d="M5 20c.7-3.1 3.1-5 7-5s6.3 1.9 7 5" />
	</svg>
)

const MailIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<path d="m4 7 8 6 8-6" />
	</svg>
)

const LockIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<rect x="5" y="10" width="14" height="11" rx="2" />
		<path d="M8 10V7a4 4 0 0 1 8 0v3" />
	</svg>
)

const Signup = () => {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const passwordsMatch = !confirmPassword || password === confirmPassword

	return (
		<main className="signup-page">
			<section className="signup-card" aria-labelledby="signup-title">
				<div className="signup-heading">
					<span className="signup-mark" aria-hidden="true">+</span>
					<p className="eyebrow">Welcome to SyncDoc</p>
					<h1 id="signup-title">Create your account</h1>
					<p className="signup-subtitle">Start organizing and syncing your documents today.</p>
				</div>

				<form className="signup-form">
					<label className="form-field">
						<span>Full Name</span>
						<span className="input-wrap">
							<UserIcon />
							<input type="text" name="name" placeholder="Enter your full name" autoComplete="name" required />
						</span>
					</label>

					<label className="form-field">
						<span>Email Address</span>
						<span className="input-wrap">
							<MailIcon />
							<input type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
						</span>
					</label>

					<label className="form-field">
						<span>Password</span>
						<span className="input-wrap">
							<LockIcon />
							<input
								type="password"
								name="password"
								placeholder="Create a password"
								autoComplete="new-password"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</span>
					</label>

					<label className="form-field">
						<span>Confirm Password</span>
						<span className={`input-wrap${passwordsMatch ? '' : ' has-error'}`}>
							<LockIcon />
							<input
								type="password"
								name="confirmPassword"
								placeholder="Re-enter your password"
								autoComplete="new-password"
								required
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
							/>
						</span>
						{!passwordsMatch && <small className="field-error">Passwords do not match.</small>}
					</label>

					<button type="submit" className="signup-submit" disabled={!passwordsMatch}>
						Create Account
					</button>
				</form>

				<p className="login-prompt">
					Already have an account? <a href="/login">Login</a>
				</p>
			</section>
		</main>
	)
}

export default Signup