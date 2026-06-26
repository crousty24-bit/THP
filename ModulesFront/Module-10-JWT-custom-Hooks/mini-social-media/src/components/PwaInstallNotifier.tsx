import { Download } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { usePwaInstallDispatch, usePwaInstallState } from '@/store/hooks'

import type { BeforeInstallPromptEvent, PwaInstallState } from '@/types'

type InstallTrigger = {
  count: number
  message: string
  trigger: 'page' | 'post'
}

function isAppRunningStandalone() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  )
}

function getInstallTrigger(state: PwaInstallState): InstallTrigger | null {
  const shouldPromptForPages =
    state.pageViews >= 3 &&
    (state.pageViews - 3) % 2 === 0 &&
    state.lastPagePromptAt !== state.pageViews

  if (shouldPromptForPages) {
    return {
      count: state.pageViews,
      trigger: 'page',
      message: 'Zgen can be installed for faster access from this device.',
    }
  }

  const shouldPromptForPosts =
    state.activeUserPostCount > 0 &&
    state.activeUserPostCount % 4 === 0 &&
    state.lastPostPromptAt !== state.activeUserPostCount

  if (shouldPromptForPosts) {
    return {
      count: state.activeUserPostCount,
      trigger: 'post',
      message: 'You are posting regularly. Install Zgen to open it like an app.',
    }
  }

  return null
}

export function PwaInstallNotifier() {
  const location = useLocation()
  const installPromptRef = useRef<BeforeInstallPromptEvent | null>(null)
  const visitedLocationRef = useRef<string | null>(null)
  const dispatchPwaInstall = usePwaInstallDispatch()
  const pwaInstallState = usePwaInstallState()

  useEffect(() => {
    if (isAppRunningStandalone()) {
      dispatchPwaInstall({ type: 'PWA_INSTALLED' })
    }
  }, [dispatchPwaInstall])

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      installPromptRef.current = event as BeforeInstallPromptEvent
      dispatchPwaInstall({ type: 'PWA_INSTALL_AVAILABLE' })
    }

    function handleAppInstalled() {
      installPromptRef.current = null
      dispatchPwaInstall({ type: 'PWA_INSTALLED' })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [dispatchPwaInstall])

  useEffect(() => {
    const locationKey = `${location.pathname}${location.search}${location.hash}`

    if (visitedLocationRef.current === locationKey) {
      return
    }

    visitedLocationRef.current = locationKey
    dispatchPwaInstall({ type: 'PWA_PAGE_VISITED' })
  }, [dispatchPwaInstall, location.hash, location.pathname, location.search])

  useEffect(() => {
    if (
      pwaInstallState.isInstalled ||
      !pwaInstallState.isInstallable ||
      pwaInstallState.isNotificationVisible
    ) {
      return
    }

    const installTrigger = getInstallTrigger(pwaInstallState)

    if (!installTrigger) {
      return
    }

    dispatchPwaInstall({
      type: 'PWA_NOTIFICATION_SHOWN',
      payload: { count: installTrigger.count, trigger: installTrigger.trigger },
    })

    toast.custom(
      (toastId) => (
        <div className="flex w-[min(92vw,360px)] flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-2xl">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Download aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Install Zgen</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {installTrigger.message}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                dispatchPwaInstall({ type: 'PWA_NOTIFICATION_DISMISSED' })
                toast.dismiss(toastId)
              }}
            >
              Not now
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const installPrompt = installPromptRef.current

                if (!installPrompt) {
                  dispatchPwaInstall({ type: 'PWA_INSTALL_PROMPT_USED' })
                  toast.dismiss(toastId)
                  return
                }

                installPromptRef.current = null
                dispatchPwaInstall({ type: 'PWA_INSTALL_PROMPT_USED' })
                toast.dismiss(toastId)
                void installPrompt.prompt()
              }}
            >
              Install
            </Button>
          </div>
        </div>
      ),
      {
        closeButton: true,
        duration: 12000,
        onAutoClose: () => dispatchPwaInstall({ type: 'PWA_NOTIFICATION_DISMISSED' }),
        onDismiss: () => dispatchPwaInstall({ type: 'PWA_NOTIFICATION_DISMISSED' }),
      },
    )
  }, [dispatchPwaInstall, pwaInstallState])

  return null
}
