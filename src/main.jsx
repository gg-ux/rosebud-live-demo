import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import { PasswordGate } from './components/PasswordGate.jsx'
import { PrivateRoute } from './components/PrivateRoute.jsx'
import { Layout } from './components/Layout.jsx'
import App from './App.jsx'
import chakraTheme from './theme/index.js'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx').then(m => ({ default: m.Dashboard })))
const DesignSystem = lazy(() => import('./pages/DesignSystem.jsx').then(m => ({ default: m.DesignSystem })))
const DesignSystemWeb = lazy(() => import('./pages/DesignSystemWeb.jsx').then(m => ({ default: m.DesignSystemWeb })))
const DesignSystemWebsite = lazy(() => import('./pages/DesignSystemWebsite.jsx').then(m => ({ default: m.DesignSystemWebsite })))
const Concepts = lazy(() => import('./pages/Concepts.jsx').then(m => ({ default: m.Concepts })))
const Presentation = lazy(() => import('./pages/Presentation.jsx').then(m => ({ default: m.Presentation })))
const ToolCalls = lazy(() => import('./pages/ToolCalls.jsx').then(m => ({ default: m.ToolCalls })))
const LivingDesignSystem = lazy(() => import('./pages/LivingDesignSystem.jsx').then(m => ({ default: m.LivingDesignSystem })))
const LivingDesignSystemPresentation = lazy(() => import('./pages/LivingDesignSystemPresentation.jsx').then(m => ({ default: m.LivingDesignSystemPresentation })))

function AppRoutes() {
  const { pathname } = useLocation();
  // Presentations are full-screen; skip the Layout chrome there.
  // Both presentations are private — wrap in PrivateRoute.
  if (pathname === '/presentation' || pathname === '/living-design-system/present') {
    return (
      <Suspense fallback={null}>
        <Routes>
          <Route path="/presentation" element={<PrivateRoute><Presentation /></PrivateRoute>} />
          <Route path="/living-design-system/present" element={<PrivateRoute><LivingDesignSystemPresentation /></PrivateRoute>} />
        </Routes>
      </Suspense>
    );
  }
  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          {/* Public — no gate */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/design-system-web" element={<DesignSystemWeb />} />
          <Route path="/design-system-website" element={<DesignSystemWebsite />} />
          {/* Private — gated by PrivateRoute (modal inside Layout) */}
          <Route path="/patterns" element={<PrivateRoute><Concepts /></PrivateRoute>} />
          <Route path="/therapist" element={<PrivateRoute><App /></PrivateRoute>} />
          <Route path="/tool-calls" element={<PrivateRoute><ToolCalls /></PrivateRoute>} />
          <Route path="/living-design-system" element={<PrivateRoute><LivingDesignSystem /></PrivateRoute>} />
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
