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
  // Icon,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
// import { FaApple } from 'react-icons/fa'
import { GoogleLogin } from '@react-oauth/google'
import AppButton from '../../components/shared/Button/AppButton'
import { useAuthStore } from '../../store/useAuthStore'
import { authService } from '../../features/auth/authService'

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

  const loginWithGoogle = <GoogleLogin
    onSuccess={async (credentialResponse) => {
      const response = await authService.googleLogin(credentialResponse.credential!)
      setTokens(response.token, '', response.roleId)
      if (response.roleId === 1 || response.roleId === 2) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }}
    onError={() => toast({ title: 'Google Login Failed', status: 'error' })}
  />

  // Submit Handler with Simulated Delays & Toast Feedback
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      setTokens(response.token, '', response.roleId)
      toast({ title: 'Login Successful', description: `Welcome back, ${response.fullname}!`, status: 'success', duration: 3000, isClosable: true, position: 'top-right' })
      if (response.roleId === 1 || response.roleId === 2) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast({ title: 'Login Failed', description: error.response?.data?.message || 'Invalid credentials.', status: 'error', duration: 3000, isClosable: true, position: 'top-right' })
    } finally {
      setIsLoading(false)
    }
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
            <Box w="full" display="flex" justifyContent="center">
              {loginWithGoogle}
            </Box>
            {/* <AppButton
              label="Continue with Apple"
              variant="outline"
              w="full"
              h="42px"
              fontSize="14px"
              leftIcon={
                <Icon as={FaApple} fontSize="18px" style={{ marginRight: '6px' }} />
              }
            /> */}
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