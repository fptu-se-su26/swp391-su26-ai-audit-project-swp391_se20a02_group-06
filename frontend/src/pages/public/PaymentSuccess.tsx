import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Text, Spinner } from '@chakra-ui/react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import apiClient from '../../lib/axios'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmPayment = async () => {
      const orderCode = searchParams.get('orderCode') || searchParams.get('id')
      if (!orderCode) {
        setStatus('error')
        setMessage('No order code received.')
        return
      }
      try {
        await apiClient.post(`/jobs/simulate-payment?orderCode=${orderCode}`)
        setStatus('success')
        setMessage('Payment confirmed! Your subscription is now active.')
        setTimeout(() => navigate('/dashboard'), 3000)
      } catch (err: any) {
        if (err.response?.status === 400) {
          setStatus('success')
          setMessage('Payment already confirmed. Your subscription is active.')
          setTimeout(() => navigate('/dashboard'), 3000)
        } else {
          setStatus('error')
          setMessage('Failed to confirm payment. Please contact support.')
        }
      }
    }
    confirmPayment()
  }, [searchParams, navigate])

  return (
    <Flex minH="100vh" bg="#0A0A0A" color="#e2e1eb" justify="center" align="center" direction="column" gap="4">
      {status === 'processing' && <Spinner color="#e03030" size="xl" />}
      <Heading fontSize="3xl" color={status === 'success' ? '#4ADE80' : status === 'error' ? '#E03030' : 'white'}>
        {status === 'processing' ? 'Confirming Payment...' : status === 'success' ? 'Payment Successful!' : 'Payment Error'}
      </Heading>
      <Text color="#8A8A93">{message}</Text>
      {status !== 'processing' && (
        <Text fontSize="sm" color="#8A8A93" mt="4">
          Redirecting to dashboard...
        </Text>
      )}
    </Flex>
  )
}

export default PaymentSuccess
