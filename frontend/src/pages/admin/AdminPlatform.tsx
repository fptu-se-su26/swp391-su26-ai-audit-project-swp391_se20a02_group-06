import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
} from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'

const AdminPlatform: React.FC = () => {
    return (
        <AdminLayout>
            <Box p="7" maxW="1200px" position="relative">
                <Box
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                    borderRadius="16px"
                    pointerEvents="none"
                >
                    <Text fontSize="28px" fontWeight="800" color="#E03030" textShadow="0 0 20px rgba(224,48,48,0.4)">
                        Coming Soon
                    </Text>
                </Box>

                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        Platform Metrics
                    </Heading>
                </Flex>

                <Flex gap="4" mb="5">
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5" flex={1}>
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Retention Rate</Text>
                        <Text fontSize="28px" fontWeight="800" color="white">--%</Text>
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5" flex={1}>
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Avg Session Duration</Text>
                        <Text fontSize="28px" fontWeight="800" color="white">--</Text>
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5" flex={1}>
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">Mobile Usage</Text>
                        <Text fontSize="28px" fontWeight="800" color="#E03030">--%</Text>
                    </Box>
                </Flex>

                <Flex gap="4">
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6" minH="300px" flex={2}>
                        <Text fontSize="14px" fontWeight="700" color="white" mb="2">Traffic & Signups</Text>
                        <Box h="200px" bg="#0A0C10" borderRadius="10px" border="1px dashed" borderColor="#2e3040" display="flex" alignItems="center" justifyContent="center">
                            <Text color="#8A8A93">Chart Placeholder</Text>
                        </Box>
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6" minH="300px" flex={1}>
                        <Text fontSize="14px" fontWeight="700" color="white" mb="2">Device Usage</Text>
                        <Box h="200px" bg="#0A0C10" borderRadius="10px" border="1px dashed" borderColor="#2e3040" display="flex" alignItems="center" justifyContent="center">
                            <Text color="#8A8A93">Pie Chart Placeholder</Text>
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </AdminLayout>
    )
}

export default AdminPlatform