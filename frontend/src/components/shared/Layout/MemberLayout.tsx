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
import { useTranslation } from 'react-i18next'
import MemberSidebar from '../Sidebar/MemberSidebar'
import HeaderActions from '../Header/HeaderActions'

const pathTitleKeys: Record<string, { key: string; defaultLabel: string }> = {
    '/dashboard': { key: 'nav.dashboard', defaultLabel: 'Dashboard' },
    '/workouts': { key: 'nav.workouts', defaultLabel: 'Workouts' },
    '/exercises': { key: 'nav.exercises', defaultLabel: 'Exercises' },
    '/nutrition': { key: 'nav.nutrition', defaultLabel: 'Nutrition' },
    '/progress': { key: 'nav.progress', defaultLabel: 'Progress' },
    '/pt-booking': { key: 'nav.ptBooking', defaultLabel: 'PT Booking' },
    '/ai-chat': { key: 'nav.aiChat', defaultLabel: 'AI Chat' },
    '/profile': { key: 'nav.profile', defaultLabel: 'Profile' },
}

interface MemberLayoutProps {
    children: React.ReactNode
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const mapped = pathTitleKeys[location.pathname]
    const title = mapped ? t(mapped.key, mapped.defaultLabel) : t('header.member', 'Member')
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
