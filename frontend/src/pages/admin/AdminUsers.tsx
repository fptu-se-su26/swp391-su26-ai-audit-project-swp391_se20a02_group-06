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
    Spinner,
    HStack,
    useToast,
    IconButton,
    Circle,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import { FiMoreVertical } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout'

interface UserDto {
    id: number;
    name: string;
    email: string;
    plan: string | null;
    planStartDate: string | null;
    planEndDate: string | null;
    joinDate: string;
    status: string;
    avatarUrl?: string | null;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const getInitials = (name: string) =>
    name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

const AdminUsers: React.FC = () => {
    const { data: users, error, isLoading, mutate } = useSWR<UserDto[]>('/user', fetcher)
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
                    <Heading fontSize="22px" fontWeight="800" color="white">
                        User Management
                    </Heading>
                </Flex>

                <Box
                    bg="#141414"
                    border="1px solid"
                    borderColor="#262626"
                    borderRadius="32px"
                    overflow="hidden"
                    boxShadow="0 12px 24px rgba(0,0,0,0.15)"
                >
                    {isLoading ? (
                        <Flex justify="center" p="10">
                            <Spinner color="red.500" />
                        </Flex>
                    ) : error ? (
                        <Text color="red.500" p="5">Failed to load users</Text>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple" size="sm">
                                <Thead bg="#0c0e14">
                                    <Tr>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Name</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Email</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Plan</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Start Date</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">End Date</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Join Date</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Status</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600" textAlign="right">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users?.map(u => {
                                        const isActive = u.status === 'ACTIVE'
                                        return (
                                            <Tr key={u.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                                <Td borderColor="#262626">
                                                    <HStack spacing="12px">
                                                        <Circle
                                                            size="40px"
                                                            bg="#282A31"
                                                            border="1px solid"
                                                            borderColor="#262626"
                                                            flexShrink={0}
                                                            overflow="hidden"
                                                        >
                                                            {u.avatarUrl ? (
                                                                <Box
                                                                    as="img"
                                                                    src={u.avatarUrl}
                                                                    alt={u.name}
                                                                    w="100%" h="100%" objectFit="cover"
                                                                />
                                                            ) : (
                                                                <Text color="#FFB4AC" fontSize="12px" fontWeight="700">
                                                                    {getInitials(u.name)}
                                                                </Text>
                                                            )}
                                                        </Circle>
                                                        <Text color="white" fontWeight="600" fontSize="14px">{u.name}</Text>
                                                    </HStack>
                                                </Td>
                                                <Td color="#8A8A93" borderColor="#262626" fontSize="13px">{u.email}</Td>
                                                <Td borderColor="#262626">
                                                    <Text
                                                        color={u.plan && u.plan !== 'Free' ? '#FFB4AC' : '#8A8A93'}
                                                        fontWeight="700"
                                                        fontSize="12px"
                                                        textTransform="uppercase"
                                                    >
                                                        {u.plan || 'Free'}
                                                    </Text>
                                                </Td>
                                                <Td color="#8A8A93" borderColor="#262626" fontSize="12px">{u.planStartDate || '-'}</Td>
                                                <Td color="#8A8A93" borderColor="#262626" fontSize="12px">{u.planEndDate || '-'}</Td>
                                                <Td color="#8A8A93" borderColor="#262626" fontSize="13px">{u.joinDate}</Td>
                                                <Td borderColor="#262626">
                                                    <HStack spacing="8px">
                                                        <Box
                                                            w="8px"
                                                            h="8px"
                                                            borderRadius="full"
                                                            bg={isActive ? '#E03030' : '#8A8A93'}
                                                            boxShadow={isActive ? '0 0 8px #E03030' : 'none'}
                                                        />
                                                        <Text
                                                            color={isActive ? '#E03030' : '#8A8A93'}
                                                            fontSize="13px"
                                                            fontWeight="600"
                                                        >
                                                            {isActive ? 'Active' : 'Banned'}
                                                        </Text>
                                                    </HStack>
                                                </Td>
                                                <Td borderColor="#262626" textAlign="right">
                                                    <Menu>
                                                        <MenuButton
                                                            as={IconButton}
                                                            aria-label="More actions"
                                                            icon={<FiMoreVertical />}
                                                            size="xs"
                                                            variant="ghost"
                                                            color="#8A8A93"
                                                            fontSize="16px"
                                                            _hover={{ color: 'white' }}
                                                        />
                                                        <MenuList
                                                            bg="#282A31"
                                                            borderColor="#262626"
                                                            minW="160px"
                                                        >
                                                            <MenuItem
                                                                bg="transparent"
                                                                _hover={{ bg: '#33343c' }}
                                                                color="white"
                                                                fontSize="13px"
                                                                onClick={() => handleToggleStatus(u.id, u.status)}
                                                            >
                                                                {isActive ? 'Deactivate' : 'Activate'}
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </Box>
            </Box>
        </AdminLayout>
    )
}

export default AdminUsers
