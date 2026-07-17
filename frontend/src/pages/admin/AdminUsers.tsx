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
    Spinner,
    Switch,
    HStack,
    useToast
} from '@chakra-ui/react'
import useSWR, { useSWRConfig } from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import AppButton from '../../components/shared/Button/AppButton'
import { useAuthStore } from '../../store/useAuthStore'

interface UserDto {
    id: number;
    name: string;
    email: string;
    plan: string | null;
    planStartDate: string | null;
    planEndDate: string | null;
    joinDate: string;
    status: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminUsers: React.FC = () => {
    const { data: users, error, isLoading, mutate } = useSWR<UserDto[]>('/user', fetcher)
    const roleId = useAuthStore(state => state.roleId)
    const toast = useToast()

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        try {
            if (currentStatus === 'ACTIVE') {
                await apiClient.put(`/user/${id}/deactivate`)
            } else {
                await apiClient.put(`/user/${id}/activate`)
            }
            toast({
                title: `User ${currentStatus === 'ACTIVE' ? 'deactivated' : 'activated'} successfully`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
            mutate()
        } catch (err: any) {
            toast({
                title: 'Failed to update user status',
                description: err.response?.data?.message || 'Something went wrong',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        }
    }

    return (
        <AdminLayout>
            <Box p="7" maxW="1200px">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        User Management
                    </Heading>
                    {roleId === 1 && (
                        <AppButton label="Add User" size="sm" />
                    )}
                </Flex>

                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
                    {isLoading ? (
                        <Flex justify="center" p="10">
                            <Spinner color="blue.500" />
                        </Flex>
                    ) : error ? (
                        <Text color="red.500" p="5">Failed to load users</Text>
                    ) : (
                        <Table variant="simple" size="sm">
                            <Thead bg="#0A0C10">
                                <Tr>
                                    <Th color="#8A8A93" borderColor="#1e2028">Name</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Email</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Plan</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Start Date</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">End Date</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Join Date</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {users?.map(u => (
                                    <Tr key={u.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                        <Td color="white" borderColor="#1e2028" fontWeight="600">{u.name}</Td>
                                        <Td color="#8A8A93" borderColor="#1e2028">{u.email}</Td>
                                        <Td borderColor="#1e2028">
                                            <Text color={u.plan !== 'Free' ? '#E03030' : '#8A8A93'} fontWeight="700" fontSize="12px" textTransform="uppercase">
                                                {u.plan || 'Free'}
                                            </Text>
                                        </Td>
                                        <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px">{u.planStartDate || '-'}</Td>
                                        <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px">{u.planEndDate || '-'}</Td>
                                        <Td color="#8A8A93" borderColor="#1e2028">{u.joinDate}</Td>
                                        <Td borderColor="#1e2028">
                                            <HStack spacing="3">
                                                <Badge
                                                    bg={u.status === 'ACTIVE' ? 'green.900' : 'red.900'}
                                                    color={u.status === 'ACTIVE' ? 'green.300' : 'red.300'}
                                                    px="2" py="0.5" borderRadius="md"
                                                >
                                                    {u.status === 'ACTIVE' ? 'Active' : 'Banned'}
                                                </Badge>
                                                <Switch
                                                    isChecked={u.status === 'ACTIVE'}
                                                    onChange={() => handleToggleStatus(u.id, u.status)}
                                                    colorScheme="red"
                                                    size="sm"
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Box>
        </AdminLayout>
    )
}

export default AdminUsers
