import React from 'react'
import {
    Box,
    Flex,
    Text,
    Stack,
    Icon,
    Heading,
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    FiGrid,
    FiActivity,
    FiShoppingCart,
    FiBarChart2,
    FiCalendar,
    FiMessageSquare,
    FiUser,
} from 'react-icons/fi'

const navItems = [
    { label: 'Dashboard', icon: FiGrid, path: '/dashboard' },
    { label: 'Workouts', icon: FiActivity, path: '/workouts' },
    { label: 'Nutrition', icon: FiShoppingCart, path: '/nutrition' },
    { label: 'Progress', icon: FiBarChart2, path: '/progress' },
    { label: 'PT Booking', icon: FiCalendar, path: '/pt-booking' },
    { label: 'AI Chat', icon: FiMessageSquare, path: '/ai-chat' },
]

const MemberSidebar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Box
            w="190px"
            minW="190px"
            h="100vh"
            position="fixed"
            top="0"
            left="0"
            bg="#111318"
            borderRight="1px solid"
            borderColor="#1e1f26"
            display="flex"
            flexDirection="column"
            zIndex={100}
        >
            {/* Logo */}
            <Box px="6" pt="7" pb="6">
                <Heading
                    fontSize="xl"
                    fontWeight="800"
                    color="white"
                    letterSpacing="-0.02em"
                    cursor="pointer"
                    onClick={() => navigate('/')}
                >
                    AISTHEA
                </Heading>
                <Text fontSize="9px" color="#8A8A93" fontWeight="600" textTransform="uppercase" letterSpacing="widest" mt="1">
                    Elite Performance
                </Text>
            </Box>

            {/* Nav Items */}
            <Stack spacing="1" px="3" flex="1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Flex
                            key={item.path}
                            align="center"
                            gap="3"
                            px="3"
                            py="2.5"
                            borderRadius="10px"
                            cursor="pointer"
                            bg={isActive ? '#E03030' : 'transparent'}
                            color={isActive ? 'white' : '#8A8A93'}
                            fontWeight={isActive ? '600' : '500'}
                            fontSize="14px"
                            transition="all 0.18s ease"
                            _hover={{
                                bg: isActive ? '#E03030' : 'rgba(255,255,255,0.05)',
                                color: isActive ? 'white' : '#E2E1EB',
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <Icon as={item.icon} boxSize="16px" />
                            <Text>{item.label}</Text>
                        </Flex>
                    )
                })}
            </Stack>

            {/* Profile at bottom */}
            <Box px="4" pb="6" borderTop="1px solid" borderColor="#1e1f26" pt="4">
                <Flex
                    align="center"
                    gap="3"
                    px="3"
                    py="2.5"
                    borderRadius="10px"
                    cursor="pointer"
                    color="#8A8A93"
                    fontSize="14px"
                    fontWeight="500"
                    _hover={{ bg: 'rgba(255,255,255,0.05)', color: '#E2E1EB' }}
                    onClick={() => navigate('/profile')}
                >
                    <Icon as={FiUser} boxSize="16px" />
                    <Text>Profile</Text>
                </Flex>
            </Box>
        </Box>
    )
}

export default MemberSidebar