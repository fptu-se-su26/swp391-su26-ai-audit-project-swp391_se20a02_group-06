import React, { useState, useMemo, useEffect } from 'react'
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
    HStack,
    VStack,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    IconButton,
    Avatar,
    Grid,
    Progress,
    useToast,
    Icon,
    Tooltip,
} from '@chakra-ui/react'
import { FiSearch, FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import PaginationFooter from '../../features/admin/components/PaginationFooter'
import { useTranslation } from 'react-i18next'

const MotionTr = motion(Tr)
const MotionBox = motion(Box)

interface WebsiteReviewItem {
    id: number
    userId: number
    fullname: string
    email: string
    avatarUrl?: string
    rating: number
    comment?: string
    isHidden: boolean
    createdAt: string
    updatedAt?: string
}

interface AdminReviewStatsResponse {
    totalReviews: number
    averageRating: number
    fiveStarCount: number
    fourStarCount: number
    threeStarCount: number
    twoStarCount: number
    oneStarCount: number
    reviews: WebsiteReviewItem[]
}

const fetcher = (url: string) => apiClient.get(url).then((res) => res.data)

const AdminReviews: React.FC = () => {
    const { t } = useTranslation()
    const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const pageSize = 10
    const toast = useToast()

    // Reset to first page when filtering or searching
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedRatingFilter, searchQuery])

    const apiUrl = `/admin/website-reviews?${selectedRatingFilter ? `ratingFilter=${selectedRatingFilter}&` : ''}${searchQuery ? `search=${encodeURIComponent(searchQuery)}` : ''}`

    const { data, error, isLoading, mutate } = useSWR<AdminReviewStatsResponse>(apiUrl, fetcher)

    const handleToggleHide = async (id: number, currentHidden: boolean) => {
        setActionLoadingId(id)
        try {
            await apiClient.put(`/admin/website-reviews/${id}/toggle-hide`)
            toast({
                title: t('common.status', 'Status Updated'),
                description: currentHidden ? t('admin.reviewVisibleSuccess', 'Review is now visible to the public.') : t('admin.reviewHiddenSuccess', 'Review has been hidden.'),
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: 'top-right',
            })
            mutate()
        } catch (err: any) {
            toast({
                title: t('common.error', 'Action Failed'),
                description: err.response?.data?.message || 'Failed to update review visibility status.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('admin.confirmDeleteReview', 'Are you sure you want to permanently delete this review?'))) return

        setActionLoadingId(id)
        try {
            await apiClient.delete(`/admin/website-reviews/${id}`)
            toast({
                title: t('admin.deleteReview', 'Review Deleted'),
                description: t('admin.reviewDeletedSuccess', 'The review has been permanently removed from the system.'),
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: 'top-right',
            })
            mutate()
        } catch (err: any) {
            toast({
                title: t('common.error', 'Delete Failed'),
                description: err.response?.data?.message || 'Failed to delete review.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setActionLoadingId(null)
        }
    }

    const total = data?.totalReviews || 0
    const avg = data?.averageRating || 5.0
    const counts = [
        { star: 5, count: data?.fiveStarCount || 0 },
        { star: 4, count: data?.fourStarCount || 0 },
        { star: 3, count: data?.threeStarCount || 0 },
        { star: 2, count: data?.twoStarCount || 0 },
        { star: 1, count: data?.oneStarCount || 0 },
    ]

    const allReviews = data?.reviews || []
    const totalItems = allReviews.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const safePage = Math.min(currentPage, totalPages)

    const paginatedReviews = useMemo(() => {
        const start = (safePage - 1) * pageSize
        return allReviews.slice(start, start + pageSize)
    }, [allReviews, safePage, pageSize])

    return (
        <AdminLayout title={t('admin.reviewsRatings', 'Reviews & Ratings')} searchPlaceholder={t('admin.searchReviews', 'Search reviews...')}>
            <Box p={{ base: '4', md: '7' }} maxW="1200px">
                <Flex justify="space-between" align="center" mb="6">
                    <Box>
                        <Heading fontSize="24px" fontWeight="800" color="white">
                            {t('admin.websiteReviews', 'Website Reviews & Ratings')}
                        </Heading>
                        <Text fontSize="13px" color="#8A8A93" mt="1">
                            {t('admin.websiteReviewsSubtitle', 'Monitor member feedback, star ratings, and testimonials after workout sessions.')}
                        </Text>
                    </Box>
                </Flex>

                {/* KPI Overview Cards */}
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 2fr' }} gap="4" mb="6">
                    {/* Card 1: Average Rating */}
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">
                            {t('admin.avgRating', 'Average Rating')}
                        </Text>
                        <HStack align="baseline" spacing="3" mt="2">
                            <Text fontSize="36px" fontWeight="800" color="#FFB800" lineHeight="1">
                                {avg.toFixed(1)}
                            </Text>
                            <Text fontSize="16px" color="#8A8A93" fontWeight="600">
                                / 5.0
                            </Text>
                        </HStack>
                        <HStack spacing="1" mt="2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Icon
                                    key={s}
                                    as={FaStar}
                                    color={s <= Math.round(avg) ? '#FFB800' : '#2A2D3A'}
                                    boxSize="18px"
                                />
                            ))}
                        </HStack>
                    </Box>

                    {/* Card 2: Total Reviews */}
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">
                            {t('admin.totalReviews', 'Total Reviews')}
                        </Text>
                        <Text fontSize="36px" fontWeight="800" color="white" lineHeight="1" mt="2">
                            {total}
                        </Text>
                        <Text fontSize="12px" color="#8A8A93" mt="3">
                            {t('admin.verifiedReviewNote', 'One verified review per member account')}
                        </Text>
                    </Box>

                    {/* Card 3: Rating Distribution */}
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700" mb="3">
                            {t('admin.ratingDistribution', 'Rating Distribution')}
                        </Text>
                        <VStack spacing="2" align="stretch">
                            {counts.map(({ star, count }) => {
                                const percent = total > 0 ? (count / total) * 100 : 0
                                return (
                                    <HStack key={star} spacing="3" fontSize="12px">
                                        <HStack w="55px" spacing="1">
                                            <Text color="white" fontWeight="700">{star}</Text>
                                            <Icon as={FaStar} color="#FFB800" boxSize="11px" />
                                            <Text color="#8A8A93" fontSize="11px">{t('admin.stars', 'Stars')}</Text>
                                        </HStack>
                                        <Progress
                                            value={percent}
                                            size="xs"
                                            colorScheme="yellow"
                                            bg="#1E2028"
                                            borderRadius="full"
                                            flex="1"
                                        />
                                        <Text color="#8A8A93" w="40px" textAlign="right">
                                            {count}
                                        </Text>
                                    </HStack>
                                )
                            })}
                        </VStack>
                    </Box>
                </Grid>

                {/* Filter and Search Bar */}
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align={{ base: 'stretch', md: 'center' }}
                    gap="3"
                    mb="4"
                >
                    {/* Star Filter Pills */}
                    <HStack spacing="2" overflowX="auto" pb={{ base: 2, md: 0 }}>
                        <Button
                            size="sm"
                            borderRadius="10px"
                            bg={selectedRatingFilter === null ? '#E03030' : '#141720'}
                            color={selectedRatingFilter === null ? 'white' : '#8A8A93'}
                            border="1px solid"
                            borderColor={selectedRatingFilter === null ? '#E03030' : '#1e2028'}
                            _hover={{ bg: selectedRatingFilter === null ? '#B82020' : '#1E2028', color: 'white' }}
                            onClick={() => setSelectedRatingFilter(null)}
                        >
                            {t('admin.all', 'All')} ({total})
                        </Button>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const isSelected = selectedRatingFilter === star
                            const count = counts.find((c) => c.star === star)?.count || 0
                            return (
                                <Button
                                    key={star}
                                    size="sm"
                                    borderRadius="10px"
                                    bg={isSelected ? '#FFB800' : '#141720'}
                                    color={isSelected ? '#0A0C10' : '#8A8A93'}
                                    border="1px solid"
                                    borderColor={isSelected ? '#FFB800' : '#1e2028'}
                                    _hover={{ bg: isSelected ? '#E6A600' : '#1E2028', color: isSelected ? '#0A0C10' : 'white' }}
                                    leftIcon={<Icon as={FaStar} color={isSelected ? '#0A0C10' : '#FFB800'} />}
                                    onClick={() => setSelectedRatingFilter(isSelected ? null : star)}
                                >
                                    {star} {star === 1 ? t('admin.star', 'Star') : t('admin.stars', 'Stars')} ({count})
                                </Button>
                            )
                        })}
                    </HStack>

                    {/* Search Input */}
                    <InputGroup maxW={{ base: 'full', md: '300px' }} size="sm">
                        <InputLeftElement pointerEvents="none">
                            <FiSearch color="#8A8A93" />
                        </InputLeftElement>
                        <Input
                            placeholder={t('admin.searchReviews', 'Search by name, email, feedback...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            bg="#141720"
                            border="1px solid"
                            borderColor="#1e2028"
                            borderRadius="10px"
                            color="white"
                            _focus={{ borderColor: '#E03030' }}
                        />
                    </InputGroup>
                </Flex>

                {/* Table Data Card */}
                <MotionBox
                    bg="#141720"
                    border="1px solid"
                    borderColor="#1e2028"
                    borderRadius="16px"
                    overflow="hidden"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isLoading ? (
                        <Flex justify="center" align="center" p="16">
                            <Spinner color="#E03030" size="lg" />
                        </Flex>
                    ) : error ? (
                        <Text color="red.400" p="8" textAlign="center">
                            {t('admin.failedLoadReviews', 'Failed to load reviews. Please refresh or try again later.')}
                        </Text>
                    ) : allReviews.length === 0 ? (
                        <Box p="16" textAlign="center">
                            <Icon as={FaStar} boxSize="40px" color="#2A2D3A" mb="3" />
                            <Text color="#8A8A93" fontWeight="600">
                                {t('admin.noReviewsMatch', 'No reviews match your filter criteria.')}
                            </Text>
                        </Box>
                    ) : (
                        <>
                            <Box overflowX="auto">
                                <Table variant="simple" size="sm">
                                    <Thead bg="#0A0C10">
                                        <Tr>
                                            <Th color="#8A8A93" borderColor="#1e2028" py="4" fontSize="11px" letterSpacing="0.05em">{t('admin.user', 'USER')}</Th>
                                            <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" letterSpacing="0.05em">{t('admin.rating', 'RATING')}</Th>
                                            <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" letterSpacing="0.05em">{t('admin.feedbackComments', 'FEEDBACK & COMMENTS')}</Th>
                                            <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" letterSpacing="0.05em">{t('admin.dateTime', 'DATE & TIME')}</Th>
                                            <Th color="#8A8A93" borderColor="#1e2028" fontSize="11px" letterSpacing="0.05em">{t('admin.status', 'STATUS')}</Th>
                                            <Th color="#8A8A93" borderColor="#1e2028" textAlign="right" fontSize="11px" letterSpacing="0.05em">{t('admin.actions', 'ACTIONS')}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {paginatedReviews.map((r, idx) => {
                                            const isActionLoading = actionLoadingId === r.id
                                            return (
                                                <MotionTr
                                                    key={`${safePage}-${r.id}`}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.25, delay: idx * 0.035, ease: 'easeOut' }}
                                                    opacity={r.isHidden ? 0.6 : 1}
                                                    _hover={{ bg: 'rgba(255,255,255,0.02)' }}
                                                >
                                                    {/* User Info */}
                                                    <Td borderColor="#1e2028" py="4">
                                                        <HStack spacing="3">
                                                            <Avatar size="sm" name={r.fullname} src={r.avatarUrl} />
                                                            <Box>
                                                                <Text color="white" fontWeight="700" fontSize="13px">
                                                                    {r.fullname}
                                                                </Text>
                                                                <Text color="#8A8A93" fontSize="11px">
                                                                    {r.email}
                                                                </Text>
                                                            </Box>
                                                        </HStack>
                                                    </Td>

                                                    {/* Stars */}
                                                    <Td borderColor="#1e2028">
                                                        <HStack spacing="1">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Icon
                                                                    key={s}
                                                                    as={FaStar}
                                                                    color={s <= r.rating ? '#FFB800' : '#2A2D3A'}
                                                                    boxSize="13px"
                                                                />
                                                            ))}
                                                            <Text color="#FFB800" fontWeight="700" fontSize="12px" ml="1">
                                                                {r.rating}.0
                                                            </Text>
                                                        </HStack>
                                                    </Td>

                                                    {/* Comment */}
                                                    <Td borderColor="#1e2028" maxW="360px">
                                                        {r.comment ? (
                                                            <Text color="#E2E1EB" fontSize="13px" noOfLines={2}>
                                                                "{r.comment}"
                                                            </Text>
                                                        ) : (
                                                            <Text color="#555" fontSize="12px" fontStyle="italic">
                                                                {t('admin.noComment', '(No comment provided)')}
                                                            </Text>
                                                        )}
                                                    </Td>

                                                    {/* Date */}
                                                    <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px">
                                                        <Box>
                                                            <Text color="white" fontSize="12px" fontWeight="600">
                                                                {new Date(r.createdAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: '2-digit',
                                                                    year: 'numeric',
                                                                })}
                                                            </Text>
                                                            <Text color="#8A8A93" fontSize="11px">
                                                                {new Date(r.createdAt).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: false,
                                                                })}
                                                            </Text>
                                                        </Box>
                                                    </Td>

                                                    {/* Status Badge */}
                                                    <Td borderColor="#1e2028">
                                                        <Badge
                                                            bg={r.isHidden ? '#2A2D3A' : 'rgba(34, 197, 94, 0.15)'}
                                                            color={r.isHidden ? '#8A8A93' : '#4ADE80'}
                                                            border="1px solid"
                                                            borderColor={r.isHidden ? '#333' : 'rgba(34, 197, 94, 0.3)'}
                                                            px="2.5"
                                                            py="0.5"
                                                            borderRadius="md"
                                                            fontSize="11px"
                                                            fontWeight="700"
                                                            letterSpacing="0.05em"
                                                        >
                                                            {r.isHidden ? t('admin.hidden', 'HIDDEN') : t('admin.visible', 'VISIBLE')}
                                                        </Badge>
                                                    </Td>

                                                    {/* Action Buttons */}
                                                    <Td borderColor="#1e2028" textAlign="right">
                                                        <HStack spacing="2" justify="flex-end">
                                                            <Tooltip label={r.isHidden ? t('admin.makeVisible', 'Make review visible') : t('admin.hideReview', 'Hide review from public')}>
                                                                <IconButton
                                                                    aria-label="Toggle Hide"
                                                                    icon={r.isHidden ? <FiEye /> : <FiEyeOff />}
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    color={r.isHidden ? '#4ADE80' : '#8A8A93'}
                                                                    _hover={{ bg: '#1E2028', color: 'white' }}
                                                                    isLoading={isActionLoading}
                                                                    onClick={() => handleToggleHide(r.id, r.isHidden)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip label={t('admin.deleteReview', 'Delete review permanently')}>
                                                                <IconButton
                                                                    aria-label="Delete review"
                                                                    icon={<FiTrash2 />}
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    color="red.400"
                                                                    _hover={{ bg: 'red.900', color: 'red.200' }}
                                                                    isLoading={isActionLoading}
                                                                    onClick={() => handleDelete(r.id)}
                                                                />
                                                            </Tooltip>
                                                        </HStack>
                                                    </Td>
                                                </MotionTr>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </Box>

                            {/* Pagination Footer */}
                            {totalItems > 0 && (
                                <PaginationFooter
                                    currentPage={safePage}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    pageSize={pageSize}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </>
                    )}
                </MotionBox>
            </Box>
        </AdminLayout>
    )
}

export default AdminReviews

