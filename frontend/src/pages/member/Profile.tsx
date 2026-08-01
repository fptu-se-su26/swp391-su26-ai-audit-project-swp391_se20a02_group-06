import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
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
    Button,
    Badge,
    Divider,
    Spinner,
    useToast
} from '@chakra-ui/react'
import { FiEdit2, FiCheck, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import MemberLayout from '../../components/shared/Layout/MemberLayout'
import BodyMetricsModal from './components/BodyMetricsModal'
import ChangePasswordModal from './components/ChangePasswordModal'
import { getLatestBodyMetric, addBodyMetric, type BodyMetric } from '../../api/bodyMetrics'
import { getProfile, type UserProfile } from '../../api/user'

const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never changed';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Changed today';
    if (diffDays < 30) return `Last changed ${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `Last changed ${diffMonths} months ago`;
    const diffYears = Math.floor(diffDays / 365);
    return `Last changed ${diffYears} years ago`;
}

const Profile: React.FC = () => {
    const { data: profile, isLoading: isProfileLoading, mutate: mutateProfile } = useSWR('profile', () => getProfile())
    const { data: metric, isLoading: isMetricLoading, mutate: mutateMetric } = useSWR('latest-metric', () => getLatestBodyMetric())
    const loading = isProfileLoading || isMetricLoading

    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()
    const logout = useAuthStore(state => state.logout)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Automatically open metric modal if no metric exists
    useEffect(() => {
        if (!isMetricLoading && metric === null) {
            setIsMetricModalOpen(true)
        }
    }, [isMetricLoading, metric])

    const handleSaveMetrics = async (data: { age: number; gender: string; height: number; weight: number }) => {
        const newMetric = await addBodyMetric(data)
        setMetric(newMetric)
        toast({ title: 'Body Metrics saved successfully', status: 'success', duration: 3000 })
    }

    const handlePasswordSuccess = () => {
        mutateProfile() // Reload to get updated passwordChangedAt
    }

    return (
        <MemberLayout>
            <Box w="full" minH="100vh" bg="#0A0C10" p="6" pb="24">
                {/* Header */}
                <Flex justify="space-between" align="center" mb="8">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        Control Center
                    </Heading>

                </Flex>

                <Grid templateColumns="1fr 340px" gap="6">
                    {/* Left Column */}
                    <Stack spacing="6">
                        {/* Profile Header Card */}
                        <Box bg="#111318" border="1px solid #1e2028" borderRadius="20px" p="6">
                            <Flex justify="space-between" align="flex-start">
                                <Box>
                                    <Heading fontSize="20px" fontWeight="800" color="white" mb="2">
                                        {profile?.name ? `${profile.name} Profile` : "Member Profile"}
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
                                        onClick={() => setIsMetricModalOpen(true)}
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
                            {loading ? (
                                <Flex justify="center"><Spinner color="#E03030" /></Flex>
                            ) : (
                                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                                    <Box>
                                        <Text fontSize="13px" color="#8A8A93" mb="1">User Name</Text>
                                        <Text fontSize="15px" fontWeight="600" color="white">{profile?.name || '--'}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="13px" color="#8A8A93" mb="1">Email Address</Text>
                                        <Text fontSize="15px" fontWeight="600" color="white">{profile?.email || '--'}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="13px" color="#8A8A93" mb="1">Membership Tier</Text>
                                        <Badge bg="rgba(224,48,48,0.1)" color="#E03030" px="2" py="0.5" borderRadius="4px">{profile?.tier || '--'}</Badge>
                                    </Box>
                                    <Box>
                                        <Text fontSize="13px" color="#8A8A93" mb="1">Join Date</Text>
                                        <Text fontSize="15px" fontWeight="600" color="white">{profile?.joinDate || '--'}</Text>
                                    </Box>
                                </Grid>
                            )}
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
                                        <Text fontSize="12px" color="#8A8A93">{loading ? 'Loading...' : formatTimeAgo(profile?.passwordChangedAt || null)}</Text>
                                    </Box>
                                    <Button size="sm" variant="outline" border="1px solid #2e3040" color="#E2E1EB" _hover={{ bg: '#1e2028' }} onClick={() => setIsPasswordModalOpen(true)}>Update</Button>
                                </Flex>
                                {/* <Flex justify="space-between" align="center" p="4" bg="#0A0C10" borderRadius="12px" border="1px solid #1e2028">
                                    <Box>
                                        <Text fontSize="14px" fontWeight="600" color="white">Two-Factor Auth</Text>
                                        <Text fontSize="12px" color="#8A8A93">Add an extra layer of security</Text>
                                    </Box>
                                    <Button size="sm" variant="outline" border="1px solid #2e3040" color="#E2E1EB" _hover={{ bg: '#1e2028' }}>Enable</Button>
                                </Flex> */}
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
                            <Avatar size="2xl" name={profile?.name || "User"} src={profile?.avatarUrl || ""} border="4px solid #111318" mt="4" mb="4" position="relative" zIndex="1" />
                            <Heading fontSize="22px" fontWeight="800" color="white" mb="1">
                                {profile?.name || "Member"}
                            </Heading>
                            <Text fontSize="14px" color="#8A8A93" mb="6">
                                {profile?.tier || '--'} Tier
                            </Text>

                            <Divider borderColor="#2e3040" mb="6" />

                            <VStack align="stretch" spacing="4">
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Workouts Completed</Text>
                                    <Text fontSize="14px" fontWeight="700" color="white">{loading ? '--' : profile?.workoutsCompleted}</Text>
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Current Streak</Text>
                                    <HStack spacing="1">
                                        <Text fontSize="14px" fontWeight="700" color="#E03030">{loading ? '--' : `${profile?.currentStreak} Days`}</Text>
                                        <Text fontSize="14px" color="white">🔥</Text>
                                    </HStack>
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Active Plan</Text>
                                    <Badge bg="rgba(72,187,120,0.1)" color="#48BB78" px="2" py="0.5" borderRadius="4px">{loading ? '--' : profile?.activePlan}</Badge>
                                </Flex>
                            </VStack>

                            <Button 
                                w="full" 
                                mt="8" 
                                bg="#1e2028" 
                                color="white" 
                                _hover={{ bg: '#e03030', color: 'white' }} 
                                rightIcon={<FiLogOut />}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Box>

            <BodyMetricsModal
                isOpen={isMetricModalOpen}
                onClose={() => setIsMetricModalOpen(false)}
                onSave={handleSaveMetrics}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSuccess={handlePasswordSuccess}
            />
        </MemberLayout>
    )
}

export default Profile