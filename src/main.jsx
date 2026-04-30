import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import { PasswordGate } from './components/PasswordGate.jsx'
import { Layout } from './components/Layout.jsx'
import App from './App.jsx'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx').then(m => ({ default: m.Dashboard })))
const DesignSystem = lazy(() => import('./pages/DesignSystem.jsx').then(m => ({ default: m.DesignSystem })))
const Concepts = lazy(() => import('./pages/Concepts.jsx').then(m => ({ default: m.Concepts })))
const Presentation = lazy(() => import('./pages/Presentation.jsx').then(m => ({ default: m.Presentation })))
const ToolCalls = lazy(() => import('./pages/ToolCalls.jsx').then(m => ({ default: m.ToolCalls })))
const LivingDesignSystem = lazy(() => import('./pages/LivingDesignSystem.jsx').then(m => ({ default: m.LivingDesignSystem })))
const LivingDesignSystemPresentation = lazy(() => import('./pages/LivingDesignSystemPresentation.jsx').then(m => ({ default: m.LivingDesignSystemPresentation })))

function AppRoutes() {
  const { pathname } = useLocation();
  // Presentations are full-screen; skip the Layout chrome there.
  if (pathname === '/presentation' || pathname === '/living-design-system/present') {
    return (
      <Suspense fallback={null}>
        <Routes>
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/living-design-system/present" element={<LivingDesignSystemPresentation />} />
        </Routes>
      </Suspense>
    );
  }
  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patterns" element={<Concepts />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/therapist" element={<App />} />
          <Route path="/tool-calls" element={<ToolCalls />} />
          <Route path="/living-design-system" element={<LivingDesignSystem />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

function Root() {
  return (
    <PasswordGate>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PasswordGate>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
