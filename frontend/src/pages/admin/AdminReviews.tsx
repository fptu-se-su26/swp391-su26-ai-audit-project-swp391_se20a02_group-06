import React, { useState } from 'react'
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
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'

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
    const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
    const toast = useToast()

    const apiUrl = `/admin/website-reviews?${selectedRatingFilter ? `ratingFilter=${selectedRatingFilter}&` : ''}${searchQuery ? `search=${encodeURIComponent(searchQuery)}` : ''}`

    const { data, error, isLoading, mutate } = useSWR<AdminReviewStatsResponse>(apiUrl, fetcher)

    const handleToggleHide = async (id: number, currentHidden: boolean) => {
        setActionLoadingId(id)
        try {
            await apiClient.put(`/admin/website-reviews/${id}/toggle-hide`)
            toast({
                title: 'Thành công',
                description: currentHidden ? 'Đã hiển thị lại đánh giá.' : 'Đã ẩn đánh giá.',
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: 'top-right',
            })
            mutate()
        } catch (err: any) {
            toast({
                title: 'Thao tác thất bại',
                description: err.response?.data?.message || 'Không thể cập nhật trạng thái.',
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
        if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá này không?')) return

        setActionLoadingId(id)
        try {
            await apiClient.delete(`/admin/website-reviews/${id}`)
            toast({
                title: 'Đã xóa',
                description: 'Đánh giá đã được xóa khỏi hệ thống.',
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: 'top-right',
            })
            mutate()
        } catch (err: any) {
            toast({
                title: 'Xóa thất bại',
                description: err.response?.data?.message || 'Không thể xóa đánh giá.',
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

    return (
        <AdminLayout title="Reviews & Ratings" searchPlaceholder="Tìm kiếm đánh giá...">
            <Box p={{ base: '4', md: '7' }} maxW="1200px">
                <Flex justify="space-between" align="center" mb="6">
                    <Box>
                        <Heading fontSize="24px" fontWeight="800" color="white">
                            Quản lý Đánh giá Trang web
                        </Heading>
                        <Text fontSize="13px" color="#8A8A93" mt="1">
                            Xem phản hồi, số sao và góp ý của học viên sau khi hoàn thành buổi tập đầu tiên.
                        </Text>
                    </Box>
                </Flex>

                {/* KPI Overview Cards */}
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 2fr' }} gap="4" mb="6">
                    {/* Card 1: Điểm trung bình */}
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">
                            Điểm đánh giá trung bình
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

                    {/* Card 2: Tổng lượt đánh giá */}
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700">
                            Tổng số đánh giá
                        </Text>
                        <Text fontSize="36px" fontWeight="800" color="white" lineHeight="1" mt="2">
                            {total}
                        </Text>
                        <Text fontSize="12px" color="#8A8A93" mt="3">
                            Mỗi tài khoản đánh giá 1 lần duy nhất
                        </Text>
                    </Box>

                    {/* Card 3: Phân bố số sao */}
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                        <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700" mb="3">
                            Phân bố xếp hạng sao
                        </Text>
                        <VStack spacing="2" align="stretch">
                            {counts.map(({ star, count }) => {
                                const percent = total > 0 ? (count / total) * 100 : 0
                                return (
                                    <HStack key={star} spacing="3" fontSize="12px">
                                        <HStack w="45px" spacing="1">
                                            <Text color="white" fontWeight="700">{star}</Text>
                                            <Icon as={FaStar} color="#FFB800" boxSize="11px" />
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
                            Tất cả ({total})
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
                                    {star} Sao ({count})
                                </Button>
                            )
                        })}
                    </HStack>

                    {/* Search Input */}
                    <InputGroup maxW={{ base: 'full', md: '280px' }} size="sm">
                        <InputLeftElement pointerEvents="none">
                            <FiSearch color="#8A8A93" />
                        </InputLeftElement>
                        <Input
                            placeholder="Tìm tên, email, nhận xét..."
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

                {/* Table Data */}
                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
                    {isLoading ? (
                        <Flex justify="center" align="center" p="16">
                            <Spinner color="#E03030" size="lg" />
                        </Flex>
                    ) : error ? (
                        <Text color="red.400" p="8" textAlign="center">
                            Không thể tải danh sách đánh giá.
                        </Text>
                    ) : data?.reviews?.length === 0 ? (
                        <Box p="16" textAlign="center">
                            <Icon as={FaStar} boxSize="40px" color="#2A2D3A" mb="3" />
                            <Text color="#8A8A93" fontWeight="600">
                                Chưa có đánh giá nào phù hợp với bộ lọc.
                            </Text>
                        </Box>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple" size="sm">
                                <Thead bg="#0A0C10">
                                    <Tr>
                                        <Th color="#8A8A93" borderColor="#1e2028" py="4">Người dùng</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028">Số sao</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028">Nhận xét & Góp ý</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028">Thời gian</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028">Trạng thái</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028" textAlign="right">Thao tác</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data?.reviews.map((r) => {
                                        const isActionLoading = actionLoadingId === r.id
                                        return (
                                            <Tr
                                                key={r.id}
                                                opacity={r.isHidden ? 0.6 : 1}
                                                _hover={{ bg: 'rgba(255,255,255,0.02)' }}
                                                transition="all 0.15s"
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
                                                            (Không có lời nhắn)
                                                        </Text>
                                                    )}
                                                </Td>

                                                {/* Date */}
                                                <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px">
                                                    {new Date(r.createdAt).toLocaleDateString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </Td>

                                                {/* Status Badge */}
                                                <Td borderColor="#1e2028">
                                                    <Badge
                                                        bg={r.isHidden ? '#2A2D3A' : 'rgba(34, 197, 94, 0.15)'}
                                                        color={r.isHidden ? '#8A8A93' : '#4ADE80'}
                                                        border="1px solid"
                                                        borderColor={r.isHidden ? '#333' : 'rgba(34, 197, 94, 0.3)'}
                                                        px="2"
                                                        py="0.5"
                                                        borderRadius="md"
                                                        fontSize="11px"
                                                    >
                                                        {r.isHidden ? 'Đã ẩn' : 'Hiển thị'}
                                                    </Badge>
                                                </Td>

                                                {/* Action Buttons */}
                                                <Td borderColor="#1e2028" textAlign="right">
                                                    <HStack spacing="2" justify="flex-end">
                                                        <Tooltip label={r.isHidden ? 'Hiện đánh giá' : 'Ẩn đánh giá'}>
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
                                                        <Tooltip label="Xóa đánh giá">
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

export default AdminReviews
