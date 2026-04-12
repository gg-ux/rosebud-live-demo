import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { PasswordGate } from './components/PasswordGate.jsx'
import App from './App.jsx'

const DesignSystem = lazy(() => import('./pages/DesignSystem.jsx').then(m => ({ default: m.DesignSystem })))
const Concepts = lazy(() => import('./pages/Concepts.jsx').then(m => ({ default: m.Concepts })))
const Presentation = lazy(() => import('./pages/Presentation.jsx').then(m => ({ default: m.Presentation })))

function Root() {
  return (
    <PasswordGate>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            {/* Patterns is the new landing page. /patterns is the
                renamed canonical slug (was /concepts before this
                refactor); both / and /patterns serve the same page so
                "Patterns" in the top nav and direct /patterns links
                both work. */}
            <Route path="/" element={<Concepts />} />
            <Route path="/patterns" element={<Concepts />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/therapist" element={<App />} />
            <Route path="/presentation" element={<Presentation />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </PasswordGate>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
