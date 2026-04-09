import { StrictMode, useState, useCallback, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Loader } from './components/Loader.jsx'
import App from './App.jsx'

const DesignSystem = lazy(() => import('./pages/DesignSystem.jsx').then(m => ({ default: m.DesignSystem })))
const Concepts = lazy(() => import('./pages/Concepts.jsx').then(m => ({ default: m.Concepts })))

function Root() {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <Loader minDuration={1400} onComplete={handleComplete} />}
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/concepts" element={<Concepts />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
