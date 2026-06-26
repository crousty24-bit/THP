import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'jotai'
import './index.css'
import App from './App.tsx'

document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const baseUrl = new URL(import.meta.env.BASE_URL, window.location.href)
    const serviceWorkerUrl = new URL('sw.js', baseUrl)

    void navigator.serviceWorker.register(serviceWorkerUrl, {
      scope: baseUrl.pathname,
    })
  })
}
