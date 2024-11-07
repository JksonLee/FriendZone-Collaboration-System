import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './Index'
import Login from './Page/Login'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index />
  </StrictMode>,
)
