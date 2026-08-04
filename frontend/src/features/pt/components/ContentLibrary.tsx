import React from 'react'
import { Box, Flex, Grid, Icon, Text, Spinner } from '@chakra-ui/react'
import { FiVideo } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import apiClient from '../../../lib/axios'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

interface ContentStats {
    published: number
    pending: number
    rejected: number
}

const ContentLibrary: React.FC = () => {
    const navigate = useNavigate()
    const { data, isLoading } = useSWR<ContentStats>('/pt/dashboard/content-stats', fetcher)

    const stats = [
        { value: data?.published ?? '—', label: 'Published' },
        { value: data?.pending   ?? '—', label: 'Pending',  topBorder: true, topColor: '#fbbf24' },
        { value: data?.rejected  ?? '—', label: 'Rejected' },
    ]

    return (
        <Box
            bg={adminColors.surface} borderRadius="xl" borderWidth="1px"
            borderColor={adminColors.surfaceVariant} p="5" display="flex" flexDirection="column"
        >
            <Flex align="center" gap="2" mb="4" pb="3" borderBottomWidth="1px" borderColor={adminColors.surfaceVariant}>
                <Icon as={FiVideo} color={adminColors.dim} boxSize="16px" />
                <Text fontSize="16px" fontWeight="600" color={adminColors.text}>Content Library Status</Text>
            </Flex>

            {isLoading ? (
                <Flex justify="center" py="6">
                    <Spinner color={adminColors.primary} />
                </Flex>
            ) : (
                <Grid templateColumns="repeat(3, 1fr)" gap="3" mb="5" flex="1">
                    {stats.map((item, i) => (
                        <Box
                            key={i}
                            bg={adminColors.surfaceMid} borderWidth="1px" borderColor={adminColors.surfaceVariant}
                            borderRadius="lg" p="3" textAlign="center" position="relative"
                        >
                            {item.topBorder && (
                                <Box position="absolute" top="0" left="0" right="0" h="1" bg={item.topColor} borderTopRadius="lg" />
                            )}
                            <Text fontSize="22px" fontWeight="700" color={adminColors.text}>{item.value}</Text>
                            <Text fontSize="9px" fontWeight="700" color={adminColors.dim} mt="1" textTransform="uppercase" letterSpacing="0.05em">
                                {item.label}
                            </Text>
                        </Box>
                    ))}
                </Grid>
            )}

            {/* Add New Exercise → navigate to content library */}
            <Flex
                bg={adminColors.surfaceHigh} borderWidth="1px"
                borderColor={adminColors.surfaceVariant} borderRadius="lg" p="4"
                align="center" justify="space-between" mt="auto"
                cursor="pointer"
                onClick={() => navigate('/pt/content-library')}
                _hover={{ borderColor: adminColors.dim }}
                transition="border-color 0.2s"
            >
                <Box>
                    <Text fontSize="14px" fontWeight="600" color={adminColors.text}>Add New Exercise</Text>
                    <Text fontSize="11px" color={adminColors.dim}>Go to your content library</Text>
                </Box>
                <Flex
                    bg={adminColors.primary} color="white" borderRadius="full"
                    px="5" py="2" fontSize="13px" fontWeight="600" align="center" gap="2"
                    _hover={{ bg: adminColors.primarySoft, color: adminColors.surface }}
                    transition="all 0.15s" boxShadow="md"
                >
                    <Icon as={FiVideo} boxSize="14px" />
                    Library
                </Flex>
            </Flex>
        </Box>
    )
}

export default ContentLibrary
