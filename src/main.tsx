import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import eyLogo from './assets/EY_logo_Ernst_and_Young-686x705.png'
import './app/shared/infrastructure/i18n'

const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

if (favicon) {
  favicon.type = 'image/png'
  favicon.href = eyLogo
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
