import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  Stack,
  Badge,
} from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import { overviewMock } from '../../mock/admin/overviewMock'

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Box p="7" maxW="1200px">
        <Flex justify="space-between" align="center" mb="7">
          <Heading fontSize="24px" fontWeight="800" color="white">
            System Overview
          </Heading>
        </Flex>

        {/* Top Cards */}
        <Grid templateColumns="repeat(4, 1fr)" gap="4" mb="7">
          <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
            <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Total Users</Text>
            <Text fontSize="28px" fontWeight="800" color="white">{overviewMock.totalUsers.toLocaleString()}</Text>
          </Box>
          <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
            <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Active PTs</Text>
            <Text fontSize="28px" fontWeight="800" color="white">{overviewMock.activePTs.toLocaleString()}</Text>
          </Box>
          <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
            <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Workouts</Text>
            <Text fontSize="28px" fontWeight="800" color="white">{overviewMock.activeWorkouts.toLocaleString()}</Text>
          </Box>
          <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
            <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Revenue</Text>
            <Text fontSize="28px" fontWeight="800" color="#E03030">${overviewMock.revenue.toLocaleString()}</Text>
          </Box>
        </Grid>

        {/* Recent Activity */}
        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6">
          <Heading fontSize="16px" fontWeight="700" color="white" mb="4">
            Recent Activities
          </Heading>
          <Stack spacing="3">
            {overviewMock.recentActivities.map((act: any) => (
              <Flex key={act.id} align="center" justify="space-between" p="3" bg="#0A0C10" borderRadius="10px" border="1px solid" borderColor="#1e2028">
                <Box>
                  <Text color="white" fontSize="14px" fontWeight="600">{act.user}</Text>
                  <Text color="#8A8A93" fontSize="12px">{act.action}</Text>
                </Box>
                <Flex align="center" gap="3">
                  <Badge bg={act.type === 'payment' ? '#E03030' : '#2e3040'} color="white" px="2" py="0.5" borderRadius="md">
                    {act.type}
                  </Badge>
                  <Text color="#8A8A93" fontSize="11px" minW="70px" textAlign="right">{act.time}</Text>
                </Flex>
              </Flex>
            ))}
          </Stack>
        </Box>
      </Box>
    </AdminLayout>
  )
}

export default AdminDashboard
