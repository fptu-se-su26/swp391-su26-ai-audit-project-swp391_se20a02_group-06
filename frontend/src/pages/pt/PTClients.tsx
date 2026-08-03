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
} from '@chakra-ui/react'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout'

interface ClientDto {
    id: number;
    name: string;
    email: string;
    plan: string | null;
    planStartDate: string | null;
    planEndDate: string | null;
    joinDate: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const PTClients: React.FC = () => {
    const { data: clients, error, isLoading } = useSWR<ClientDto[]>('/pt-clients', fetcher)

    return (
        <AdminLayout>
            <Box p="7" maxW="1200px">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        My Clients
                    </Heading>
                </Flex>

                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
                    {isLoading ? (
                        <Flex justify="center" p="10">
                            <Spinner color="#E03030" />
                        </Flex>
                    ) : error ? (
                        <Text color="red.500" p="5">Failed to load clients</Text>
                    ) : (
                        <Table variant="simple" size="sm">
                            <Thead bg="#0A0C10">
                                <Tr>
                                    <Th color="#8A8A93" borderColor="#1e2028">Name</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Email</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Plan</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Start Date</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">End Date</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {clients?.map(c => (
                                    <Tr key={c.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                        <Td color="white" borderColor="#1e2028" fontWeight="600">{c.name}</Td>
                                        <Td color="#8A8A93" borderColor="#1e2028">{c.email}</Td>
                                        <Td borderColor="#1e2028">
                                            <Text color={c.plan !== 'Free' ? '#E03030' : '#8A8A93'} fontWeight="700" fontSize="12px" textTransform="uppercase">
                                                {c.plan || 'Free'}
                                            </Text>
                                        </Td>
                                        <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px">{c.planStartDate || '-'}</Td>
                                        <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px">{c.planEndDate || '-'}</Td>
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

export default PTClients
