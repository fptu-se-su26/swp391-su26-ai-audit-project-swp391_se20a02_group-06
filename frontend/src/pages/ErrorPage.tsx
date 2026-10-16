import { useMemo } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppButton from '../components/shared/Button/AppButton'
import errorBg from '../assets/landing/error-bg.jpg'

/* ------------------------------------------------------------------ */
/*  Minimal error code configuration (One concise line only)           */
/* ------------------------------------------------------------------ */
interface ErrorConfig {
  code: string
  title: string
}

const ERROR_MAP: Record<string, ErrorConfig> = {
  '400': {
    code: '400',
    title: 'Yêu cầu không hợp lệ',
  },
  '403': {
    code: '403',
    title: 'Từ chối truy cập',
  },
  '404': {
    code: '404',
    title: 'Trang không tồn tại',
  },
  '500': {
    code: '500',
    title: 'Lỗi kết nối máy chủ',
  },
  '502': {
    code: '502',
    title: 'Máy chủ phản hồi sai',
  },
  '503': {
    code: '503',
    title: 'Dịch vụ tạm gián đoạn',
  },
  network: {
    code: 'Offline',
    title: 'Mất kết nối máy chủ',
  },
  default: {
    code: 'Error',
    title: 'Đã xảy ra sự cố',
  },
}

/* ------------------------------------------------------------------ */
/*  Animations                                                         */
/* ------------------------------------------------------------------ */
const ambientPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.7;
  }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface ErrorPageProps {
  errorCode?: string
  message?: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode, message }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const config = useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    const codeParam = searchParams.get('code')
    const msgParam = searchParams.get('message')
    const state = location.state as { errorCode?: string; message?: string } | null

    const code = errorCode || codeParam || state?.errorCode || '404'
    const cfg = ERROR_MAP[code] || ERROR_MAP.default
    const customTitle = message || msgParam || state?.message
    return customTitle ? { ...cfg, title: customTitle } : cfg
  }, [errorCode, message, location.state, location.search])

  const isServerIssue = config.code === '500' || config.code === 'Offline' || config.code === '502' || config.code === '503'

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#070709"
    >
      {/* Background image */}
      <Box
        position="absolute"
        inset="0"
        bgImage={`url(${errorBg})`}
        bgSize="cover"
        bgPosition="center"
        filter="brightness(0.3) contrast(1.15)"
        zIndex="0"
      />

      {/* Cinematic dark vignette overlay */}
      <Box
        position="absolute"
        inset="0"
        bg="radial-gradient(circle at center, rgba(7,7,9,0.55) 0%, rgba(7,7,9,0.92) 80%, #070709 100%)"
        zIndex="1"
      />

      {/* Ambient Red Aura behind card */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w={{ base: '320px', md: '520px' }}
        h={{ base: '320px', md: '520px' }}
        bg="radial-gradient(circle, rgba(235, 47, 47, 0.28) 0%, rgba(235, 47, 47, 0.08) 45%, transparent 70%)"
        filter="blur(50px)"
        pointerEvents="none"
        zIndex="1"
        animation={`${ambientPulse} 4s ease-in-out infinite`}
      />

      {/* Main Content */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        zIndex="2"
        px={4}
        w="full"
        animation={`${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1)`}
      >
        {/* Elite-style Box Container */}
        <Box
          bg="#282a31"
          border="1px solid"
          borderColor="rgba(224, 48, 48, 0.3)"
          borderRadius="32px"
          p={{ base: '8', md: '12' }}
          maxW="500px"
          w="full"
          position="relative"
          overflow="hidden"
          boxShadow="0 24px 60px rgba(0, 0, 0, 0.6)"
        >
          <VStack position="relative" zIndex="10" spacing="6" align="center" textAlign="center">
            {/* Top Badge with Centered Watermark Number */}
            <Box position="relative" display="flex" justifyContent="center" alignItems="center" pt={2} pb={1}>
              {/* Watermark Number centered directly on the button/badge */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                fontSize={{ base: '95px', md: '115px' }}
                fontWeight="900"
                letterSpacing="-0.03em"
                color="#e03030"
                opacity="0.1"
                lineHeight="1"
                userSelect="none"
                pointerEvents="none"
                whiteSpace="nowrap"
                zIndex="0"
              >
                {config.code}
              </Box>

              {/* Red Outline Badge */}
              <Box
                position="relative"
                zIndex="1"
                display="inline-block"
                px="4"
                py="1"
                bg="rgba(40, 42, 49, 0.85)"
                border="1px solid"
                borderColor="#e03030"
                borderRadius="full"
                w="fit-content"
                boxShadow="0 0 15px rgba(224, 48, 48, 0.2)"
              >
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  color="#e03030"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  ERROR {config.code}
                </Text>
              </Box>
            </Box>

            {/* Elite Heading with clear margin from number */}
            <Heading
              fontSize={{ base: '28px', md: '36px' }}
              color="white"
              fontWeight="bold"
              letterSpacing="-0.02em"
              lineHeight="1.2"
              pt={{ base: 5, md: 7 }}
            >
              {config.title}
            </Heading>

            {/* Action Buttons */}
            <HStack spacing={3} pt={2} justify="center" w="full">
              <AppButton
                label="Về Trang Chủ"
                onClick={() => navigate('/')}
                size="md"
                px={7}
                borderRadius="full"
              />

              {isServerIssue ? (
                <AppButton
                  label="Tải Lại"
                  variant="outline"
                  onClick={() => window.location.reload()}
                  size="md"
                  px={6}
                  borderRadius="full"
                  borderColor="rgba(255, 255, 255, 0.2)"
                  color="white"
                  _hover={{
                    bg: 'whiteAlpha.100',
                    borderColor: '#e03030',
                  }}
                />
              ) : (
                <AppButton
                  label="Quay Lại"
                  variant="outline"
                  onClick={() => navigate(-1 as any)}
                  size="md"
                  px={6}
                  borderRadius="full"
                  borderColor="rgba(255, 255, 255, 0.2)"
                  color="white"
                  _hover={{
                    bg: 'whiteAlpha.100',
                    borderColor: '#e03030',
                  }}
                />
              )}
            </HStack>
          </VStack>
        </Box>

        {/* Minimal Subtle Brand Tag */}
        <HStack spacing={2} mt={7} opacity={0.35}>
          <Box w="5px" h="5px" borderRadius="full" bg="#E52D27" />
          <Text
            fontSize="11px"
            fontWeight="600"
            color="white"
            letterSpacing="0.2em"
            textTransform="uppercase"
          >
            NETFIT
          </Text>
        </HStack>
      </Flex>
    </Box>
  )
}

export default ErrorPage
