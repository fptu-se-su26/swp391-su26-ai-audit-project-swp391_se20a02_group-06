import React from 'react'
import { Box, Grid, Stack, Heading, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const PublicFooter: React.FC = () => {
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
            AISTHEA
          </Heading>
          <Text fontSize="xs" color="#8A8A93">
            Precision AI training for high-performance athletes.
          </Text>
        </Stack>
        <Stack spacing="2">
          <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" mb="1">Product</Text>
          {['AI Workouts', 'Nutrition', 'PT Booking'].map((link) => (
            <Text key={link} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }}>
              {link}
            </Text>
          ))}
        </Stack>
        <Stack spacing="2">
          <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" mb="1">Company</Text>
          {['About', 'Careers', 'Contact'].map((link) => (
            <Text key={link} fontSize="xs" color={link === 'About' ? 'white' : '#8A8A93'} cursor="pointer" _hover={{ color: '#e03030' }} onClick={() => link === 'About' ? navigate('/about') : null}>
              {link}
            </Text>
          ))}
        </Stack>
        <Stack spacing="2">
          <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" mb="1">Legal</Text>
          {['Privacy', 'Terms'].map((link) => (
            <Text key={link} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }}>
              {link}
            </Text>
          ))}
        </Stack>
      </Grid>
      <Box maxW="1200px" mx="auto" px="8" mt="8" pt="4" borderTop="1px solid" borderColor="#33343c">
        <Text fontSize="xs" color="#8A8A93">
          © 2024 AISTHEA AI. All rights reserved.
        </Text>
      </Box>
    </Box>
  )
}

export default PublicFooter
