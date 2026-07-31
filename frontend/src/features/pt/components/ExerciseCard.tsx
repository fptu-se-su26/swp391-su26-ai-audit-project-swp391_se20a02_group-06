import React from 'react'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiMoreVertical, FiEye, FiThumbsUp, FiClock, FiAlertTriangle, FiArrowRight } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'

type ExerciseStatus = 'published' | 'pending' | 'rejected' | 'draft'

interface ExerciseCardProps {
    title: string
    status: ExerciseStatus
    duration: string
    tags: string[]
    thumbnail: string
    views?: string
    likes?: string
    feedbackMsg?: string
    submittedAgo?: string
}

const statusConfig: Record<ExerciseStatus, {
    label: string
    dotColor: string
    bgColor: string
    borderColor: string
    avatarFilter?: string
    overlay?: boolean
}> = {
    published: {
        label: 'Published',
        dotColor: '#10b981',
        bgColor: `${adminColors.surfaceHigh}E6`,
        borderColor: adminColors.surfaceVariant,
    },
    pending: {
        label: 'Pending Review',
        dotColor: '#f59e0b',
        bgColor: `${adminColors.surfaceHigh}E6`,
        borderColor: 'rgba(245,158,11,0.3)',
        avatarFilter: 'brightness(0.8)',
    },
    rejected: {
        label: 'Rejected',
        dotColor: adminColors.primary,
        bgColor: `${adminColors.surfaceHigh}E6`,
        borderColor: adminColors.primary,
        avatarFilter: 'grayscale(1) brightness(0.6)',
        overlay: true,
    },
    draft: {
        label: 'Draft',
        dotColor: adminColors.dim,
        bgColor: `${adminColors.surfaceHigh}E6`,
        borderColor: adminColors.surfaceVariant,
    },
}

const ThumbnailMedia: React.FC<{ url: string; rejected: boolean; pending: boolean }> = ({ url, rejected, pending }) => {
    const imageFilter = rejected ? 'grayscale(1) brightness(0.6)' : pending ? 'brightness(0.8)' : undefined

    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (youtubeMatch) {
        return (
            <Box
                as="img"
                src={`https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`}
                alt=""
                w="full" h="full" objectFit="cover"
                filter={imageFilter}
            />
        )
    }

    if (/\.(gif|jpg|jpeg|png|webp)(\?|$)/i.test(url)) {
        return (
            <Box
                as="img"
                src={url}
                alt=""
                w="full" h="full" objectFit="cover"
                filter={imageFilter}
            />
        )
    }

    return (
        <Box
            as="video"
            src={url}
            preload="metadata"
            playsInline
            muted
            w="full" h="full" objectFit="cover"
            filter={imageFilter}
        />
    )
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
    title, status, duration, tags, thumbnail, views, likes, feedbackMsg, submittedAgo,
}) => {
    const cfg = statusConfig[status]
    const isPending = status === 'pending'
    const isRejected = status === 'rejected'

    return (
        <Box
            bg="#141414"
            borderRadius="32px"
            borderWidth="1px"
            borderColor={isPending ? 'rgba(245,158,11,0.3)' : isRejected ? adminColors.primary : adminColors.surfaceVariant}
            overflow="hidden"
            _hover={{ borderColor: adminColors.surfaceVariant }}
            transition="border-color 0.2s"
            display="flex"
            flexDirection="column"
            h="full"
            boxShadow="md"
            position="relative"
        >
            {isRejected && (
                <Box position="absolute" top="0" left="0" right="0" h="4px" bg={adminColors.primary} zIndex={1} />
            )}

            {/* Thumbnail */}
            <Box position="relative" aspectRatio={16 / 9} w="full" overflow="hidden" bg={adminColors.surfaceMid}>
                <ThumbnailMedia url={thumbnail} rejected={isRejected} pending={isPending} />
                {isRejected && (
                    <Box position="absolute" inset="0" bg={`${adminColors.primary}1A`} zIndex={1} />
                )}
                <Box
                    position="absolute"
                    inset="0"
                    bgGradient="linear(to-t, rgba(18,19,26,0.8), transparent)"
                    zIndex={1}
                />

                {/* Status badge */}
                <Flex
                    position="absolute"
                    top="3"
                    right="3"
                    zIndex={2}
                    bg={cfg.bgColor}
                    backdropFilter="blur(4px)"
                    borderRadius="full"
                    px="2"
                    py="0.5"
                    align="center"
                    gap="1.5"
                    borderWidth="1px"
                    borderColor={isPending ? 'rgba(245,158,11,0.3)' : cfg.borderColor}
                >
                    {isPending ? (
                        <Box position="relative" w="2" h="2">
                            <Box
                                position="absolute"
                                w="2" h="2"
                                borderRadius="full"
                                bg="#f59e0b"
                                opacity={0.75}
                                animation="ping 1.5s infinite"
                            />
                            <Box position="relative" w="2" h="2" borderRadius="full" bg="#f59e0b" />
                        </Box>
                    ) : isRejected ? (
                        <Icon as={FiAlertTriangle} color={adminColors.primary} boxSize="12px" />
                    ) : (
                        <Box w="2" h="2" borderRadius="full" bg={cfg.dotColor} />
                    )}
                    <Text fontSize="9px" fontWeight="700" letterSpacing="0.05em" textTransform="uppercase" color={isRejected ? adminColors.primary : status === 'draft' ? adminColors.dim : adminColors.text}>
                        {cfg.label}
                    </Text>
                </Flex>

                {/* Duration */}
                <Flex
                    position="absolute"
                    bottom="3"
                    right="3"
                    zIndex={2}
                    bg={cfg.bgColor}
                    backdropFilter="blur(4px)"
                    borderRadius="md"
                    px="2"
                    py="1"
                >
                    <Text fontSize="9px" fontWeight="700" letterSpacing="0.05em" textTransform="uppercase" color={adminColors.text}>
                        {duration}
                    </Text>
                </Flex>
            </Box>

            {/* Body */}
            <Flex direction="column" p="4" flex="1">
                <Flex justify="space-between" align="flex-start" mb="2">
                    <Text fontSize="16px" fontWeight="600" color={adminColors.text} noOfLines={2}>
                        {title}
                    </Text>
                    <Icon as={FiMoreVertical} color={adminColors.dim} boxSize="16px" cursor="pointer" flexShrink={0} ml="2" _hover={{ color: adminColors.primary }} />
                </Flex>

                <Flex wrap="wrap" gap="1" mb="3">
                    {tags.map(tag => (
                        <Flex
                            key={tag}
                            bg={adminColors.surfaceVariant}
                            color={adminColors.text}
                            px="2"
                            py="0.5"
                            borderRadius="full"
                            fontSize="9px"
                            fontWeight="700"
                            letterSpacing="0.05em"
                            textTransform="uppercase"
                        >
                            {tag}
                        </Flex>
                    ))}
                </Flex>

                {/* Published: views/likes */}
                {status === 'published' && (
                    <Flex mt="auto" pt="3" borderTopWidth="1px" borderColor={adminColors.surfaceVariant} align="center" justify="space-between" color={adminColors.dim}>
                        <Flex align="center" gap="1">
                            <Icon as={FiEye} boxSize="14px" />
                            <Text fontSize="12px">{views} views</Text>
                        </Flex>
                        <Flex align="center" gap="1">
                            <Icon as={FiThumbsUp} boxSize="14px" />
                            <Text fontSize="12px">{likes}%</Text>
                        </Flex>
                    </Flex>
                )}

                {/* Pending: submitted info */}
                {status === 'pending' && (
                    <Flex mt="auto" pt="3" borderTopWidth="1px" borderColor={adminColors.surfaceVariant}>
                        <Flex align="center" gap="1.5" bg="rgba(51,52,60,0.5)" p="2" borderRadius="lg" w="full" color={adminColors.dim}>
                            <Icon as={FiClock} boxSize="14px" />
                            <Text fontSize="12px">Submitted {submittedAgo}. Est. review: 24h.</Text>
                        </Flex>
                    </Flex>
                )}

                {/* Rejected: feedback */}
                {status === 'rejected' && (
                    <Box mt="auto" bg={adminColors.surfaceHigh} borderWidth="1px" borderColor={adminColors.surfaceVariant} borderRadius="lg" p="3">
                        <Flex align="flex-start" gap="1.5" mb="1">
                            <Icon as={FiAlertTriangle} color={adminColors.primary} boxSize="14px" mt="0.5" flexShrink={0} />
                            <Text fontSize="12px" color={adminColors.text}>
                                {feedbackMsg}
                            </Text>
                        </Flex>
                        <Flex
                            as="button"
                            align="center" gap="1"
                            color={adminColors.primarySoft} fontSize="13px" fontWeight="600"
                            w="full" justify="flex-end" mt="1"
                            _hover={{ color: adminColors.primary }}
                            transition="color 0.15s"
                        >
                            View Feedback Details
                            <Icon as={FiArrowRight} boxSize="14px" />
                        </Flex>
                    </Box>
                )}
            </Flex>
        </Box>
    )
}

export default ExerciseCard