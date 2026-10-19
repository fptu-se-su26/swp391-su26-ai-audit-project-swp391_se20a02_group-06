import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Text, Icon, Flex, Badge, Stack, Spinner, HStack, Button, useToast } from '@chakra-ui/react'
import { FiClock, FiZap, FiCheckCircle, FiRotateCcw, FiPlayCircle, FiLock } from 'react-icons/fi'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'
import { getWorkoutHistory, type WorkoutSessionDto, type WorkoutSessionDetailDto } from '../../api/workouts.ts'
import { useWorkoutStore } from '../../store/useWorkoutStore.ts'
import WorkoutExerciseModal, { type ModalExerciseData } from '../../features/workout/components/WorkoutExerciseModal.tsx'
import type { ExerciseCardData } from '../../features/workout/types/workout.ts'
import apiClient from '../../lib/axios.ts'
import { useTranslation } from 'react-i18next'

const Progress: React.FC = () => {
    const { t, i18n } = useTranslation()
    const [history, setHistory] = useState<WorkoutSessionDto[]>([])
    const [allExercises, setAllExercises] = useState<any[]>([])
    const [catalog, setCatalog] = useState<any[]>([])
    const [membership, setMembership] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedExercise, setSelectedExercise] = useState<ModalExerciseData | null>(null)

    const navigate = useNavigate()
    const toast = useToast()
    const { setFormData, setExercises, setActivePlanId, setActiveSessionId, setPhase } = useWorkoutStore()

    useEffect(() => {
        getWorkoutHistory()
            .then(data => setHistory(data))
            .catch(err => console.error("Failed to load history", err))
            .finally(() => setLoading(false))

        apiClient.get('/exercises')
            .then(res => setAllExercises(res.data || []))
            .catch(err => console.error("Failed to load exercises", err))

        apiClient.get('/exercises/catalog')
            .then(res => setCatalog(res.data || []))
            .catch(err => console.error("Failed to load catalog", err))

        apiClient.get('/membership/my')
            .then(res => setMembership(res.data))
            .catch(err => console.error("Failed to load membership", err))
    }, [])

    const isDetailLocked = (detail: WorkoutSessionDetailDto): { locked: boolean; packageName?: string; title?: string } => {
        const catItem = catalog.find((c: any) => c.id === detail.exerciseId || c.title?.toLowerCase() === detail.exerciseName?.toLowerCase())
        if (catItem) {
            return {
                locked: !!catItem.isLocked,
                packageName: catItem.packageName,
                title: catItem.title || detail.exerciseName
            }
        }
        return { locked: false, title: detail.exerciseName }
    }

    const handleRepeatWorkout = (session: WorkoutSessionDto) => {
        if (!session.details || session.details.length === 0) return

        // 1. Kiểm tra xem buổi tập này có bài nào thuộc gói nâng cấp mà người dùng đã hết hạn/chưa mua không
        const lockedItems = session.details
            .map(d => isDetailLocked(d))
            .filter(item => item.locked)

        if (lockedItems.length > 0) {
            const requiredPackages = Array.from(new Set(lockedItems.map(i => i.packageName || 'Premium'))).join(', ')
            const lockedNames = lockedItems.map(i => i.title).slice(0, 3).join(', ') + (lockedItems.length > 3 ? '...' : '')
            const currentPkg = membership?.isActive ? membership.packageName : 'Current package has expired'

            toast({
                title: 'Unable to replay workout session',
                description: `This session contains exercises (${lockedNames}) requiring the "${requiredPackages}" package. Your current tier (${currentPkg}) does not have access. Please upgrade to continue!`,
                status: 'warning',
                duration: 6000,
                isClosable: true,
                position: 'top',
            })
            navigate('/pricing')
            return
        }

        // 2. Nếu tất cả bài tập đều hợp lệ (Free hoặc đã mua gói còn hạn) -> mở tập luyện
        const mappedExercises: ExerciseCardData[] = session.details.map((detail, idx) => {
            const dbEx = allExercises.find((e: any) => e.id === detail.exerciseId || e.title?.toLowerCase() === detail.exerciseName?.toLowerCase())
            const catItem = catalog.find((c: any) => c.id === detail.exerciseId || c.title?.toLowerCase() === detail.exerciseName?.toLowerCase())

            const exerciseTitle = detail.exerciseName || dbEx?.title || catItem?.title || `Exercise ${idx + 1}`
            const videoUrl = dbEx?.videoUrl || catItem?.videoUrl || ''
            const description = dbEx?.description || catItem?.description || ''
            const durationMinutes = dbEx?.duration || catItem?.durationMinutes || 5
            const durationSeconds = detail.durationSeconds && detail.durationSeconds > 0
                ? detail.durationSeconds
                : durationMinutes * 60

            const sets = detail.setsDone || 3
            const reps = detail.repsDone || 12

            return {
                id: detail.exerciseId,
                index: idx + 1,
                name: exerciseTitle,
                tags: [dbEx?.muscleGroup || catItem?.muscleGroup || 'Full Body', (dbEx?.difficulty ?? catItem?.difficulty) === 0 ? 'Beginner' : (dbEx?.difficulty ?? catItem?.difficulty) === 1 ? 'Intermediate' : 'Advanced'].filter(Boolean),
                sets: `${sets} sets`,
                setsLabel: `${sets} sets × ${reps} reps`,
                description: description,
                videoUrl: videoUrl,
                imageUrl: catItem?.thumbnailUrl || '',
                isActive: idx === 0,
                isLocked: false, // Tất cả bài đã được xác thực quyền truy cập hợp lệ
                isDone: false,
                isSkipped: false,
                setsCount: sets,
                repsCount: reps,
                durationSeconds: durationSeconds,
                restSeconds: 60,
                caloriesBurned: detail.caloriesBurned ? Number(detail.caloriesBurned) : 30
            }
        })

        setFormData({
            planType: 'daily',
            goal: 'Repeat Workout',
            gender: 'male',
            age: '25',
            height: '175',
            weight: '70',
            level: 'intermediate',
            duration: session.totalDurationMinutes || 30,
            frequency: 3,
            equipment: ['None'],
            muscles: ['Full Body'],
            injuries: [],
            targetCalories: session.totalCaloriesBurned ? Number(session.totalCaloriesBurned) : 100,
        })

        setActivePlanId(session.workoutPlanId || null)
        setActiveSessionId(null)
        setExercises(mappedExercises)
        setPhase('results')
        navigate('/workouts')
    }

    const handleOpenExerciseModal = async (detail: WorkoutSessionDetailDto) => {
        const lockInfo = isDetailLocked(detail)
        if (lockInfo.locked) {
            const currentPkg = membership?.isActive ? membership.packageName : 'Current package has expired'
            toast({
                title: 'Premium Tier Required',
                description: `The exercise "${lockInfo.title}" requires the "${lockInfo.packageName || 'Premium'}" tier. Your current tier (${currentPkg}) does not have access.`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
            navigate('/pricing')
            return
        }

        const dbEx = allExercises.find((e: any) => e.id === detail.exerciseId || e.title?.toLowerCase() === detail.exerciseName?.toLowerCase())
        const catItem = catalog.find((c: any) => c.id === detail.exerciseId || c.title?.toLowerCase() === detail.exerciseName?.toLowerCase())

        try {
            const res = await apiClient.get(`/exercises/${detail.exerciseId}`)
            const full = res.data
            setSelectedExercise({
                name: full.title || detail.exerciseName || `Exercise #${detail.exerciseId}`,
                videoUrl: full.videoUrl || dbEx?.videoUrl,
                description: full.description || dbEx?.description,
                tags: [full.muscleGroup || dbEx?.muscleGroup, (full.difficulty ?? dbEx?.difficulty) === 0 ? 'Beginner' : (full.difficulty ?? dbEx?.difficulty) === 1 ? 'Intermediate' : 'Advanced'].filter(Boolean) as string[],
                duration: full.duration || dbEx?.duration || 5,
                restSeconds: 60,
            })
        } catch {
            setSelectedExercise({
                name: detail.exerciseName || dbEx?.title || catItem?.title || `Exercise #${detail.exerciseId}`,
                videoUrl: dbEx?.videoUrl || catItem?.videoUrl,
                description: dbEx?.description || catItem?.description,
                tags: [dbEx?.muscleGroup || catItem?.muscleGroup || 'Full Body', 'General'].filter(Boolean) as string[],
                duration: dbEx?.duration || catItem?.durationMinutes || 5,
                restSeconds: 60,
            })
        }
    }

    return (
        <MemberLayout>
            <Box p="7" maxW="1000px" mx="auto">
                <Flex align="center" gap="3" mb="6">
                    <Box w="40px" h="40px" borderRadius="12px" bg="rgba(224,48,48,0.12)" display="flex" alignItems="center" justifyContent="center">
                        <Icon as={FiClock} color="#E03030" boxSize="20px" />
                    </Box>
                    <Box>
                        <Heading fontSize="24px" fontWeight="800" color="white">{t('progress.title', 'Workout History')}</Heading>
                        <Text fontSize="13px" color="#8A8A93">{t('progress.subtitle', 'Review your past training sessions and progress')}</Text>
                    </Box>
                </Flex>

                {loading ? (
                    <Flex justify="center" py="20">
                        <Spinner color="#E03030" />
                    </Flex>
                ) : history.length === 0 ? (
                    <Box p="10" bg="#141720" borderRadius="16px" border="1px solid" borderColor="#1e2028" textAlign="center">
                        <Text color="#8A8A93">{t('progress.noHistory', "You haven't completed any workouts yet.")}</Text>
                    </Box>
                ) : (
                    <Stack spacing="4">
                        {history.map(session => {
                            const hasLockedExercises = session.details?.some(d => isDetailLocked(d).locked)

                            return (
                                <Box key={session.id} bg="#141720" borderRadius="16px" border="1px solid" borderColor="#1e2028" p="5" transition="all 0.2s" _hover={{ borderColor: '#2e3040' }}>
                                    <Flex justify="space-between" align="center" mb="4" wrap="wrap" gap="3">
                                        <Box>
                                            <Text fontSize="16px" fontWeight="700" color="white" mb="1">
                                                {session.startedAt ? new Date(session.startedAt).toLocaleDateString(i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : (i18n.language.startsWith('vi') ? 'Không rõ ngày' : 'Unknown Date')}
                                            </Text>
                                            <HStack spacing="3">
                                                <Badge bg="rgba(224,48,48,0.15)" color="#E03030" fontSize="10px" px="2" py="0.5" borderRadius="4px">{t('progress.completed', 'COMPLETED')}</Badge>
                                                <Flex align="center" gap="1" color="#8A8A93" fontSize="12px">
                                                    <Icon as={FiClock} />
                                                    <Text>{session.totalDurationMinutes} {i18n.language.startsWith('vi') ? 'phút' : 'min'}</Text>
                                                </Flex>
                                                <Flex align="center" gap="1" color="#8A8A93" fontSize="12px">
                                                    <Icon as={FiZap} />
                                                    <Text>{session.totalCaloriesBurned} kcal</Text>
                                                </Flex>
                                            </HStack>
                                        </Box>

                                        {session.details && session.details.length > 0 && (
                                            <Button
                                                size="sm"
                                                leftIcon={hasLockedExercises ? <FiLock /> : <FiRotateCcw />}
                                                bg={hasLockedExercises ? "#1e2230" : "#E03030"}
                                                color={hasLockedExercises ? "#FBBF24" : "white"}
                                                border={hasLockedExercises ? "1px solid rgba(251,191,36,0.3)" : "none"}
                                                _hover={{
                                                    bg: hasLockedExercises ? "#252b3d" : "#C62828",
                                                    transform: 'translateY(-1px)',
                                                    borderColor: hasLockedExercises ? '#FBBF24' : 'transparent'
                                                }}
                                                _active={{ bg: hasLockedExercises ? "#1a1c27" : "#B71C1C" }}
                                                borderRadius="10px"
                                                fontWeight="700"
                                                fontSize="13px"
                                                px="4"
                                                h="36px"
                                                boxShadow={hasLockedExercises ? "none" : "0 2px 10px rgba(224,48,48,0.25)"}
                                                transition="all 0.2s"
                                                onClick={() => handleRepeatWorkout(session)}
                                            >
                                                {hasLockedExercises ? t('common.premiumRequired', 'Premium Required') : t('progress.repeat', 'Repeat Workout')}
                                            </Button>
                                        )}
                                    </Flex>
                                    
                                    <Box bg="#0f1117" p="4" borderRadius="12px" border="1px solid" borderColor="#1e2028">
                                        <Text fontSize="11px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="3">{t('progress.exercisesCompleted', 'Exercises Completed')}</Text>
                                        <Stack spacing="2">
                                            {session.details.map((detail, idx) => {
                                                const lockState = isDetailLocked(detail)
                                                return (
                                                    <Flex
                                                        key={idx}
                                                        justify="space-between"
                                                        align="center"
                                                        py="1.5"
                                                        px="2"
                                                        borderRadius="8px"
                                                        _hover={{ bg: 'rgba(255,255,255,0.03)' }}
                                                        transition="all 0.2s"
                                                    >
                                                        <Flex align="center" gap="2">
                                                            <Icon
                                                                as={lockState.locked ? FiLock : FiCheckCircle}
                                                                color={lockState.locked ? "#FBBF24" : "#E03030"}
                                                                boxSize="14px"
                                                            />
                                                            <Text fontSize="13px" fontWeight="600" color={lockState.locked ? "#8A8A93" : "white"}>
                                                                {detail.exerciseName || `Exercise #${detail.exerciseId}`}
                                                            </Text>
                                                            {lockState.locked && (
                                                                <Badge bg="rgba(251,191,36,0.15)" color="#FBBF24" fontSize="9px" px="1.5" py="0.2" borderRadius="4px">
                                                                    {lockState.packageName || 'PREMIUM'}
                                                                </Badge>
                                                            )}
                                                        </Flex>
                                                        <HStack spacing="3">
                                                            <Text fontSize="12px" color="#8A8A93">{detail.setsDone} {t('workouts.sets', 'sets')} × {detail.repsDone} {t('workouts.reps', 'reps')}</Text>
                                                            <Button
                                                                size="xs"
                                                                variant="outline"
                                                                leftIcon={lockState.locked ? <FiLock /> : <FiPlayCircle />}
                                                                color={lockState.locked ? "#FBBF24" : "#E03030"}
                                                                borderColor={lockState.locked ? "rgba(251,191,36,0.3)" : "rgba(224,48,48,0.3)"}
                                                                _hover={{
                                                                    bg: lockState.locked ? "rgba(251,191,36,0.15)" : "rgba(224,48,48,0.15)",
                                                                    borderColor: lockState.locked ? "#FBBF24" : "#E03030",
                                                                    color: lockState.locked ? "#FDE68A" : "#ff4d4d"
                                                                }}
                                                                borderRadius="6px"
                                                                fontSize="11px"
                                                                fontWeight="600"
                                                                h="24px"
                                                                px="2.5"
                                                                onClick={() => handleOpenExerciseModal(detail)}
                                                            >
                                                                {lockState.locked ? t('common.unlock', 'Unlock') : t('common.retry', 'Retry')}
                                                            </Button>
                                                        </HStack>
                                                    </Flex>
                                                )
                                            })}
                                            {session.details.length === 0 && (
                                                <Text fontSize="12px" color="#8A8A93">{t('progress.noExercises', 'No exercises recorded.')}</Text>
                                            )}
                                        </Stack>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Stack>
                )}
            </Box>

            <WorkoutExerciseModal
                exercise={selectedExercise}
                isOpen={!!selectedExercise}
                onClose={() => setSelectedExercise(null)}
                onComplete={() => setSelectedExercise(null)}
            />
        </MemberLayout>
    )
}

export default Progress