import React, { useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Checkbox,
  Link,
  Stack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Icon,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { FaApple } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google'
import AppButton from '../../components/shared/Button/AppButton'
import { useAuthStore } from '../../store/authStore'

// Validation Schema using Zod
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormInputs = z.infer<typeof loginSchema>

const Login: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const setTokens = useAuthStore((state) => state.setTokens)

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log('Google login success', codeResponse)
      
      // Ở ứng dụng thực tế, chúng ta sẽ gửi Google Token này cho Backend 
      // để Backend trả về Access Token & Refresh Token của hệ thống.
      // Tại đây mình giả lập lưu Access Token của Google và một Refresh Token giả.
      setTokens(codeResponse.access_token, 'mock-refresh-token-12345')

      toast({
        title: 'Google Login Successful',
        description: 'You have authenticated with Google.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      navigate('/')
    },
    onError: (error) => {
      console.log('Login Failed', error)
      toast({
        title: 'Google Login Failed',
        description: 'There was an issue logging in with Google.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
    }
  })

  // Submit Handler with Simulated Delays & Toast Feedback
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: 'Authentication Successful',
        description: `Welcome back! You logged in as ${data.email}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      navigate('/')
    }, 1200)
  }

  return (
    <Box
      minH="100vh"
      bg="#0c0e14"
      color="#e2e1eb"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {/* Top Navbar */}
      <Box
        as="nav"
        position="fixed"
        top="0"
        left="0"
        right="0"
        h="70px"
        bg="rgba(12, 14, 20, 0.8)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="#33343c"
        zIndex="100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: '4', md: '8' }}
      >
        <Flex maxW="1200px" w="full" justify="space-between" align="center">
          <HStack spacing="2" cursor="pointer" onClick={() => navigate('/')}>
            <FiArrowLeft />
            <Heading fontSize="2xl" fontWeight="bold" letterSpacing="tighter">
              AISTHEA
            </Heading>
          </HStack>
          <Link
            fontSize="sm"
            color="#e5bdb9"
            _hover={{ color: 'white', textDecoration: 'none' }}
            href="#"
          >
            Support
          </Link>
        </Flex>
      </Box>

      {/* Main Content Canvas */}
      <Flex
        as="main"
        w="full"
        flex="1"
        direction="column"
        align="center"
        justify="center"
        px="4"
        pt="24"
        pb="8"
      >
        {/* Login Card */}
        <Box
          bg="#141414"
          border="1px solid"
          borderColor="#262626"
          w="full"
          maxW="480px"
          borderRadius="32px"
          p="8"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
          display="flex"
          flexDirection="column"
          gap="6"
          position="relative"
          overflow="hidden"
        >
          {/* Header */}
          <Stack spacing="2" textAlign="center" align="center">
            <Heading as="h1" fontSize="22px" color="white" fontWeight="700" letterSpacing="-0.02em">
              Welcome Back
            </Heading>
            <Text fontSize="14px" color="#e5bdb9">
              Enter your credentials to access your dashboard.
            </Text>
          </Stack>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="4">
              {/* Email Field */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="12px" color="#e5bdb9" mb="1">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  placeholder="athlete@example.com"
                  bg="#0A0A0A"
                  borderColor="#262626"
                  color="#e2e1eb"
                  h="42px"
                  _placeholder={{ color: '#8A8A93' }}
                  _hover={{ borderColor: '#e03030' }}
                  _focus={{
                    borderColor: '#e03030',
                    boxShadow: '0 0 0 1px #e03030',
                    bg: '#0A0A0A',
                  }}
                  {...register('email')}
                />
                <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
              </FormControl>

              {/* Password Field */}
              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontSize="12px" color="#e5bdb9" mb="1">
                  Password
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    bg="#0A0A0A"
                    borderColor="#262626"
                    color="#e2e1eb"
                    h="42px"
                    pr="10"
                    _placeholder={{ color: '#8A8A93' }}
                    _hover={{ borderColor: '#e03030' }}
                    _focus={{
                      borderColor: '#e03030',
                      boxShadow: '0 0 0 1px #e03030',
                      bg: '#0A0A0A',
                    }}
                    {...register('password')}
                  />
                  <InputRightElement h="full" pr="2">
                    <IconButton
                      aria-label="Toggle password visibility"
                      variant="ghost"
                      size="sm"
                      color="#e5bdb9"
                      _hover={{ color: 'white', bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                      icon={
                        <Box as="span" className="material-symbols-outlined" fontSize="20px">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </Box>
                      }
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="xs">{errors.password?.message}</FormErrorMessage>
              </FormControl>

              {/* Options Row */}
              <Flex justify="space-between" align="center" pt="1" fontSize="12px">
                <Checkbox
                  colorScheme="red"
                  defaultChecked
                  sx={{
                    'span.chakra-checkbox__control': {
                      bg: 'transparent',
                      borderColor: '#262626',
                      borderRadius: '4px',
                      _checked: {
                        bg: '#e03030',
                        borderColor: '#e03030',
                      },
                      _focus: {
                        boxShadow: 'none',
                      },
                    },
                  }}
                >
                  <Text fontSize="12px" color="#e5bdb9">
                    Remember me
                  </Text>
                </Checkbox>
                <Link
                  fontSize="12px"
                  color="#ffb4ac"
                  _hover={{ color: '#ffdad6', textDecoration: 'none' }}
                  href="#"
                >
                  Forgot password?
                </Link>
              </Flex>

              {/* Primary Action */}
              <AppButton
                label="Login"
                type="submit"
                variant="solid"
                w="full"
                h="44px"
                fontSize="14px"
                isLoading={isLoading}
                loadingText="Logging in..."
                mt="2"
              />
            </Stack>
          </form>

          {/* Divider */}
          <Flex align="center" py="1">
            <Box flex="1" h="1px" bg="#33343c" />
            <Text px="4" fontSize="12px" color="#e5bdb9" whiteSpace="nowrap">
              or continue with
            </Text>
            <Box flex="1" h="1px" bg="#33343c" />
          </Flex>

          {/* Social Actions */}
          <Stack spacing="3">
            <AppButton
              label="Continue with Google"
              variant="outline"
              w="full"
              h="42px"
              fontSize="14px"
              onClick={() => loginWithGoogle()}
              leftIcon={
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            />
            <AppButton
              label="Continue with Apple"
              variant="outline"
              w="full"
              h="42px"
              fontSize="14px"
              leftIcon={
                <Icon as={FaApple} fontSize="18px" style={{ marginRight: '6px' }} />
              }
            />
          </Stack>
        </Box>

        {/* Redirect Link */}
        <Box mt="6" textAlign="center">
          <Text fontSize="12px" color="#e5bdb9">
            Don't have an account?{' '}
            <Link
              color="#ffb4ac"
              fontWeight="600"
              _hover={{ color: '#ffdad6', textDecoration: 'none' }}
              onClick={() => navigate('/register')}
            >
              Register
            </Link>
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default Login
