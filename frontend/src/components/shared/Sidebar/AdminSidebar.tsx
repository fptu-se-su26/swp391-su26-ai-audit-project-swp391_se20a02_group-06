import React from 'react'
import { Box, VStack, Flex, Text } from '@chakra-ui/react'
import { useAuthStore } from '../../../store/useAuthStore'
import { useNavigate, useLocation } from 'react-router-dom'

const AdminSidebar: React.FC = () => {
  const roleId = useAuthStore((state) => state.roleId)
  const isPT = roleId === 2
  const navigate = useNavigate()
  const location = useLocation()

  const NavItem = ({ href, label }: { href: string; label: string }) => {
    const isActive = location.pathname === href
    return (
      <Flex
        p="3"
        borderRadius="8px"
        cursor="pointer"
        bg={isActive ? '#E03030' : 'transparent'}
        color={isActive ? 'white' : '#8A8A93'}
        _hover={{ bg: isActive ? '#E03030' : '#141720', color: isActive ? 'white' : '#E2E1EB' }}
        onClick={() => navigate(href)}
      >
        <Text>{label}</Text>
      </Flex>
    )
  }

  return (
    <Box
      w={{ base: '0', lg: '220px' }}
      display={{ base: 'none', lg: 'block' }}
      h="100vh"
      position="fixed"
      left="0"
      top="0"
      bg="#0A0C10"
      borderRight="1px solid"
      borderColor="#1e2028"
      py="8"
      px="4"
    >
      <Text color="white" fontSize="20px" fontWeight="800" mb="8" px="4">
        AISTHEA <Text as="span" color="#E03030">{isPT ? 'PT' : 'ADMIN'}</Text>
      </Text>
      <VStack align="stretch" spacing="2">
        <NavItem href="/admin" label="Dashboard" />
        <NavItem href="/admin/users" label={isPT ? 'My Clients' : 'Users'} />
        <NavItem href="/admin/workouts" label="Workouts" />
        {!isPT && (
          <>
            <NavItem href="/admin/pts" label="PTs" />
            <NavItem href="/admin/platform" label="Platform" />
            <NavItem href="/admin/payments" label="Payments" />
          </>
        )}
      </VStack>
    </Box>
  )
}

export default AdminSidebar
