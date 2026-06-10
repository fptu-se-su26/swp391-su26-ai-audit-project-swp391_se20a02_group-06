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
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import AppButton from '../../components/shared/Button/AppButton'
import { authService } from '../../features/auth/authService'
import { useAuthStore } from '../../store/useAuthStore'

// Validation Schema using Zod
const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms & Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormInputs = z.infer<typeof registerSchema>

const Register: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false,
    },
  })

  // Watch password to dynamically compute strength
  const watchedPassword = watch('password', '')

  // Simple dynamic password strength calculator
  const getPasswordStrength = () => {
    if (!watchedPassword) return { score: 0, label: '' }
    if (watchedPassword.length < 6) return { score: 1, label: 'Weak' }
    const hasNumbers = /\d/.test(watchedPassword)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword)
    if (watchedPassword.length >= 8 && hasNumbers && hasSpecial) {
      return { score: 4, label: 'Strongest' }
    }
    if (watchedPassword.length >= 7 && (hasNumbers || hasSpecial)) {
      return { score: 3, label: 'Strong' }
    }
    return { score: 2, label: 'Medium' }
  }

  const strength = getPasswordStrength()

  const setTokens = useAuthStore((state) => state.setTokens)

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true)
    try {
      const response = await authService.register({
        fullname: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      })
      setTokens(response.token, '')
      toast({
        title: 'Registration Successful',
        description: `Welcome to AISTHEA, ${response.fullname}! Let's start training.`,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      })
      navigate('/')
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'An error occurred during registration.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
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
      alignItems="center"
      justifyContent="center"
      p="6"
    >
      <Box w="full" maxW="480px" display="flex" flexDirection="column" gap="4">
        {/* Header */}
        <Box textAlign="center" mb="2">
          <Heading
            fontSize="22px"
            fontWeight="700"
            letterSpacing="-0.02em"
            color="white"
            mb="1"
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            AISTHEA
          </Heading>
          <Text fontSize="14px" color="#e5bdb9">
            Elite Performance AI
          </Text>
        </Box>

        {/* Registration Card */}
        <Box
          bg="#141414"
          border="1px solid"
          borderColor="#262626"
          borderRadius="32px"
          p="8"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
        >
          {/* Step Indicator */}
          <Box mb="6">
            <Flex align="center" justify="space-between" mb="3" position="relative">
              <Box
                position="absolute"
                left="0"
                top="50%"
                transform="translateY(-50%)"
                w="full"
                h="2px"
                bg="#262626"
                zIndex="0"
              />
              {/* Step 1 (Active) */}
              <Box h="2" w="28%" bg="#e03030" borderRadius="full" zIndex="10" />
              {/* Step 2 (Inactive) */}
              <Box h="2" w="28%" bg="#262626" borderRadius="full" zIndex="10" />
              {/* Step 3 (Inactive) */}
              <Box h="2" w="28%" bg="#262626" borderRadius="full" zIndex="10" />
            </Flex>
            <Box textAlign="center">
              <Text fontSize="10px" fontWeight="600" color="#e5bdb9" textTransform="uppercase" letterSpacing="0.05em">
                Step 1 of 3
              </Text>
              <Heading as="h2" fontSize="18px" fontWeight="600" color="white" mt="1">
                Account Info
              </Heading>
            </Box>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="4">
              {/* Full Name */}
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel fontSize="12px" color="#e2e1eb" mb="1">
                  Full Name
                </FormLabel>
                <Input
                  placeholder="John Doe"
                  bg="#0c0e14"
                  borderColor="#262626"
                  color="#e2e1eb"
                  h="42px"
                  _placeholder={{ color: 'rgba(226, 225, 235, 0.3)' }}
                  _hover={{ borderColor: '#e03030' }}
                  _focus={{
                    borderColor: '#e03030',
                    boxShadow: 'none',
                    bg: '#0c0e14',
                  }}
                  {...register('fullName')}
                />
                <FormErrorMessage fontSize="xs">{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              {/* Email */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="12px" color="#e2e1eb" mb="1">
                  Email
                </FormLabel>
                <Input
                  placeholder="john@example.com"
                  bg="#0c0e14"
                  borderColor="#262626"
                  color="#e2e1eb"
                  h="42px"
                  _placeholder={{ color: 'rgba(226, 225, 235, 0.3)' }}
                  _hover={{ borderColor: '#e03030' }}
                  _focus={{
                    borderColor: '#e03030',
                    boxShadow: 'none',
                    bg: '#0c0e14',
                  }}
                  {...register('email')}
                />
                <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
              </FormControl>

              {/* Password */}
              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontSize="12px" color="#e2e1eb" mb="1">
                  Password
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    bg="#0c0e14"
                    borderColor="#262626"
                    color="#e2e1eb"
                    h="42px"
                    _placeholder={{ color: 'rgba(226, 225, 235, 0.3)' }}
                    _hover={{ borderColor: '#e03030' }}
                    _focus={{
                      borderColor: '#e03030',
                      boxShadow: 'none',
                      bg: '#0c0e14',
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

                {/* Password Strength Indicator */}
                {watchedPassword && (
                  <Box mt="2">
                    <HStack spacing="1">
                      <Box h="1" flex="1" bg={strength.score >= 1 ? '#e03030' : '#262626'} borderRadius="full" />
                      <Box h="1" flex="1" bg={strength.score >= 2 ? '#e03030' : '#262626'} borderRadius="full" />
                      <Box h="1" flex="1" bg={strength.score >= 3 ? '#e03030' : '#262626'} borderRadius="full" />
                      <Box h="1" flex="1" bg={strength.score >= 4 ? '#e03030' : '#262626'} borderRadius="full" />
                    </HStack>
                    <Text fontSize="12px" color="#e5bdb9" mt="1" textAlign="right">
                      {strength.label}
                    </Text>
                  </Box>
                )}
              </FormControl>

              {/* Confirm Password */}
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel fontSize="12px" color="#e2e1eb" mb="1">
                  Confirm Password
                </FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  bg="#0c0e14"
                  borderColor="#262626"
                  color="#e2e1eb"
                  h="42px"
                  _placeholder={{ color: 'rgba(226, 225, 235, 0.3)' }}
                  _hover={{ borderColor: '#e03030' }}
                  _focus={{
                    borderColor: '#e03030',
                    boxShadow: 'none',
                    bg: '#0c0e14',
                  }}
                  {...register('confirmPassword')}
                />
                <FormErrorMessage fontSize="xs">{errors.confirmPassword?.message}</FormErrorMessage>
              </FormControl>

              {/* Terms Checkbox */}
              <FormControl isInvalid={!!errors.terms}>
                <Flex align="flex-start" mt="2">
                  <Checkbox
                    id="terms"
                    colorScheme="red"
                    sx={{
                      'span.chakra-checkbox__control': {
                        bg: 'transparent',
                        borderColor: '#262626',
                        borderRadius: '4px',
                        mt: '0.5',
                        _checked: {
                          bg: '#e03030',
                          borderColor: '#e03030',
                        },
                        _focus: {
                          boxShadow: 'none',
                        },
                      },
                    }}
                    {...register('terms')}
                  />
                  <Box ml="3">
                    <FormLabel htmlFor="terms" fontSize="12px" color="#e5bdb9" m="0" cursor="pointer" lineHeight="1.4">
                      I agree to the{' '}
                      <Link color="#ffb4ac" href="#" _hover={{ textDecoration: 'underline' }}>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link color="#ffb4ac" href="#" _hover={{ textDecoration: 'underline' }}>
                        Privacy Policy
                      </Link>
                      .
                    </FormLabel>
                  </Box>
                </Flex>
                <FormErrorMessage fontSize="xs" mt="1">{errors.terms?.message}</FormErrorMessage>
              </FormControl>

              {/* Actions */}
              <Box pt="2" mt="2">
                <AppButton
                  type="submit"
                  variant="solid"
                  w="full"
                  h="52px"
                  fontSize="14px"
                  isLoading={isLoading}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap="1"
                  label={
                    <>
                      Continue
                      <Box as="span" className="material-symbols-outlined" fontSize="20px">
                        arrow_forward
                      </Box>
                    </>
                  }
                />
              </Box>
            </Stack>
          </form>
        </Box>

        {/* Back to Login Link */}
        <Box textAlign="center" mt="2">
          <Link
            fontSize="12px"
            color="#e5bdb9"
            _hover={{ color: 'white', textDecoration: 'none' }}
            onClick={() => navigate('/login')}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="1"
          >
            <Box as="span" className="material-symbols-outlined" fontSize="16px">
              arrow_back
            </Box>
            Back to Login
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default Register
