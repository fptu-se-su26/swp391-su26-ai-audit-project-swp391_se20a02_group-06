import React, { useState } from 'react'
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  Stack,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {
  FiCheck,
  FiCheckCircle,
  FiMenu,
  FiX,
  FiCpu,
  FiUser,
  FiBarChart2,
  FiGlobe,
  FiAward,
  FiUsers,
  FiActivity,
  FiZap,
} from 'react-icons/fi'

// Hero athlete gallery images from Stitch
const heroImages = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvmQ0Q8iA8vEnMUlutBbM7fZXsxEbJNRPE0vszfQQ22RmgntXs-3ezWBpXcxZucEEj73yzTNtnaHbgB3q325eRGTP3J1I_fIFhkhZx7aDlr-e2GbBas7tZcqdt2zaKiBxEnKyQXa_YVOeEUk7oCj1yhQRUMD96PCJpPJFu14ce94vbXQlw5ByeB_mUSK-bdyTkqNkN3XfZEB4SVTt7daTiSe7MaNJe2IfYaovMxkotX94paIiDIeBoNlawNd_KhrEvxp1uWp72SMTk',
    alt: 'Female athlete functional training',
    marginTop: '0px',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida/ADBb0uhpyvDEM2zPsyTXcwiHOvXqUdfoGOXXLd6aft4DIxEGVX90Hfdy1ZtjtLMq-3LlJ0ToP0fGMNXYuPmBpaxcREY-536UGUw-ulBLxMkNSQcINpIMzD4oh3ZhQWkxUeAJZx0AV0XWjNVb7ssMtvCGnOsWPymIMQth9pkQ4lV0Q_zkMfur7TQlAwzz5rr217PKmKCJ4-TF7p41o7PH8xHas7nq7i7uMBAxV92Mp03rQdWJ1VxJ87d1soNsGBKE',
    alt: 'Male athlete focused training',
    marginTop: '40px',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLOhPge2vCkky1al7RB4FgG7E37tt_1SlvsQYYENOalw_nc3nON7zI9KDRStdArz2GzSQOOnERGU0Ia41ZCbY0L_SVyDMO_cvgMLl1wsemBB0tPXfxPZ5CDr8tLzBnRDg_b5PXz8gi_9L5JXmFS9J5AwfHd2sIEuUQCgVWqpIjNy8hsBUiKuBZiDkKJmCdxsGUtL1G0nh7gObjOnB56FpiYxfQ58mgTjY9KJIjqEuwJDo4PAO6N8prXGS4Vl5i3J2-PuIpFSNpoFdO',
    alt: 'Female athlete high-intensity training',
    marginTop: '-20px',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnwiQojKAvmqccfPbtuF0MRIlVR7VnKIIC1sBF2z-D0WUUBHRhIZd13j3CYhA89iCPAsEUbnO5F2rC3yrB0SJQq3Juh3dg1pQ4KW76WmKQH0zdJozyMjKA-q-Nx4FEvpLgNw1IjkdqHGIOllHSiQhCDfnUbuW1563y9lFy7MT0YdBjbZJcJmlkSXj78DccY3laeVRn6wfLJHaaHXkepS4jyGT38HNOSaR3UFHI5OgdAmDRGadl3LQ7mZ3gHIIL6J1tiKy0gIhxdCGi',
    alt: 'Male athlete intense lifting',
    marginTop: '20px',
  },
]

// Feature strip items
const features = [
  {
    title: 'AI Workouts',
    desc: 'Dynamic programming that adapts to your performance daily.',
    icon: 'fitness_center',
  },
  {
    title: 'AI Nutrition',
    desc: 'Macro-perfected meal plans synced to your energy expenditure.',
    icon: 'restaurant',
  },
  {
    title: 'PT Booking',
    desc: 'Schedule elite human coaching when you need form correction.',
    icon: 'calendar_month',
  },
]

// Elite membership benefits
const eliteBenefits = [
  { icon: FiAward, title: 'Priority Booking', desc: 'First access to top-tier international PTs.' },
  { icon: FiUsers, title: 'Elite Community', desc: 'Private Discord for Pro & Coached tiers.' },
  { icon: FiActivity, title: 'Wearable Sync', desc: 'Native integration with Whoop, Oura, Garmin.' },
  { icon: FiZap, title: 'Recovery Labs', desc: 'Discounts on partner recovery facilities.' },
]

// About section cards
const aboutCards = [
  { icon: FiCpu, title: 'AI-Powered', desc: 'adaptive programming.' },
  { icon: FiUser, title: 'Human Coaches', desc: 'real PT expertise.' },
  { icon: FiBarChart2, title: 'Data-Driven', desc: 'performance analytics.' },
  { icon: FiGlobe, title: 'Global Community', desc: '50K+ members.' },
]

const Landing: React.FC = () => {
  const navigate = useNavigate()
  const [isYearly, setIsYearly] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLoginClick = () => navigate('/login')

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Training', href: '#training' },
    { label: 'About', href: '/about' },
  ]

  return (
    <Box minH="100vh" bg="#0c0e14" color="#e2e1eb" overflowX="hidden">
      {/* ===================== TOP NAV BAR ===================== */}
      <Box
        as="nav"
        position="fixed"
        top="0"
        left="0"
        right="0"
        h="70px"
        bg="rgba(12, 14, 20, 0.8)"
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
                color="#8A8A93"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ color: 'white', opacity: 0.8 }}
                _active={{ transform: 'scale(0.95)' }}
                onClick={() => {
                  if (link.href.startsWith('/')) {
                    navigate(link.href)
                  } else {
                    const el = document.querySelector(link.href)
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {link.label}
              </Text>
            ))}
          </HStack>

          {/* Right Side CTA */}
          <HStack spacing="4" zIndex="50">
            <Button
              variant="ghost"
              fontSize="sm"
              fontWeight="600"
              px="4"
              display={{ base: 'none', md: 'block' }}
              onClick={handleLoginClick}
            >
              Login
            </Button>
            <Button
              variant="solid"
              fontSize="sm"
              fontWeight="600"
              px="6"
              h="10"
              borderRadius="full"
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
          bg="#0c0e14"
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
              color="#8A8A93"
              cursor="pointer"
              _hover={{ color: 'white' }}
              onClick={() => {
                setIsMobileMenuOpen(false)
                if (link.href.startsWith('/')) {
                  navigate(link.href)
                } else {
                  const el = document.querySelector(link.href)
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }
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
      <Box as="main" pt="80px" pb="8" display="flex" flexDirection="column" gap={{ base: '16', md: '24' }}>

        {/* ===================== HERO SECTION ===================== */}
        <Box position="relative" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
          {/* Background Staggered Athlete Gallery */}
          <Grid
            position="absolute"
            inset="0"
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
            gap="4"
            px="4"
            opacity="0.4"
          >
            {heroImages.map((img, idx) => (
              <Box
                key={idx}
                h="full"
                mt={img.marginTop}
                overflow="hidden"
                borderRadius="xl"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>
            ))}
          </Grid>

          {/* Hero Content Overlay */}
          <Flex
            position="relative"
            zIndex="10"
            maxW="1200px"
            mx="auto"
            px="8"
            w="full"
            textAlign="center"
            direction="column"
            align="center"
            py={{ base: '16', md: '24' }}
          >
            <Flex
              bg="rgba(12, 14, 20, 0.4)"
              backdropFilter="blur(4px)"
              p="8"
              borderRadius="32px"
              border="1px solid"
              borderColor="rgba(51, 52, 60, 0.3)"
              direction="column"
              align="center"
              gap="6"
            >
              <Heading
                as="h1"
                fontSize={{ base: '40px', md: '64px' }}
                lineHeight="tight"
                fontWeight="bold"
                color="white"
                maxW="3xl"
              >
                Train Smarter.
                <br />
                <Text as="span" color="#e03030">
                  Powered by AI.
                </Text>
              </Heading>
              <Text
                fontSize={{ base: 'sm', md: 'lg' }}
                color="#e5bdb9"
                maxW="xl"
              >
                Elevate your performance with elite-level AI programming. No fluff, just data-driven results for the focused athlete.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing="4" pt="2">
                <Button
                  variant="solid"
                  px="8"
                  py="6"
                  fontSize="md"
                  boxShadow="0 4px 20px rgba(224, 48, 48, 0.2)"
                  _hover={{ brightness: '110%' }}
                  onClick={handleLoginClick}
                >
                  Start Free Trial
                </Button>
                <Button
                  border="1px solid"
                  borderColor="#e2e1eb"
                  color="#e2e1eb"
                  bg="transparent"
                  px="8"
                  py="6"
                  fontSize="md"
                  borderRadius="full"
                  _hover={{ bg: '#e2e1eb', color: '#0c0e14' }}
                  _active={{ transform: 'scale(0.95)' }}
                  transition="all 0.2s"
                >
                  View Features
                </Button>
              </Stack>
            </Flex>
          </Flex>

          {/* Bottom Gradient Fade */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            h="32"
            bgGradient="linear(to-t, #0c0e14, transparent)"
            pointerEvents="none"
          />
        </Box>

        {/* ===================== FEATURE STRIP ===================== */}
        <Box id="features" maxW="1200px" w="full" mx="auto" px={{ base: '4', md: '8' }}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6">
            {features.map((feature, i) => (
              <Stack
                key={i}
                bg="#1e1f26"
                border="1px solid"
                borderColor="#33343c"
                borderRadius="32px"
                p="6"
                spacing="4"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{ transform: 'translateY(-4px)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <Flex
                  h="12"
                  w="12"
                  borderRadius="full"
                  bg="#33343c"
                  align="center"
                  justify="center"
                  color="#e03030"
                >
                  <Box as="span" className="material-symbols-outlined">
                    {feature.icon}
                  </Box>
                </Flex>
                <Heading as="h3" fontSize="lg" color="white" fontWeight="600">
                  {feature.title}
                </Heading>
                <Text fontSize="sm" color="#8A8A93">
                  {feature.desc}
                </Text>
              </Stack>
            ))}
          </Grid>
        </Box>

        {/* ===================== ELITE MEMBERSHIP BENEFITS ===================== */}
        <Box maxW="1200px" w="full" mx="auto" px={{ base: '4', md: '8' }} py="8">
          <Box
            bg="#282a31"
            border="1px solid"
            borderColor="rgba(224, 48, 48, 0.3)"
            borderRadius="32px"
            p={{ base: '8', md: '12' }}
            position="relative"
            overflow="hidden"
          >
            {/* Background decoration */}
            <Box position="absolute" top="0" right="0" p="8" opacity="0.1">
              <Icon as={FiAward} fontSize="120px" color="#e03030" />
            </Box>

            <Stack position="relative" zIndex="10" spacing="6">
              {/* Badge */}
              <Box
                display="inline-block"
                px="4"
                py="1"
                bg="rgba(224, 48, 48, 0.2)"
                border="1px solid"
                borderColor="#e03030"
                borderRadius="full"
                w="fit-content"
              >
                <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" letterSpacing="wider">
                  Exclusive Access
                </Text>
              </Box>

              <Heading fontSize={{ base: '28px', md: '36px' }} color="white" fontWeight="bold">
                Elite Membership Benefits
              </Heading>

              {/* Benefits Grid */}
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="6" mt="4">
                {eliteBenefits.map((benefit, idx) => (
                  <HStack key={idx} spacing="3" align="flex-start">
                    <Icon as={benefit.icon} color="#e03030" fontSize="xl" mt="1" flexShrink={0} />
                    <Stack spacing="1">
                      <Text fontSize="sm" fontWeight="bold" color="white">
                        {benefit.title}
                      </Text>
                      <Text fontSize="xs" color="#8A8A93">
                        {benefit.desc}
                      </Text>
                    </Stack>
                  </HStack>
                ))}
              </Grid>
            </Stack>
          </Box>
        </Box>

        {/* ===================== PRICING SECTION ===================== */}
        <Stack
          id="pricing"
          maxW="1200px"
          w="full"
          mx="auto"
          px={{ base: '4', md: '8' }}
          spacing="12"
          py="8"
          align="center"
          borderTop="1px solid"
          borderColor="#33343c"
        >
          <Stack spacing="4" align="center" textAlign="center">
            <Heading fontSize={{ base: '32px', md: '40px' }} color="white" fontWeight="bold">
              Choose Your Path
            </Heading>

            {/* Monthly/Yearly Toggle */}
            <Flex
              bg="#282a31"
              border="1px solid"
              borderColor="#33343c"
              p="1"
              borderRadius="full"
              gap="1"
            >
              <Button
                variant={!isYearly ? 'solid' : 'ghost'}
                size="sm"
                borderRadius="full"
                px="6"
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </Button>
              <Button
                variant={isYearly ? 'solid' : 'ghost'}
                size="sm"
                borderRadius="full"
                px="6"
                onClick={() => setIsYearly(true)}
              >
                Yearly (-20%)
              </Button>
            </Flex>
          </Stack>

          {/* Pricing Cards */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap="6"
            w="full"
            alignItems="stretch"
          >
            {/* Foundation */}
            <Box
              bg="#1a1b22"
              border="1px solid"
              borderColor="#33343c"
              borderRadius="32px"
              p="8"
              display="flex"
              flexDirection="column"
              gap="6"
              transition="all 0.2s"
              _hover={{ borderColor: '#e5bdb9' }}
            >
              <Stack spacing="2">
                <Text fontSize="lg" fontWeight="600" color="white">Foundation</Text>
                <Text fontSize="4xl" fontWeight="bold" color="white">
                  {isYearly ? '$23' : '$29'}
                  <Text as="span" fontSize="sm" color="#8A8A93" fontWeight="400">/mo</Text>
                </Text>
                <Text fontSize="xs" color="#8A8A93">For those starting their elite journey.</Text>
              </Stack>
              <Box h="1px" bg="#33343c" />
              <Stack spacing="4" flex="1">
                {['Basic AI Workouts', 'Progress Tracking', 'Community Access'].map((feat, i) => (
                  <HStack key={i} spacing="2" fontSize="sm" color="#8A8A93">
                    <Icon as={FiCheckCircle} color="#e03030" fontSize="18px" />
                    <Text>{feat}</Text>
                  </HStack>
                ))}
              </Stack>
              <Button variant="outline" w="full" mt="auto" py="6" onClick={handleLoginClick}>
                Select Foundation
              </Button>
            </Box>

            {/* Pro Athlete (Highlighted) */}
            <Box
              bg="#33343c"
              border="2px solid"
              borderColor="#e03030"
              borderRadius="32px"
              p="8"
              display="flex"
              flexDirection="column"
              gap="6"
              boxShadow="0 20px 60px rgba(224, 48, 48, 0.1)"
              position="relative"
              transform={{ base: 'none', md: 'scale(1.05)' }}
              zIndex="1"
            >
              {/* Most Popular Badge */}
              <Box
                position="absolute"
                top="0"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="#e03030"
                color="white"
                px="6"
                py="1.5"
                borderRadius="full"
                fontSize="10px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="widest"
                boxShadow="lg"
              >
                MOST POPULAR
              </Box>
              <Stack spacing="2">
                <Text fontSize="lg" fontWeight="600" color="white">Pro Athlete</Text>
                <Text fontSize="4xl" fontWeight="bold" color="white">
                  {isYearly ? '$71' : '$89'}
                  <Text as="span" fontSize="sm" color="#8A8A93" fontWeight="400">/mo</Text>
                </Text>
                <Text fontSize="xs" color="#8A8A93">Complete data-driven performance optimization.</Text>
              </Stack>
              <Box h="1px" bg="rgba(224, 48, 48, 0.3)" />
              <Stack spacing="4" flex="1">
                {['Advanced AI Programming', 'Nutrition Integration', 'Video Form Analysis', 'Wearable Data Sync'].map((feat, i) => (
                  <HStack key={i} spacing="2" fontSize="sm" color="white">
                    <Icon as={FiCheck} color="#e03030" fontSize="20px" />
                    <Text>{feat}</Text>
                  </HStack>
                ))}
              </Stack>
              <Button
                variant="solid"
                w="full"
                mt="auto"
                py="6"
                _hover={{ brightness: '110%', boxShadow: 'lg' }}
                onClick={handleLoginClick}
              >
                Get Pro Access
              </Button>
            </Box>

            {/* Elite Coached */}
            <Box
              bg="#1a1b22"
              border="1px solid"
              borderColor="#33343c"
              borderRadius="32px"
              p="8"
              display="flex"
              flexDirection="column"
              gap="6"
              transition="all 0.2s"
              _hover={{ borderColor: '#e5bdb9' }}
            >
              <Stack spacing="2">
                <Text fontSize="lg" fontWeight="600" color="white">Elite Coached</Text>
                <Text fontSize="4xl" fontWeight="bold" color="white">
                  {isYearly ? '$159' : '$199'}
                  <Text as="span" fontSize="sm" color="#8A8A93" fontWeight="400">/mo</Text>
                </Text>
                <Text fontSize="xs" color="#8A8A93">Human expertise meets machine precision.</Text>
              </Stack>
              <Box h="1px" bg="#33343c" />
              <Stack spacing="4" flex="1">
                {['Everything in Pro', '1-on-1 Human PT Checks', 'Custom Strategy Sessions'].map((feat, i) => (
                  <HStack key={i} spacing="2" fontSize="sm" color="#8A8A93">
                    <Icon as={FiCheckCircle} color="#e03030" fontSize="18px" />
                    <Text>{feat}</Text>
                  </HStack>
                ))}
              </Stack>
              <Button variant="outline" w="full" mt="auto" py="6" onClick={handleLoginClick}>
                Book Coaching
              </Button>
            </Box>
          </Grid>
        </Stack>

        {/* ===================== ABOUT AISTHEA SECTION ===================== */}
        <Flex
          id="about"
          maxW="1200px"
          w="full"
          mx="auto"
          px={{ base: '4', md: '8' }}
          py="16"
          borderTop="1px solid"
          borderColor="#33343c"
          direction={{ base: 'column', md: 'row' }}
          gap="8"
          align="center"
        >
          {/* Left Column */}
          <Stack flex="1" spacing="6">
            <Box>
              <Box
                display="inline-block"
                px="4"
                py="1"
                border="1px solid"
                borderColor="#e03030"
                borderRadius="full"
                mb="4"
              >
                <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" letterSpacing="wider">
                  Our Mission
                </Text>
              </Box>
              <Heading fontSize="2xl" fontWeight="bold" color="white" lineHeight="tight">
                Built for Athletes.
                <br />
                Designed by Data.
              </Heading>
            </Box>
            <Text fontSize="sm" color="#8A8A93">
              AISTHEA combines AI-driven programming with human expertise to deliver personalized fitness at scale. No generic plans. No guesswork.
            </Text>
            <Text fontSize="xs" color="#8A8A93" fontStyle="italic">
              Founded in 2023, trusted by 50,000+ athletes worldwide.
            </Text>

            {/* Stats Row */}
            <HStack spacing="8" pt="4" flexWrap="wrap">
              {[
                { value: '50K+', label: 'Users' },
                { value: '200+', label: 'PT Experts' },
                { value: '4.9★', label: 'Average Rating' },
              ].map((stat, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <Box h="10" w="1px" bg="#33343c" display={{ base: 'none', sm: 'block' }} />
                  )}
                  <Stack spacing="0">
                    <Text fontSize="2xl" fontWeight="bold" color="#e03030">
                      {stat.value}
                    </Text>
                    <Text fontSize="xs" color="#8A8A93" textTransform="uppercase" fontWeight="600">
                      {stat.label}
                    </Text>
                  </Stack>
                </React.Fragment>
              ))}
            </HStack>
          </Stack>

          {/* Right Column — 2x2 Glassmorphic Cards */}
          <Box flex="1" w="full">
            <Grid templateColumns="repeat(2, 1fr)" gap="4">
              {aboutCards.map((card, idx) => (
                <Flex
                  key={idx}
                  bg="rgba(40, 42, 49, 0.3)"
                  backdropFilter="blur(16px)"
                  border="1px solid"
                  borderColor="rgba(224, 48, 48, 0.2)"
                  borderRadius="32px"
                  p={{ base: '4', sm: '6' }}
                  direction="column"
                  gap="3"
                  aspectRatio="1"
                  justify="center"
                  position="relative"
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ borderColor: 'rgba(224, 48, 48, 0.5)' }}
                  boxShadow="0 0 40px -15px rgba(224, 48, 48, 0.2)"
                >
                  {/* Glow decorative */}
                  <Box
                    position="absolute"
                    right="-4"
                    top="-4"
                    w="16"
                    h="16"
                    bg="rgba(224, 48, 48, 0.1)"
                    filter="blur(24px)"
                    borderRadius="full"
                    pointerEvents="none"
                  />
                  <Icon as={card.icon} color="#e03030" fontSize="32px" mb="1" />
                  <Heading fontSize="16px" fontWeight="bold" color="white">
                    {card.title}
                  </Heading>
                  <Text fontSize="12px" color="#8A8A93">
                    {card.desc}
                  </Text>
                </Flex>
              ))}
            </Grid>
          </Box>
        </Flex>
      </Box>

      {/* ===================== FOOTER ===================== */}
      <Box as="footer" w="full" py="12" bg="#0c0e14" borderTop="1px solid" borderColor="#33343c">
        <Grid
          maxW="1200px"
          mx="auto"
          px={{ base: '4', md: '8' }}
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
            {['AI Workouts', 'Nutrition'].map((link) => (
              <Text key={link} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }} transition="color 0.2s">
                {link}
              </Text>
            ))}
          </Stack>
          <Stack spacing="2">
            {['PT Booking', 'About', 'Careers'].map((link) => (
              <Text
                key={link}
                fontSize="xs"
                color="#8A8A93"
                cursor="pointer"
                _hover={{ color: '#e03030' }}
                transition="color 0.2s"
                onClick={() => link === 'About' ? navigate('/about') : link === 'PT Booking' ? navigate('/pricing') : null}
              >
                {link}
              </Text>
            ))}
          </Stack>
          <Stack spacing="2">
            {['Contact', 'Privacy', 'Terms'].map((link) => (
              <Text key={link} fontSize="xs" color="#8A8A93" cursor="pointer" _hover={{ color: '#e03030' }} transition="color 0.2s">
                {link}
              </Text>
            ))}
          </Stack>
        </Grid>
      </Box>
    </Box>
  )
}

export default Landing
