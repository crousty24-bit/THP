import type { PwaInstallState } from '@/types'

export type PwaInstallAction =
  | { type: 'PWA_INSTALL_AVAILABLE' }
  | { type: 'PWA_INSTALL_PROMPT_USED' }
  | { type: 'PWA_INSTALLED' }
  | { type: 'PWA_PAGE_VISITED' }
  | { type: 'PWA_ACTIVE_USER_POST_CREATED' }
  | { type: 'PWA_NOTIFICATION_SHOWN'; payload: { trigger: 'page' | 'post'; count: number } }
  | { type: 'PWA_NOTIFICATION_DISMISSED' }

export const initialPwaInstallState: PwaInstallState = {
  pageViews: 0,
  activeUserPostCount: 0,
  lastPagePromptAt: 0,
  lastPostPromptAt: 0,
  isInstallable: false,
  isInstalled: false,
  isNotificationVisible: false,
}

export function pwaInstallReducer(
  state = initialPwaInstallState,
  action: PwaInstallAction,
): PwaInstallState {
  switch (action.type) {
    case 'PWA_INSTALL_AVAILABLE':
      return state.isInstalled ? state : { ...state, isInstallable: true }
    case 'PWA_INSTALL_PROMPT_USED':
      return { ...state, isInstallable: false, isNotificationVisible: false }
    case 'PWA_INSTALLED':
      return { ...state, isInstallable: false, isInstalled: true, isNotificationVisible: false }
    case 'PWA_PAGE_VISITED':
      return { ...state, pageViews: state.pageViews + 1 }
    case 'PWA_ACTIVE_USER_POST_CREATED':
      return { ...state, activeUserPostCount: state.activeUserPostCount + 1 }
    case 'PWA_NOTIFICATION_SHOWN': {
      const pagePromptIsDue = state.pageViews >= 3 && (state.pageViews - 3) % 2 === 0
      const postPromptIsDue =
        state.activeUserPostCount > 0 && state.activeUserPostCount % 4 === 0

      return {
        ...state,
        isNotificationVisible: true,
        lastPagePromptAt: pagePromptIsDue ? state.pageViews : state.lastPagePromptAt,
        lastPostPromptAt: postPromptIsDue
          ? state.activeUserPostCount
          : state.lastPostPromptAt,
      }
    }
    case 'PWA_NOTIFICATION_DISMISSED':
      return { ...state, isNotificationVisible: false }
    default:
      return state
  }
}
