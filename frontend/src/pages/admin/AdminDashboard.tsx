import React, { useMemo, useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Grid,
    Stack,
    Badge,
    Spinner,
    Button,
    useToast,
} from '@chakra-ui/react'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import { useAuthStore } from '../../store/useAuthStore.ts'
import { FiRefreshCw } from 'react-icons/fi'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminDashboard: React.FC = () => {
    const roleId = useAuthStore((state) => state.roleId)
    const isPT = roleId === 2
    const toast = useToast()
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Fetch real data from backend APIs
    const { data: users, isLoading: loadingUsers, mutate: mutateUsers } = useSWR('/user', fetcher)
    const { data: pts, isLoading: loadingPTs, mutate: mutatePTs } = useSWR('/pt', fetcher)
    const { data: exercises, isLoading: loadingExercises, mutate: mutateExercises } = useSWR('/exercises', fetcher)
    const { data: payments, isLoading: loadingPayments, mutate: mutatePayments } = useSWR(isPT ? null : '/payments', fetcher)

    const isLoading = loadingUsers || loadingPTs || loadingExercises || (!isPT && loadingPayments)
    const totalUsers = users?.length ?? 0
    const activePTs = pts?.filter((pt: any) => pt.status === 'Active')?.length ?? 0
    const totalExercises = exercises?.length ?? 0

    const totalRevenue = useMemo(() => {
        if (!payments || !Array.isArray(payments)) return 0
        return payments
            .filter((p: any) => p.status === 'SUCCESS')
            .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)
    }, [payments])

    const handleRefreshAll = async () => {
        try {
            setIsRefreshing(true)
            await Promise.all([
                mutateUsers(undefined, { revalidate: true }),
                mutatePTs(undefined, { revalidate: true }),
                mutateExercises(undefined, { revalidate: true }),
                !isPT && mutatePayments ? mutatePayments(undefined, { revalidate: true }) : Promise.resolve(),
            ])
            toast({
                title: 'Đã cập nhật',
                description: 'Dữ liệu tổng quan đã được làm mới.',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            })
        } catch {
            toast({
                title: 'Không thể làm mới',
                description: 'Có lỗi xảy ra khi tải dữ liệu mới.',
                status: 'error',
                duration: 2500,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setIsRefreshing(false)
        }
    }

    // Recent activities — derived from real data
    const recentActivities = [
        ...(payments?.filter((p: any) => p.status === 'SUCCESS')?.slice(0, 2)?.map((p: any) => ({
            id: `pay-${p.id}`,
            user: p.userName || p.userEmail,
            action: `Paid for ${p.packageName} (₫${Math.round(Number(p.amount) || 0).toLocaleString('vi-VN')})`,
            type: 'payment',
            time: p.paidAt ? new Date(p.paidAt).toLocaleDateString('vi-VN') : 'Recently',
        })) ?? []),
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
                <Flex justify="space-between" align="center" mb="7" flexWrap="wrap" gap="4">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        {isPT ? 'My PT Overview' : 'System Overview'}
                    </Heading>
                    <Button
                        leftIcon={<FiRefreshCw />}
                        size="sm"
                        variant="outline"
                        borderColor="#1e2028"
                        color="white"
                        _hover={{ bg: '#1e2028' }}
                        isLoading={isRefreshing || isLoading}
                        loadingText="Đang tải..."
                        onClick={handleRefreshAll}
                    >
                        Làm mới
                    </Button>
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
                        {loadingPayments ? (
                            <Spinner size="sm" color="#E03030" mt="2" />
                        ) : (
                            <Text fontSize="28px" fontWeight="800" color="#E03030">
                                {isPT ? '$2,450' : `₫${Math.round(totalRevenue).toLocaleString('vi-VN')}`}
                            </Text>
                        )}
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
                                        <Badge bg={act.type === 'payment' ? 'green.600' : act.type === 'registration' ? '#E03030' : '#2e3040'} color="white" px="2" py="0.5" borderRadius="md">
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