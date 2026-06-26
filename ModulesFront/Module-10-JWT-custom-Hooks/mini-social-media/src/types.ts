export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export type UserProfile = {
  id: number
  username: string
  email?: string
  description?: string | null
  provider?: string
  confirmed?: boolean
  blocked?: boolean
  createdAt?: string
  updatedAt?: string
}

export type AuthPayload = {
  accessToken: string
  user: UserProfile
}

export type Post = {
  id: number
  text: string
  like: number
  modified: boolean
  createdAt: string
  updatedAt: string
  author: UserProfile | null
  likedUserIds: number[]
}

export type LocalComment = {
  id: string
  postId: number
  parentId: string | null
  text: string
  like: number
  createdAt: string
  updatedAt: string
  author: UserProfile
  likedUserIds: number[]
}

export type AuthState = {
  accessToken: string | null
  user: UserProfile | null
  status: RequestStatus
  error: string | null
}

export type PostsState = {
  items: Post[]
  status: RequestStatus
  error: string | null
  pendingIds: number[]
}

export type CommentsState = {
  items: LocalComment[]
}

export type PwaInstallState = {
  pageViews: number
  activeUserPostCount: number
  lastPagePromptAt: number
  lastPostPromptAt: number
  isInstallable: boolean
  isInstalled: boolean
  isNotificationVisible: boolean
}

export type BeforeInstallPromptEvent = Event & {
  platforms?: string[]
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed'; platform: string } | void>
}
