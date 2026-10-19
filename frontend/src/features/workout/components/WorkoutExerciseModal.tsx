import React, { useState, useEffect, useRef } from 'react'
import {
    AspectRatio, Badge, Box, Flex, HStack, Text, Image, Stack, Icon,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
} from '@chakra-ui/react'
import { FiList, FiClock, FiInfo } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import AppButton from '../../../components/shared/Button/AppButton'

export interface ModalExerciseData {
    name: string
    videoUrl?: string
    description?: string
    tags: string[]
    duration?: number      // phút
    restSeconds?: number   // THÊM MỚI
}

interface WorkoutExerciseModalProps {
    exercise: ModalExerciseData | null
    isOpen: boolean
    onClose: () => void
    onComplete: () => void
    currentStep?: number
    totalSteps?: number
}

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Phân tích chuỗi description thành từng bước thực hiện độc lập.
 * Tương thích linh hoạt:
 * - Hỗ trợ dạng đánh số xuống dòng: "1. Chuẩn bị\n2. Thực hiện"
 * - Hỗ trợ dạng tiền tố: "Bước 1: ...\nBước 2: ..." hoặc "Step 1: ...\nStep 2: ..."
 * - Hỗ trợ dạng gạch đầu dòng: "- Bước 1\n- Bước 2" hoặc "* Bước 1\n* Bước 2"
 * - Hỗ trợ dạng cùng 1 dòng: "1. Chuẩn bị... 2. Thực hiện..."
 * - Tự động tách câu nếu là đoạn văn thông thường nhiều câu.
 */
const parseInstructionSteps = (description?: string): string[] => {
    if (!description || !description.trim()) return []

    const clean = description.trim()

    // 1. Phân tách theo dòng nếu có nhiều dòng
    const rawLines = clean.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    if (rawLines.length > 1) {
        return rawLines.map(line => {
            return line.replace(/^(\d+[\.\/\)\:\-]\s*|\b(Bước|Step)\s*\d+[\:\.\-]?\s*|[-*•]\s*)/i, '').trim()
        }).filter(Boolean)
    }

    // 2. Nếu nằm trên 1 dòng nhưng có đánh số: "1. ... 2. ... 3. ..." hoặc "Bước 1: ... Bước 2: ..."
    const inlineNumbered = clean.split(/(?:^|\s+)(?:\d+[\.\/\)\:]|\b(?:Bước|Step)\s*\d+[\:\.\-]?)\s+/i).map(s => s.trim()).filter(Boolean)
    if (inlineNumbered.length > 1) {
        return inlineNumbered
    }

    // 3. Fallback: Nếu là đoạn văn bản liên tục nhiều câu, tự động tách theo dấu chấm
    const sentences = clean.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ỹ0-9])/).map(s => s.trim()).filter(Boolean)
    if (sentences.length > 1) {
        return sentences
    }

    // 4. Nếu chỉ có 1 câu đơn
    return [clean]
}

const WorkoutExerciseModal: React.FC<WorkoutExerciseModalProps> = ({ exercise, isOpen, onClose, onComplete, currentStep, totalSteps }) => {
    const { t } = useTranslation()
    const [started, setStarted] = useState(false)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)
    const [modalBreak, setModalBreak] = useState(false)
    const [breakRemaining, setBreakRemaining] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const breakTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const totalSeconds = (exercise?.duration || 0) * 60
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setStarted(false)
            setElapsedSeconds(0)
            setIsCompleted(false)
            setModalBreak(false)
            setBreakRemaining(0)
            if (timerRef.current) clearInterval(timerRef.current)
            if (breakTimerRef.current) clearInterval(breakTimerRef.current)
            if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
            }
        }
    }, [isOpen])

    // Reset state when switching to a different exercise while modal stays open
    useEffect(() => {
        setStarted(false)
        setElapsedSeconds(0)
        setIsCompleted(false)
        setModalBreak(false)
        setBreakRemaining(0)
        if (timerRef.current) clearInterval(timerRef.current)
        if (breakTimerRef.current) clearInterval(breakTimerRef.current)
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
    }, [exercise?.name])

    // Timer tick
    useEffect(() => {
        if (started && !isCompleted && !modalBreak) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1)
            }, 1000)
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [started, isCompleted, modalBreak])

    // Break countdown tick
    useEffect(() => {
        if (modalBreak && breakRemaining > 0) {
            breakTimerRef.current = setInterval(() => {
                setBreakRemaining(prev => {
                    if (prev <= 1) {
                        if (breakTimerRef.current) clearInterval(breakTimerRef.current)
                        setModalBreak(false)
                        setIsCompleted(false)
                        setStarted(false)
                        setElapsedSeconds(0)
                        onComplete()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => { if (breakTimerRef.current) clearInterval(breakTimerRef.current) }
    }, [modalBreak, breakRemaining, onComplete])

    const handleStart = () => {
        setStarted(true)
        if (videoRef.current) {
            videoRef.current.muted = true
            videoRef.current.play().catch(() => {})
        }
    }

    const handleComplete = () => {
        setIsCompleted(true)
        setModalBreak(true)
        setBreakRemaining(exercise?.restSeconds && exercise.restSeconds > 0 ? exercise.restSeconds : 30)
        if (videoRef.current) {
            videoRef.current.pause()
        }
    }

    const skipBreak = () => {
        if (breakTimerRef.current) clearInterval(breakTimerRef.current)
        setModalBreak(false)
        setIsCompleted(false)
        setStarted(false)
        setElapsedSeconds(0)
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
        onComplete()
    }

    if (!exercise) return null

    const url = exercise.videoUrl
    const isImage = url && (url.match(/\.(gif|png|jpg|jpeg|webp)(\?.*)?$/i) || url.includes('/image/upload/'))
    const isYoutube = url && (url.includes('youtube.com') || url.includes('youtu.be'))
    const youtubeId = isYoutube ? (url!.match(/(?:v=|embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || '') : ''

    const instructionSteps = parseInstructionSteps(exercise.description)

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.800" />
            <ModalContent mx="3" maxH="90vh" bg="#111318" border="1px solid" borderColor="#1e2028" borderRadius={{ base: '16px', sm: '24px' }} overflow="hidden">
                <ModalHeader color="white" pt="6" pb="4" pr="12">
                    <Text fontSize="20px" fontWeight="700" noOfLines={1}>{exercise.name}</Text>
                    {currentStep && totalSteps && (
                        <Text fontSize="12px" fontWeight="600" color="#8A8A93" mt="1">
                            Exercise {currentStep} of {totalSteps}
                        </Text>
                    )}
                </ModalHeader>
                <ModalCloseButton color="white" top="4" right="4" />

                <ModalBody pb="6">
                    {/* Media - blurred during break */}
                    <Box opacity={modalBreak ? 0.15 : 1} transition="opacity 0.3s" pointerEvents={modalBreak ? 'none' : 'auto'}>
                        {url ? (
                            <Box mb="5" borderRadius="16px" overflow="hidden" bg="#0A0C10" border="1px solid" borderColor="#1e2028">
                                {isImage ? (
                                    <Image src={url} alt={exercise.name} maxW="full" maxH="480px" mx="auto" objectFit="contain" />
                                ) : (
                                    <AspectRatio ratio={16 / 9} w="100%">
                                        {isYoutube ? (
                                            started ? (
                                                <iframe title={exercise.name} src={`${url}${url.includes('?') ? '&' : '?'}autoplay=1&mute=1&playsinline=1`} allow="autoplay" allowFullScreen style={{ border: 'none', width: '100%', height: '100%' }} />
                                            ) : (
                                                <Image
                                                    src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                                                    alt={exercise.name}
                                                    w="full" h="full" objectFit="cover"
                                                />
                                            )
                                        ) : (
                                            <video
                                                ref={videoRef}
                                                src={url}
                                                controls={started}
                                                muted
                                                playsInline
                                                preload={started ? 'auto' : 'metadata'}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        )}
                                    </AspectRatio>
                                )}
                            </Box>
                        ) : (
                            <Box mb="5" borderRadius="16px" bg="#0A0C10" border="1px solid" borderColor="#1e2028" textAlign="center" py="16">
                                <Text color="#8A8A93" fontSize="14px">No media available</Text>
                            </Box>
                        )}

                        {/* Tags */}
                        <HStack spacing="2" mb="4" flexWrap="wrap">
                            {exercise.tags.map((t, ti) => (
                                <Badge key={ti} bg="#1e2028" color="#8A8A93" fontSize="10px" fontWeight="600" px="2" py="1" borderRadius="5px" textTransform="uppercase" letterSpacing="wider">{t}</Badge>
                            ))}
                        </HStack>

                        {/* Timer / Info */}
                        <Flex justify="space-between" align="center" bg="#0A0C10" p="4" borderRadius="12px" border="1px solid" borderColor="#1e2028" mb="6">
                            <Box>
                                <Flex align="center" gap="1.5" mb="1">
                                    <Icon as={FiClock} color="#8A8A93" boxSize="13px" />
                                    <Text fontSize="12px" color="#8A8A93">{t('common.duration', 'Duration')}</Text>
                                </Flex>
                                <Text fontSize="18px" fontWeight="800" color="#E03030">{exercise.duration ? `${exercise.duration}m` : '--'}</Text>
                            </Box>
                            {started && (
                                <Box textAlign="right">
                                    <Text fontSize="12px" color="#8A8A93" mb="1">{isCompleted ? t('common.completed', 'Completed') : t('common.remaining', 'Remaining')}</Text>
                                    <Text fontSize="24px" fontWeight="900" color={remainingSeconds < 60 ? '#E03030' : '#22C55E'}>{formatTime(remainingSeconds)}</Text>
                                </Box>
                            )}
                        </Flex>

                        {/* Instructions / Steps */}
                        {instructionSteps.length > 0 ? (
                            <Box mb="4">
                                <Flex align="center" justify="space-between" mb="3">
                                    <Flex align="center" gap="2.5">
                                        <Box
                                            p="1.5"
                                            borderRadius="8px"
                                            bg="rgba(224, 48, 48, 0.12)"
                                            color="#E03030"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Icon as={FiList} boxSize="15px" />
                                        </Box>
                                        <Text fontSize="13px" fontWeight="700" color="#FFFFFF" letterSpacing="0.5px">
                                            {t('workouts.instructionsTitle', 'EXERCISE INSTRUCTIONS')}
                                        </Text>
                                    </Flex>
                                    <Badge
                                        bg="rgba(224, 48, 48, 0.15)"
                                        color="#E03030"
                                        border="1px solid"
                                        borderColor="rgba(224, 48, 48, 0.3)"
                                        fontSize="11px"
                                        fontWeight="700"
                                        px="2.5"
                                        py="0.5"
                                        borderRadius="full"
                                        letterSpacing="wider"
                                    >
                                        {instructionSteps.length} {t('workouts.step', 'STEP')}
                                    </Badge>
                                </Flex>

                                <Stack spacing="2.5">
                                    {instructionSteps.map((stepText, idx) => (
                                        <Flex
                                            key={idx}
                                            align="flex-start"
                                            gap="3.5"
                                            bg="#0A0C10"
                                            border="1px solid"
                                            borderColor="#1e2028"
                                            borderRadius="14px"
                                            p="3.5"
                                            transition="all 0.25s ease"
                                            _hover={{
                                                borderColor: 'rgba(224, 48, 48, 0.45)',
                                                bg: '#0e1118',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                                            }}
                                        >
                                            <Box
                                                w="26px"
                                                h="26px"
                                                minW="26px"
                                                borderRadius="full"
                                                bg="linear-gradient(135deg, rgba(224, 48, 48, 0.25) 0%, rgba(224, 48, 48, 0.08) 100%)"
                                                border="1.5px solid"
                                                borderColor="rgba(224, 48, 48, 0.5)"
                                                color="#FF5A5A"
                                                fontSize="12px"
                                                fontWeight="800"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                mt="1px"
                                                flexShrink={0}
                                                boxShadow="0 0 10px rgba(224, 48, 48, 0.2)"
                                            >
                                                {idx + 1}
                                            </Box>
                                            <Box flex="1">
                                                <Text fontSize="11px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="0.5">
                                                    {t('workouts.step', 'STEP')} {idx + 1}
                                                </Text>
                                                <Text fontSize="13.5px" color="#F1F1F5" lineHeight="1.65" fontWeight="500">
                                                    {stepText}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    ))}
                                </Stack>
                            </Box>
                        ) : (
                            <Box mb="4" p="4" bg="#0A0C10" border="1px dashed" borderColor="#1e2028" borderRadius="14px">
                                <Flex align="center" gap="3">
                                    <Icon as={FiInfo} color="#8A8A93" boxSize="18px" />
                                    <Text fontSize="13px" color="#8A8A93">
                                        {t('workouts.noInstructions', 'No step-by-step instructions available. Please follow the demonstration video for proper form.')}
                                    </Text>
                                </Flex>
                            </Box>
                        )}
                    </Box>
                </ModalBody>

                {/* Fixed Sticky Footer for Actions */}
                <ModalFooter bg="#0D0F14" borderTop="1px solid" borderColor="#1e2028" p="4">
                    {modalBreak ? (
                        <Box w="full">
                            <Text textAlign="center" fontSize="13px" fontWeight="700" color="#22C55E" mb="2" textTransform="uppercase" letterSpacing="wider">
                                {t('workouts.breakTime', 'Break Time')}
                            </Text>
                            <AppButton
                                label={breakRemaining > 0 ? `${t('workouts.skipBreak', 'Skip Break')} (${formatTime(breakRemaining)})` : t('common.continue', 'Continue')}
                                variant="solid"
                                w="full" h="48px" fontSize="15px"
                                bg="#22C55E" color="black"
                                _hover={{ bg: '#16A34A' }}
                                onClick={skipBreak}
                            />
                        </Box>
                    ) : started && !isCompleted ? (
                        <AppButton
                            label={t('workouts.complete', 'Complete')}
                            variant="solid" w="full" h="48px" fontSize="15px"
                            onClick={handleComplete}
                        />
                    ) : !started ? (
                        <AppButton
                            label={t('workouts.start', 'Start')}
                            variant="solid" w="full" h="48px" fontSize="15px"
                            bg="#E03030" color="white"
                            _hover={{ bg: '#C62828' }}
                            onClick={handleStart}
                        />
                    ) : null}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default WorkoutExerciseModal
