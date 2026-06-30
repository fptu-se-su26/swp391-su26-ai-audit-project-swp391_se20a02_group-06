import React, { useEffect, useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Stack,
    HStack,
    VStack,
    Avatar,
    Grid,
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
    Button,
    Badge,
    Divider,
    Spinner,
    useToast
} from '@chakra-ui/react'
import { FiSearch, FiBell, FiEdit2, FiCheck, FiChevronRight } from 'react-icons/fi'
import MemberLayout from '../../components/shared/Layout/MemberLayout'
import BodyMetricsModal from './components/BodyMetricsModal'
import { getLatestBodyMetric, addBodyMetric, type BodyMetric } from '../../api/bodyMetrics'

const Profile: React.FC = () => {
    const [metric, setMetric] = useState<BodyMetric | null>(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toast = useToast()

    const loadMetric = async () => {
        try {
            const data = await getLatestBodyMetric()
            if (data) {
                setMetric(data)
            } else {
                setIsModalOpen(true)
            }
        } catch (error) {
            console.error("Failed to fetch metric", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMetric()
    }, [])

    const handleSaveMetrics = async (data: { age: number; gender: string; height: number; weight: number }) => {
        const newMetric = await addBodyMetric(data)
        setMetric(newMetric)
        toast({ title: 'Đã lưu thông tin Body Metrics', status: 'success', duration: 3000 })
    }

    return (
        <MemberLayout>
            <Box w="full" minH="100vh" bg="#0A0C10" p="6" pb="24">
                {/* Header */}
                <Flex justify="space-between" align="center" mb="8">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        Control Center
                    </Heading>
                    <HStack spacing="4">
                        <InputGroup w="300px">
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FiSearch} color="#8A8A93" />
                            </InputLeftElement>
                            <Input 
                                placeholder="Search settings..." 
                                bg="#111318" 
                                border="1px solid #1e2028"
                                color="white"
                                _placeholder={{ color: '#4e5060' }}
                                _focus={{ borderColor: '#E03030', boxShadow: 'none' }}
                                borderRadius="12px"
                            />
                        </InputGroup>
                        <Box p="3" bg="#111318" border="1px solid #1e2028" borderRadius="12px" cursor="pointer" _hover={{ bg: '#1a1c23' }}>
                            <Icon as={FiBell} color="#8A8A93" boxSize="5" />
                        </Box>
                        <Avatar size="sm" name="Alex Mercer" src="https://bit.ly/dan-abramov" border="2px solid #2e3040" />
                    </HStack>
                </Flex>

                <Grid templateColumns="1fr 340px" gap="6">
                    {/* Left Column */}
                    <Stack spacing="6">
                        {/* Profile Header Card */}
                        <Box bg="#111318" border="1px solid #1e2028" borderRadius="20px" p="6">
                            <Flex justify="space-between" align="flex-start">
                                <Box>
                                    <Heading fontSize="20px" fontWeight="800" color="white" mb="2">
                                        Athlete Profile
                                    </Heading>
                                    <Text fontSize="14px" color="#8A8A93">
                                        Manage your biometric data and account preferences
                                    </Text>
                                </Box>
                                <HStack spacing="3">
                                    <Button 
                                        leftIcon={<FiEdit2 />} 
                                        variant="outline" 
                                        border="1px solid #2e3040" 
                                        bg="transparent" 
                                        color="#E2E1EB" 
                                        _hover={{ bg: '#1e2028' }}
                                        size="sm"
                                        borderRadius="8px"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button 
                                        leftIcon={<FiCheck />} 
                                        bg="#E03030" 
                                        color="white" 
                                        _hover={{ bg: '#c22727' }}
                                        size="sm"
                                        borderRadius="8px"
                                    >
                                        Save Changes
                                    </Button>
                                </HStack>
                            </Flex>
                        </Box>

                        {/* Biometric Overview */}
                        <Box bg="#111318" border="1px solid #1e2028" borderRadius="20px" p="6">
                            <Flex justify="space-between" align="center" mb="5">
                                <Heading fontSize="16px" fontWeight="700" color="white">
                                    Biometric Overview
                                </Heading>
                            </Flex>
                            
                            {loading ? (
                                <Flex justify="center" p="10"><Spinner color="#E03030" /></Flex>
                            ) : (
                                <Grid templateColumns="repeat(3, 1fr)" gap="4">
                                    {/* Height */}
                                    <Box bg="#0A0C10" p="4" borderRadius="16px" border="1px solid #1e2028">
                                        <Text fontSize="12px" fontWeight="700" color="#8A8A93" textTransform="uppercase" mb="2">
                                            Height
                                        </Text>
                                        <HStack align="baseline">
                                            <Heading fontSize="28px" fontWeight="800" color="white">
                                                {metric?.height || '--'}
                                            </Heading>
                                            <Text fontSize="14px" fontWeight="600" color="#4e5060">
                                                cm
                                            </Text>
                                        </HStack>
                                    </Box>

                                    {/* Weight */}
                                    <Box bg="#0A0C10" p="4" borderRadius="16px" border="1px solid #1e2028">
                                        <Text fontSize="12px" fontWeight="700" color="#8A8A93" textTransform="uppercase" mb="2">
                                            Weight
                                        </Text>
                                        <HStack align="baseline" mb="1">
                                            <Heading fontSize="28px" fontWeight="800" color="white">
                                                {metric?.weight || '--'}
                                            </Heading>
                                            <Text fontSize="14px" fontWeight="600" color="#4e5060">
                                                kg
                                            </Text>
                                        </HStack>
                                        <Badge bg="rgba(224,48,48,0.1)" color="#E03030" textTransform="none" px="2" py="0.5" borderRadius="4px" fontSize="10px">
                                            Recorded recently
                                        </Badge>
                                    </Box>

                                    {/* BMI */}
                                    <Box bg="#0A0C10" p="4" borderRadius="16px" border="1px solid #1e2028">
                                        <Text fontSize="12px" fontWeight="700" color="#8A8A93" textTransform="uppercase" mb="2">
                                            BMI
                                        </Text>
                                        <HStack align="baseline" mb="1">
                                            <Heading fontSize="28px" fontWeight="800" color="white">
                                                {metric?.bmi ? metric.bmi.toFixed(1) : '--'}
                                            </Heading>
                                        </HStack>
                                        <Badge bg="rgba(72,187,120,0.1)" color="#48BB78" textTransform="none" px="2" py="0.5" borderRadius="4px" fontSize="10px">
                                            Optimal Range
                                        </Badge>
                                    </Box>
                                </Grid>
                            )}
                        </Box>

                        {/* Account Information */}
                        <Box bg="#111318" border="1px solid #1e2028" borderRadius="20px" p="6">
                            <Heading fontSize="16px" fontWeight="700" color="white" mb="5">
                                Account Information
                            </Heading>
                            <Grid templateColumns="repeat(2, 1fr)" gap="6">
                                <Box>
                                    <Text fontSize="13px" color="#8A8A93" mb="1">User Name</Text>
                                    <Text fontSize="15px" fontWeight="600" color="white">Alex Mercer</Text>
                                </Box>
                                <Box>
                                    <Text fontSize="13px" color="#8A8A93" mb="1">Email Address</Text>
                                    <Text fontSize="15px" fontWeight="600" color="white">alex.titan@example.com</Text>
                                </Box>
                                <Box>
                                    <Text fontSize="13px" color="#8A8A93" mb="1">Membership Tier</Text>
                                    <Badge bg="rgba(224,48,48,0.1)" color="#E03030" px="2" py="0.5" borderRadius="4px">Pro Athlete</Badge>
                                </Box>
                                <Box>
                                    <Text fontSize="13px" color="#8A8A93" mb="1">Join Date</Text>
                                    <Text fontSize="15px" fontWeight="600" color="white">Oct 12, 2023</Text>
                                </Box>
                            </Grid>
                        </Box>

                        {/* Security & Access */}
                        <Box bg="#111318" border="1px solid #1e2028" borderRadius="20px" p="6">
                            <Heading fontSize="16px" fontWeight="700" color="white" mb="5">
                                Security & Access
                            </Heading>
                            <Stack spacing="4">
                                <Flex justify="space-between" align="center" p="4" bg="#0A0C10" borderRadius="12px" border="1px solid #1e2028">
                                    <Box>
                                        <Text fontSize="14px" fontWeight="600" color="white">Password</Text>
                                        <Text fontSize="12px" color="#8A8A93">Last changed 3 months ago</Text>
                                    </Box>
                                    <Button size="sm" variant="outline" border="1px solid #2e3040" color="#E2E1EB" _hover={{ bg: '#1e2028' }}>Update</Button>
                                </Flex>
                                <Flex justify="space-between" align="center" p="4" bg="#0A0C10" borderRadius="12px" border="1px solid #1e2028">
                                    <Box>
                                        <Text fontSize="14px" fontWeight="600" color="white">Two-Factor Auth</Text>
                                        <Text fontSize="12px" color="#8A8A93">Add an extra layer of security</Text>
                                    </Box>
                                    <Button size="sm" variant="outline" border="1px solid #2e3040" color="#E2E1EB" _hover={{ bg: '#1e2028' }}>Enable</Button>
                                </Flex>
                            </Stack>
                        </Box>
                    </Stack>

                    {/* Right Column - ID Card */}
                    <Box>
                        <Box bg="#111318" border="1px solid #1e2028" borderRadius="24px" p="6" textAlign="center" position="relative" overflow="hidden">
                            <Box 
                                position="absolute" 
                                top="0" 
                                left="0" 
                                right="0" 
                                h="100px" 
                                bg="linear-gradient(180deg, rgba(224,48,48,0.15) 0%, rgba(17,19,24,0) 100%)" 
                            />
                            <Avatar size="2xl" name="Alex Mercer" src="https://bit.ly/dan-abramov" border="4px solid #111318" mt="4" mb="4" position="relative" zIndex="1" />
                            <Heading fontSize="22px" fontWeight="800" color="white" mb="1">
                                Alex "Titan" Mercer
                            </Heading>
                            <Text fontSize="14px" color="#8A8A93" mb="6">
                                Pro Athlete Tier
                            </Text>
                            
                            <Divider borderColor="#2e3040" mb="6" />

                            <VStack align="stretch" spacing="4">
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Workouts Completed</Text>
                                    <Text fontSize="14px" fontWeight="700" color="white">142</Text>
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Current Streak</Text>
                                    <HStack spacing="1">
                                        <Text fontSize="14px" fontWeight="700" color="#E03030">12 Days</Text>
                                        <Text fontSize="14px" color="white">🔥</Text>
                                    </HStack>
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Active Plan</Text>
                                    <Badge bg="rgba(72,187,120,0.1)" color="#48BB78" px="2" py="0.5" borderRadius="4px">Hypertrophy Pro</Badge>
                                </Flex>
                            </VStack>

                            <Button w="full" mt="8" bg="#1e2028" color="white" _hover={{ bg: '#2e3040' }} rightIcon={<FiChevronRight />}>
                                View Public Profile
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Box>

            <BodyMetricsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveMetrics} 
            />
        </MemberLayout>
    )
}

export default Profile