import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import AdminSidebar from '../Sidebar/AdminSidebar'
import {
  adminColors,
  SearchField,
  TopbarActions,
} from '../../../pages/admin/AdminPrimitives'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  searchPlaceholder?: string
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = 'Elite Dashboard',
  searchPlaceholder = 'Search...',
}) => {
  return (
    <Flex minH="100vh" bg={adminColors.bg} color={adminColors.text}>
      <AdminSidebar />
      <Box
        flex="1"
        ml={{ base: 0, lg: '220px' }}
        minH="100vh"
        bg={adminColors.bg}
      >
        <Flex
          as="header"
          position="fixed"
          top="0"
          right="0"
          left={{ base: 0, lg: '220px' }}
          h="64px"
          align="center"
          justify="space-between"
          px="32px"
          bg={adminColors.page}
          borderBottom="1px solid"
          borderColor={adminColors.surfaceVariant}
          zIndex={40}
        >
          <Text color={adminColors.primarySoft} fontSize="18px" lineHeight="24px" fontWeight="700">
            {title}
          </Text>
          <Flex align="center" gap="24px">
            <SearchField placeholder={searchPlaceholder} />
            <TopbarActions />
          </Flex>
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
