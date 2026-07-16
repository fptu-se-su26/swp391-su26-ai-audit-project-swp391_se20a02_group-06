import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    AspectRatio,
    Badge,
    Box,
    Checkbox,
    Flex,
    HStack,
    Heading,
    Stack,
    Text,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    IconButton
} from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import AppButton from '../../../components/shared/Button/AppButton'
import MemberLayout from '../../../components/shared/Layout/MemberLayout.tsx'
import type { ExerciseCardData } from '../types/workout'
import { useWorkoutStore } from '../../../store/useWorkoutStore.ts'
import { startWorkoutSession, completeWorkoutSession } from '../../../api/workouts.ts'

const MiniStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="14px" p="4" flex="1" textAlign="center">
        <Text fontSize="22px" fontWeight="800" color="white" lineHeight="1">{value}</Text>
        <Text fontSize="9px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mt="1">{label}</Text>
    </Box>
)

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

interface ExerciseCardProps extends ExerciseCardData {
    onStart: () => void
    onSkip: () => void
    onMarkDone: () => void
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
    index, name, tags, sets, setsLabel, isActive, isLocked, isDone, isSkipped,
    imageUrl, videoUrl, isWarmup,
    onStart, onSkip, onMarkDone
}) => {
    const isPast = isDone || isSkipped
    const statusColor = isActive ? '#E03030' : '#1e2028'
    const statusOpacity = isPast ? 0.4 : 1
    return (
        <Flex
            align="center" gap="4"
            bg={isActive ? '#141720' : '#0f1117'}
            border="1px solid"
            borderColor={isActive ? '#E03030' : '#1e2028'}
            borderRadius="14px" p="4"
            opacity={isLocked ? 0.5 : statusOpacity}
            transition="all 0.2s"
            _hover={!isLocked ? { borderColor: isActive ? '#E03030' : '#2e3040' } : {}}
        >

            <Box w="30px" h="30px" borderRadius="full" bg={statusColor} border="1px solid" borderColor={isActive ? '#E03030' : '#2e3040'} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                <Text fontSize="11px" fontWeight="700" color={isActive ? 'white' : '#8A8A93'}>{index}</Text>
            </Box>

            <Box w="100px" h="75px" borderRadius="10px" overflow="hidden" bg="#0A0C10" flexShrink={0} position="relative">
                {isWarmup && videoUrl ? (
                    <video src={videoUrl} muted autoPlay loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (() => {
                    const isImageFile = videoUrl && (videoUrl.match(/\.(gif|png|jpg|jpeg|webp)(\?.*)?$/i) || videoUrl.includes('/image/upload/'))
                    const thumbSrc = imageUrl || (isImageFile ? videoUrl : (videoUrl?.includes('youtube.com/embed/') ? `https://img.youtube.com/vi/${videoUrl.split('embed/')[1].split('?')[0]}/0.jpg` : ''))
                    return thumbSrc ? (
                        <Image src={thumbSrc} alt={name} w="full" h="full" objectFit="contain" />
                    ) : (
                        <Box w="full" h="full" bg={`hsl(${index * 40 + 200}, 18%, 18%)`} />
                    )
                })()}
            </Box>

            <Box flex="1">
                <Text fontSize="15px" fontWeight="700" color={isLocked ? '#8A8A93' : 'white'} mb="1">{name}</Text>
                <HStack spacing="2" flexWrap="wrap">
                    {tags.map((t, ti) => (
                        <Badge key={ti} bg="#1e2028" color="#8A8A93" fontSize="9px" fontWeight="600" px="2" py="0.5" borderRadius="5px" textTransform="uppercase" letterSpacing="wider">{t}</Badge>
                    ))}
                </HStack>
                {(isActive || isSkipped) && (
                    <Box mt="3">
                        <AppButton label="Start Exercise" variant="solid" size="sm" h="32px" fontSize="13px" px="5" onClick={onStart} />
                    </Box>
                )}
            </Box>

            <Box textAlign="right" flexShrink={0}>
                <Text fontSize="16px" fontWeight="800" color={isActive ? '#E03030' : (isLocked || isSkipped) ? '#8A8A93' : '#E2E1EB'}>{sets}</Text>
                <Text fontSize="9px" fontWeight="600" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">{setsLabel}</Text>
                {!isWarmup && (isActive || isSkipped) && (
                    <Flex align="center" gap="4" justify="flex-end" mt="3">
                        {!isSkipped && (
                            <Text fontSize="13px" fontWeight="600" color="#8A8A93" cursor="pointer" _hover={{ color: 'white' }} onClick={onSkip}>Skip</Text>
                        )}
                        <Flex align="center" gap="2" cursor="pointer" onClick={(e) => { e.preventDefault(); onMarkDone(); }}>
                            <Checkbox isChecked={isDone} onChange={onMarkDone} colorScheme="red" size="lg" />
                            <Text fontSize="14px" fontWeight="700" color={isDone ? '#E03030' : '#8A8A93'}>Mark Done</Text>
                        </Flex>
                    </Flex>
                )}
            </Box>
        </Flex>
    )
}

const WorkoutResults: React.FC = () => {
    const { formData: data, exercises, resetWorkout, markExerciseDone, skipExercise, activePlanId, activeSessionId, setActiveSessionId } = useWorkoutStore()
    const [selectedExercise, setSelectedExercise] = useState<(ExerciseCardData & { arrayIndex: number }) | null>(null)
    const navigate = useNavigate()

    // Timer
    const [timerRunning, setTimerRunning] = useState(false)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Break (inside modal)
    const [modalBreak, setModalBreak] = useState(false)
    const [breakRemaining, setBreakRemaining] = useState(0)
    const breakTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const totalDuration = data?.duration || 30
    const totalSeconds = totalDuration * 60
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

    useEffect(() => {
        if (!activeSessionId && activePlanId) {
            startWorkoutSession({ workoutPlanId: activePlanId })
                .then(session => setActiveSessionId(session.id))
                .catch(console.error)
        }
    }, [activeSessionId, activePlanId, setActiveSessionId])

    // Timer tick
    useEffect(() => {
        if (timerRunning) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1)
            }, 1000)
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [timerRunning])

    // Break countdown tick
    useEffect(() => {
        if (modalBreak && breakRemaining > 0) {
            breakTimerRef.current = setInterval(() => {
                setBreakRemaining(prev => {
                    if (prev <= 1) {
                        if (breakTimerRef.current) clearInterval(breakTimerRef.current)
                        setModalBreak(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => { if (breakTimerRef.current) clearInterval(breakTimerRef.current) }
    }, [modalBreak, breakRemaining])

    const startTimer = () => {
        if (!timerRunning) setTimerRunning(true)
    }

    const skipBreak = () => {
        if (breakTimerRef.current) clearInterval(breakTimerRef.current)
        setModalBreak(false)
        setBreakRemaining(0)
    }

    const handleCompleteExercise = (arrayIndex: number) => {
        markExerciseDone(arrayIndex)
        const nextIdx = arrayIndex + 1
        const nextExercise = exercises[nextIdx]
        if (nextExercise && !nextExercise.isDone && !nextExercise.isSkipped) {
            // Navigate to next exercise in modal and start break
            setSelectedExercise({ ...nextExercise, arrayIndex: nextIdx })
            const breakTime = nextExercise.breakTime || 30
            setBreakRemaining(breakTime)
            setModalBreak(true)
        } else {
            setSelectedExercise(null)
        }
    }

    const handleStartExercise = (ex: ExerciseCardData & { arrayIndex: number }) => {
        startTimer()
        setSelectedExercise(ex)
    }

    const handleCompleteWorkout = async () => {
        if (!activeSessionId) {
            resetWorkout()
            navigate('/nutrition')
            return
        }
        const doneExercises = exercises.filter(e => e.isDone)
        const totalCalories = data?.targetCalories || (doneExercises.length * 30)
        try {
            await completeWorkoutSession(activeSessionId, {
                totalDurationMinutes: totalDuration,
                totalCaloriesBurned: totalCalories,
                details: doneExercises.map(ex => ({
                    exerciseId: ex.id,
                    setsDone: parseInt(ex.sets.split('x')[0]) || 3,
                    repsDone: parseInt(ex.sets.split('x')[1]) || 12,
                    durationSeconds: ex.duration || 0,
                    caloriesBurned: 30
                }))
            })
        } catch (error) {
            console.error("Failed to complete session:", error)
        } finally {
            resetWorkout()
            navigate('/nutrition')
        }
    }

    if (!data) return null

    const goalNames: Record<string, string> = {
        lose_weight: 'Fat Burn Phase', build_muscle: 'Strength Phase', stay_active: 'Active Lifestyle',
        endurance: 'Endurance Phase', health: 'Health & Wellness', performance: 'Athletic Phase',
    }
    const diffMap: Record<string, string> = { Beginner: 'Low', Intermediate: 'High', Advanced: 'Max' }

    const completedCount = exercises.filter(e => e.isDone).length
    const activeIndex = exercises.findIndex(ex => !ex.isDone && !ex.isSkipped)

    if (data.planType === 'weekly') {
        return (
            <MemberLayout>
                <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p="7">
                    <Heading fontSize="32px" fontWeight="900" color="white" mb="4">Weekly Plan</Heading>
                    <Text color="#8A8A93" textAlign="center" mt="8">Weekly workout plan generation is in development.</Text>
                    <AppButton mt="4" label="Regenerate Workout" onClick={resetWorkout} variant="outline" />
                </Box>
            </MemberLayout>
        )
    }

    return (
        <MemberLayout>
            <Box minH="100vh" display="flex" flexDirection="column">
                <Box flex="1" p="7" pb="28" maxW="900px">
                    <Flex align="center" gap="3" mb="1" flexWrap="wrap">
                        <Heading fontSize="24px" fontWeight="800" color="white">Today — {goalNames[data.goal] ?? 'Custom Phase'}</Heading>
                        <Badge bg="rgba(224,48,48,0.15)" color="#E03030" border="1px solid" borderColor="rgba(224,48,48,0.3)" fontSize="10px" fontWeight="700" px="3" py="1" borderRadius="full" display="flex" alignItems="center" gap="1">AI Optimized</Badge>
                    </Flex>
                    <Text fontSize="11px" color="#8A8A93" mb="5" cursor="pointer" _hover={{ color: '#E03030' }} display="inline-block" onClick={resetWorkout}>Regenerate Workout</Text>

                    <HStack spacing="3" mb="6">
                        <MiniStat value={String(exercises.length)} label="Exercises" />
                        <MiniStat value={`${data.targetCalories}`} label="Calories" />
                        <MiniStat value={timerRunning ? formatTime(remainingSeconds) : `${totalDuration}m`} label={timerRunning ? 'Remaining' : 'Duration'} />
                        <MiniStat value={diffMap[data.level] ?? 'Medium'} label="Difficulty" />
                    </HStack>

                    <Stack spacing="3">
                        {exercises.map((ex, i) => (
                            <ExerciseCard
                                key={`${ex.id}-${i}`}
                                {...ex}
                                isActive={i === activeIndex}
                                onStart={() => handleStartExercise({ ...ex, arrayIndex: i })}
                                onSkip={() => skipExercise(i)}
                                onMarkDone={() => handleCompleteExercise(i)}
                            />
                        ))}
                    </Stack>
                </Box>

                {/* Bottom progress bar */}
                <Box position="fixed" bottom="0" left="190px" right="0" h="64px" bg="#111318" borderTop="1px solid" borderColor="#1e2028" px="7" display="flex" alignItems="center" justifyContent="space-between" zIndex={50}>
                    <Box flex="1" mr="8">
                        <Flex justify="space-between" mb="1">
                            <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">Progress</Text>
                            <Text fontSize="11px" fontWeight="600" color="white">{completedCount} / {exercises.length} Completed</Text>
                        </Flex>
                        <Box h="3px" bg="#1e2028" borderRadius="full">
                            <Box h="full" borderRadius="full" bg="#E03030" style={{ width: exercises.length > 0 ? `${(completedCount / exercises.length) * 100}%` : '0%' }} transition="width 0.5s ease" />
                        </Box>
                    </Box>
                    <Box onClick={completedCount === exercises.length ? handleCompleteWorkout : undefined} opacity={completedCount === exercises.length ? 1 : 0.5} cursor={completedCount === exercises.length ? 'pointer' : 'not-allowed'}>
                        <AppButton label={completedCount === exercises.length ? 'Complete Workout' : 'Finish All First'} variant="solid" h="40px" px="6" fontSize="13px" isDisabled={completedCount !== exercises.length} />
                    </Box>
                </Box>

                {/* Exercise Details Modal */}
                <Modal isOpen={!!selectedExercise} onClose={() => setSelectedExercise(null)} isCentered size="3xl">
                    <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.800" />
                    <ModalContent bg="#111318" border="1px solid" borderColor="#1e2028" borderRadius="24px" overflow="hidden">
                        <ModalHeader color="white" pt="6" pb="4" display="flex" alignItems="center" gap="2">
                            {selectedExercise && selectedExercise.arrayIndex > 0 && (
                                <IconButton aria-label="Previous Exercise" icon={<FiChevronLeft />} size="sm" variant="ghost" color="#8A8A93" _hover={{ color: 'white', bg: '#1e2028' }}
                                    onClick={() => {
                                        const prevIdx = selectedExercise.arrayIndex - 1
                                        setSelectedExercise({ ...exercises[prevIdx], arrayIndex: prevIdx })
                                    }} />
                            )}
                            <Text flex="1" noOfLines={1}>{selectedExercise?.name}</Text>
                            {selectedExercise && selectedExercise.arrayIndex < exercises.length - 1 && (
                                <IconButton aria-label="Next Exercise" icon={<FiChevronRight />} size="sm" variant="ghost" color="#8A8A93" mr="8" _hover={{ color: 'white', bg: '#1e2028' }}
                                    onClick={() => {
                                        const nextIdx = selectedExercise.arrayIndex + 1
                                        setSelectedExercise({ ...exercises[nextIdx], arrayIndex: nextIdx })
                                    }} />
                            )}
                        </ModalHeader>
                        <ModalCloseButton color="white" top="4" right="4" />
                        <ModalBody pb="6">
                            {/* Media + Info (blurred during break) */}
                            <Box opacity={modalBreak ? 0.15 : 1} transition="opacity 0.3s" pointerEvents={modalBreak ? 'none' : 'auto'}>
                                {(() => {
                                    const url = selectedExercise?.videoUrl
                                    const isImage = url && (url.match(/\.(gif|png|jpg|jpeg|webp)(\?.*)?$/i) || url.includes('/image/upload/'))
                                    const isYoutube = url && (url.includes('youtube.com') || url.includes('youtu.be'))
                                    if (isImage) {
                                        return (
                                            <Box mb="6" borderRadius="16px" overflow="hidden" bg="#0A0C10" border="1px solid" borderColor="#1e2028" textAlign="center">
                                                <Image src={url} alt={selectedExercise!.name} maxW="full" maxH="480px" mx="auto" objectFit="contain" />
                                            </Box>
                                        )
                                    }
                                    return (
                                        <Box mb="6" borderRadius="16px" overflow="hidden" position="relative" bg="#0A0C10" border="1px solid" borderColor="#1e2028">
                                            <AspectRatio ratio={16 / 9} w="100%">
                                                {isYoutube ? (
                                                    <iframe title={selectedExercise!.name} src={url} allowFullScreen style={{ border: 'none', width: '100%', height: '100%' }} />
                                                ) : url ? (
                                                    <video src={url} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <Box display="flex" alignItems="center" justifyContent="center"><Text color="#8A8A93">No media available</Text></Box>
                                                )}
                                            </AspectRatio>
                                        </Box>
                                    )
                                })()}

                                <HStack spacing="2" mb="4" flexWrap="wrap">
                                    {selectedExercise?.tags.map((t, ti) => (
                                        <Badge key={ti} bg="#1e2028" color="#8A8A93" fontSize="10px" fontWeight="600" px="2" py="1" borderRadius="5px" textTransform="uppercase" letterSpacing="wider">{t}</Badge>
                                    ))}
                                </HStack>

                                <Flex justify="space-between" align="center" bg="#0A0C10" p="4" borderRadius="12px" border="1px solid" borderColor="#1e2028" mb="6">
                                    <Box>
                                        <Text fontSize="12px" color="#8A8A93" mb="1">{selectedExercise?.isWarmup ? 'Duration' : 'Target Goal'}</Text>
                                        <Text fontSize="18px" fontWeight="800" color="#E03030">{selectedExercise?.sets}</Text>
                                        <Text fontSize="10px" fontWeight="600" color="#8A8A93" textTransform="uppercase">{selectedExercise?.setsLabel}</Text>
                                    </Box>
                                    {timerRunning && (
                                        <Box textAlign="right">
                                            <Text fontSize="12px" color="#8A8A93" mb="1">Workout Timer</Text>
                                            <Text fontSize="24px" fontWeight="900" color={remainingSeconds < 60 ? '#E03030' : '#22C55E'}>{formatTime(remainingSeconds)}</Text>
                                            <Text fontSize="10px" fontWeight="600" color="#8A8A93" textTransform="uppercase">remaining</Text>
                                        </Box>
                                    )}
                                </Flex>

                                <Text fontSize="14px" color="#E2E1EB" mb="6" lineHeight="1.6">
                                    {selectedExercise?.description || "No detailed instructions available."}
                                </Text>
                            </Box>

                            {modalBreak ? (
                                <AppButton
                                    label={breakRemaining > 0 ? `Skip Break (${formatTime(breakRemaining)})` : 'Continue'}
                                    variant="solid"
                                    w="full" h="48px" fontSize="15px"
                                    bg="#22C55E" color="black"
                                    _hover={{ bg: '#16A34A' }}
                                    onClick={skipBreak}
                                />
                            ) : (
                                <AppButton
                                    label={selectedExercise && selectedExercise.arrayIndex === exercises.length - 1 ? 'Complete & Finish' : 'Complete & Next'}
                                    variant="solid" w="full" h="48px" fontSize="15px"
                                    onClick={() => {
                                        if (selectedExercise) {
                                            handleCompleteExercise(selectedExercise.arrayIndex)
                                        }
                                    }}
                                />
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </MemberLayout>
    )
}

export default WorkoutResults
