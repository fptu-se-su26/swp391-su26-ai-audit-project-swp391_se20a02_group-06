import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  PinInput,
  PinInputField,
  useToast
} from '@chakra-ui/react'

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
}

export const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, email, onVerify, onResend }) => {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const toast = useToast()

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (isOpen && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [isOpen, countdown])

  useEffect(() => {
    if (isOpen) {
      setOtp('')
      setCountdown(60)
    }
  }, [isOpen])

  const handleVerify = async () => {
    if (otp.length < 6) return
    setIsLoading(true)
    try {
      await onVerify(otp)
    } catch (error: any) {
      toast({
        title: 'Error verifying OTP',
        description: error.response?.data?.message || 'Invalid OTP',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setIsLoading(true)
    try {
      await onResend()
      setCountdown(60)
      toast({
        title: 'OTP Resent',
        description: 'Please check your email.',
        status: 'info',
        duration: 3000,
        isClosable: true
      })
    } catch (error: any) {
      toast({
        title: 'Failed to resend OTP',
        description: error.response?.data?.message || 'Try again later',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
      <ModalContent bg="gray.900" color="white" borderRadius="xl" mx={4}>
        <ModalHeader borderBottom="1px solid" borderColor="whiteAlpha.100">
          Verify your Email
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={6}>
            <Text color="gray.400" textAlign="center">
              We've sent a 6-digit verification code to<br />
              <Text as="span" color="white" fontWeight="bold">{email}</Text>
            </Text>

            <HStack justify="center">
              <PinInput value={otp} onChange={setOtp} otp autoFocus focusBorderColor="brand.primary">
                <PinInputField bg="gray.800" borderColor="whiteAlpha.200" _hover={{ borderColor: 'whiteAlpha.400' }} />
                <PinInputField bg="gray.800" borderColor="whiteAlpha.200" _hover={{ borderColor: 'whiteAlpha.400' }} />
                <PinInputField bg="gray.800" borderColor="whiteAlpha.200" _hover={{ borderColor: 'whiteAlpha.400' }} />
                <PinInputField bg="gray.800" borderColor="whiteAlpha.200" _hover={{ borderColor: 'whiteAlpha.400' }} />
                <PinInputField bg="gray.800" borderColor="whiteAlpha.200" _hover={{ borderColor: 'whiteAlpha.400' }} />
                <PinInputField bg="gray.800" borderColor="whiteAlpha.200" _hover={{ borderColor: 'whiteAlpha.400' }} />
              </PinInput>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter flexDirection="column" gap={4} borderTop="1px solid" borderColor="whiteAlpha.100">
          <Button
            w="full"
            colorScheme="red"
            isLoading={isLoading}
            isDisabled={otp.length < 6}
            onClick={handleVerify}
          >
            Verify
          </Button>
          <HStack justify="center" w="full" fontSize="sm">
            <Text color="gray.400">Didn't receive code?</Text>
            <Button
              variant="link"
              color={countdown > 0 ? "gray.500" : "brand.primary"}
              onClick={handleResend}
              isDisabled={countdown > 0 || isLoading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
