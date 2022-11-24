import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createHashHistory, ReactLocation } from '@tanstack/react-location'
import { Routes } from '@/components/generouted/react-location'

const location = new ReactLocation({ history: createHashHistory() })

function Client() {
  return (
    <StrictMode>
      <Routes location={location} />
    </StrictMode>
  )
}

const app = document.getElementById('app')!
const root = createRoot(app)

if (app.hasChildNodes()) hydrateRoot(app, <Client />)
else root.render(<Client />)
