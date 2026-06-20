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
import { usersMock } from '../../mock/admin/usersMock'

const AdminUsers: React.FC = () => {
  return (
    <AdminLayout>
      <Box p="7" maxW="1200px">
        <Flex justify="space-between" align="center" mb="7">
          <Heading fontSize="24px" fontWeight="800" color="white">
            User Management
          </Heading>
          <AppButton label="Add User" size="sm" />
        </Flex>

        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="#0A0C10">
              <Tr>
                <Th color="#8A8A93" borderColor="#1e2028">Name</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Email</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Plan</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Join Date</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {usersMock.map(u => (
                <Tr key={u.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                  <Td color="white" borderColor="#1e2028" fontWeight="600">{u.name}</Td>
                  <Td color="#8A8A93" borderColor="#1e2028">{u.email}</Td>
                  <Td borderColor="#1e2028">
                    <Text color={u.plan === 'Pro' ? '#E03030' : '#8A8A93'} fontWeight="700" fontSize="12px" textTransform="uppercase">{u.plan}</Text>
                  </Td>
                  <Td color="#8A8A93" borderColor="#1e2028">{u.joinDate}</Td>
                  <Td borderColor="#1e2028">
                    <Badge
                      bg={u.status === 'Active' ? 'green.900' : u.status === 'Banned' ? 'red.900' : '#2e3040'}
                      color={u.status === 'Active' ? 'green.300' : u.status === 'Banned' ? 'red.300' : '#e2e1eb'}
                      px="2" py="0.5" borderRadius="md"
                    >
                      {u.status}
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

export default AdminUsers
