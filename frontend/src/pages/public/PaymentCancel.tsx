import { Flex, Heading, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import AppButton from '../../components/shared/Button/AppButton'

const PaymentCancel = () => {
  const navigate = useNavigate()

  return (
    <Flex minH="100vh" bg="#0A0A0A" color="#e2e1eb" justify="center" align="center" direction="column" gap="4">
      <Heading fontSize="3xl" color="#E03030">Payment Cancelled</Heading>
      <Text color="#8A8A93">Your payment was cancelled. No charges were made.</Text>
      <AppButton label="Back to Pricing" onClick={() => navigate('/pricing')} mt="4" />
    </Flex>
  )
}

export default PaymentCancel
