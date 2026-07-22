import React from 'react'
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Text,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Icon,
    Circle,
} from '@chakra-ui/react'
import { FiEye, FiEdit2, FiTrash2, FiMoreVertical, FiPlay } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'

interface ExerciseRow {
    id: number
    title: string
    description?: string
    videoUrl?: string
    muscleGroup?: string
    category?: string
    muscleTarget?: string
    difficulty: number
    duration?: number
    createdBy?: number
    creatorName?: string
    packageId?: number | null
    status?: 'published' | 'pending' | 'rejected'
    thumbnailUrl?: string
}

interface ExerciseTableProps {
    exercises: ExerciseRow[]
    difficultyLabels: Record<number, string>
    getPackageBadge: (packageId: number | null | undefined) => React.ReactNode
    handlePreviewVideo: (url?: string) => void
    handleDelete: (id: number) => void
    openEdit: (ex: ExerciseRow) => void
    isAdmin: boolean
}

const difficultyColors: Record<number, string> = {
    0: '#48BB78',
    1: '#F59E0B',
    2: '#E03030',
}

const ThumbnailContent: React.FC<{ url?: string }> = ({ url }) => {
    if (!url) return <Icon as={FiPlay} color={adminColors.dim} boxSize="14px" />

    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (youtubeMatch) {
        return (
            <Box
                as="img"
                src={`https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`}
                alt=""
                w="100%" h="100%" objectFit="cover"
            />
        )
    }

    if (/\.(gif|jpg|jpeg|png|webp)(\?|$)/i.test(url)) {
        return (
            <Box
                as="img"
                src={url}
                alt=""
                w="100%" h="100%" objectFit="cover"
            />
        )
    }

    return (
        <Box
            as="video"
            src={url}
            preload="metadata"
            playsInline
            w="100%" h="100%" objectFit="cover"
        />
    )
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({
    exercises,
    difficultyLabels,
    getPackageBadge,
    handlePreviewVideo,
    handleDelete,
    openEdit,
    isAdmin,
}) => {
    return (
        <Box overflow="auto" maxHeight="calc(100vh - 300px)" sx={{ '&::-webkit-scrollbar': { width: '6px', height: '6px' }, '&::-webkit-scrollbar-track': { bg: '#0A0C10' }, '&::-webkit-scrollbar-thumb': { bg: '#2e3040', borderRadius: '3px' } }}>
            <Table variant="simple" size="sm" w="100%">
                <Thead position="sticky" top={0} zIndex={1} bg="#0A0C10">
                    <Tr>
                        <Th color="#8A8A93" borderColor="#1e2028" w="60px"></Th>
                        <Th color="#8A8A93" borderColor="#1e2028" w="300px">Exercise Name</Th>
                        <Th color="#8A8A93" borderColor="#1e2028" w="130px">Category</Th>
                        <Th color="#8A8A93" borderColor="#1e2028" w="100px">Difficulty</Th>
                        <Th color="#8A8A93" borderColor="#1e2028" w="140px">Muscle Target</Th>
                        <Th color="#8A8A93" borderColor="#1e2028" w="150px">Trainer</Th>
                        <Th color="#8A8A93" borderColor="#1e2028" w="80px" isNumeric>Duration</Th>
                        <Th color="#8A8A93" borderColor="#1e2028" w="180px">Package</Th>
                        {isAdmin && (
                            <Th color="#8A8A93" borderColor="#1e2028" w="70px">Action</Th>
                        )}
                    </Tr>
                </Thead>
                <Tbody>
                    {exercises.map((ex) => {
                        return (
                            <Tr key={ex.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                <Td borderColor="#1e2028">
                                    <Box
                                        as="button"
                                        onClick={() => handlePreviewVideo(ex.videoUrl)}
                                        cursor={ex.videoUrl ? 'pointer' : 'default'}
                                        display="inline-flex"
                                        borderRadius="full"
                                        _hover={ex.videoUrl ? { opacity: 0.8 } : undefined}
                                    >
                                        <Circle
                                            size="36px"
                                            bg={adminColors.surfaceHigh}
                                            overflow="hidden"
                                            flexShrink={0}
                                            border="1px solid"
                                            borderColor={adminColors.surfaceVariant}
                                        >
                                            <ThumbnailContent url={ex.videoUrl} />
                                        </Circle>
                                    </Box>
                                </Td>
                                <Td color="white" borderColor="#1e2028" fontWeight="600" fontSize="14px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={ex.title}>
                                    {ex.title}
                                </Td>
                                <Td borderColor="#1e2028" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                    <Badge
                                        bg="rgba(224, 48, 48, 0.12)"
                                        color={adminColors.primarySoft}
                                        px="8px"
                                        py="3px"
                                        borderRadius="6px"
                                        fontSize="11px"
                                        fontWeight="600"
                                        textTransform="uppercase"
                                    >
                                        {ex.category || ex.muscleGroup || 'General'}
                                    </Badge>
                                </Td>
                                <Td borderColor="#1e2028" overflow="hidden" whiteSpace="nowrap">
                                    <HStack spacing={1.5}>
                                        <Box
                                            w="8px"
                                            h="8px"
                                            borderRadius="full"
                                            bg={difficultyColors[ex.difficulty] || '#8A8A93'}
                                            flexShrink={0}
                                        />
                                        <Text color="#e2e1eb" fontSize="13px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                            {difficultyLabels[ex.difficulty] || '-'}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td color="#8A8A93" borderColor="#1e2028" fontSize="13px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" title={ex.muscleTarget || ex.muscleGroup || '-'}>
                                    {ex.muscleTarget || ex.muscleGroup || '-'}
                                </Td>
                                <Td color="#e2e1eb" borderColor="#1e2028" fontSize="13px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" title={ex.creatorName || 'AI Generated'}>
                                    {ex.creatorName || 'AI Generated'}
                                </Td>
                                <Td color="#e2e1eb" borderColor="#1e2028" isNumeric fontSize="13px" overflow="hidden" whiteSpace="nowrap">
                                    {ex.duration ? `${ex.duration} min` : '-'}
                                </Td>
                                <Td borderColor="#1e2028" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                    {getPackageBadge(ex.packageId)}
                                </Td>
                                {isAdmin && (
                                    <Td borderColor="#1e2028">
                                        <HStack spacing={1}>
                                            <IconButton
                                                aria-label="Edit exercise"
                                                icon={<FiEdit2 />}
                                                size="xs"
                                                colorScheme="blue"
                                                variant="ghost"
                                                fontSize="14px"
                                                onClick={() => openEdit(ex)}
                                            />
                                            <Menu>
                                                <MenuButton
                                                    as={IconButton}
                                                    aria-label="More actions"
                                                    icon={<FiMoreVertical />}
                                                    size="xs"
                                                    variant="ghost"
                                                    color="#8A8A93"
                                                    fontSize="14px"
                                                    _hover={{ color: 'white' }}
                                                />
                                                <MenuList
                                                    bg={adminColors.surfaceHigh}
                                                    borderColor={adminColors.surfaceVariant}
                                                    minW="140px"
                                                >
                                                    <MenuItem
                                                        bg="transparent"
                                                        _hover={{ bg: adminColors.surfaceVariant }}
                                                        color={adminColors.text}
                                                        fontSize="13px"
                                                        icon={<Icon as={FiEye} boxSize="14px" />}
                                                    >
                                                        View Details
                                                    </MenuItem>
                                                    <MenuItem
                                                        bg="transparent"
                                                        _hover={{ bg: adminColors.surfaceVariant }}
                                                        color={adminColors.error}
                                                        fontSize="13px"
                                                        icon={<Icon as={FiTrash2} boxSize="14px" />}
                                                        onClick={() => handleDelete(ex.id)}
                                                    >
                                                        Delete
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </HStack>
                                    </Td>
                                )}
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </Box>
    )
}

export default ExerciseTable
