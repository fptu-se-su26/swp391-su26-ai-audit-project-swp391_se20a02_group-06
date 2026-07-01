import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Grid,
    Stack,
    Badge,
    Spinner,
} from '@chakra-ui/react'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import { useAuthStore } from '../../store/useAuthStore.ts'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminDashboard: React.FC = () => {
    const roleId = useAuthStore((state) => state.roleId)
    const isPT = roleId === 2

    // Fetch real data from backend APIs
    const { data: users, isLoading: loadingUsers } = useSWR('/user', fetcher)
    const { data: pts, isLoading: loadingPTs } = useSWR('/pt', fetcher)
    const { data: exercises, isLoading: loadingExercises } = useSWR('/exercises', fetcher)

    const isLoading = loadingUsers || loadingPTs || loadingExercises
    const totalUsers = users?.length ?? 0
    const activePTs = pts?.filter((pt: any) => pt.status === 'Active')?.length ?? 0
    const totalExercises = exercises?.length ?? 0

    // Recent activities — derived from real data
    const recentActivities = [
        ...(users?.slice(-2)?.map((u: any, i: number) => ({
            id: `user-${i}`,
            user: u.name,
            action: 'Joined the platform',
            type: 'registration',
            time: u.joinDate,
        })) ?? []),
        ...(pts?.slice(-1)?.map((pt: any, i: number) => ({
            id: `pt-${i}`,
            user: pt.name,
            action: `PT status: ${pt.status}`,
            type: 'booking',
            time: 'Recently',
        })) ?? []),
    ]

    return (
        <AdminLayout>
            <Box p="7" maxW="1200px">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        {isPT ? 'My PT Overview' : 'System Overview'}
                    </Heading>
                </Flex>

                {/* Top Cards */}
                <Grid templateColumns="repeat(4, 1fr)" gap="4" mb="7">
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">
                            {isPT ? 'My Clients' : 'Total Users'}
                        </Text>
                        {isLoading ? (
                            <Spinner size="sm" color="white" mt="2" />
                        ) : (
                            <Text fontSize="28px" fontWeight="800" color="white">
                                {isPT ? '12' : totalUsers.toLocaleString()}
                            </Text>
                        )}
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">
                            {isPT ? 'Active Programs' : 'Active PTs'}
                        </Text>
                        {isLoading ? (
                            <Spinner size="sm" color="white" mt="2" />
                        ) : (
                            <Text fontSize="28px" fontWeight="800" color="white">
                                {isPT ? '8' : activePTs.toLocaleString()}
                            </Text>
                        )}
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">
                            {isPT ? 'Pending Reviews' : 'Exercises'}
                        </Text>
                        {isLoading ? (
                            <Spinner size="sm" color="white" mt="2" />
                        ) : (
                            <Text fontSize="28px" fontWeight="800" color="white">
                                {isPT ? '3' : totalExercises.toLocaleString()}
                            </Text>
                        )}
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">
                            {isPT ? 'My Earnings' : 'Revenue'}
                        </Text>
                        <Text fontSize="28px" fontWeight="800" color="#E03030">
                            ${isPT ? '2,450' : '—'}
                        </Text>
                    </Box>
                </Grid>

                {/* Recent Activity */}
                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6">
                    <Heading fontSize="16px" fontWeight="700" color="white" mb="4">
                        Recent Activities
                    </Heading>
                    <Stack spacing="3">
                        {recentActivities.length === 0 ? (
                            <Text color="#8A8A93" fontSize="14px">No recent activities.</Text>
                        ) : (
                            recentActivities.map((act) => (
                                <Flex key={act.id} align="center" justify="space-between" p="3" bg="#0A0C10" borderRadius="10px" border="1px solid" borderColor="#1e2028">
                                    <Box>
                                        <Text color="white" fontSize="14px" fontWeight="600">{act.user}</Text>
                                        <Text color="#8A8A93" fontSize="12px">{act.action}</Text>
                                    </Box>
                                    <Flex align="center" gap="3">
                                        <Badge bg={act.type === 'registration' ? '#E03030' : '#2e3040'} color="white" px="2" py="0.5" borderRadius="md">
                                            {act.type}
                                        </Badge>
                                        <Text color="#8A8A93" fontSize="11px" minW="70px" textAlign="right">{act.time}</Text>
                                    </Flex>
                                </Flex>
                            ))
                        )}
                    </Stack>
                </Box>
            </Box>
        </AdminLayout>
    )
}

export default AdminDashboard