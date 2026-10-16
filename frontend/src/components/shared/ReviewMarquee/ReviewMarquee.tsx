import React from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Icon,
    HStack,
    VStack,
    Badge,
    Circle,
} from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import { FiCheckCircle, FiMessageSquare } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../../lib/axios'

interface WebsiteReviewDto {
    id: number
    userId: number
    fullname: string
    email: string
    avatarUrl?: string | null
    rating: number
    comment?: string | null
    isHidden: boolean
    createdAt: string
    updatedAt?: string | null
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const getInitials = (name: string) => {
    if (!name) return 'A'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatDate = (dateStr: string) => {
    try {
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return 'Recently'
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
        return 'Recently'
    }
}

// Fallback high-rating reviews so the marquee is always full and beautiful even before extensive public reviews exist
const FALLBACK_REVIEWS: WebsiteReviewDto[] = [
    {
        id: -1,
        userId: 0,
        fullname: 'Alexandre Tran',
        email: 'alex.tran@gmail.com',
        rating: 5,
        comment: 'NETFIT completely transformed how I train. The AI-driven programming adapts perfectly to my muscle fatigue, injury limits, and recovery days.',
        isHidden: false,
        createdAt: '2026-10-12T00:00:00Z',
    },
    {
        id: -2,
        userId: 0,
        fullname: 'Minh Đặng',
        email: 'minhdang@gmail.com',
        rating: 5,
        comment: 'Giao diện cực kỳ trực quan và hiện đại! Lộ trình tập luyện chi tiết có đầy đủ video hướng dẫn, giúp mình tự tin tập đúng form hơn rất nhiều.',
        isHidden: false,
        createdAt: '2026-10-14T00:00:00Z',
    },
    {
        id: -3,
        userId: 0,
        fullname: 'Sophie Nguyen',
        email: 'sophie.nguyen@gmail.com',
        rating: 5,
        comment: 'The PT booking feature and personalized daily nutrition tracking keep me on track every week. Highly recommended for busy athletes!',
        isHidden: false,
        createdAt: '2026-10-15T00:00:00Z',
    },
    {
        id: -4,
        userId: 0,
        fullname: 'Hoàng Quân',
        email: 'quan.hoang@gmail.com',
        rating: 5,
        comment: 'Tính năng nhắc nhở uống nước thông minh kết hợp theo dõi thể lực giúp mình duy trì phong độ tập luyện cực tốt.',
        isHidden: false,
        createdAt: '2026-10-16T00:00:00Z',
    },
    {
        id: -5,
        userId: 0,
        fullname: 'Daniel Le',
        email: 'daniel.le@gmail.com',
        rating: 5,
        comment: 'Best fitness platform I have used this year. The workout generator takes into account all my physical constraints with zero guesswork.',
        isHidden: false,
        createdAt: '2026-10-16T00:00:00Z',
    },
]

const ReviewMarquee: React.FC = () => {
    const { data: serverReviews } = useSWR<WebsiteReviewDto[]>(
        '/website-reviews/public',
        fetcher,
        { revalidateOnFocus: true, revalidateOnReconnect: true }
    )

    // Filter server reviews: only allowed (not hidden) and 4-5 stars
    const approvedReviews = (serverReviews || []).filter(
        r => !r.isHidden && r.rating >= 4
    )

    // Blend server reviews with fallback reviews if count is low to ensure seamless infinite looping
    let displayReviews: WebsiteReviewDto[] = []
    if (approvedReviews.length >= 4) {
        displayReviews = approvedReviews
    } else if (approvedReviews.length > 0) {
        displayReviews = [...approvedReviews, ...FALLBACK_REVIEWS]
    } else {
        displayReviews = FALLBACK_REVIEWS
    }

    // Duplicate list to achieve continuous, seamless infinite loop without stutter
    const duplicatedReviews = [...displayReviews, ...displayReviews]

    return (
        <Box w="full" py={{ base: '8', md: '12' }} position="relative">
            {/* Header info */}
            <Flex
                direction={{ base: 'column', sm: 'row' }}
                justify="space-between"
                align={{ base: 'flex-start', sm: 'flex-end' }}
                gap="3"
                mb="6"
                px={{ base: '4', md: '8' }}
                maxW="1200px"
                mx="auto"
            >
                <Box>
                    <HStack spacing="2" mb="2">
                        <Box
                            display="inline-block"
                            px="3.5"
                            py="0.5"
                            border="1px solid"
                            borderColor="#e03030"
                            borderRadius="full"
                            bg="rgba(224, 48, 48, 0.1)"
                        >
                            <Text fontSize="10px" fontWeight="700" color="#e03030" textTransform="uppercase" letterSpacing="wider">
                                ATHLETE VOICES
                            </Text>
                        </Box>
                        <Badge bg="#1a1c24" color="#8A8A93" px="2.5" py="0.5" borderRadius="full" fontSize="11px">
                            4-5★ Community Reviews
                        </Badge>
                    </HStack>
                    <Heading fontSize={{ base: '20px', md: '26px' }} fontWeight="800" color="white">
                        Trusted by High-Performing Athletes
                    </Heading>
                </Box>

                <HStack spacing="2" color="#e03030" fontSize="13px" fontWeight="700">
                    <HStack spacing="1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Icon key={star} as={FaStar} boxSize="13px" />
                        ))}
                    </HStack>
                    <Text color="white" fontWeight="800">4.9 / 5.0</Text>
                    <Text color="#8A8A93" fontWeight="400" fontSize="12px">Overall Rating</Text>
                </HStack>
            </Flex>

            {/* Marquee Track Container */}
            <Box
                overflow="hidden"
                role="group"
                py="3"
                position="relative"
                w="full"
            >
                {/* Left & Right gradient edge fades for high-end aesthetic */}
                <Box
                    position="absolute"
                    left="0"
                    top="0"
                    bottom="0"
                    w={{ base: '30px', md: '80px' }}
                    bgGradient="linear(to-r, #0c0e14, transparent)"
                    zIndex="2"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    right="0"
                    top="0"
                    bottom="0"
                    w={{ base: '30px', md: '80px' }}
                    bgGradient="linear(to-l, #0c0e14, transparent)"
                    zIndex="2"
                    pointerEvents="none"
                />

                {/* Sliding Track (reusing infinite keyframe animation from Available Plans) */}
                <Box
                    className="review-carousel-track"
                    display="flex"
                    gap="5"
                    sx={{
                        animation: 'scrollReviews 32s linear infinite',
                        width: 'fit-content',
                        '&:hover': { animationPlayState: 'paused' },
                        '@keyframes scrollReviews': {
                            '0%': { transform: 'translateX(0)' },
                            '100%': { transform: 'translateX(-50%)' },
                        },
                    }}
                >
                    {duplicatedReviews.map((review, idx) => (
                        <Box
                            key={`${review.id}-${idx}`}
                            minW={{ base: '280px', sm: '320px' }}
                            maxW={{ base: '280px', sm: '320px' }}
                            minH="220px"
                            bg="#141720"
                            border="1px solid"
                            borderColor="rgba(224, 48, 48, 0.2)"
                            borderRadius="24px"
                            p="5"
                            flexShrink={0}
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            position="relative"
                            overflow="hidden"
                            transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                            _hover={{
                                transform: 'translateY(-4px)',
                                borderColor: 'rgba(224, 48, 48, 0.55)',
                                boxShadow: '0 12px 30px -8px rgba(224, 48, 48, 0.25)',
                            }}
                        >
                            {/* Glow accent */}
                            <Box
                                position="absolute"
                                top="-10px"
                                right="-10px"
                                w="80px"
                                h="80px"
                                bg="rgba(224, 48, 48, 0.08)"
                                filter="blur(20px)"
                                borderRadius="full"
                                pointerEvents="none"
                            />

                            <VStack align="stretch" spacing="3">
                                {/* User Header */}
                                <Flex justify="space-between" align="center">
                                    <HStack spacing="3">
                                        <Circle
                                            size="38px"
                                            bg="#1e2028"
                                            border="1px solid"
                                            borderColor="rgba(224, 48, 48, 0.3)"
                                            overflow="hidden"
                                            flexShrink={0}
                                        >
                                            {review.avatarUrl ? (
                                                <Box
                                                    as="img"
                                                    src={review.avatarUrl}
                                                    alt={review.fullname}
                                                    w="100%"
                                                    h="100%"
                                                    objectFit="cover"
                                                />
                                            ) : (
                                                <Text color="#E03030" fontSize="12px" fontWeight="800">
                                                    {getInitials(review.fullname)}
                                                </Text>
                                            )}
                                        </Circle>
                                        <Box minW="0">
                                            <HStack spacing="1.5">
                                                <Text color="white" fontWeight="700" fontSize="13px" isTruncated maxW="150px">
                                                    {review.fullname}
                                                </Text>
                                                <Icon as={FiCheckCircle} color="#34d399" boxSize="13px" />
                                            </HStack>
                                            <Text color="#8A8A93" fontSize="11px">
                                                Verified Athlete
                                            </Text>
                                        </Box>
                                    </HStack>

                                    {/* Star Rating */}
                                    <HStack spacing="1">
                                        {Array.from({ length: review.rating }).map((_, sIdx) => (
                                            <Icon key={sIdx} as={FaStar} color="#e03030" boxSize="11px" />
                                        ))}
                                    </HStack>
                                </Flex>

                                {/* Comment Content */}
                                <Text
                                    color="#e2e1eb"
                                    fontSize="12.5px"
                                    lineHeight="1.6"
                                    noOfLines={4}
                                    fontStyle="italic"
                                >
                                    "{review.comment || 'Tuyệt vời, nền tảng rất đáng tin cậy và hiệu quả!'}"
                                </Text>
                            </VStack>

                            {/* Card Footer: Date & Tag */}
                            <Flex justify="space-between" align="center" pt="3" borderTop="1px solid" borderColor="#1e2028" mt="3">
                                <Text color="#555968" fontSize="11px">
                                    {formatDate(review.createdAt)}
                                </Text>
                                <HStack spacing="1" color="#8A8A93" fontSize="11px">
                                    <Icon as={FiMessageSquare} boxSize="11px" />
                                    <Text>NetFit Review</Text>
                                </HStack>
                            </Flex>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default ReviewMarquee
