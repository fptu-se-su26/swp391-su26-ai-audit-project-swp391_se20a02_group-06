import React, { useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  Stack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import PublicNavbar from '../../components/shared/Navbar/PublicNavbar'
import PublicFooter from '../../components/shared/Footer/PublicFooter'
import AppButton from '../../components/shared/Button/AppButton'

const Pricing: React.FC = () => {
  const navigate = useNavigate()
  const [isYearly, setIsYearly] = useState(false)

  const handleLoginClick = () => navigate('/login')

  // Pricing configuration
  const plans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      desc: '/month',
      features: [
        { label: 'Basic Workouts', included: true },
        { label: 'Manual Tracking', included: true },
        { label: 'AI Program Generation', included: false },
        { label: 'Advanced Analytics', included: false },
      ],
      btnText: 'Get Started',
      popular: false,
    },
    {
      name: 'Premium',
      monthlyPrice: 19,
      yearlyPrice: 15,
      desc: '/month',
      features: [
        { label: 'Everything in Free', included: true },
        { label: 'AI Program Generation', included: true },
        { label: 'Advanced Analytics', included: true },
        { label: '1-on-1 PT Coaching', included: false },
      ],
      btnText: 'Upgrade to Premium',
      popular: true,
    },
    {
      name: 'Elite',
      monthlyPrice: 49,
      yearlyPrice: 39,
      desc: '/month',
      features: [
        { label: 'Everything in Premium', included: true },
        { label: '1-on-1 PT Coaching', included: true },
        { label: 'Priority Support', included: true },
        { label: 'Custom Meal Plans', included: true },
      ],
      btnText: 'Go Elite',
      popular: false,
    },
  ]

  return (
    <Box minH="100vh" bg="#0A0A0A" color="#e2e1eb" overflowX="hidden" display="flex" flexDirection="column" pt="72px">
      <PublicNavbar />

      {/* ===================== MAIN CONTENT ===================== */}
      <Flex as="main" direction="column" align="center" py="12" px="4" maxW="1200px" mx="auto" w="full" flex="1">
        {/* Header Section */}
        <Stack align="center" spacing="6" textAlign="center" mb="12">
          <Heading fontSize={{ base: '32px', md: '40px' }} color="white" fontWeight="700" letterSpacing="-0.02em">
            Choose Your Plan
          </Heading>

          {/* Toggle Pill */}
          <Flex
            bg="#141414"
            border="1px solid"
            borderColor="#262626"
            p="1"
            borderRadius="full"
            align="center"
            boxShadow="md"
          >
            <AppButton
              label="Monthly"
              variant="ghost"
              size="sm"
              px="6"
              bg={!isYearly ? '#33343c' : 'transparent'}
              color={!isYearly ? 'white' : '#8A8A93'}
              _hover={{ color: 'white' }}
              onClick={() => setIsYearly(false)}
            />
            <AppButton
              variant="ghost"
              size="sm"
              px="6"
              bg={isYearly ? '#33343c' : 'transparent'}
              color={isYearly ? 'white' : '#8A8A93'}
              _hover={{ color: 'white' }}
              onClick={() => setIsYearly(true)}
              display="flex"
              alignItems="center"
              gap="2"
              label={
                <>
                  Yearly
                  <Box
                    as="span"
                    fontSize="10px"
                    fontWeight="700"
                    bg="#e03030"
                    color="white"
                    px="2"
                    py="0.5"
                    borderRadius="full"
                  >
                    -20%
                  </Box>
                </>
              }
            />
          </Flex>
        </Stack>

        {/* Pricing Cards Grid */}
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap="6"
          w="full"
          mb="16"
          px={{ base: '0', lg: '8' }}
        >
          {plans.map((plan) => (
            <Flex
              key={plan.name}
              bg="#141414"
              border={plan.popular ? '2px solid' : '1px solid'}
              borderColor={plan.popular ? '#e03030' : '#262626'}
              borderRadius="32px"
              p="6"
              direction="column"
              boxShadow="md"
              position="relative"
              transition="all 0.2s"
              transform={plan.popular ? { base: 'none', md: 'translateY(-16px)' } : 'none'}
              _hover={{ borderColor: plan.popular ? '#e03030' : '#33343c' }}
            >
              {/* Popular ribbon */}
              {plan.popular && (
                <Box
                  position="absolute"
                  top="0"
                  right="8"
                  transform="translateY(-50%)"
                  bg="#e03030"
                  color="white"
                  px="3"
                  py="1"
                  borderRadius="full"
                  fontSize="10px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Most Popular
                </Box>
              )}

              {/* Title & Price */}
              <Box mb="6">
                <Heading as="h2" fontSize="lg" fontWeight="600" color="white" mb="2">
                  {plan.name}
                </Heading>
                <HStack align="baseline" spacing="1">
                  <Text fontSize="32px" fontWeight="700" color="white">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </Text>
                  <Text fontSize="12px" color="#8A8A93">
                    {plan.desc}
                  </Text>
                </HStack>
              </Box>

              {/* Features List */}
              <Stack spacing="3" mb="8" flex="1">
                {plan.features.map((feat, idx) => (
                  <HStack key={idx} spacing="2" align="center">
                    <Box
                      as="span"
                      className="material-symbols-outlined"
                      style={{
                        color: feat.included ? '#e03030' : '#33343c',
                        fontSize: '16px',
                      }}
                    >
                      {feat.included ? 'check' : 'close'}
                    </Box>
                    <Text fontSize="12px" color={feat.included ? '#e2e1eb' : '#33343c'}>
                      {feat.label}
                    </Text>
                  </HStack>
                ))}
              </Stack>

              {/* CTA Action */}
              <AppButton
                label={plan.btnText}
                variant={plan.popular ? 'solid' : 'outline'}
                w="full"
                h="10"
                fontSize="14px"
                bg={plan.popular ? '#e03030' : 'transparent'}
                borderColor={plan.popular ? '#e03030' : '#262626'}
                color="white"
                _hover={
                  plan.popular
                    ? { bg: '#c92a2a', opacity: 0.9 }
                    : { borderColor: 'white', bg: 'rgba(255, 255, 255, 0.05)' }
                }
                onClick={handleLoginClick}
              />
            </Flex>
          ))}
        </Grid>

        {/* Features Comparison Table */}
        <Box w="full" maxW="800px" mx="auto" overflowX="auto" pb="8">
          <Table variant="unstyled" w="full" style={{ borderCollapse: 'collapse' }}>
            <Thead>
              <Tr borderBottom="1px solid" borderColor="#262626">
                <Th py="4" px="2" fontSize="18px" fontWeight="600" color="white" textTransform="none" w="40%">
                  Features Comparison
                </Th>
                <Th py="4" px="2" fontSize="14px" fontWeight="600" color="#8A8A93" textAlign="center" w="20%">
                  Free
                </Th>
                <Th py="4" px="2" fontSize="14px" fontWeight="600" color="#e03030" textAlign="center" w="20%">
                  Premium
                </Th>
                <Th py="4" px="2" fontSize="14px" fontWeight="600" color="#8A8A93" textAlign="center" w="20%">
                  Elite
                </Th>
              </Tr>
            </Thead>
            <Tbody fontSize="12px" color="#e2e1eb">
              <Tr borderBottom="1px solid" borderColor="#262626" _hover={{ bg: '#141414' }} transition="background 0.2s">
                <Td py="4" px="2">
                  AI Program Generation
                </Td>
                <Td py="4" px="2" textAlign="center">
                  <Box as="span" className="material-symbols-outlined" style={{ color: '#33343c', fontSize: '20px' }}>
                    close
                  </Box>
                </Td>
                <Td py="4" px="2" textAlign="center">
                  <Box as="span" className="material-symbols-outlined" style={{ color: '#e03030', fontSize: '20px' }}>
                    check
                  </Box>
                </Td>
                <Td py="4" px="2" textAlign="center">
                  <Box as="span" className="material-symbols-outlined" style={{ color: '#e03030', fontSize: '20px' }}>
                    check
                  </Box>
                </Td>
              </Tr>

              <Tr borderBottom="1px solid" borderColor="#262626" _hover={{ bg: '#141414' }} transition="background 0.2s">
                <Td py="4" px="2">
                  Advanced Analytics Depth
                </Td>
                <Td py="4" px="2" textAlign="center" color="#8A8A93">
                  Basic
                </Td>
                <Td py="4" px="2" textAlign="center">
                  Detailed
                </Td>
                <Td py="4" px="2" textAlign="center" fontWeight="600">
                  Pro Level
                </Td>
              </Tr>

              <Tr borderBottom="1px solid" borderColor="#262626" _hover={{ bg: '#141414' }} transition="background 0.2s">
                <Td py="4" px="2">
                  1-on-1 PT Coaching
                </Td>
                <Td py="4" px="2" textAlign="center">
                  <Box as="span" className="material-symbols-outlined" style={{ color: '#33343c', fontSize: '20px' }}>
                    close
                  </Box>
                </Td>
                <Td py="4" px="2" textAlign="center">
                  <Box as="span" className="material-symbols-outlined" style={{ color: '#33343c', fontSize: '20px' }}>
                    close
                  </Box>
                </Td>
                <Td py="4" px="2" textAlign="center">
                  <Box as="span" className="material-symbols-outlined" style={{ color: '#e03030', fontSize: '20px' }}>
                    check
                  </Box>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Flex>

      <PublicFooter />
    </Box>
  )
}

export default Pricing
