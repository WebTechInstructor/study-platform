import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ContentProvider } from './context/ContentContext.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'
import App from './App.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContentProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </ContentProvider>
  </StrictMode>
)
