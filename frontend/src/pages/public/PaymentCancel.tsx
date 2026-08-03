import { Flex, Heading, Text } from '@chakra-ui/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppButton from '../../components/shared/Button/AppButton'
import apiClient from '../../lib/axios'

const PaymentCancel = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [cancelType, setCancelType] = useState<string | null>(null)
  
  const orderCode = searchParams.get('orderCode')

  useEffect(() => {
    if (orderCode) {
      apiClient.post(`/jobs/cancel-payment?orderCode=${orderCode}`)
        .then(res => setCancelType(res.data.type))
        .catch(console.error)
    }
  }, [orderCode])

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
