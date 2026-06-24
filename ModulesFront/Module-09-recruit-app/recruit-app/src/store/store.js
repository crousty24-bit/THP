import { createStore } from 'redux'
import rootReducer from '../reducers/rootReducer'

const STORAGE_KEY = 'recruit-app-profile-state'

function getEmptyState() {
  return rootReducer(undefined, { type: '@@INIT' })
}

function normalizeStoredState(storedState) {
  const emptyState = getEmptyState()

  if (!storedState || typeof storedState !== 'object') {
    return emptyState
  }

  const firstName = String(storedState.user?.firstName || '').trim()
  const lastName = String(storedState.user?.lastName || '').trim()
  const skills = Array.isArray(storedState.skills?.skills)
    ? storedState.skills.skills.map((skill) => String(skill).trim()).filter(Boolean)
    : []

  return {
    user: {
      firstName,
      lastName,
      fullName: firstName && lastName ? `${firstName} ${lastName}` : null,
    },
    skills: {
      skills,
      skillsCount: skills.length,
    },
  }
}

function loadPersistedState() {
  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY)
    return rawState ? normalizeStoredState(JSON.parse(rawState)) : getEmptyState()
  } catch {
    return getEmptyState()
  }
}

const store = createStore(rootReducer, loadPersistedState())

store.subscribe(() => {
  const { user, skills } = store.getState()

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
        skills: {
          skills: skills.skills,
        },
      }),
    )
  } catch {
    // Local storage can be unavailable in private or restricted browser contexts.
  }
})

export { STORAGE_KEY }
export default store
