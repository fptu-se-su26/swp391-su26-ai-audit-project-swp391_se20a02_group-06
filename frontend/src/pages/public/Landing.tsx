import React, { useState, useEffect } from 'react'
import hero1 from '../../assets/landing/hero1.png'
import hero2 from '../../assets/landing/hero2.png'
import hero3 from '../../assets/landing/hero3.png'
import hero4 from '../../assets/landing/hero4.png'
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Image,
  Icon,
  Stack,
  HStack,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import {
  FiCheck,
  FiCheckCircle,
  FiCpu,
  FiUser,
  FiBarChart2,
  FiGlobe,
  FiAward,
  FiUsers,
  FiActivity,
  FiZap,
} from 'react-icons/fi'
import PublicNavbar from '../../components/shared/Navbar/PublicNavbar'
import PublicFooter from '../../components/shared/Footer/PublicFooter'
import AppButton from '../../components/shared/Button/AppButton'
import { getProductPackages, type ProductPackage } from '../../api/productPackages'

// Hero athlete gallery images from Stitch
const heroImages = [
  {
    src: hero1,
    alt: 'Female athlete functional training',
    marginTop: '0px',
  },
  {
    src: hero2,
    alt: 'Male athlete focused training',
    marginTop: '0px',
  },
  {
    src: hero3,
    alt: 'Female athlete high-intensity training',
    marginTop: '0px',
  },
  {
    src: hero4,
    alt: 'Male athlete intense lifting',
    marginTop: '0px',
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
  const [packages, setPackages] = useState<ProductPackage[]>([])
  const { isAuthenticated, roleId } = useAuthStore()

  useEffect(() => {
    const fetchPackages = async () => {
      const data = await getProductPackages()
      setPackages(data)
    }
    fetchPackages()
  }, [])

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate(roleId === 1 ? '/admin' : '/dashboard')
    } else {
      navigate('/login')
    }
  }

  const filteredPackages = packages
    .filter(p => isYearly ? p.durationDays >= 180 : p.durationDays < 180)
    .sort((a, b) => {
      // Prioritize popular packages
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      // Secondary sort by price or duration if needed, currently leaving as is
      return 0;
    })
    .slice(0, 3);

  return (
    <Box minH="100vh" bg="#0c0e14" color="#e2e1eb" overflowX="hidden">
      <PublicNavbar />

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
                overflow="hidden"
                borderRadius="16px"
                flexShrink={0}
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
                <AppButton
                  variant="solid"
                  label={isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                  px="8"
                  py="6"
                  fontSize="md"
                  onClick={handleLoginClick}
                />
                <AppButton
                  variant="outline"
                  label="View Features"
                  px="8"
                  py="6"
                  fontSize="md"
                  borderColor="#e2e1eb"
                  color="#e2e1eb"
                  _hover={{ bg: '#e2e1eb', color: '#0c0e14' }}
                  onClick={() => {
                    const el = document.getElementById('features')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                />
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
              <AppButton
                variant={!isYearly ? 'solid' : 'ghost'}
                label="Monthly"
                size="sm"
                px="6"
                onClick={() => setIsYearly(false)}
              />
              <AppButton
                variant={isYearly ? 'solid' : 'ghost'}
                label="Yearly"
                size="sm"
                px="6"
                onClick={() => setIsYearly(true)}
              />
            </Flex>
          </Stack>

          {/* Pricing Cards */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap="6"
            w="full"
            alignItems="stretch"
            justifyContent="center"
          >
            {filteredPackages.map((pkg) => (
              <Box
                key={pkg.id}
                bg={pkg.isPopular ? "#33343c" : "#1a1b22"}
                border={pkg.isPopular ? "2px solid" : "1px solid"}
                borderColor={pkg.isPopular ? "#e03030" : "#33343c"}
                borderRadius="32px"
                p="8"
                display="flex"
                flexDirection="column"
                gap="6"
                boxShadow={pkg.isPopular ? "0 20px 60px rgba(224, 48, 48, 0.1)" : "none"}
                position="relative"
                transform={pkg.isPopular ? { base: 'none', md: 'scale(1.05)' } : "none"}
                zIndex={pkg.isPopular ? 1 : 0}
                transition="all 0.2s"
                _hover={{ borderColor: pkg.isPopular ? '#e03030' : '#e5bdb9' }}
              >
                {pkg.isPopular && (
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
                )}
                <Stack spacing="2">
                  <Text fontSize="lg" fontWeight="600" color="white">{pkg.name}</Text>
                  <Text fontSize="4xl" fontWeight="bold" color="white">
                    {pkg.price.toLocaleString('vi-VN')} ₫
                  </Text>
                  <Text fontSize="xs" color="#8A8A93">Duration: {pkg.durationDays} days</Text>
                  <Box py="2">
                    <Text fontSize="sm" color="#8A8A93" noOfLines={2}>{pkg.description}</Text>
                  </Box>
                </Stack>
                <Box h="1px" bg={pkg.isPopular ? "rgba(224, 48, 48, 0.3)" : "#33343c"} />
                <Stack spacing="4" flex="1">
                  {['Access to Platform', 'Progress Tracking'].map((feat, i) => (
                    <HStack key={i} spacing="2" fontSize="sm" color={pkg.isPopular ? "white" : "#8A8A93"}>
                      <Icon as={pkg.isPopular ? FiCheck : FiCheckCircle} color="#e03030" fontSize={pkg.isPopular ? "20px" : "18px"} />
                      <Text>{feat}</Text>
                    </HStack>
                  ))}
                </Stack>
                <AppButton
                  variant={pkg.isPopular ? "solid" : "outline"}
                  label="Purchase Plan"
                  w="full"
                  mt="auto"
                  py="6"
                  _hover={pkg.isPopular ? { brightness: '110%', boxShadow: 'lg' } : undefined}
                  onClick={handleLoginClick}
                />
              </Box>
            ))}
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

      <PublicFooter />
    </Box>
  )
}

export default Landing
