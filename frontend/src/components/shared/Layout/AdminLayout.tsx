import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useAuthStore } from '../../../store/useAuthStore'
import AdminSidebar from '../Sidebar/AdminSidebar'
import PTSidebar from '../Sidebar/PTSidebar'
import {
    adminColors,
    TopbarActions,
} from '../../../pages/admin/AdminPrimitives'

interface AdminLayoutProps {
    children: React.ReactNode
    title?: string
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    title = 'Elite Dashboard',
}) => {
    const roleId = useAuthStore((state) => state.roleId)
    const isPT = roleId === 2

    return (
        <Flex minH="100vh" bg={adminColors.bg} color={adminColors.text}>
            {isPT ? <PTSidebar /> : <AdminSidebar />}
            <Box
                flex="1"
                ml={isPT ? '190px' : { base: 0, lg: '220px' }}
                minH="100vh"
                bg={adminColors.bg}
            >
                <Flex
                    as="header"
                    position="fixed"
                    top="0"
                    right="0"
                    left={isPT ? '190px' : { base: 0, lg: '220px' }}
                    h="64px"
                    align="center"
                    justify="space-between"
                    px="32px"
                    bg={adminColors.page}
                    borderBottom="1px solid"
                    borderColor={adminColors.surfaceVariant}
                    zIndex={40}
                >
                    <Text color={adminColors.text} fontSize="18px" fontWeight="700">
                        {title}
                    </Text>
                    <TopbarActions />
                </Flex>

                <Box as="main" px={{ base: '20px', xl: '32px' }} pt="96px" pb="32px" minH="100vh">
                    <Box maxW="1280px" mx="auto">
                        {children}
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default AdminLayout
