import { Provider as JotaiProvider } from 'jotai'
import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <JotaiProvider>
      {children}
      <Toaster richColors position="top-center" />
    </JotaiProvider>
  )
}
