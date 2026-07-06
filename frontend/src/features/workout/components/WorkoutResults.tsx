import React, { useState, useEffect } from 'react'
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
    ModalCloseButton
} from '@chakra-ui/react'
import AppButton from '../../../components/shared/Button/AppButton'
import MemberLayout from '../../../components/shared/Layout/MemberLayout.tsx'
import type { ExerciseCardData } from '../types/workout'
import { useWorkoutStore } from '../../../store/useWorkoutStore.ts'
import { startWorkoutSession, completeWorkoutSession } from '../../../api/workouts.ts'

const MiniStat: React.FC<{ value: string; label: string }> = ({
    value,
    label,
}) => (
    <Box
        bg="#141720"
        border="1px solid"
        borderColor="#1e2028"
        borderRadius="14px"
        p="4"
        flex="1"
        textAlign="center"
    >
        <Text fontSize="22px" fontWeight="800" color="white" lineHeight="1">
            {value}
        </Text>
        <Text fontSize="9px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mt="1">
            {label}
        </Text>
    </Box>
)

interface ExerciseCardProps extends ExerciseCardData {
    onStart: () => void
    onSkip: () => void
    onMarkDone: () => void
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
    index,
    name,
    tags,
    sets,
    setsLabel,
    isActive,
    isLocked,
    isDone,
    isSkipped,
    imageUrl,
    videoUrl,
    onStart,
    onSkip,
    onMarkDone
}) => {
    // Determine the overall status for styling
    const isPast = isDone || isSkipped
    const statusColor = isActive ? '#E03030' : '#1e2028'
    const statusOpacity = isPast ? 0.4 : 1
    return (
        <Flex
            align="center"
            gap="4"
            bg={isActive ? '#141720' : '#0f1117'}
            border="1px solid"
            borderColor={isActive ? '#E03030' : '#1e2028'}
            borderRadius="14px"
            p="4"
            opacity={isLocked ? 0.5 : statusOpacity}
            transition="all 0.2s"
            _hover={!isLocked ? { borderColor: isActive ? '#E03030' : '#2e3040' } : {}}
        >
            <Box
                w="30px" h="30px" borderRadius="full"
                bg={statusColor}
                border="1px solid"
                borderColor={isActive ? '#E03030' : '#2e3040'}
                display="flex" alignItems="center" justifyContent="center" flexShrink={0}
            >
                <Text fontSize="11px" fontWeight="700" color={isActive ? 'white' : '#8A8A93'}>{index}</Text>
            </Box>

            <Box w="70px" h="52px" borderRadius="10px" overflow="hidden" bg="#1e2028" flexShrink={0} position="relative">
                {(imageUrl || videoUrl) ? (
                    <Image src={imageUrl || (videoUrl?.includes('youtube.com/embed/') ? `https://img.youtube.com/vi/${videoUrl.split('embed/')[1].split('?')[0]}/0.jpg` : '')} alt={name} w="full" h="full" objectFit="cover" />
                ) : (
                    <Box w="full" h="full" bg={`hsl(${index * 40 + 200}, 18%, 18%)`} />
                )}
                {isLocked && (
                    <Box position="absolute" inset="0" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="rgba(0,0,0,0.5)">
                        <Text fontSize="8px" color="#8A8A93" fontWeight="600" mt="1" textAlign="center" maxW="60px">Premium Plan Required</Text>
                    </Box>
                )}
            </Box>

            <Box flex="1">
                <Text fontSize="15px" fontWeight="700" color={isLocked ? '#8A8A93' : 'white'} mb="1">{name}</Text>
                <HStack spacing="2" flexWrap="wrap">
                    {tags.map((t, ti) => (
                        <Badge key={ti} bg="#1e2028" color="#8A8A93" fontSize="9px" fontWeight="600" px="2" py="0.5" borderRadius="5px" textTransform="uppercase" letterSpacing="wider">
                            {t}
                        </Badge>
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
                {(isActive || isSkipped) && (
                    <Flex align="center" gap="4" justify="flex-end" mt="3">
                        {!isSkipped && (
                            <Text fontSize="13px" fontWeight="600" color="#8A8A93" cursor="pointer" _hover={{color: 'white'}} onClick={onSkip}>
                                Skip
                            </Text>
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

    useEffect(() => {
        // Automatically start the session when arriving on this page
        if (!activeSessionId && activePlanId) {
            startWorkoutSession({ workoutPlanId: activePlanId })
                .then(session => setActiveSessionId(session.id))
                .catch(console.error)
        }
    }, [activeSessionId, activePlanId, setActiveSessionId])

    const handleCompleteWorkout = async () => {
        if (!activeSessionId) {
            resetWorkout()
            navigate('/nutrition')
            return
        }

        const doneExercises = exercises.filter(e => e.isDone)
        const totalDuration = data?.duration || 30 // Fallback
        const totalCalories = data?.targetCalories || (doneExercises.length * 30) // Estimate
        
        try {
            await completeWorkoutSession(activeSessionId, {
                totalDurationMinutes: totalDuration,
                totalCaloriesBurned: totalCalories,
                details: doneExercises.map(ex => ({
                    exerciseId: ex.id,
                    setsDone: parseInt(ex.sets.split('x')[0]) || 3,
                    repsDone: parseInt(ex.sets.split('x')[1]) || 12,
                    durationSeconds: 0,
                    caloriesBurned: 30 // Estimate per exercise
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
        lose_weight: 'Fat Burn Phase',
        build_muscle: 'Strength Phase',
        stay_active: 'Active Lifestyle',
        endurance: 'Endurance Phase',
        health: 'Health & Wellness',
        performance: 'Athletic Phase',
    }
    const diffMap: Record<string, string> = { Beginner: 'Low', Intermediate: 'High', Advanced: 'Max' }

    const completedCount = exercises.filter((e) => e.isDone).length
    
    // Find the index of the first active exercise (not done, not skipped)
    const activeIndex = exercises.findIndex(ex => !ex.isDone && !ex.isSkipped)

    if (data.planType === 'weekly') {
        return (
            <MemberLayout>
                <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p="7">
                    <Heading fontSize="32px" fontWeight="900" color="white" mb="4">
                        Weekly Plan
                    </Heading>
                    <Text color="#8A8A93" textAlign="center" mt="8">
                        Weekly workout plan generation is in development. Please check back later!
                    </Text>
                    <AppButton 
                        mt="4" 
                        label="Regenerate Workout" 
                        onClick={resetWorkout}
                        variant="outline"
                    />
                </Box>
            </MemberLayout>
        )
    }

    return (
        <MemberLayout>
            <Box minH="100vh" display="flex" flexDirection="column">
                <Box flex="1" p="7" pb="28" maxW="900px">
                    <Flex align="center" gap="3" mb="1" flexWrap="wrap">
                        <Heading fontSize="24px" fontWeight="800" color="white">
                            Today — {goalNames[data.goal] ?? 'Custom Phase'}
                        </Heading>
                        <Badge
                            bg="rgba(224,48,48,0.15)" color="#E03030"
                            border="1px solid" borderColor="rgba(224,48,48,0.3)"
                            fontSize="10px" fontWeight="700" px="3" py="1" borderRadius="full"
                            display="flex" alignItems="center" gap="1"
                        >
                            AI Optimized
                        </Badge>
                    </Flex>

                    <Text
                        fontSize="11px" color="#8A8A93" mb="5"
                        cursor="pointer" _hover={{ color: '#E03030' }}
                        display="inline-block" onClick={resetWorkout}
                    >
                        Regenerate Workout
                    </Text>

                    <HStack spacing="3" mb="6">
                        <MiniStat value={String(exercises.length)} label="Exercises" />
                        <MiniStat value={`${data.targetCalories}`} label="Calories" />
                        <MiniStat value={`${data.duration}m`} label="Duration" />
                        <MiniStat value={diffMap[data.level] ?? 'Medium'} label="Difficulty" />
                    </HStack>

                    <Stack spacing="3">
                        {exercises.map((ex, i) => (
                            <ExerciseCard 
                                key={ex.index} 
                                {...ex} 
                                isActive={i === activeIndex}
                                onStart={() => setSelectedExercise({ ...ex, arrayIndex: i })}
                                onSkip={() => skipExercise(i)}
                                onMarkDone={() => markExerciseDone(i)}
                            />
                        ))}
                    </Stack>
                </Box>

                <Box
                    position="fixed" bottom="0" left="190px" right="0" h="64px"
                    bg="#111318" borderTop="1px solid" borderColor="#1e2028"
                    px="7" display="flex" alignItems="center" justifyContent="space-between" zIndex={50}
                >
                    <Box flex="1" mr="8">
                        <Flex justify="space-between" mb="1">
                            <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">Progress</Text>
                            <Text fontSize="11px" fontWeight="600" color="white">{completedCount} / {exercises.length} Completed</Text>
                        </Flex>
                        <Box h="3px" bg="#1e2028" borderRadius="full">
                            <Box
                                h="full" borderRadius="full" bg="#E03030"
                                style={{ width: exercises.length > 0 ? `${(completedCount / exercises.length) * 100}%` : '0%' }}
                                transition="width 0.5s ease"
                            />
                        </Box>
                    </Box>
                    <Box 
                        onClick={completedCount === exercises.length ? handleCompleteWorkout : undefined}
                        opacity={completedCount === exercises.length ? 1 : 0.5}
                        cursor={completedCount === exercises.length ? 'pointer' : 'not-allowed'}
                    >
                        <AppButton
                            label={completedCount === exercises.length ? "Complete Workout" : "Finish All First"}
                            variant="solid" h="40px" px="6" fontSize="13px"
                            isDisabled={completedCount !== exercises.length}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Exercise Details Modal */}
            <Modal isOpen={!!selectedExercise} onClose={() => setSelectedExercise(null)} isCentered size="3xl">
                <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.800" />
                <ModalContent bg="#111318" border="1px solid" borderColor="#1e2028" borderRadius="24px" overflow="hidden">
                    <ModalHeader color="white" pt="6" pb="4">{selectedExercise?.name}</ModalHeader>
                    <ModalCloseButton color="white" top="4" right="4" />
                    <ModalBody pb="6">
                        {/* Video Player */}
                        <Box mb="6" borderRadius="16px" overflow="hidden" position="relative" bg="#0A0C10" border="1px solid" borderColor="#1e2028">
                            <AspectRatio ratio={16 / 9} w="100%">
                                {selectedExercise?.videoUrl ? (
                                    <iframe
                                        title={selectedExercise.name}
                                        src={selectedExercise.videoUrl}
                                        allowFullScreen
                                        style={{ border: 'none' }}
                                    />
                                ) : (
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <Text color="#8A8A93">No video available</Text>
                                    </Box>
                                )}
                            </AspectRatio>
                        </Box>

                        <HStack spacing="2" mb="4" flexWrap="wrap">
                            {selectedExercise?.tags.map((t, ti) => (
                                <Badge key={ti} bg="#1e2028" color="#8A8A93" fontSize="10px" fontWeight="600" px="2" py="1" borderRadius="5px" textTransform="uppercase" letterSpacing="wider">
                                    {t}
                                </Badge>
                            ))}
                        </HStack>
                        
                        <Flex justify="space-between" align="center" bg="#0A0C10" p="4" borderRadius="12px" border="1px solid" borderColor="#1e2028" mb="6">
                            <Box>
                                <Text fontSize="12px" color="#8A8A93" mb="1">Target Goal</Text>
                                <Text fontSize="18px" fontWeight="800" color="#E03030">{selectedExercise?.sets}</Text>
                                <Text fontSize="10px" fontWeight="600" color="#8A8A93" textTransform="uppercase">{selectedExercise?.setsLabel}</Text>
                            </Box>
                        </Flex>

                        <Text fontSize="14px" color="#E2E1EB" mb="6" lineHeight="1.6">
                            {selectedExercise?.description || "No detailed instructions available."}
                        </Text>
                        
                        <AppButton 
                            label="Complete this exercise" 
                            variant="solid" w="full" h="48px" fontSize="15px"
                            onClick={() => {
                                if (selectedExercise) {
                                    markExerciseDone(selectedExercise.arrayIndex)
                                    setSelectedExercise(null)
                                }
                            }}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </MemberLayout>
    )
}

export default WorkoutResults