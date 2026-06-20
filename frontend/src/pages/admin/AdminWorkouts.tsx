import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import AppButton from '../../components/shared/Button/AppButton'
import { workoutsMock } from '../../mock/admin/workoutsMock'

const AdminWorkouts: React.FC = () => {
  return (
    <AdminLayout>
      <Box p="7" maxW="1200px">
        <Flex justify="space-between" align="center" mb="7">
          <Heading fontSize="24px" fontWeight="800" color="white">
            Workout Management
          </Heading>
          <AppButton label="Create Program" size="sm" />
        </Flex>

        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="#0A0C10">
              <Tr>
                <Th color="#8A8A93" borderColor="#1e2028">Program Title</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Creator</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Type</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Level</Th>
                <Th color="#8A8A93" borderColor="#1e2028" isNumeric>Uses</Th>
              </Tr>
            </Thead>
            <Tbody>
              {workoutsMock.map((w: any) => (
                <Tr key={w.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                  <Td color="white" borderColor="#1e2028" fontWeight="600">{w.title}</Td>
                  <Td color="#e2e1eb" borderColor="#1e2028">{w.creator}</Td>
                  <Td borderColor="#1e2028">
                    <Badge bg="#2e3040" color="#E2E1EB" px="2" py="0.5" borderRadius="md">{w.type}</Badge>
                  </Td>
                  <Td color="#8A8A93" borderColor="#1e2028">{w.level}</Td>
                  <Td color="#e2e1eb" borderColor="#1e2028" isNumeric>{w.uses.toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </AdminLayout>
  )
}

export default AdminWorkouts
