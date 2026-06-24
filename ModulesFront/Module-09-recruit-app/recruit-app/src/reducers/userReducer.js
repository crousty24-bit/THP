const initialState = {
  firstName: '',
  lastName: '',
  fullName: null,
}

function buildFullName(firstName, lastName) {
  return firstName && lastName ? `${firstName} ${lastName}` : null
}

function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_USER_PROFILE': {
      const firstName = String(action.payload?.firstName || '').trim()
      const lastName = String(action.payload?.lastName || '').trim()

      return {
        firstName,
        lastName,
        fullName: buildFullName(firstName, lastName),
      }
    }

    default:
      return state
  }
}

export default userReducer
