import React from 'react'
import {
    Box,
    Flex,
    Grid,
    Heading,
    Text,
    Stack,
    HStack,
    Icon,
    Avatar,
    Badge,
    Button,
} from '@chakra-ui/react'
import {
    FiZap,
    FiCpu,
    FiPlay,
    FiVideo,
} from 'react-icons/fi'
import AppButton from '../../components/shared/Button/AppButton'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'

import {
    GoalRing,
    MacroBar,
    MiniBarChart,
    StatCard,
    StreakDots,
    WeeklyVolumeChart,
} from '../../features/dashboard/components/DashboardWidgets.tsx'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../../store/useWorkoutStore'

interface DashboardSummaryDto {
    currentStreak: number;
    activeDaysThisWeek: number[];
    activeCaloriesToday: number;
    activeCaloriesHistory: number[];
    proteinConsumed: number;
    proteinTarget: number;
    carbsConsumed: number;
    carbsTarget: number;
    fatsConsumed: number;
    fatsTarget: number;
}

import { warmupExercise, calcSetsReps, buildExerciseCard } from '../../features/workout/data/workoutExercises'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const Dashboard: React.FC = () => {
    const { data: summary } = useSWR<DashboardSummaryDto>('/dashboard/summary', fetcher)
    const { data: catalog } = useSWR<any[]>('/exercises/catalog', fetcher)
    const { setExercises, setPhase, setFormData } = useWorkoutStore()
    const navigate = useNavigate()

    const suggestedRoutine = React.useMemo(() => {
        if (!catalog) return []
        const unlocked = catalog.filter(e => !e.isLocked)
        if (unlocked.length < 4) return unlocked

        const shuffled = [...unlocked].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 4)
    }, [catalog])

    const handleStartWorkout = () => {
        if (suggestedRoutine.length === 0) return

        const warmupConfig = calcSetsReps(300, 'Beginner', 'general')
        const mainConfig = calcSetsReps(600, 'Beginner', 'general')

        const exercisesToPlay = [
            buildExerciseCard(warmupExercise, 0, warmupConfig, true),
            ...suggestedRoutine.map((ex, index) => buildExerciseCard(ex, index + 1, mainConfig, false))
        ]

        setExercises(exercisesToPlay)
        setPhase('results')
        setFormData({
            planType: 'daily',
            goal: 'General Fitness',
            gender: 'Any',
            age: 'Any',
            height: 'Any',
            weight: 'Any',
            level: 'Beginner',
            duration: 45,
            frequency: 3,
            equipment: [],
            muscles: [],
            targetCalories: 300
        })
        
        navigate('/workouts')
    }

    return (
        <MemberLayout>
            <Box p="7" maxW="1200px">
                {/* Stat Cards Row */}
                <Grid templateColumns="repeat(4, 1fr)" gap="4" mb="5">
                    {/* Active Calories */}
                    <StatCard
                        label="Active Calories"
                        value={
                            <Box>
                                <Text as="span" fontSize="28px" fontWeight="800" color="white">{summary?.activeCaloriesToday ?? 0}</Text>
                                <Text as="span" fontSize="13px" color="#8A8A93" ml="1">kcal</Text>
                            </Box>
                        }
                        icon={FiZap}
                        sub={<MiniBarChart bars={summary?.activeCaloriesHistory ?? [0,0,0,0,0,0,0]} />}
                    />

                    {/* Current Streak */}
                    <StatCard
                        label="Current Streak"
                        value={
                            <Box>
                                <Text as="span" fontSize="28px" fontWeight="800" color="white">{summary?.currentStreak ?? 0}</Text>
                                <Text as="span" fontSize="13px" color="#8A8A93" ml="1">Days</Text>
                            </Box>
                        }
                        icon={FiZap}
                        sub={<StreakDots activeDays={summary?.activeDaysThisWeek ?? []} />}
                    />

                    {/* Weekly Goal */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="5"
                        transition="all 0.2s"
                        _hover={{ borderColor: '#2e3040', transform: 'translateY(-2px)' }}
                    >
                        <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="2">
                            Weekly Goal
                        </Text>
                        <Flex align="center" justify="space-between">
                            <Box>
                                <Text fontSize="28px" fontWeight="800" color="white" lineHeight="1">
                                    4 <Text as="span" fontSize="14px" color="#8A8A93" fontWeight="500">/ 5 Sessions</Text>
                                </Text>
                                <Text fontSize="11px" color="#8A8A93" mt="3">1 session left to hit target.</Text>
                            </Box>
                            <GoalRing current={4} total={5} />
                        </Flex>
                    </Box>

                    {/* Next Up */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="5"
                        transition="all 0.2s"
                        _hover={{ borderColor: '#2e3040', transform: 'translateY(-2px)' }}
                    >
                        <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="1">
                            Next Up • 18:00
                        </Text>
                        <Text fontSize="16px" fontWeight="700" color="white" mb="1">
                            Live PT Session
                        </Text>
                        <Text fontSize="11px" color="#8A8A93" mb="3">
                            Coach Sarah • Core & Mobility
                        </Text>
                        <AppButton
                            label={
                                <HStack spacing="2">
                                    <Icon as={FiVideo} boxSize="13px" />
                                    <Text>Join Now</Text>
                                </HStack>
                            }
                            variant="solid"
                            size="sm"
                            w="full"
                            h="34px"
                            fontSize="12px"
                        />
                    </Box>
                </Grid>

                {/* Middle Row */}
                <Grid templateColumns="1fr 300px" gap="4" mb="5">
                    {/* Suggested Routine Block */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="6"
                        transition="all 0.2s"
                        _hover={{ borderColor: '#2e3040' }}
                    >
                        <HStack spacing="2" mb="4">
                            <Badge
                                bg="#2e3040"
                                color="#E2E1EB"
                                fontSize="10px"
                                fontWeight="700"
                                px="2"
                                py="1"
                                borderRadius="6px"
                                textTransform="uppercase"
                            >
                                Recommendation
                            </Badge>
                            <Badge
                                bg="#2e3040"
                                color="#E2E1EB"
                                fontSize="10px"
                                fontWeight="700"
                                px="2"
                                py="1"
                                borderRadius="6px"
                            >
                                ~45 MIN
                            </Badge>
                        </HStack>
                        <Heading fontSize="24px" fontWeight="800" color="white" mb="2">
                            Today's Suggested Routine
                        </Heading>
                        <Text fontSize="13px" color="#8A8A93" mb="5" maxW="500px">
                            A curated selection of exercises from your library to keep your momentum going today.
                        </Text>

                        <Grid templateColumns="repeat(4, 1fr)" gap="4" mb="5">
                            {suggestedRoutine.length > 0 ? (
                                suggestedRoutine.map((ex, i) => (
                                    <Box key={ex.id}>
                                        <Text fontSize="9px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="1">
                                            {i === 3 ? 'Finisher' : `Block ${i + 1}`}
                                        </Text>
                                        <Text fontSize="13px" fontWeight="600" color="white" noOfLines={1}>{ex.title}</Text>
                                        <Text fontSize="11px" color="#8A8A93">{ex.muscleGroup}</Text>
                                    </Box>
                                ))
                            ) : (
                                <Text fontSize="13px" color="#8A8A93" gridColumn="span 4">
                                    Loading your suggestions...
                                </Text>
                            )}
                        </Grid>

                        <Flex align="center" justify="space-between">
                            <HStack spacing="2">
                                <HStack spacing="-2">
                                    <Avatar size="xs" name="User 1" bg="#4a5068" fontSize="9px" />
                                    <Avatar size="xs" name="User 2" bg="#3a4058" fontSize="9px" />
                                </HStack>
                                <Text fontSize="11px" color="#8A8A93">+24 Completed today</Text>
                            </HStack>
                            <AppButton
                                label={
                                    <HStack spacing="2">
                                        <Icon as={FiPlay} boxSize="13px" />
                                        <Text>Start Workout</Text>
                                    </HStack>
                                }
                                variant="solid"
                                size="md"
                                px="6"
                                h="40px"
                                fontSize="13px"
                                onClick={handleStartWorkout}
                            />
                        </Flex>
                    </Box>

                    {/* AI Insight Card */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="6"
                    >
                        <HStack spacing="2" mb="4">
                            <Icon as={FiCpu} color="#E03030" boxSize="14px" />
                            <Text fontSize="10px" fontWeight="700" color="#E03030" textTransform="uppercase" letterSpacing="wider">
                                AISTHEA Insight
                            </Text>
                        </HStack>
                        <Icon as={FiCpu} color="#2e3040" boxSize="40px" mb="3" />
                        <Heading fontSize="18px" fontWeight="800" color="white" mb="3" lineHeight="short">
                            Recovery Deficit Detected
                        </Heading>
                        <Text fontSize="12px" color="#8A8A93" mb="5" lineHeight="1.6">
                            Based on yesterday's HRV and sleep data, your central nervous system needs a lighter load today. Consider swapping heavy squats for mobility work.
                        </Text>
                        <Stack spacing="2">
                            <Button
                                size="sm"
                                variant="outline"
                                borderColor="#2e3040"
                                color="#E2E1EB"
                                fontSize="12px"
                                borderRadius="10px"
                                h="36px"
                                _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: '#E03030' }}
                            >
                                Swap to Mobility Routine
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                color="#8A8A93"
                                fontSize="12px"
                                borderRadius="10px"
                                h="36px"
                                _hover={{ bg: 'rgba(255,255,255,0.05)', color: '#E2E1EB' }}
                            >
                                Ignore & Proceed
                            </Button>
                        </Stack>
                    </Box>
                </Grid>

                {/* Bottom Row */}
                <Grid templateColumns="1fr 1fr 300px" gap="4">
                    {/* Weekly Volume */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="5"
                    >
                        <Flex justify="space-between" align="center" mb="4">
                            <Heading fontSize="16px" fontWeight="700" color="white">
                                Weekly Volume
                            </Heading>
                            <Text fontSize="10px" fontWeight="700" color="#8A8A93">
                                LBS
                            </Text>
                        </Flex>
                        <WeeklyVolumeChart />
                    </Box>

                    {/* Macros */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="5"
                    >
                        <Flex justify="space-between" align="center" mb="4">
                            <Heading fontSize="16px" fontWeight="700" color="white">
                                Macros
                            </Heading>
                            <Text fontSize="10px" fontWeight="700" color="#8A8A93">
                                TODAY
                            </Text>
                        </Flex>
                        <Stack spacing="4">
                            <MacroBar label="Protein" current={summary?.proteinConsumed ?? 0} total={summary?.proteinTarget || 180} unit="g" color="#E03030" />
                            <MacroBar label="Carbs" current={summary?.carbsConsumed ?? 0} total={summary?.carbsTarget || 300} unit="g" color="#3b82f6" />
                            <MacroBar label="Fats" current={summary?.fatsConsumed ?? 0} total={summary?.fatsTarget || 65} unit="g" color="#f59e0b" />
                        </Stack>
                    </Box>

                    {/* Upcoming */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="5"
                    >
                        <Flex justify="space-between" align="center" mb="4">
                            <Heading fontSize="16px" fontWeight="700" color="white">
                                Upcoming
                            </Heading>
                            <Text fontSize="10px" fontWeight="700" color="#8A8A93">
                                CALENDAR
                            </Text>
                        </Flex>
                        <Stack spacing="3">
                            {[
                                { date: '14', day: 'TOM', title: 'Rest & Mobility', sub: 'Active Recovery' },
                                { date: '15', day: 'FRI', title: 'Upper Power', sub: '18:00 • Block B' },
                            ].map((ev, i) => (
                                <Flex
                                    key={i}
                                    align="center"
                                    gap="3"
                                    p="3"
                                    bg="#0f1117"
                                    borderRadius="10px"
                                    border="1px solid"
                                    borderColor="#1e2028"
                                >
                                    <Box
                                        w="36px"
                                        h="36px"
                                        borderRadius="8px"
                                        bg="#1e2028"
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                    >
                                        <Text fontSize="8px" fontWeight="700" color="#8A8A93" textTransform="uppercase">
                                            {ev.day}
                                        </Text>
                                        <Text fontSize="14px" fontWeight="800" color="white" lineHeight="1">
                                            {ev.date}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="13px" fontWeight="600" color="white">
                                            {ev.title}
                                        </Text>
                                        <Text fontSize="11px" color="#8A8A93">
                                            {ev.sub}
                                        </Text>
                                    </Box>
                                </Flex>
                            ))}
                        </Stack>
                    </Box>
                </Grid>
            </Box>
        </MemberLayout>
    )
}

export default Dashboard