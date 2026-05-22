import React, { useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  Stack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'

const Pricing: React.FC = () => {
  const navigate = useNavigate()
  const [isYearly, setIsYearly] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLoginClick = () => navigate('/login')

  const navLinks = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '/pricing', isActive: true },
    { label: 'Training', href: '#' },
    { label: 'About', href: '/about' },
  ]

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
      {/* ===================== TOP NAV BAR ===================== */}
      <Box
        as="nav"
        position="fixed"
        top="0"
        left="0"
        right="0"
        h="70px"
        bg="rgba(10, 10, 10, 0.8)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="#33343c"
        zIndex="100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: '4', md: '8' }}
      >
        <Flex maxW="1200px" w="full" justify="space-between" align="center" position="relative">
          {/* Logo */}
          <Heading
            fontSize="2xl"
            fontWeight="bold"
            letterSpacing="tighter"
            cursor="pointer"
            zIndex="50"
            onClick={() => navigate('/')}
          >
            AISTHEA
          </Heading>

          {/* Desktop Nav Links — Centered */}
          <HStack
            spacing="8"
            display={{ base: 'none', md: 'flex' }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            {navLinks.map((link) => (
              <Text
                key={link.label}
                fontSize="sm"
                fontWeight="500"
                color={link.isActive ? '#e03030' : '#8A8A93'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ color: 'white', opacity: 0.8 }}
                onClick={() => link.href.startsWith('/') ? navigate(link.href) : null}
              >
                {link.label}
              </Text>
            ))}
          </HStack>

          {/* Right Side CTA */}
          <HStack spacing="4" zIndex="50">
            <Button
              variant="outline"
              fontSize="xs"
              fontWeight="600"
              borderColor="#262626"
              borderRadius="full"
              px="5"
              h="9"
              color="white"
              bg="transparent"
              _hover={{ bg: 'rgba(255,255,255,0.05)' }}
              display={{ base: 'none', md: 'block' }}
              onClick={handleLoginClick}
            >
              Login
            </Button>
            <Button
              variant="solid"
              fontSize="xs"
              fontWeight="600"
              bg="#e03030"
              color="white"
              borderRadius="full"
              px="5"
              h="9"
              _hover={{ bg: '#c92a2a' }}
              onClick={handleLoginClick}
            >
              Start Training
            </Button>

            {/* Mobile Hamburger */}
            <IconButton
              aria-label="Toggle mobile menu"
              icon={isMobileMenuOpen ? <FiX size="24" /> : <FiMenu size="24" />}
              display={{ base: 'flex', md: 'none' }}
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </HStack>
        </Flex>
      </Box>

      {/* ===================== MOBILE MENU OVERLAY ===================== */}
      {isMobileMenuOpen && (
        <Flex
          position="fixed"
          inset="0"
          bg="#0A0A0A"
          zIndex="45"
          direction="column"
          align="center"
          justify="center"
          gap="8"
        >
          {navLinks.map((link) => (
            <Text
              key={link.label}
              fontSize="2xl"
              fontWeight="bold"
              color={link.isActive ? '#e03030' : '#8A8A93'}
              cursor="pointer"
              _hover={{ color: 'white' }}
              onClick={() => {
                setIsMobileMenuOpen(false)
                if (link.href.startsWith('/')) navigate(link.href)
              }}
            >
              {link.label}
            </Text>
          ))}
          <Button
            variant="ghost"
            fontSize="md"
            mt="4"
            onClick={() => {
              setIsMobileMenuOpen(false)
              handleLoginClick()
            }}
          >
            Login
          </Button>
        </Flex>
      )}

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
            <Button
              size="sm"
              borderRadius="full"
              px="6"
              bg={!isYearly ? '#33343c' : 'transparent'}
              color={!isYearly ? 'white' : '#8A8A93'}
              _hover={{ color: 'white' }}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </Button>
            <Button
              size="sm"
              borderRadius="full"
              px="6"
              bg={isYearly ? '#33343c' : 'transparent'}
              color={isYearly ? 'white' : '#8A8A93'}
              _hover={{ color: 'white' }}
              onClick={() => setIsYearly(true)}
              display="flex"
              alignItems="center"
              gap="2"
            >
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
            </Button>
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
              <Button
                variant={plan.popular ? 'solid' : 'outline'}
                w="full"
                h="10"
                borderRadius="full"
                fontWeight="600"
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
              >
                {plan.btnText}
              </Button>
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

      {/* ===================== FOOTER ===================== */}
      <Box as="footer" w="full" py="10" bg="#0c0e14" borderTop="1px solid" borderColor="#33343c" mt="auto">
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
              © 2024 AISTHEA AI. All rights reserved.
            </Text>
          </Stack>
          <Stack spacing="2">
            {['AI Workouts', 'Nutrition', 'PT Booking'].map((link) => (
              <Text key={link} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }}>
                {link}
              </Text>
            ))}
          </Stack>
          <Stack spacing="2">
            {['About', 'Careers', 'Contact'].map((link) => (
              <Text key={link} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }} onClick={() => link === 'About' ? navigate('/about') : null}>
                {link}
              </Text>
            ))}
          </Stack>
          <Stack spacing="2">
            {['Privacy', 'Terms'].map((link) => (
              <Text key={link} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }}>
                {link}
              </Text>
            ))}
          </Stack>
        </Grid>
      </Box>
    </Box>
  )
}

export default Pricing
