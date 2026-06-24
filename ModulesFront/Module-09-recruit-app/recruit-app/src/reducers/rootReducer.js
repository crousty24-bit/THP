import { combineReducers } from 'redux'
import skillsReducer from './skillsReducer'
import userReducer from './userReducer'

const rootReducer = combineReducers({
  user: userReducer,
  skills: skillsReducer,
})

export default rootReducer
