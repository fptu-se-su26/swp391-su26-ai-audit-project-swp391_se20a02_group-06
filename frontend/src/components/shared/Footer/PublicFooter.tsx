import React from 'react'
import { Box, Grid, Stack, Heading, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const PublicFooter: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box as="footer" w="full" py="12" bg="#0c0e14" borderTop="1px solid" borderColor="#33343c" mt="auto">
      <Grid
        maxW="1200px"
        mx="auto"
        px="8"
        templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
        gap="8"
      >
        <Stack spacing="3">
          <Heading as="h4" fontSize="lg" color="white" fontWeight="bold">
            NETFIT
          </Heading>
          <Text fontSize="xs" color="#8A8A93">
            Precision AI training for high-performance athletes.
          </Text>
        </Stack>
        <Stack spacing="2">
          <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" mb="1">{t('landing.product', 'Product')}</Text>
          {[
            { label: 'AI Workouts', href: '/dashboard' },
            { label: t('nav.nutrition', 'Nutrition'), href: '/nutrition' },
            { label: t('pt.bookingTitle', 'PT Booking'), href: '/pt-booking' },
          ].map((item) => (
            <Text key={item.label} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }} onClick={() => navigate(item.href)}>
              {item.label}
            </Text>
          ))}
        </Stack>
        <Stack spacing="2">
          <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" mb="1">{t('landing.company', 'Company')}</Text>
          {[
            { label: t('landing.about', 'About'), href: '/about' },
            { label: 'Careers', href: '#' },
            { label: t('landing.contact', 'Contact'), href: '#' },
          ].map((item) => (
            <Text key={item.label} fontSize="xs" color={item.label === t('landing.about', 'About') ? 'white' : '#8A8A93'} cursor="pointer" _hover={{ color: '#e03030' }} onClick={() => item.href !== '#' ? navigate(item.href) : null}>
              {item.label}
            </Text>
          ))}
        </Stack>
        <Stack spacing="2">
          <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" mb="1">{t('landing.legal', 'Legal')}</Text>
          {['Privacy', 'Terms'].map((link) => (
            <Text key={link} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }}>
              {link}
            </Text>
          ))}
        </Stack>
      </Grid>
      <Box maxW="1200px" mx="auto" px="8" mt="8" pt="4" borderTop="1px solid" borderColor="#33343c">
        <Text fontSize="xs" color="#8A8A93">
          © 2026 NETFIT AI. {t('landing.allRightsReserved', 'All rights reserved.')}
        </Text>
      </Box>
    </Box>
  )
}

export default PublicFooter
