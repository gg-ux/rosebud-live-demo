import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import { PasswordGate } from './components/PasswordGate.jsx'
import { Layout } from './components/Layout.jsx'
import App from './App.jsx'
import chakraTheme from './theme/index.js'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx').then(m => ({ default: m.Dashboard })))
const DesignSystem = lazy(() => import('./pages/DesignSystem.jsx').then(m => ({ default: m.DesignSystem })))
const DesignSystemWeb = lazy(() => import('./pages/DesignSystemWeb.jsx').then(m => ({ default: m.DesignSystemWeb })))
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
          <Route path="/design-system-web" element={<DesignSystemWeb />} />
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
      {/* Chakra is scoped: resetCSS=false + disableGlobalStyle=true keep existing
          Tailwind pages untouched. Chakra components rendered inside their own
          subtree pick up the theme tokens (brand.500, bg, text, etc.). */}
      <ChakraProvider theme={chakraTheme} resetCSS={false} disableGlobalStyle>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ChakraProvider>
    </PasswordGate>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
