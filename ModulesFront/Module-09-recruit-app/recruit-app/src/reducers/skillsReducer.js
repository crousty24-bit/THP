const initialState = {
  skills: [],
  skillsCount: 0,
}

function skillsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_SKILLS': {
      const skills = Array.isArray(action.payload)
        ? action.payload.map((skill) => String(skill).trim()).filter(Boolean)
        : []

      return {
        skills,
        skillsCount: skills.length,
      }
    }

    default:
      return state
  }
}

export default skillsReducer
