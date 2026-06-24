import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Home() {
  const fullName = useSelector((state) => state.user.fullName)
  const skills = useSelector((state) => state.skills.skills)

  return (
    <main className="page-shell home-page">
      <section className="hero-panel" aria-labelledby="home-title">
        <p className="section-label">Profil candidat</p>
        <h1 id="home-title">Bienvenue{fullName ? ` ${fullName}` : ''} !</h1>

        {skills.length > 0 ? (
          <>
            <p className="page-intro">
              Vos compétences sont synchronisées avec le state global Redux.
            </p>

            <div className="skills-block" aria-labelledby="skills-title">
              <h2 id="skills-title">Vos compétences</h2>
              <ul className="skills-list">
                {skills.map((skill) => (
                  <li key={skill}>
                    <span aria-hidden="true">#</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <Link className="text-action" to="/profile">
              Modifier mes compétences
            </Link>
          </>
        ) : (
          <p className="empty-message">
            Veuillez remplir <Link to="/profile">votre profil</Link> pour continuer.
          </p>
        )}
      </section>
    </main>
  )
}

export default Home
