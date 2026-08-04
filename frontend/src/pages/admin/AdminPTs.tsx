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
    Button,
    useToast
} from '@chakra-ui/react'
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
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminPTs: React.FC = () => {
    const { data: pts, error, isLoading, mutate } = useSWR<PtDto[]>('/pt', fetcher)
    const toast = useToast()

    const handleActivate = async (id: number) => {
        try {
            await apiClient.put(`/pt/${id}/activate`)
            toast({
                title: 'Success',
                description: 'PT activated successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            mutate()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to activate PT.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const handleDeactivate = async (id: number) => {
        try {
            await apiClient.put(`/pt/${id}/deactivate`)
            toast({
                title: 'Success',
                description: 'PT deactivated successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            mutate()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to deactivate PT.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return (
        <AdminLayout>
            <Box p="7" maxW="1200px">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        PT Management
                    </Heading>
                </Flex>

                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
                    {isLoading ? (
                        <Flex justify="center" p="10">
                            <Spinner color="blue.500" />
                        </Flex>
                    ) : error ? (
                        <Text color="red.500" p="5">Failed to load PTs</Text>
                    ) : (
                        <Table variant="simple" size="sm">
                            <Thead bg="#0A0C10">
                                <Tr>
                                    <Th color="#8A8A93" borderColor="#1e2028">Trainer Name</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Email</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Experience</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" isNumeric>Rating</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Status</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {pts?.map(pt => (
                                    <Tr key={pt.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                        <Td color="white" borderColor="#1e2028" fontWeight="600">{pt.name}</Td>
                                        <Td color="#8A8A93" borderColor="#1e2028">{pt.email}</Td>
                                        <Td color="white" borderColor="#1e2028">{pt.experience}</Td>
                                        <Td borderColor="#1e2028" isNumeric>
                                            <Text color={pt.rating ? "yellow.400" : "#8A8A93"} fontWeight="700">
                                                {pt.rating ? `★ ${pt.rating}` : '-'}
                                            </Text>
                                        </Td>
                                        <Td borderColor="#1e2028">
                                            <Badge
                                                bg={pt.status === 'Active' ? 'green.900' : pt.status === 'Fully Booked' ? '#E03030' : '#2e3040'}
                                                color={pt.status === 'Active' ? 'green.300' : pt.status === 'Fully Booked' ? 'white' : '#e2e1eb'}
                                                px="2" py="0.5" borderRadius="md"
                                            >
                                                {pt.status || '-'}
                                            </Badge>
                                        </Td>
                                        <Td borderColor="#1e2028">
                                            {pt.status !== 'Active' ? (
                                                <Button size="xs" colorScheme="green" mr="2" onClick={() => handleActivate(pt.id)}>
                                                    Activate
                                                </Button>
                                            ) : (
                                                <Button size="xs" colorScheme="red" onClick={() => handleDeactivate(pt.id)}>
                                                    Deactivate
                                                </Button>
                                            )}
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

export default AdminPTs