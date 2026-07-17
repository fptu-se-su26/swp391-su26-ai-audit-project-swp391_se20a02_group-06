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
    FiUsers,
    FiActivity,
    FiFileText,
    FiUser,
} from 'react-icons/fi'

const navItems = [
    { label: 'Dashboard', icon: FiGrid, path: '/pt/dashboard' },
    { label: 'My Clients', icon: FiUsers, path: '/pt/clients' },
    { label: 'Workouts', icon: FiActivity, path: '/pt/workouts' },
    { label: 'Exercise Requests', icon: FiFileText, path: '/pt/exercise-requests' },
]

const PTSidebar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const isActivePath = (path: string) => {
        if (path === '/pt/dashboard') return location.pathname === '/pt/dashboard'
        return location.pathname.startsWith(path)
    }

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
                    onClick={() => navigate('/pt/dashboard')}
                >
                    AISTHEA
                </Heading>
                <Text fontSize="9px" color="#E03030" fontWeight="600" textTransform="uppercase" letterSpacing="widest" mt="1">
                    PT Portal
                </Text>
            </Box>

            {/* Nav Items */}
            <Stack spacing="1" px="3" flex="1">
                {navItems.map((item) => {
                    const isActive = isActivePath(item.path)
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
                    color={location.pathname === '/pt/profile' ? 'white' : '#8A8A93'}
                    bg={location.pathname === '/pt/profile' ? '#E03030' : 'transparent'}
                    fontWeight={location.pathname === '/pt/profile' ? '600' : '500'}
                    fontSize="14px"
                    transition="all 0.18s ease"
                    _hover={{ bg: location.pathname === '/pt/profile' ? '#E03030' : 'rgba(255,255,255,0.05)',
                             color: location.pathname === '/pt/profile' ? 'white' : '#E2E1EB' }}
                    onClick={() => navigate('/pt/profile')}
                >
                    <Icon as={FiUser} boxSize="16px" />
                    <Text>Profile</Text>
                </Flex>
            </Box>
        </Box>
    )
}

export default PTSidebar
