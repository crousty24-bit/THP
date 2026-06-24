import { useSelector } from 'react-redux'

function getSkillsLabel(skillsCount) {
  if (skillsCount === 0) {
    return 'Aucune compétence'
  }

  return skillsCount === 1 ? '1 compétence' : `${skillsCount} compétences`
}

function UserName() {
  const fullName = useSelector((state) => state.user.fullName)
  const skillsCount = useSelector((state) => state.skills.skillsCount)

  return (
    <div className="user-summary" aria-label="Profil courant">
      <strong>{fullName || 'Inconnu'}</strong>
      <span>{getSkillsLabel(skillsCount)}</span>
    </div>
  )
}

export default UserName
