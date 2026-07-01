import { useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Stack,
  FormControl,
  FormLabel,
  useToast,
  Link,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import AppButton from '../../components/shared/Button/AppButton'
import { authApi } from '../../api/auth'
import { OTPModal } from '../../features/auth/components/OTPModal'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const toast = useToast()
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  
  // Reset password fields (shown after verification)
  const [isVerified, setIsVerified] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verifiedOtp, setVerifiedOtp] = useState('')

  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      await authApi.sendForgotPasswordOTP({ email })
      setIsOtpModalOpen(true)
    } catch (error: any) {
      toast({
        title: 'Failed to send OTP',
        description: error.response?.data?.message || 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    await authApi.verifyForgotPasswordOTP({ email, otpCode: otp })
    setVerifiedOtp(otp)
    setIsVerified(true)
    setIsOtpModalOpen(false)
    toast({
      title: 'Verified',
      description: 'You can now set a new password.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleResendOtp = async () => {
    await authApi.sendForgotPasswordOTP({ email })
  }

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters long.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      await authApi.resetPassword({
        email,
        otpCode: verifiedOtp,
        newPassword
      })
      toast({
        title: 'Success',
        description: 'Your password has been reset successfully. Please login.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/login')
    } catch (error: any) {
      toast({
        title: 'Failed to reset password',
        description: error.response?.data?.message || 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" display="flex" bg="brand.dark" bgImage="url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')" bgSize="cover" bgPosition="center">
      <Box w="full" h="full" position="absolute" top="0" left="0" bg="blackAlpha.800" backdropFilter="blur(5px)" zIndex="0" />
      
      <Flex direction="column" justify="center" align="center" flex="1" zIndex="1" px={4}>
        <Box bg="whiteAlpha.100" backdropFilter="blur(20px)" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.200" w="full" maxW="md" boxShadow="2xl">
          <Heading size="lg" mb={2} color="white" textAlign="center">
            {isVerified ? 'Reset Password' : 'Forgot Password'}
          </Heading>
          <Text mb={6} color="gray.400" textAlign="center" fontSize="sm">
            {isVerified ? 'Enter your new password below.' : 'Enter your email address and we will send you a verification code.'}
          </Text>

          <Stack spacing={4}>
            {!isVerified ? (
              <>
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">Email Address</FormLabel>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="blackAlpha.400" 
                    border="1px solid" 
                    borderColor="whiteAlpha.200" 
                    color="white" 
                    _focus={{ borderColor: 'brand.primary', boxShadow: 'none' }}
                  />
                </FormControl>
                
                <AppButton 
                  onClick={handleSendOTP} 
                  isLoading={isLoading}
                  w="full"
                  mt={2}
                  label="Send Verification Code"
                />
              </>
            ) : (
              <>
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">New Password</FormLabel>
                  <Input 
                    type="password" 
                    placeholder="Enter new password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    bg="blackAlpha.400" 
                    border="1px solid" 
                    borderColor="whiteAlpha.200" 
                    color="white" 
                    _focus={{ borderColor: 'brand.primary', boxShadow: 'none' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">Confirm Password</FormLabel>
                  <Input 
                    type="password" 
                    placeholder="Confirm new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    bg="blackAlpha.400" 
                    border="1px solid" 
                    borderColor="whiteAlpha.200" 
                    color="white" 
                    _focus={{ borderColor: 'brand.primary', boxShadow: 'none' }}
                  />
                </FormControl>
                
                <AppButton 
                  onClick={handleResetPassword} 
                  isLoading={isLoading}
                  w="full"
                  mt={2}
                  label="Reset Password"
                />
              </>
            )}
          </Stack>

          <Box textAlign="center" mt={6}>
            <Text fontSize="sm" color="gray.400">
              Remember your password? <Link color="brand.primary" onClick={() => navigate('/login')}>Login</Link>
            </Text>
          </Box>
        </Box>
      </Flex>

      <OTPModal 
        isOpen={isOtpModalOpen} 
        onClose={() => setIsOtpModalOpen(false)} 
        email={email}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </Box>
  )
}

export default ForgotPassword
