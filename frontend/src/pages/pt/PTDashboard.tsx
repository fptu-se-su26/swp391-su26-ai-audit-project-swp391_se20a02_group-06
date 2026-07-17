import React from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import { useAuthStore } from '../../store/useAuthStore'

const PTDashboard: React.FC = () => {
  const user = useAuthStore(s => s.user)

  return (
    <AdminLayout>
      <Box p="7" maxW="1200px">
        <Heading fontSize="24px" fontWeight="800" color="white" mb="2">
          Welcome, {user?.fullName || 'PT'}!
        </Heading>
        <Text color="#8A8A93" fontSize="14px">
          Manage your clients, workouts, and exercise requests from the sidebar.
        </Text>
        <Flex mt="10" gap="6" wrap="wrap">
          <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6" flex="1" minW="200px">
            <Text color="#8A8A93" fontSize="12px" textTransform="uppercase" fontWeight="600">My Clients</Text>
            <Text color="white" fontSize="28px" fontWeight="800" mt="2">—</Text>
            <Text color="#555" fontSize="12px" mt="1">Navigate to My Clients tab</Text>
          </Box>
          <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6" flex="1" minW="200px">
            <Text color="#8A8A93" fontSize="12px" textTransform="uppercase" fontWeight="600">Workouts</Text>
            <Text color="white" fontSize="28px" fontWeight="800" mt="2">—</Text>
            <Text color="#555" fontSize="12px" mt="1">Navigate to Workouts tab</Text>
          </Box>
        </Flex>
      </Box>
    </AdminLayout>
  )
}

export default PTDashboard
