import { useEffect, useState } from 'react'
import api from '../services/api'

const Dashboard = () => {
	const [user, setUser] = useState(null)
	const [error, setError] = useState('')

	useEffect(() => {
		api.get('/user/user')
			.then(({ data }) => setUser(data.data.user))
			.catch(() => {
				localStorage.removeItem('syncdoc-access-token')
				window.location.href = '/login'
			})
	}, [])

	const handleLogout = async () => {
		try {
			await api.get('/user/logout')
		} catch {
			setError('Unable to log out. Please try again.')
			return
		}

		localStorage.removeItem('syncdoc-access-token')
		window.location.href = '/login'
	}

	return (
		<main className="page-content">
			<h1>{user ? `Welcome, ${user.name}` : 'Loading your dashboard...'}</h1>
			<p>Manage your SyncDoc documents from your authenticated workspace.</p>
			{error && <p className="form-error" role="alert">{error}</p>}
			<button type="button" className="signup-submit" onClick={handleLogout}>Log out</button>
		</main>
	)
}

export default Dashboard
