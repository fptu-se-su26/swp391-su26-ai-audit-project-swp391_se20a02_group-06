import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
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
import { ptsMock } from '../../mock/admin/ptsMock'

const AdminPTs: React.FC = () => {
  return (
    <AdminLayout>
      <Box p="7" maxW="1200px">
        <Flex justify="space-between" align="center" mb="7">
          <Heading fontSize="24px" fontWeight="800" color="white">
            PT Management
          </Heading>
          <AppButton label="Add Trainer" size="sm" />
        </Flex>

        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="#0A0C10">
              <Tr>
                <Th color="#8A8A93" borderColor="#1e2028">Trainer Name</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Specialty</Th>
                <Th color="#8A8A93" borderColor="#1e2028" isNumeric>Active Students</Th>
                <Th color="#8A8A93" borderColor="#1e2028" isNumeric>Rating</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ptsMock.map(pt => (
                <Tr key={pt.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                  <Td color="white" borderColor="#1e2028" fontWeight="600">{pt.name}</Td>
                  <Td color="#8A8A93" borderColor="#1e2028">{pt.specialties.join(', ')}</Td>
                  <Td color="white" borderColor="#1e2028" isNumeric>{pt.clients}</Td>
                  <Td borderColor="#1e2028" isNumeric>
                    <Text color="yellow.400" fontWeight="700">★ {pt.rating}</Text>
                  </Td>
                  <Td borderColor="#1e2028">
                    <Badge
                      bg={pt.status === 'Available' ? 'green.900' : pt.status === 'Fully Booked' ? '#E03030' : '#2e3040'}
                      color={pt.status === 'Available' ? 'green.300' : pt.status === 'Fully Booked' ? 'white' : '#e2e1eb'}
                      px="2" py="0.5" borderRadius="md"
                    >
                      {pt.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </AdminLayout>
  )
}

export default AdminPTs
