import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { PageWrapper } from './components/PageWrapper'
import { WebMCP } from './webmcp/WebMCP'

import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PageWrapper />
    <WebMCP />
  </StrictMode>,
)
