import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './Index'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index />
    {/* <App /> */}
  </StrictMode>,
)
