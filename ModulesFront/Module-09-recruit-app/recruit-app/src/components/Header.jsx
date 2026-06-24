import { NavLink } from 'react-router-dom'
import Logo from './Logo'
import UserName from './UserName'

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Logo />

        <nav className="main-nav" aria-label="Navigation principale">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Accueil
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Mon profil
          </NavLink>
        </nav>

        <UserName />
      </div>
    </header>
  )
}

export default Header
