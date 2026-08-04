import React, { useState, useEffect, useRef } from 'react'
import {
    AspectRatio, Badge, Box, Flex, HStack, Text, Image,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
} from '@chakra-ui/react'
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

const WorkoutExerciseModal: React.FC<WorkoutExerciseModalProps> = ({ exercise, isOpen, onClose, onComplete, currentStep, totalSteps }) => {
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
            <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.800" />
            <ModalContent bg="#111318" border="1px solid" borderColor="#1e2028" borderRadius="24px" overflow="hidden">
                <ModalHeader color="white" pt="6" pb="4" pr="12">
                    <Text fontSize="20px" fontWeight="700" noOfLines={1}>{exercise.name}</Text>
                    {currentStep && totalSteps && (
                        <Text fontSize="12px" fontWeight="600" color="#8A8A93" mt="1">
                            Bài {currentStep} / {totalSteps}
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
                                <Text fontSize="12px" color="#8A8A93" mb="1">Duration</Text>
                                <Text fontSize="18px" fontWeight="800" color="#E03030">{exercise.duration ? `${exercise.duration}m` : '--'}</Text>
                            </Box>
                            {started && (
                                <Box textAlign="right">
                                    <Text fontSize="12px" color="#8A8A93" mb="1">{isCompleted ? 'Completed' : 'Remaining'}</Text>
                                    <Text fontSize="24px" fontWeight="900" color={remainingSeconds < 60 ? '#E03030' : '#22C55E'}>{formatTime(remainingSeconds)}</Text>
                                </Box>
                            )}
                        </Flex>

                        {/* Description */}
                        {exercise.description && (
                            <Text fontSize="14px" color="#E2E1EB" mb="6" lineHeight="1.6">
                                {exercise.description}
                            </Text>
                        )}
                    </Box>

                    {/* Actions */}
                    {modalBreak ? (
                        <>
                        <Text textAlign="center" fontSize="13px" fontWeight="700" color="#22C55E" mb="3" textTransform="uppercase" letterSpacing="wider">
                            Break Time
                        </Text>
                        <AppButton
                            label={breakRemaining > 0 ? `Skip Break (${formatTime(breakRemaining)})` : 'Continue'}
                            variant="solid"
                            w="full" h="48px" fontSize="15px"
                            bg="#22C55E" color="black"
                            _hover={{ bg: '#16A34A' }}
                            onClick={skipBreak}
                        />
                        </>
                    ) : started && !isCompleted ? (
                        <AppButton
                            label="Complete"
                            variant="solid" w="full" h="48px" fontSize="15px"
                            onClick={handleComplete}
                        />
                    ) : !started ? (
                        <AppButton
                            label="Start"
                            variant="solid" w="full" h="48px" fontSize="15px"
                            bg="#E03030" color="white"
                            _hover={{ bg: '#C62828' }}
                            onClick={handleStart}
                        />
                    ) : null}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default WorkoutExerciseModal