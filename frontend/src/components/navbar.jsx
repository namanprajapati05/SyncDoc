import { useState } from 'react'
import './navbar.css'

const HomeIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />
	</svg>
)

const DocumentIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M6 2h8l4 4v16H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
		<path d="M14 2v5h5M8 12h8M8 16h6" />
	</svg>
)

const MenuIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M4 6h16M4 12h16M4 18h16" />
	</svg>
)

const CloseIcon = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="m6 6 12 12M18 6 6 18" />
	</svg>
)

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const currentPath = window.location.pathname

	const closeMenu = () => setIsMenuOpen(false)

	return (
		<header className="site-header">
			<nav className="navbar" aria-label="Main navigation">
				<a href="/" className="navbar-brand" onClick={closeMenu}>
					<span className="brand-icon"><DocumentIcon /></span>
					<span>SyncDoc</span>
				</a>

				<button
					type="button"
					className="menu-toggle"
					aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
					aria-expanded={isMenuOpen}
					onClick={() => setIsMenuOpen((open) => !open)}
				>
					{isMenuOpen ? <CloseIcon /> : <MenuIcon />}
				</button>

				<div className={`navbar-content${isMenuOpen ? ' is-open' : ''}`}>
					<div className="navbar-links">
						<a href="/" className={`navbar-link${currentPath === '/' ? ' active' : ''}`} onClick={closeMenu}>
							<HomeIcon />
							<span>Home</span>
						</a>
						<a href="/features" className="navbar-link" onClick={closeMenu}>Features</a>
						<a href="/pricing" className="navbar-link" onClick={closeMenu}>Pricing</a>
						<a href="/about" className="navbar-link" onClick={closeMenu}>About</a>
					</div>

					<div className="navbar-actions">
						<a href="/login" className="navbar-button login-button" onClick={closeMenu}>Login</a>
						<a href="/signup" className="navbar-button primary-button" onClick={closeMenu}>Get Started</a>
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Navbar
