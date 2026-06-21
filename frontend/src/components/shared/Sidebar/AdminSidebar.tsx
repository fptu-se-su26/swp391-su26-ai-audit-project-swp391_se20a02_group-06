import React from 'react'
import { Box, VStack, Link, Text } from '@chakra-ui/react'
import { useAuthStore } from '../../../store/useAuthStore'

const AdminSidebar: React.FC = () => {
  const roleId = useAuthStore((state) => state.roleId)
  const isPT = roleId === 2

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
        <Link href="/admin" p="3" borderRadius="8px" _hover={{ bg: '#141720' }} color="#8A8A93">Dashboard</Link>
        <Link href="/admin/users" p="3" borderRadius="8px" _hover={{ bg: '#141720' }} color="#8A8A93">{isPT ? 'My Clients' : 'Users'}</Link>
        <Link href="/admin/workouts" p="3" borderRadius="8px" _hover={{ bg: '#141720' }} color="#8A8A93">Workouts</Link>
        {!isPT && (
          <>
            <Link href="/admin/pts" p="3" borderRadius="8px" _hover={{ bg: '#141720' }} color="#8A8A93">PTs</Link>
            <Link href="/admin/platform" p="3" borderRadius="8px" _hover={{ bg: '#141720' }} color="#8A8A93">Platform</Link>
            <Link href="/admin/payments" p="3" borderRadius="8px" _hover={{ bg: '#141720' }} color="#8A8A93">Payments</Link>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default AdminSidebar
