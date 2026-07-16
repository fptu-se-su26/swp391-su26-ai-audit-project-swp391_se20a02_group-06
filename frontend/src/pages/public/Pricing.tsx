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
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import PublicNavbar from '../../components/shared/Navbar/PublicNavbar'
import PublicFooter from '../../components/shared/Footer/PublicFooter'
import AppButton from '../../components/shared/Button/AppButton'
import { useAuthStore } from '../../store/useAuthStore'
import { orderService } from '../../features/orders/orderService'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const Pricing: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [purchasingPlan, setPurchasingPlan] = useState<number | null>(null)

  // Fetch product packages from backend
  const { data: packages, error, isLoading } = useSWR('/product-packages', fetcher)

  const handlePurchaseClick = async (pkgId: number, planName: string) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/pricing')
      return
    }

    setPurchasingPlan(pkgId)
    try {
      const result = await orderService.purchasePackage(pkgId)
      
      if (result && result.checkoutUrl) {
        // Redirect to PayOS checkout page
        window.location.href = result.checkoutUrl
      } else {
        // Fallback for packages that might not need payment
        toast({
          title: 'Purchase Successful',
          description: `You have successfully purchased the ${planName} package.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Purchase Failed',
        description: error.response?.data?.message || 'Something went wrong.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    } finally {
      setPurchasingPlan(null)
    }
  }

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
          <Text color="#8A8A93" maxW="500px">
            Unlock your full potential with our premium memberships and online programs.
          </Text>
        </Stack>

        {/* Pricing Cards Grid */}
        {isLoading ? (
          <Flex justify="center" align="center" h="40vh">
            <Spinner color="#e03030" size="xl" />
          </Flex>
        ) : error ? (
          <Text color="red.500">Failed to load packages.</Text>
        ) : (
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap="6"
            w="full"
            mb="16"
            px={{ base: '0', lg: '8' }}
          >
            {packages?.filter((p: any) => p.isActive !== false && !p.name.includes('(Old)')).map((pkg: any) => {
              const isPopular = pkg.isPopular;
              return (
                <Flex
                  key={pkg.id}
                  bg="#141414"
                  border={isPopular ? '2px solid' : '1px solid'}
                  borderColor={isPopular ? '#e03030' : '#262626'}
                  borderRadius="32px"
                  p="6"
                  direction="column"
                  boxShadow="md"
                  position="relative"
                  transition="all 0.2s"
                  transform={isPopular ? { base: 'none', md: 'translateY(-16px)' } : 'none'}
                  _hover={{ borderColor: isPopular ? '#e03030' : '#33343c' }}
                >
                  {/* Popular ribbon */}
                  {isPopular && (
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
                      {pkg.name}
                    </Heading>
                    <HStack align="baseline" spacing="1">
                      <Text fontSize="32px" fontWeight="700" color="white">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                      </Text>
                    </HStack>
                    <Text fontSize="12px" color="#8A8A93" mt="2">
                      Duration: {pkg.durationDays} days
                    </Text>
                  </Box>

                  {/* Features List */}
                  <Stack spacing="3" mb="8" flex="1">
                    <Text color="#e2e1eb" fontSize="14px">{pkg.description}</Text>
                    <HStack spacing="2" align="center" mt="4">
                      <Box as="span" className="material-symbols-outlined" style={{ color: '#e03030', fontSize: '18px' }}>check</Box>
                      <Text fontSize="13px" color="#e2e1eb">Access to Platform</Text>
                    </HStack>
                    <HStack spacing="2" align="center">
                      <Box as="span" className="material-symbols-outlined" style={{ color: '#e03030', fontSize: '18px' }}>check</Box>
                      <Text fontSize="13px" color="#e2e1eb">Progress Tracking</Text>
                    </HStack>
                  </Stack>

                  {/* Purchase Button */}
                  <AppButton
                    label={purchasingPlan === pkg.id ? 'Processing...' : 'Purchase Plan'}
                    variant={isPopular ? 'solid' : 'ghost'}
                    w="full"
                    bg={isPopular ? '#e03030' : '#1a1a1a'}
                    color={isPopular ? 'white' : '#e2e1eb'}
                    _hover={{ bg: isPopular ? '#c92424' : '#262626', color: 'white' }}
                    onClick={() => handlePurchaseClick(pkg.id, pkg.name)}
                    isDisabled={purchasingPlan !== null}
                  />
                </Flex>
              )
            })}
          </Grid>
        )}

        {/* ===================== COMPARISON TABLE ===================== */}
        <Box w="full" px={{ base: '0', lg: '8' }}>
          <Heading fontSize={{ base: '24px', md: '28px' }} color="white" fontWeight="700" textAlign="center" mb="8">
            Compare Features
          </Heading>
          <Box overflowX="auto" bg="#141414" border="1px solid" borderColor="#262626" borderRadius="24px" p="6">
            <Table variant="unstyled" size="sm">
              <Thead borderBottom="1px solid" borderColor="#262626">
                <Tr>
                  <Th color="#8A8A93" fontSize="12px" py="4" px="4">Features</Th>
                  <Th color="white" fontSize="12px" py="4" px="4" textAlign="center">Membership</Th>
                  <Th color="#e03030" fontSize="12px" py="4" px="4" textAlign="center">Online Workout</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr borderBottom="1px solid" borderColor="#262626">
                  <Td color="#e2e1eb" fontSize="14px" py="4" px="4">Gym Access</Td>
                  <Td textAlign="center" color="#e03030"><span className="material-symbols-outlined">check</span></Td>
                  <Td textAlign="center" color="#33343c"><span className="material-symbols-outlined">close</span></Td>
                </Tr>
                <Tr borderBottom="1px solid" borderColor="#262626">
                  <Td color="#e2e1eb" fontSize="14px" py="4" px="4">Basic Workouts</Td>
                  <Td textAlign="center" color="#e03030"><span className="material-symbols-outlined">check</span></Td>
                  <Td textAlign="center" color="#e03030"><span className="material-symbols-outlined">check</span></Td>
                </Tr>
                <Tr borderBottom="1px solid" borderColor="#262626">
                  <Td color="#e2e1eb" fontSize="14px" py="4" px="4">AI Program Generation</Td>
                  <Td textAlign="center" color="#e03030"><span className="material-symbols-outlined">check</span></Td>
                  <Td textAlign="center" color="#e03030"><span className="material-symbols-outlined">check</span></Td>
                </Tr>
                <Tr>
                  <Td color="#e2e1eb" fontSize="14px" py="4" px="4">1-on-1 PT Coaching</Td>
                  <Td textAlign="center" color="#33343c"><span className="material-symbols-outlined">close</span></Td>
                  <Td textAlign="center" color="#e03030"><span className="material-symbols-outlined">check</span></Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
      <PublicFooter />
    </Box>
  )
}

export default Pricing
