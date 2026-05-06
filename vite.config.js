import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vectorIconsStub = path.resolve(__dirname, 'src/native-theme/vector-icons-stub.js')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Alias react-native → react-native-web so RN components render in the browser.
    // Lets us use real react-native-paper + native primitives on the Mobile App
    // design-system page.
    alias: [
      { find: 'react-native', replacement: 'react-native-web' },
      // Stub vector-icons (incl. subpaths like /MaterialCommunityIcons).
      // Paper imports its sets statically; Rolldown can't parse JSX inside
      // their .js files. We supply a custom default icon via PaperProvider
      // settings.icon, so these stubs are only here to satisfy the imports.
      { find: /^react-native-vector-icons(\/.*)?$/, replacement: vectorIconsStub },
    ],
    // Pick web-specific source files when both .web.js and .js exist.
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  optimizeDeps: {
    esbuildOptions: {
      // Some RN packages ship JSX inside .js files. Tell esbuild to parse .js as JSX.
      loader: { '.js': 'jsx' },
      // Skip Flow types in node_modules (RN code uses Flow-typed .js).
      resolveExtensions: ['.web.js', '.web.jsx', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    },
  },
  define: {
    // tokens.ts in apps/native references __DEV__ (RN global). Provide a value.
    __DEV__: JSON.stringify(false),
    // RNW's Animated module uses Node's `global`. Map it to globalThis in the
    // browser so the runtime doesn't ReferenceError.
    global: 'globalThis',
  },
})
