import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Flex, Text, Heading, Icon, Button, Spinner,
} from '@chakra-ui/react'
import { FiX, FiCheck, FiCheckCircle, FiAward } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../../../lib/axios'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

interface PlanSidebarProps {
    isOpen: boolean
    onClose: () => void
}

const formatDate = (d: Date): string => {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const PlanSidebar: React.FC<PlanSidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const { data: membership, isLoading: loadingM } = useSWR('/membership/my', fetcher)
    const { data: packages, isLoading: loadingP } = useSWR('/product-packages', fetcher)

    const currentPlanName = membership?.packageName || 'Free'
    const isActive = membership?.isActive ?? false
    const startDate = membership?.startDate ? new Date(membership.startDate) : null
    const endDate = membership?.endDate ? new Date(membership.endDate) : null
    const now = new Date()

    let progressPercent = 0
    let remainingDays = 0
    if (startDate && endDate && isActive) {
        const total = endDate.getTime() - startDate.getTime()
        const elapsed = now.getTime() - startDate.getTime()
        progressPercent = total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 100
        remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    }

    const currentPackageId = membership?.packageId

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    return (
        <>
            <Box
                position="fixed" inset="0" bg="blackAlpha.700" backdropFilter="blur(4px)"
                zIndex={60}
                opacity={isOpen ? 1 : 0}
                pointerEvents={isOpen ? 'auto' : 'none'}
                transition="opacity 0.3s"
                onClick={onClose}
            />
            <Box
                position="fixed" top="0" right="0" h="full"
                w={{ base: 'full', sm: '400px' }}
                bg="#141414" borderLeft="1px solid" borderColor="rgba(255,255,255,0.08)"
                zIndex={70}
                transform={isOpen ? 'translateX(0)' : 'translateX(100%)'}
                transition="transform 0.3s"
                display="flex" flexDirection="column"
                boxShadow="2xl"
            >
                <Flex
                    p="6" borderBottom="1px solid" borderColor="rgba(255,255,255,0.06)" bg="#0C0C0C"
                    justify="space-between" align="center"
                >
                    <Heading fontSize="18px" fontWeight="600" color="white">Your Subscription</Heading>
                    <Flex as="button" p="2" borderRadius="full" color="#8A8A93"
                        _hover={{ color: 'white', bg: 'rgba(255,255,255,0.06)' }} onClick={onClose}
                    >
                        <Icon as={FiX} boxSize="20px" />
                    </Flex>
                </Flex>

                <Box flex="1" overflowY="auto" p="6">
                    {loadingM || loadingP ? (
                        <Flex justify="center" py="10"><Spinner color="#E03030" /></Flex>
                    ) : (
                        <>
                            {/* Current Plan */}
                            <Box mb="8">
                                <Flex align="center" gap="2" mb="3">
                                    <Box fontSize="10px" fontWeight="700" letterSpacing="0.05em" textTransform="uppercase"
                                        color="#E03030" bg="rgba(224,48,48,0.15)" px="2" py="1" borderRadius="full"
                                        border="1px solid" borderColor="rgba(224,48,48,0.25)"
                                    >
                                        CURRENT TIER
                                    </Box>
                                </Flex>

                                {isActive ? (
                                    <>
                                        <Heading fontSize="28px" fontWeight="700" color="white" mb="1">
                                            {currentPlanName}
                                        </Heading>
                                        <Text fontSize="14px" color="#8A8A93" mb="4">
                                            {membership?.status === 'ACTIVE' ? 'Active' : currentPlanName} Access
                                        </Text>

                                        <Box bg="#1A1A1A" borderRadius="16px" p="4" border="1px solid" borderColor="rgba(255,255,255,0.08)" mb="4">
                                            <Flex justify="space-between" align="center" mb="2">
                                                <Text fontSize="12px" color="#8A8A93">Status</Text>
                                                <Flex align="center" gap="1" color="#4ADE80" fontWeight="600" fontSize="14px">
                                                    <Icon as={FiCheckCircle} boxSize="16px" />
                                                    <Text fontSize="14px" fontWeight="600">Active</Text>
                                                </Flex>
                                            </Flex>
                                            {endDate && (
                                                <Flex justify="space-between" align="center" mb="4">
                                                    <Text fontSize="12px" color="#8A8A93">Renewal Date</Text>
                                                    <Text fontSize="14px" fontWeight="600" color="white">{formatDate(endDate)}</Text>
                                                </Flex>
                                            )}
                                            {/* Progress bar */}
                                            <Box w="full" h="4px" bg="#262626" mb="1" borderRadius="full" overflow="hidden">
                                                <Box w={`${progressPercent}%`} h="full" bg={`${progressPercent > 90 ? '#E03030' : '#E03030'}`} borderRadius="full" transition="width 0.5s ease" />
                                            </Box>
                                            <Text fontSize="11px" color="#8A8A93" textAlign="right">
                                                {remainingDays > 0 ? `${remainingDays} days remaining` : 'Expiring today'}
                                            </Text>
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        <Heading fontSize="28px" fontWeight="700" color="white" mb="1">Free</Heading>
                                        <Text fontSize="14px" color="#8A8A93" mb="4">No active plan</Text>
                                        <Box bg="#1A1A1A" borderRadius="16px" p="4" border="1px solid" borderColor="rgba(255,255,255,0.08)" mb="4">
                                            <Text fontSize="13px" color="#8A8A93">
                                                You're currently on the Free tier. Subscribe to unlock premium exercises and features.
                                            </Text>
                                        </Box>
                                    </>
                                )}
                            </Box>

                            {/* Package Carousel */}
                            <Box mb="8">
                                <Flex align="center" gap="2" mb="5">
                                    <Icon as={FiAward} color="#EAB308" boxSize="18px" />
                                    <Heading fontSize="16px" fontWeight="600" color="white">Available Plans</Heading>
                                </Flex>
                                <Box
                                    overflow="hidden"
                                    borderRadius="20px"
                                    role="group"
                                    py="3"
                                >
                                    <Box
                                        className="carousel-track"
                                        display="flex"
                                        gap="4"
                                        sx={{
                                            animation: 'scrollPackages 24s linear infinite',
                                            width: 'fit-content',
                                            '&:hover': { animationPlayState: 'paused' },
                                            '@keyframes scrollPackages': {
                                                '0%': { transform: 'translateX(0)' },
                                                '100%': { transform: 'translateX(-50%)' },
                                            },
                                        }}
                                    >
                                        {Array.isArray(packages) && [...packages.filter((p: any) => p.name !== 'Free'), ...packages.filter((p: any) => p.name !== 'Free')].map((pkg: any, idx: number) => {
                                            const isCurrent = pkg.id === currentPackageId
                                            return (
                                                <Box
                                                    key={`${pkg.id}-${idx}`}
                                                    minW="200px"
                                                    maxW="200px"
                                                    minH="210px"
                                                    bg={isCurrent ? '#1A1A1A' : '#141414'}
                                                    border="1px solid"
                                                    borderColor={pkg.isPopular ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.06)'}
                                                    borderRadius="20px"
                                                    p="5"
                                                    flexShrink={0}
                                                    display="flex"
                                                    flexDirection="column"
                                                    transition="transform 0.25s ease"
                                                    _hover={{ transform: 'scale(1.05)' }}
                                                >
                                                    {pkg.isPopular && !isCurrent && (
                                                        <Text fontSize="9px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em"
                                                            color="#EAB308" mb="1"
                                                        >
                                                            Popular
                                                        </Text>
                                                    )}
                                                    <Heading fontSize="16px" fontWeight="600" color="white" mb="1">{pkg.name}</Heading>
                                                    <Text fontSize="22px" fontWeight="800" color="#E03030" mb="1">
                                                        ${pkg.price}<Text as="span" fontSize="12px" fontWeight="400" color="#8A8A93">/{pkg.durationDays}d</Text>
                                                    </Text>
                                                    <Text fontSize="11px" color="#8A8A93" noOfLines={4} mb="3">
                                                        {pkg.description || `${pkg.durationDays}-day access to ${pkg.name} tier exercises`}
                                                    </Text>
                                                    <Box mt="auto">
                                                        {isCurrent ? (
                                                            <Flex align="center" gap="1" color="#4ADE80" fontSize="12px" fontWeight="600">
                                                                <Icon as={FiCheck} boxSize="14px" />
                                                                Current Plan
                                                            </Flex>
                                                        ) : (
                                                            <Button
                                                                w="full" h="32px" fontSize="12px" fontWeight="600"
                                                                bg="transparent" color="#E03030"
                                                                border="1px solid" borderColor="#E03030"
                                                                borderRadius="full"
                                                                _hover={{ bg: 'rgba(224,48,48,0.1)' }}
                                                                onClick={() => { onClose(); navigate('/pricing') }}
                                                            >
                                                                Upgrade
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                </Box>
                            </Box>

                            {!isActive && (
                                <Button
                                    w="full"
                                    bg="#E03030" color="white"
                                    borderRadius="full" py="6" fontSize="14px" fontWeight="600"
                                    _hover={{ bg: '#C62828' }}
                                    onClick={() => { onClose(); navigate('/pricing') }}
                                >
                                    View All Plans
                                </Button>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default PlanSidebar