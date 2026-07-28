import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import ResponsiveTabs from '../Tabs/ResponsiveTabs'
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
    const memberTabs = [
        { id: '/dashboard', label: 'Dashboard' },
        { id: '/workouts', label: 'Workout' },
        { id: '/nutrition', label: 'Nutrition' },
        { id: '/pt-booking', label: 'PT Booking' },
    ];
    return (
        <Flex minH="100vh" bg="#0A0C10">
            <MemberSidebar />
            <Box
                flex="1"
                ml="190px"
                minH="100vh"
                bg="#0A0C10"
            >
                <Flex
                    as="header"
                    position="fixed"
                    top="0"
                    right="0"
                    left="190px"
                    h="64px"
                    align="center"
                    justify="space-between"
                    px="32px"
                    bg="#12131A"
                    borderBottom="1px solid"
                    borderColor="#262626"
                    zIndex={40}
                >
                    <Text color="#E2E1EB" fontSize="18px" fontWeight="700">
                        {title}
                    </Text>
                    <HeaderActions />
                </Flex>

                <Box maxW="1200px" mx="auto" px="4">
                <ResponsiveTabs tabs={memberTabs} />
                </Box>
                <Box as="main" pt={['80px','120px']} pb="32px" minH="100vh">

                    {children}
                </Box>
            </Box>
        </Flex>
    )
}

export default MemberLayout
