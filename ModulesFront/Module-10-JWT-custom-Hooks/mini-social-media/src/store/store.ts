import { createStore } from 'redux'

import { rootReducer } from '@/store/rootReducer'

import type { RootState } from '@/store/rootReducer'

function getInitialState() {
  return rootReducer(undefined, { type: '@@INIT' })
}

export const store = createStore(rootReducer, getInitialState())

export type AppDispatch = typeof store.dispatch
export type { RootState }
