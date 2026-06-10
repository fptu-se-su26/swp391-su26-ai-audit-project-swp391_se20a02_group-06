import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import theme from './lib/chakra-theme.ts'
import App from './App.tsx'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'

const Router = import.meta.env.PROD ? HashRouter : BrowserRouter

// Google Client ID is a public identifier. Hardcoding it here ensures it works on GitHub Pages
// since .env files are not committed to the repository.
const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '916356717531-klok2ck49pggi156ockpp72f5s5mkf3i.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <App />
        </Router>
      </GoogleOAuthProvider>
    </ChakraProvider>
  </React.StrictMode>
)