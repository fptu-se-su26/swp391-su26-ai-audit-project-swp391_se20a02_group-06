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
  Grid,
} from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import AppButton from '../../components/shared/Button/AppButton'
import { paymentsMock } from '../../mock/admin/paymentsMock'

const AdminPayments: React.FC = () => {
  return (
    <AdminLayout>
      <Box p="7" maxW="1200px">
        <Flex justify="space-between" align="center" mb="7">
          <Heading fontSize="24px" fontWeight="800" color="white">
            Payments & Revenue
          </Heading>
          <AppButton label="Export Report" size="sm" />
        </Flex>

        <Grid templateColumns="repeat(2, 1fr)" gap="4" mb="7">
          <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6">
            <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Total Revenue YTD</Text>
            <Flex align="flex-end" gap="3">
              <Text fontSize="36px" fontWeight="800" color="#E03030" lineHeight="1">${paymentsMock.totalRevenue.toLocaleString()}</Text>
              <Text fontSize="14px" color="green.400" fontWeight="600" mb="1">+{paymentsMock.monthlyGrowth}%</Text>
            </Flex>
          </Box>
          <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6">
            <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Next Payout</Text>
            <Flex align="flex-end" gap="3">
              <Text fontSize="36px" fontWeight="800" color="white" lineHeight="1">$12,450.00</Text>
              <Text fontSize="14px" color="#8A8A93" mb="1">Due in 3 days</Text>
            </Flex>
          </Box>
        </Grid>

        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="#0A0C10">
              <Tr>
                <Th color="#8A8A93" borderColor="#1e2028">Transaction ID</Th>
                <Th color="#8A8A93" borderColor="#1e2028">User</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Plan</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Date</Th>
                <Th color="#8A8A93" borderColor="#1e2028" isNumeric>Amount</Th>
                <Th color="#8A8A93" borderColor="#1e2028">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paymentsMock.recentTransactions.map((t: any) => (
                <Tr key={t.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                  <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px">{t.id}</Td>
                  <Td color="white" borderColor="#1e2028" fontWeight="600">{t.user}</Td>
                  <Td borderColor="#1e2028">
                    <Text color={t.plan === 'Pro' ? '#E03030' : '#8A8A93'} fontWeight="700" fontSize="12px" textTransform="uppercase">{t.plan}</Text>
                  </Td>
                  <Td color="#8A8A93" borderColor="#1e2028">{t.date}</Td>
                  <Td color="white" borderColor="#1e2028" isNumeric fontWeight="700">${t.amount}</Td>
                  <Td borderColor="#1e2028">
                    <Badge
                      bg={t.status === 'Completed' ? 'green.900' : t.status === 'Failed' ? 'red.900' : '#2e3040'}
                      color={t.status === 'Completed' ? 'green.300' : t.status === 'Failed' ? 'red.300' : '#e2e1eb'}
                      px="2" py="0.5" borderRadius="md"
                    >
                      {t.status}
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

export default AdminPayments
