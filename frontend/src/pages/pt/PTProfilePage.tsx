import React, { useEffect, useState, useRef } from 'react'
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
    useToast,
    Input,
    Textarea,
    FormControl,
    FormLabel,
} from '@chakra-ui/react'
import { FiEdit2, FiCheck, FiLogOut, FiUpload } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import { getPTProfile, updatePTProfile, type PTProfile, type UpdatePTProfilePayload } from '../../api/ptProfile'
import { getLatestBodyMetric, addBodyMetric, type BodyMetric } from '../../api/bodyMetrics'
import BodyMetricsModal from '../member/components/BodyMetricsModal'
import ChangePasswordModal from '../member/components/ChangePasswordModal'
import { uploadImage } from '../../api/upload'



const PTProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<PTProfile | null>(null)
    const [metric, setMetric] = useState<BodyMetric | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const toast = useToast()
    const navigate = useNavigate()
    const logout = useAuthStore(state => state.logout)

    // Editable fields
    const [editFullName, setEditFullName] = useState('')
    const [editBio, setEditBio] = useState('')
    const [editExperienceYears, setEditExperienceYears] = useState('')
    const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null)

    const loadData = async () => {
        try {
            setLoading(true)
            const [profileData, metricData] = await Promise.all([
                getPTProfile(),
                getLatestBodyMetric().catch(() => null),
            ])

            if (profileData) {
                setProfile(profileData)
                setEditFullName(profileData.fullName)
                setEditBio(profileData.bio || '')
                setEditExperienceYears(profileData.experienceYears?.toString() || '')
                setEditAvatarUrl(profileData.avatarUrl)
            }
            if (metricData) {
                setMetric(metricData)
            } else {
                setIsMetricModalOpen(true)
            }
        } catch (error) {
            console.error("Failed to fetch PT profile", error)
            toast({ title: 'Failed to load profile', status: 'error', duration: 3000 })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadImage(formData)
            const url = result.url;
            setEditAvatarUrl(url)
            toast({ title: 'Avatar uploaded', status: 'success', duration: 2000 })
        } catch (error) {
            toast({ title: 'Failed to upload avatar', status: 'error', duration: 3000 })
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const payload: UpdatePTProfilePayload = {
                fullName: editFullName,
                bio: editBio,
                experienceYears: editExperienceYears ? parseInt(editExperienceYears) : undefined,
                avatarUrl: editAvatarUrl || undefined,
            }

            await updatePTProfile(payload)
            toast({ title: 'Profile updated successfully', status: 'success', duration: 3000 })
            setIsEditing(false)
            loadData()
        } catch (error: any) {
            toast({
                title: 'Update failed',
                description: error.response?.data?.message || 'Something went wrong',
                status: 'error',
                duration: 3000,
            })
        } finally {
            setSaving(false)
        }
    }

    const handleSaveMetrics = async (data: { age: number; gender: string; height: number; weight: number }) => {
        const newMetric = await addBodyMetric(data)
        setMetric(newMetric)
        toast({ title: 'Body Metrics saved successfully', status: 'success', duration: 3000 })
    }

    const handlePasswordSuccess = () => {
        loadData()
    }

    return (
        <AdminLayout title="PT Profile">
            <Box w="full" minH="100vh" bg="#0A0C10" p="6" pb="24">
                {/* Header */}
                <Flex justify="space-between" align="center" mb="8">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        PT Control Center
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
                                        {profile?.fullName ? `${profile.fullName} Profile` : "PT Profile"}
                                    </Heading>
                                    <Text fontSize="14px" color="#8A8A93">
                                        Manage your profile, biometrics, and account preferences
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
                                        onClick={() => {
                                            setIsEditing(!isEditing)
                                            if (!isEditing) {
                                                setEditFullName(profile?.fullName || '')
                                                setEditBio(profile?.bio || '')
                                                setEditExperienceYears(profile?.experienceYears?.toString() || '')
                                                setEditAvatarUrl(profile?.avatarUrl || null)
                                            }
                                        }}
                                    >
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </Button>
                                    {isEditing && (
                                        <Button
                                            leftIcon={<FiCheck />}
                                            bg="#E03030"
                                            color="white"
                                            _hover={{ bg: '#c22727' }}
                                            size="sm"
                                            borderRadius="8px"
                                            onClick={handleSave}
                                            isLoading={saving}
                                        >
                                            Save Changes
                                        </Button>
                                    )}
                                </HStack>
                            </Flex>
                        </Box>

                        {/* Editable Profile Fields */}
                        {isEditing && (
                            <Box bg="#111318" border="1px solid #1e2028" borderRadius="20px" p="6">
                                <Heading fontSize="16px" fontWeight="700" color="white" mb="5">
                                    Edit Profile
                                </Heading>
                                <Stack spacing="4">
                                    <FormControl>
                                        <FormLabel color="#8A8A93" fontSize="13px">FULL NAME</FormLabel>
                                        <Input
                                            value={editFullName}
                                            onChange={(e) => setEditFullName(e.target.value)}
                                            placeholder="Your full name"
                                            bg="#0A0C10"
                                            borderColor="#1e2028"
                                            color="white"
                                            _hover={{ borderColor: '#E03030' }}
                                            _focus={{ borderColor: '#E03030', boxShadow: 'none' }}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color="#8A8A93" fontSize="13px">BIO</FormLabel>
                                        <Textarea
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            placeholder="Tell members about yourself..."
                                            bg="#0A0C10"
                                            borderColor="#1e2028"
                                            color="white"
                                            minH="100px"
                                            _hover={{ borderColor: '#E03030' }}
                                            _focus={{ borderColor: '#E03030', boxShadow: 'none' }}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel color="#8A8A93" fontSize="13px">EXPERIENCE (YEARS)</FormLabel>
                                        <Input
                                            type="number"
                                            value={editExperienceYears}
                                            onChange={(e) => setEditExperienceYears(e.target.value)}
                                            placeholder="e.g. 5"
                                            bg="#0A0C10"
                                            borderColor="#1e2028"
                                            color="white"
                                            _hover={{ borderColor: '#E03030' }}
                                            _focus={{ borderColor: '#E03030', boxShadow: 'none' }}
                                        />
                                    </FormControl>
                                </Stack>
                            </Box>
                        )}

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
                                    <Box bg="#0A0C10" p="4" borderRadius="16px" border="1px solid #1e2028">
                                        <Text fontSize="12px" fontWeight="700" color="#8A8A93" textTransform="uppercase" mb="2">Height</Text>
                                        <HStack align="baseline">
                                            <Heading fontSize="28px" fontWeight="800" color="white">{metric?.height || '--'}</Heading>
                                            <Text fontSize="14px" fontWeight="600" color="#4e5060">cm</Text>
                                        </HStack>
                                    </Box>
                                    <Box bg="#0A0C10" p="4" borderRadius="16px" border="1px solid #1e2028">
                                        <Text fontSize="12px" fontWeight="700" color="#8A8A93" textTransform="uppercase" mb="2">Weight</Text>
                                        <HStack align="baseline" mb="1">
                                            <Heading fontSize="28px" fontWeight="800" color="white">{metric?.weight || '--'}</Heading>
                                            <Text fontSize="14px" fontWeight="600" color="#4e5060">kg</Text>
                                        </HStack>
                                        <Badge bg="rgba(224,48,48,0.1)" color="#E03030" textTransform="none" px="2" py="0.5" borderRadius="4px" fontSize="10px">Recorded recently</Badge>
                                    </Box>
                                    <Box bg="#0A0C10" p="4" borderRadius="16px" border="1px solid #1e2028">
                                        <Text fontSize="12px" fontWeight="700" color="#8A8A93" textTransform="uppercase" mb="2">BMI</Text>
                                        <HStack align="baseline" mb="1">
                                            <Heading fontSize="28px" fontWeight="800" color="white">{metric?.bmi ? metric.bmi.toFixed(1) : '--'}</Heading>
                                        </HStack>
                                        <Badge bg="rgba(72,187,120,0.1)" color="#48BB78" textTransform="none" px="2" py="0.5" borderRadius="4px" fontSize="10px">Optimal Range</Badge>
                                    </Box>
                                </Grid>
                            )}
                        </Box>

                        {/* Professional Information */}
                        <Box bg="#111318" border="1px solid #1e2028" borderRadius="20px" p="6">
                            <Heading fontSize="16px" fontWeight="700" color="white" mb="5">
                                Professional Information
                            </Heading>
                            {loading ? (
                                <Flex justify="center"><Spinner color="#E03030" /></Flex>
                            ) : (
                                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                                    <Box>
                                        <Text fontSize="13px" color="#8A8A93" mb="1">Full Name</Text>
                                        <Text fontSize="15px" fontWeight="600" color="white">{profile?.fullName || '--'}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="13px" color="#8A8A93" mb="1">Email Address</Text>
                                        <Text fontSize="15px" fontWeight="600" color="white">{profile?.email || '--'}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="13px" color="#8A8A93" mb="1">Experience</Text>
                                        <Text fontSize="15px" fontWeight="600" color="white">{profile?.experienceYears ? `${profile.experienceYears} years` : '--'}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="13px" color="#8A8A93" mb="1">Rating</Text>
                                        <Badge bg="rgba(224,48,48,0.1)" color="#E03030" px="2" py="0.5" borderRadius="4px">{profile?.rating?.toFixed(1) ?? '5.0'} ⭐</Badge>
                                    </Box>
                                    <Box gridColumn="span 2">
                                        <Text fontSize="13px" color="#8A8A93" mb="1">Bio</Text>
                                        <Text fontSize="14px" color="white">{profile?.bio || 'No bio yet.'}</Text>
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
                                        <Text fontSize="12px" color="#8A8A93">{loading ? 'Loading...' : 'Update your password regularly'}</Text>
                                    </Box>
                                    <Button size="sm" variant="outline" border="1px solid #2e3040" color="#E2E1EB" _hover={{ bg: '#1e2028' }} onClick={() => setIsPasswordModalOpen(true)}>Update</Button>
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
                            <Box position="relative" zIndex="1" display="flex" flexDirection="column" alignItems="center">
                                <Avatar
                                    size="2xl"
                                    name={profile?.fullName || "PT"}
                                    src={editAvatarUrl || profile?.avatarUrl || ""}
                                    border="4px solid #111318"
                                    mt="4"
                                />
                                {isEditing && (
                                    <>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                        />
                                        <Button
                                            size="xs"
                                            leftIcon={<FiUpload />}
                                            bg="#1e2028"
                                            color="white"
                                            _hover={{ bg: '#E03030' }}
                                            onClick={() => fileInputRef.current?.click()}
                                            mt="3"
                                        >
                                            Upload Avatar
                                        </Button>
                                    </>
                                )}
                            </Box>
                            <Heading fontSize="22px" fontWeight="800" color="white" mb="1">
                                {profile?.fullName || "PT"}
                            </Heading>
                            <Text fontSize="14px" color="#8A8A93" mb="6">
                                Personal Trainer
                            </Text>

                            <Divider borderColor="#2e3040" mb="6" />

                            <VStack align="stretch" spacing="4">
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Experience</Text>
                                    <Text fontSize="14px" fontWeight="700" color="white">{loading ? '--' : profile?.experienceYears ? `${profile.experienceYears} years` : 'N/A'}</Text>
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Rating</Text>
                                    <HStack spacing="1">
                                        <Text fontSize="14px" fontWeight="700" color="#E03030">{loading ? '--' : profile?.rating?.toFixed(1) ?? '5.0'}</Text>
                                        <Text fontSize="14px">⭐</Text>
                                    </HStack>
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="13px" color="#8A8A93">Email</Text>
                                    <Badge bg="rgba(72,187,120,0.1)" color="#48BB78" px="2" py="0.5" borderRadius="4px" fontSize="11px" maxW="160px" isTruncated>{loading ? '--' : profile?.email}</Badge>
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
        </AdminLayout>
    )
}

export default PTProfilePage
