import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './Index'
import App from './App'
import Testing from './Testing'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index />
    {/* <App /> */}
    {/* <Testing /> */}
  </StrictMode>,
)
