import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Profile() {
  const dispatch = useDispatch()
  const { firstName, lastName } = useSelector((state) => state.user)
  const skills = useSelector((state) => state.skills.skills)
  const [isSaved, setIsSaved] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const nextFirstName = String(formData.get('firstName') || '').trim()
    const nextLastName = String(formData.get('lastName') || '').trim()
    const nextSkills = String(formData.get('skills') || '')
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)

    dispatch({
      type: 'SET_USER_PROFILE',
      payload: {
        firstName: nextFirstName,
        lastName: nextLastName,
      },
    })
    dispatch({
      type: 'SET_SKILLS',
      payload: nextSkills,
    })
    setIsSaved(true)
  }

  return (
    <main className="page-shell profile-page">
      <section className="profile-panel" aria-labelledby="profile-title">
        <p className="section-label">Édition du profil</p>
        <h1 id="profile-title">Mon profil</h1>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Prénom</span>
              <input name="firstName" type="text" defaultValue={firstName} />
            </label>

            <label>
              <span>Nom</span>
              <input name="lastName" type="text" defaultValue={lastName} />
            </label>
          </div>

          <label>
            <span>Compétences</span>
            <input
              name="skills"
              type="text"
              defaultValue={skills.join(', ')}
              placeholder="Vos compétences, séparées par des virgules"
            />
          </label>

          <div className="form-actions">
            <button type="submit">Sauvegarder</button>
            <p className={isSaved ? 'save-status is-visible' : 'save-status'} aria-live="polite">
              Profil mis à jour avec succès.
            </p>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Profile
