import React from 'react'
import {
  Box, Flex, Heading, Text, Grid, HStack, VStack,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import { useAuthStore } from '../../store/useAuthStore'

const MotionBox = motion(Box)
const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const toVnd = (amount: number) => `\u20ab${Math.round(amount).toLocaleString('vi-VN')}`

const AdminDashboard: React.FC = () => {
  const user = useAuthStore(s => s.user)
  const roleId = user?.roleId ?? useAuthStore(s => s.roleId)
  const isAdmin = roleId === 1

  const { data: dash, isLoading } = useSWR(isAdmin ? '/admin/dashboard' : null, fetcher)

  if (!isAdmin) {
    return <AdminLayout><Text color="white">PT Dashboard</Text></AdminLayout>
  }

  const statCards = dash ? [
    { label: 'Total Users', value: dash.totalUsers.toLocaleString(), color: 'white' },
    { label: 'Active Subscriptions', value: dash.activeSubscriptions.toLocaleString(), color: '#4ade80' },
    { label: 'Expired', value: dash.expiredSubscriptions.toLocaleString(), color: '#f87171' },
    { label: 'Revenue (Month)', value: toVnd(dash.revenueThisMonth), color: '#E03030' },
    { label: 'New Users (Month)', value: dash.newUsersThisMonth.toLocaleString(), color: '#60a5fa' },
    { label: 'Subscription Rate', value: `${dash.subscriptionRate}%`, color: '#fbbf24' },
  ] : []

  const totalRevenue = dash ? toVnd(dash.totalRevenue) : '---'

  return (
    <AdminLayout>
      <Box p="7" maxW="1280px" mx="auto">
        <Flex justify="space-between" align="center" mb="7">
          <Heading fontSize="28px" fontWeight="900" color="white" textTransform="uppercase">
            Dashboard
          </Heading>
          <Text fontSize="14px" color="#8A8A93">
            Total Revenue: <Text as="span" color="#E03030" fontWeight="800">{totalRevenue}</Text>
          </Text>
        </Flex>

        {isLoading ? (
          <Flex justify="center" py="20"><Spinner color="#E03030" size="xl" /></Flex>
        ) : !dash ? (
          <Text color="red.500">Failed to load dashboard data.</Text>
        ) : (
          <>
            <Grid templateColumns="repeat(6, 1fr)" gap="4" mb="8">
              {statCards.map((stat, idx) => (
                <MotionBox
                  key={idx}
                  bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <Text fontSize="11px" color="#8A8A93" textTransform="uppercase" fontWeight="700" mb="2">{stat.label}</Text>
                  <Text fontSize="24px" fontWeight="900" color={stat.color} lineHeight="1">{stat.value}</Text>
                </MotionBox>
              ))}
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap="6" mb="8">
              <MotionBox
                bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              >
                <Heading fontSize="16px" color="white" mb="4" fontWeight="700">Monthly Revenue</Heading>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dash.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                    <XAxis dataKey="month" tick={{ fill: '#8A8A93', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#8A8A93', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#141720', border: '1px solid #1e2028', borderRadius: '8px', color: 'white' }}
                      formatter={(value: any) => toVnd(value)}
                    />
                    <Bar dataKey="amount" fill="#E03030" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </MotionBox>

              <MotionBox
                bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              >
                <Heading fontSize="16px" color="white" mb="4" fontWeight="700">New Users</Heading>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dash.monthlyNewUsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                    <XAxis dataKey="month" tick={{ fill: '#8A8A93', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#8A8A93', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#141720', border: '1px solid #1e2028', borderRadius: '8px', color: 'white' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#E03030" strokeWidth={2} dot={{ fill: '#E03030', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </MotionBox>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap="6">
              <MotionBox
                bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              >
                <Heading fontSize="16px" color="white" mb="4" fontWeight="700">Top Packages</Heading>
                {dash.topPackages.length > 0 ? (
                  <VStack align="stretch" spacing="3">
                    {dash.topPackages.map((pkg: any, idx: number) => (
                      <Flex key={idx} justify="space-between" align="center" p="3" bg="#0A0C10" borderRadius="8px">
                        <HStack spacing="3">
                          <Text color="#E03030" fontWeight="800" fontSize="13px">#{idx + 1}</Text>
                          <Text color="white" fontSize="13px" fontWeight="600">{pkg.packageName}</Text>
                        </HStack>
                        <HStack spacing="4">
                          <Text color="#8A8A93" fontSize="12px">{pkg.count} purchases</Text>
                          <Text color="#4ade80" fontSize="12px" fontWeight="700">{toVnd(pkg.revenue)}</Text>
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                ) : (
                  <Text color="#8A8A93" fontSize="13px">No package data yet.</Text>
                )}
              </MotionBox>

              <MotionBox
                bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
              >
                <Box p="6" pb="3">
                  <Heading fontSize="16px" color="white" fontWeight="700">Recent Payments</Heading>
                </Box>
                <Table variant="unstyled" size="sm">
                  <Thead bg="#0A0C10">
                    <Tr>
                      <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" px="4">User</Th>
                      <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" px="4" isNumeric>Amount</Th>
                      <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" px="4">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {dash.recentPayments.map((p: any) => (
                      <Tr key={p.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                        <Td color="white" borderColor="#1e2028" fontSize="12px" fontWeight="600" px="4">{p.userName || p.userEmail}</Td>
                        <Td color="white" borderColor="#1e2028" fontSize="12px" fontWeight="800" isNumeric px="4">{toVnd(p.amount)}</Td>
                        <Td borderColor="#1e2028" px="4">
                          <Badge
                            px="2" py="0.5" borderRadius="md" textTransform="none" fontSize="10px" fontWeight="700"
                            bg={p.status === 'SUCCESS' ? 'green.900' : p.status === 'FAILED' ? 'red.900' : 'yellow.900'}
                            color={p.status === 'SUCCESS' ? 'green.300' : p.status === 'FAILED' ? 'red.300' : 'yellow.300'}
                          >
                            {p.status === 'SUCCESS' ? 'Completed' : p.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                    {dash.recentPayments.length === 0 && (
                      <Tr><Td colSpan={3} textAlign="center" py="6" color="#8A8A93" fontSize="13px">No payments yet.</Td></Tr>
                    )}
                  </Tbody>
                </Table>
              </MotionBox>
            </Grid>
          </>
        )}
      </Box>
    </AdminLayout>
  )
}

export default AdminDashboard
