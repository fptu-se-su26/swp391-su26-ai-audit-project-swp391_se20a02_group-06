import { useEffect, useState, useCallback } from 'react'
import { Flex, Heading, Text, Spinner } from '@chakra-ui/react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AppButton from '../../components/shared/Button/AppButton'
import apiClient from '../../lib/axios'

const PaymentSuccess = () => {
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
        setMessage('Không tìm thấy mã đơn hàng.')
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
        setMessage('Thanh toán đã bị huỷ hoặc không thành công. Slot tập đã được mở lại.')
        return
      }

      const kind = localStorage.getItem('payment-kind') // 'PT_SESSION' | 'SUBSCRIPTION' | null
      const opts = { timeout: 25000 }
      
      try {
        if (kind === 'SUBSCRIPTION') {
          await apiClient.post(`/jobs/simulate-payment?orderCode=${orderCode}`, null, opts)
          setStatus('success')
          setMessage('Thanh toán thành công! Gói tập của bạn đã được kích hoạt.')
          localStorage.removeItem('payment-kind')
          setTimeout(() => navigate('/dashboard'), 1000)
          return
        }
        
        try {
          await apiClient.post(`/jobs/simulate-schedule-payment?orderCode=${orderCode}`, null, opts)
          setStatus('success')
          setMessage('Thanh toán lịch tập PT thành công! Link Google Meet đã được tạo và gửi qua email cho bạn.')
          localStorage.removeItem('payment-kind')
          setTimeout(() => navigate('/dashboard'), 1000)
          return
        } catch (schedErr: any) {
          if (schedErr.response?.data?.message?.includes('Schedule not found')) {
            await apiClient.post(`/jobs/simulate-payment?orderCode=${orderCode}`, null, opts)
            setStatus('success')
            setMessage('Thanh toán thành công! Gói tập của bạn đã được kích hoạt.')
            localStorage.removeItem('payment-kind')
            setTimeout(() => navigate('/dashboard'), 1000)
            return
          }
          throw schedErr
        }
      } catch (err: any) {
        if (err.response?.status === 400) {
          setStatus('success')
          setMessage('Thanh toán đã được xác nhận trước đó.')
          setTimeout(() => navigate('/dashboard'), 1000)
        } else {
          setStatus('error')
          setMessage(err.response?.data?.message || 'Xác nhận thanh toán thất bại. Vui lòng liên hệ hỗ trợ.')
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
        {status === 'processing' ? 'Đang xác nhận thanh toán...' :
         status === 'success' ? 'Thanh toán thành công!' :
         status === 'cancelled' ? 'Thanh toán đã huỷ' :
         'Lỗi thanh toán'}
      </Heading>
      <Text color="#8A8A93">{message}</Text>
      {status === 'cancelled' && (
        <AppButton label="Quay lại trang gói tập" onClick={() => navigate('/pricing')} mt="4" />
      )}
      {status === 'success' && (
        <Text fontSize="sm" color="#8A8A93" mt="4">
          Đang chuyển hướng đến trang quản lý...
        </Text>
      )}
    </Flex>
  )
}

export default PaymentSuccess
