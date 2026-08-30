import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpacedRepetitionProvider } from './spacedRepetition/SpacedRepetitionContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpacedRepetitionProvider>
      <App />
    </SpacedRepetitionProvider>
  </StrictMode>,
)
