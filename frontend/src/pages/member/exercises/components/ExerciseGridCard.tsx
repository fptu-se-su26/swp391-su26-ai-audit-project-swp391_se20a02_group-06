import React from 'react'
import {
    Box, Flex, Text, Icon, Heading,
} from '@chakra-ui/react'
import { FiPlay, FiLock, FiStar, FiClock } from 'react-icons/fi'

export interface ExerciseGridItem {
    id: number
    title: string
    muscleGroup: string
    difficulty: string
    duration: string
    packageBadge: { label: string; color: string; bg: string }
    isLocked: boolean
    requiredPlan?: string
    thumbnailUrl?: string
}

interface ExerciseGridCardProps {
    exercise: ExerciseGridItem
    onPlay?: (id: number) => void
    onUpgrade?: () => void
}

const ExerciseGridCard: React.FC<ExerciseGridCardProps> = ({ exercise, onPlay, onUpgrade }) => {
    const { id, title, muscleGroup, difficulty, duration, packageBadge, isLocked, requiredPlan, thumbnailUrl } = exercise

    return (
        <Box
            role="group"
            bg="#141414"
            borderRadius="32px"
            overflow="hidden"
            border="1px solid"
            borderColor={packageBadge.label === 'VIP' ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)'}
            boxShadow={packageBadge.label === 'VIP' ? '0 0 15px rgba(255,215,0,0.12)' : 'none'}
            position="relative"
            cursor={isLocked ? 'default' : 'pointer'}
            _hover={!isLocked ? { boxShadow: 'md', borderColor: 'rgba(255,255,255,0.12)' } : undefined}
            transition="all 0.2s"
            onClick={() => { if (!isLocked && onPlay) onPlay(id) }}
        >
            {/* Thumbnail */}
            <Box position="relative" w="full" aspectRatio={16 / 9} bg="#1E1E1E" overflow="hidden">
                {thumbnailUrl && !isLocked ? (
                    <Box
                        overflow="hidden"
                        w="full" h="full"
                    >
                        <Box
                            as="img"
                            src={thumbnailUrl}
                            alt=""
                            w="full" h="full" objectFit="cover"
                            opacity={0.8}
                            _groupHover={{ transform: 'scale(1.05)' }}
                            transition="transform 0.5s"
                        />
                    </Box>
                ) : (
                    <Flex w="full" h="full" align="center" justify="center" bg="#1E1E1E">
                        <Icon as={FiLock} color="#333" boxSize="32px" />
                    </Flex>
                )}

                {/* Package Badge - Top Left */}
                <Box position="absolute" top="4" left="4" zIndex={10}>
                    <Flex
                        bg={packageBadge.bg}
                        color={packageBadge.color}
                        fontSize="10px"
                        fontWeight="700"
                        letterSpacing="0.05em"
                        textTransform="uppercase"
                        px="2"
                        py="1"
                        borderRadius="full"
                        border="1px solid"
                        borderColor={packageBadge.label === 'VIP' ? 'rgba(255,215,0,0.4)' : `${packageBadge.color}40`}
                        backdropFilter="blur(4px)"
                        align="center"
                        gap="1"
                    >
                        {packageBadge.label === 'VIP' && <Icon as={FiStar} boxSize="12px" color="#EAB308" />}
                        {packageBadge.label}
                    </Flex>
                </Box>

                {/* Duration - Bottom Right */}
                <Flex
                    position="absolute"
                    bottom="4"
                    right="4"
                    bg="rgba(0,0,0,0.7)"
                    color="white"
                    fontSize="10px"
                    fontWeight="700"
                    letterSpacing="0.05em"
                    textTransform="uppercase"
                    px="2"
                    py="1"
                    borderRadius="full"
                    border="1px solid rgba(255,255,255,0.08)"
                    backdropFilter="blur(4px)"
                    align="center"
                    gap="1"
                >
                    <Icon as={FiClock} boxSize="14px" />
                    {duration}
                </Flex>

                {/* Hover Play Overlay (unlocked) */}
                {!isLocked && (
                    <Box
                        position="absolute"
                        inset="0"
                        bg="rgba(224,48,48,0.15)"
                        opacity={0}
                        _groupHover={{ opacity: 1 }}
                        transition="opacity 0.3s"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        zIndex={10}
                    >
                        <Flex
                            bg="rgba(255,255,255,0.08)"
                            backdropFilter="blur(12px)"
                            borderRadius="full"
                            p="4"
                            border="1px solid rgba(255,255,255,0.15)"
                            transform="scale(0.9)"
                            _groupHover={{ transform: 'scale(1)' }}
                            transition="transform 0.3s"
                        >
                            <Icon as={FiPlay} color="white" boxSize="28px" style={{ fill: 'white' }} />
                        </Flex>
                    </Box>
                )}

                {/* Locked Overlay */}
                {isLocked && (
                    <Box
                        position="absolute"
                        inset="0"
                        bg="rgba(10,10,10,0.7)"
                        backdropFilter="blur(4px)"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        zIndex={20}
                        p="4"
                        textAlign="center"
                    >
                        <Icon as={FiLock} color="#8A8A93" boxSize="28px" mb="2" />
                        <Text fontSize="14px" fontWeight="600" color="white" mb="3">
                            Requires {requiredPlan || 'a higher plan'}
                        </Text>
                        {onUpgrade && (
                            <Flex
                                as="button"
                                bg="transparent"
                                border="1px solid"
                                borderColor="#E03030"
                                color="#E03030"
                                fontSize="12px"
                                fontWeight="600"
                                px="4"
                                py="1.5"
                                borderRadius="full"
                                _hover={{ bg: 'rgba(224,48,48,0.1)' }}
                                onClick={(e) => { e.stopPropagation(); onUpgrade() }}
                            >
                                Upgrade Now
                            </Flex>
                        )}
                    </Box>
                )}
            </Box>

            {/* Content */}
            <Box p="5" borderTop="1px solid" borderColor="rgba(255,255,255,0.04)" opacity={isLocked ? 0.7 : 1}>
                <Heading
                    fontSize="18px"
                    fontWeight="600"
                    color="white"
                    mb="3"
                    noOfLines={2}
                >
                    {title}
                </Heading>
                <Flex wrap="wrap" gap="2">
                    <Box
                        bg="#262626"
                        color="white"
                        px="3"
                        py="1"
                        borderRadius="full"
                        fontSize="11px"
                        fontWeight="600"
                        letterSpacing="0.03em"
                    >
                        {muscleGroup.toUpperCase()}
                    </Box>
                    <Box
                        bg="#262626"
                        color="white"
                        px="3"
                        py="1"
                        borderRadius="full"
                        fontSize="11px"
                        fontWeight="600"
                        letterSpacing="0.03em"
                    >
                        {difficulty.toUpperCase()}
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}

export default ExerciseGridCard