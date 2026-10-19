import React from 'react'
import {
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Flex,
    IconButton,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import MemberSidebar from '../Sidebar/MemberSidebar'
import HeaderActions from '../Header/HeaderActions'

const pathTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/workouts': 'Workouts',
    '/exercises': 'Exercises',
    '/nutrition': 'Nutrition',
    '/progress': 'Progress',
    '/pt-booking': 'PT Booking',
    '/ai-chat': 'AI Chat',
    '/profile': 'Profile',
}

interface MemberLayoutProps {
    children: React.ReactNode
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
    const location = useLocation()
    const title = pathTitles[location.pathname] || 'Member'
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex minH="100vh" bg="#0A0C10">
            <MemberSidebar />
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
                <DrawerOverlay />
                <DrawerContent bg="#111318">
                    <DrawerBody p="0">
                        <MemberSidebar mobile onNavigate={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <Box
                flex="1"
                ml={{ base: 0, lg: '190px' }}
                minW="0"
                minH="100vh"
                bg="#0A0C10"
            >
                <Flex
                    as="header"
                    position="fixed"
                    top="0"
                    right="0"
                    left={{ base: 0, lg: '190px' }}
                    h="64px"
                    align="center"
                    justify="space-between"
                    px={{ base: '16px', md: '24px', lg: '32px' }}
                    bg="#12131A"
                    borderBottom="1px solid"
                    borderColor="#262626"
                    zIndex={40}
                >
                    <Flex align="center" gap="2">
                        <IconButton
                            aria-label="Open navigation menu"
                            display={{ base: 'inline-flex', lg: 'none' }}
                            icon={<FiMenu />}
                            variant="ghost"
                            color="#E2E1EB"
                            onClick={onOpen}
                        />
                        <Text color="#E2E1EB" fontSize="18px" fontWeight="700">
                            {title}
                        </Text>
                    </Flex>
                    <HeaderActions />
                </Flex>

                <Box maxW="1200px" mx="auto" px="4">

                </Box>
                <Box as="main" pt={{ base: '80px', md: '120px' }} pb="32px" minH="100vh">

                    {children}
                </Box>
            </Box>
        </Flex>
    )
}

export default MemberLayout
