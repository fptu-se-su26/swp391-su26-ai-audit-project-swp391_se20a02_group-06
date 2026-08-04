import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Grid,
} from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import { metricsMock } from '../../mock/admin/metricsMock.ts'

const AdminPlatform: React.FC = () => {
    return (
        <AdminLayout>
            <Box p="7" maxW="1200px">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        Platform Metrics
                    </Heading>
                </Flex>

                <Grid templateColumns="repeat(3, 1fr)" gap="4" mb="5">
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Retention Rate</Text>
                        <Text fontSize="28px" fontWeight="800" color="white">{metricsMock.retentionRate}%</Text>
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Avg Session Duration</Text>
                        <Text fontSize="28px" fontWeight="800" color="white">{metricsMock.avgSessionDuration}</Text>
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Mobile Usage</Text>
                        <Text fontSize="28px" fontWeight="800" color="#E03030">
                            {metricsMock.deviceUsage.find((d: any) => d.name === 'Mobile')?.value}%
                        </Text>
                    </Box>
                </Grid>

                <Grid templateColumns="2fr 1fr" gap="4">
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6" minH="300px">
                        <Text fontSize="14px" fontWeight="700" color="white" mb="2">Traffic & Signups (Mock Chart Area)</Text>
                        <Box h="200px" bg="#0A0C10" borderRadius="10px" border="1px dashed" borderColor="#2e3040" display="flex" alignItems="center" justifyContent="center">
                            <Text color="#8A8A93">Chart Component Placeholder</Text>
                        </Box>
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6" minH="300px">
                        <Text fontSize="14px" fontWeight="700" color="white" mb="2">Device Usage</Text>
                        <Box h="200px" bg="#0A0C10" borderRadius="10px" border="1px dashed" borderColor="#2e3040" display="flex" alignItems="center" justifyContent="center">
                            <Text color="#8A8A93">Pie Chart Placeholder</Text>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </AdminLayout>
    )
}

export default AdminPlatform