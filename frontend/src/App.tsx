import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import theme from './lib/chakra-theme.ts'
import RouterContainer from './router/router-container'

import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/shared/ErrorBoundary'

const Router = import.meta.env.PROD ? HashRouter : BrowserRouter

const rawClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '72625663972-6j5ncv7smsmduij6q4tugs261vmajihe.apps.googleusercontent.com'

const googleClientId = String(rawClientId).trim()

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <Router>
            <ErrorBoundary>
              <NotificationProvider>
                <RouterContainer />
              </NotificationProvider>
            </ErrorBoundary>
          </Router>
        </GoogleOAuthProvider>
      </ChakraProvider>
    </>
  )
}

export default App
