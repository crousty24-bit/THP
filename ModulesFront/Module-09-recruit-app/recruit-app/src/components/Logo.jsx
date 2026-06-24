import { Link } from 'react-router-dom'

function Logo() {
  return (
    <Link className="brand-logo" to="/" aria-label="Accueil Recruit App">
      <span className="brand-logo__mark" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span className="brand-logo__text">Recruit</span>
    </Link>
  )
}

export default Logo
