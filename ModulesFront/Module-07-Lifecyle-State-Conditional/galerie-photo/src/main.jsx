import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function loadRuntimeConfig() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = './unsplash-config.js'
    script.onload = resolve
    script.onerror = resolve
    document.head.append(script)
  })
}

loadRuntimeConfig().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
