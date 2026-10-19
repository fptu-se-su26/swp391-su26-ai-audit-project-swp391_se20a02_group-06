import { useEffect, useState, useCallback } from 'react'
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppButton from '../../components/shared/Button/AppButton'
import apiClient from '../../lib/axios'

const PaymentSuccess = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'processing' | 'success' | 'cancelled' | 'error'>('processing')
  const [message, setMessage] = useState('')

  // HashRouter + PayOS can put query params either before or after the #
  const getOrderCode = useCallback(() => {
    const fromRouter = searchParams.get('orderCode') || searchParams.get('id')
    if (fromRouter) return fromRouter
    const raw = new URLSearchParams(window.location.search)
    return raw.get('orderCode') || raw.get('id')
  }, [searchParams])

  useEffect(() => {
    const confirmPayment = async () => {
      const orderCode = getOrderCode()
      if (!orderCode) {
        setStatus('error')
        setMessage('Order code not found.')
        return
      }

      // Check if PayOS returned a cancel/fail status via query params
      const payosCode = searchParams.get('code') || new URLSearchParams(window.location.search).get('code')
      const payosStatus = searchParams.get('status') || new URLSearchParams(window.location.search).get('status')

      if ((payosCode && payosCode !== '00') || (payosStatus && payosStatus.toUpperCase() === 'CANCELLED')) {
        try {
          await apiClient.post(`/jobs/cancel-payment?orderCode=${orderCode}`)
        } catch {}
        setStatus('cancelled')
        setMessage('Payment was cancelled or unsuccessful. The booking slot has been reopened.')
        return
      }

      const kind = localStorage.getItem('payment-kind') // 'PT_SESSION' | 'SUBSCRIPTION' | null
      const opts = { timeout: 25000 }
      
      try {
        if (kind === 'SUBSCRIPTION') {
          await apiClient.post(`/jobs/simulate-payment?orderCode=${orderCode}`, null, opts)
          setStatus('success')
          setMessage('Payment successful! Your membership package has been activated.')
          localStorage.removeItem('payment-kind')
          setTimeout(() => navigate('/dashboard'), 1000)
          return
        }
        
        try {
          await apiClient.post(`/jobs/simulate-schedule-payment?orderCode=${orderCode}`, null, opts)
          setStatus('success')
          setMessage('PT session booking confirmed! A Google Meet link has been created and sent to your email.')
          localStorage.removeItem('payment-kind')
          setTimeout(() => navigate('/dashboard'), 1000)
          return
        } catch (schedErr: any) {
          if (schedErr.response?.data?.message?.includes('Schedule not found')) {
            await apiClient.post(`/jobs/simulate-payment?orderCode=${orderCode}`, null, opts)
            setStatus('success')
            setMessage('Payment successful! Your membership package has been activated.')
            localStorage.removeItem('payment-kind')
            setTimeout(() => navigate('/dashboard'), 1000)
            return
          }
          throw schedErr
        }
      } catch (err: any) {
        if (err.response?.status === 400) {
          setStatus('success')
          setMessage('Payment was already confirmed previously.')
          setTimeout(() => navigate('/dashboard'), 1000)
        } else {
          setStatus('error')
          setMessage(err.response?.data?.message || 'Payment confirmation failed. Please contact support.')
        }
      }
    }
    confirmPayment()
  }, [searchParams, navigate, getOrderCode])

  return (
    <Flex minH="100vh" bg="#0A0A0A" color="#e2e1eb" justify="center" align="center" direction="column" gap="4">
      {status === 'processing' && <Spinner color="#e03030" size="xl" />}
      <Heading fontSize="3xl" color={
        status === 'success' ? '#4ADE80' :
        status === 'cancelled' ? '#F59E0B' :
        status === 'error' ? '#E03030' : 'white'
      }>
        {status === 'processing' ? t('landing.confirmingPayment', 'Confirming payment...') :
         status === 'success' ? t('landing.paymentSuccessful', 'Payment Successful!') :
         status === 'cancelled' ? t('landing.paymentCancelled', 'Payment Cancelled') :
         t('landing.paymentError', 'Payment Error')}
      </Heading>
      <Text color="#8A8A93">{message}</Text>
      {status === 'cancelled' && (
        <AppButton label={t('landing.backToPricing', 'Back to Pricing')} onClick={() => navigate('/pricing')} mt="4" />
      )}
      {status === 'success' && (
        <Text fontSize="sm" color="#8A8A93" mt="4">
          {t('landing.redirectingDashboard', 'Redirecting to dashboard...')}
        </Text>
      )}
    </Flex>
  )
}

export default PaymentSuccess
