import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import theme from './lib/chakra-theme.ts'
import RouterContainer from './router/router-container'

const Router = import.meta.env.PROD ? HashRouter : BrowserRouter

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '916356717531-klok2ck49pggi156ockpp72f5s5mkf3i.apps.googleusercontent.com'

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <Router>
            <RouterContainer />
          </Router>
        </GoogleOAuthProvider>
      </ChakraProvider>
    </>
  )
}

export default App
