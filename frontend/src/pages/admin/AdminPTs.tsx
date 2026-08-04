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
    Circle,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
    Icon,
    IconButton,
} from '@chakra-ui/react'
import { FiStar, FiMoreVertical } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'

interface PtDto {
    id: number;
    name: string;
    email: string;
    rating: number | null;
    experience: string;
    status: string;
    avatarUrl?: string | null;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminPTs: React.FC = () => {
    const { data: pts, error, isLoading, mutate } = useSWR<PtDto[]>('/pt', fetcher)
    const toast = useToast()

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const isActive = currentStatus === 'ACTIVE'
        const action = isActive ? 'deactivate' : 'activate'
        const actionLabel = isActive ? 'deactivated' : 'activated'
        try {
            await apiClient.put(`/pt/${id}/${action}`)
            toast({
                title: 'Success',
                description: `PT ${actionLabel} successfully.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            mutate()
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to ${actionLabel} PT.`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const getInitials = (name: string) =>
        name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

    return (
        <AdminLayout>
            <Box p="7" maxW="1200px">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="22px" fontWeight="800" color="white">
                        Personal Trainers
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
                        <Text color="red.500" p="5">Failed to load PTs</Text>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple" size="sm">
                                <Thead bg="#0c0e14">
                                    <Tr>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Trainer</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Email</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Experience</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600" isNumeric>Rating</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600">Status</Th>
                                        <Th color="#8A8A93" borderColor="#262626" textTransform="uppercase" fontSize="10px" letterSpacing="0.05em" fontWeight="600" textAlign="right">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {pts?.map(pt => {
                                        const isActive = pt.status === 'ACTIVE'
                                        return (
                                            <Tr key={pt.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
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
                                                    {pt.avatarUrl ? (
                                                        <Box
                                                            as="img"
                                                            src={pt.avatarUrl}
                                                            alt={pt.name}
                                                            w="100%"
                                                            h="100%"
                                                            objectFit="cover"
                                                        />
                                                    ) : (
                                                        <Text color="#FFB4AC" fontSize="12px" fontWeight="700">
                                                            {getInitials(pt.name)}
                                                        </Text>
                                                    )}
                                                </Circle>
                                                        <Box>
                                                            <Text color="white" fontWeight="600" fontSize="14px">{pt.name}</Text>
                                                            <Text color="#E5BDB9" fontSize="12px">ID: PT-{pt.id}</Text>
                                                        </Box>
                                                    </HStack>
                                                </Td>
                                                <Td color="#8A8A93" borderColor="#262626" fontSize="13px">{pt.email}</Td>
                                                <Td color="white" borderColor="#262626" fontSize="13px">{pt.experience}</Td>
                                                <Td borderColor="#262626" isNumeric>
                                                    <HStack spacing="4px" justify="flex-end">
                                                        {pt.rating ? (
                                                            <>
                                                                <Icon as={FiStar} color="#FFB4AC" boxSize="14px" />
                                                                <Text color="white" fontWeight="600" fontSize="13px">{pt.rating}</Text>
                                                            </>
                                                        ) : (
                                                            <Text color="#8A8A93" fontSize="13px">N/A</Text>
                                                        )}
                                                    </HStack>
                                                </Td>
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
                                                            {isActive ? 'Active' : 'Inactive'}
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
                                                                onClick={() => handleToggleStatus(pt.id, pt.status)}
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

export default AdminPTs
