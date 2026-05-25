import RouterContainer from './router/router-container'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './lib/chakra-theme.ts'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterContainer />
    </ChakraProvider>
  )
}

export default App
