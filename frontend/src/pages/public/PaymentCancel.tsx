import { Flex, Heading, Text } from '@chakra-ui/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import AppButton from '../../components/shared/Button/AppButton'
import apiClient from '../../lib/axios'

const PaymentCancel = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [cancelType, setCancelType] = useState<string | null>(null)

  // HashRouter + PayOS can put query params either before or after the #
  // In production: https://site.com/?orderCode=123#/payment/cancel  → window.location.search has it
  // In dev:        http://localhost:5173/payment/cancel?orderCode=123 → useSearchParams has it
  const getOrderCode = useCallback(() => {
    const fromRouter = searchParams.get('orderCode')
    if (fromRouter) return fromRouter
    return new URLSearchParams(window.location.search).get('orderCode')
  }, [searchParams])

  useEffect(() => {
    const orderCode = getOrderCode()
    if (orderCode) {
      apiClient.post(`/jobs/cancel-payment?orderCode=${orderCode}`)
        .then(res => setCancelType(res.data.type))
        .catch(console.error)
    }
  }, [getOrderCode])

  const handleBack = () => {
    if (cancelType === 'PT_SESSION') {
      navigate('/pt-booking')
    } else {
      navigate('/pricing')
    }
  }

  return (
    <Flex minH="100vh" bg="#0A0A0A" color="#e2e1eb" justify="center" align="center" direction="column" gap="4">
      <Heading fontSize="3xl" color="#E03030">Payment Cancelled</Heading>
      <Text color="#8A8A93">Your payment was cancelled. No charges were made.</Text>
      <AppButton label={cancelType === 'PT_SESSION' ? "Back to PT Booking" : "Back to Pricing"} onClick={handleBack} mt="4" />
    </Flex>
  )
}

export default PaymentCancel
