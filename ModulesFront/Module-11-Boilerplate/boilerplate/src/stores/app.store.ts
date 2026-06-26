import { atom } from 'jotai'

export type ThemePreference = 'system' | 'light' | 'dark'

export const themePreferenceAtom = atom<ThemePreference>('system')
