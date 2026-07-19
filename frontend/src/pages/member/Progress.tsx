import React, { useState, useMemo } from 'react'
import {
    Box, Flex, Heading, Text, Icon, Button, Spinner, HStack, Stack, Select,
} from '@chakra-ui/react'
import { FiBarChart2, FiCheckCircle } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import MemberLayout from '../../components/shared/Layout/MemberLayout'
import WorkoutExerciseModal from '../../features/workout/components/WorkoutExerciseModal'
import type { ModalExerciseData } from '../../features/workout/components/WorkoutExerciseModal'
import { getWorkoutHistory } from '../../api/workouts'
import type { WorkoutSessionDto, WorkoutSessionDetailDto } from '../../api/workouts'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const Progress: React.FC = () => {
    const [periodFilter, setPeriodFilter] = useState('all')
    const [muscleFilter, setMuscleFilter] = useState('')
    const [selectedExercise, setSelectedExercise] = useState<ModalExerciseData | null>(null)

    const { data: history, isLoading, error } = useSWR<WorkoutSessionDto[]>(
        `/workouts/history?filter=${periodFilter}`,
        () => getWorkoutHistory(periodFilter),
    )

    const { data: allExercises } = useSWR<any[]>('/exercises', fetcher, { dedupingInterval: 60000 })

    const muscleGroups = useMemo(() => {
        if (!allExercises) return []
        const set = new Set<string>()
        allExercises.forEach((e: any) => { if (e.muscleGroup) set.add(e.muscleGroup) })
        return Array.from(set).sort()
    }, [allExercises])

    const filteredHistory = useMemo(() => {
        if (!history) return []
        if (!muscleFilter) return history
        return history.filter(session =>
            session.details.some(detail => {
                const ex = allExercises?.find((e: any) => e.id === detail.exerciseId)
                return ex?.muscleGroup?.toLowerCase() === muscleFilter.toLowerCase()
            })
        )
    }, [history, muscleFilter, allExercises])

    const buildExerciseData = (detail: WorkoutSessionDetailDto): ModalExerciseData => {
        const exDetail = allExercises?.find((e: any) => e.id === detail.exerciseId)
        return {
            name: detail.exerciseName || exDetail?.name || `Exercise #${detail.exerciseId}`,
            videoUrl: exDetail?.videoUrl,
            description: exDetail?.description,
            tags: [exDetail?.muscleGroup, exDetail?.difficulty].filter(Boolean),
            duration: exDetail?.duration || undefined,
        }
    }

    return (
        <MemberLayout>
            <Box p="7" maxW="1000px" mx="auto">
                <Flex justify="space-between" align="flex-end" mb="6" wrap="wrap" gap="4">
                    <Box>
                        <Heading fontSize="22px" fontWeight="800" color="white" mb="1">Progress</Heading>
                        <Text fontSize="14px" color="#8A8A93">Your workout history</Text>
                    </Box>
                    <HStack spacing="3">
                        <Select
                            value={periodFilter}
                            onChange={e => setPeriodFilter(e.target.value)}
                            bg="#1e2028" color="white" border="1px solid" borderColor="#2e3040"
                            borderRadius="8px" fontSize="13px"
                            _focus={{ borderColor: '#E03030' }}
                        >
                            <option value="all" style={{ background: '#141720' }}>All Time</option>
                            <option value="day" style={{ background: '#141720' }}>Today</option>
                            <option value="week" style={{ background: '#141720' }}>This Week</option>
                            <option value="month" style={{ background: '#141720' }}>This Month</option>
                        </Select>
                        <Select
                            value={muscleFilter}
                            onChange={e => setMuscleFilter(e.target.value)}
                            bg="#1e2028" color="white" border="1px solid" borderColor="#2e3040"
                            borderRadius="8px" fontSize="13px"
                            _focus={{ borderColor: '#E03030' }}
                        >
                            <option value="" style={{ background: '#141720' }}>All Muscle Groups</option>
                            {muscleGroups.map(mg => (
                                <option key={mg} value={mg} style={{ background: '#141720' }}>{mg}</option>
                            ))}
                        </Select>
                    </HStack>
                </Flex>

                <Box position="relative" pl="6">
                    <Box position="absolute" left="3" top="2" bottom="0" w="1px" bg="rgba(255,255,255,0.06)" />

                    {isLoading ? (
                        <Flex justify="center" py="20"><Spinner color="#E03030" size="lg" /></Flex>
                    ) : error ? (
                        <Text color="#E03030" textAlign="center" py="10">Failed to load progress. Please try again.</Text>
                    ) : filteredHistory.length === 0 ? (
                        <Box textAlign="center" py="16">
                            <Icon as={FiBarChart2} boxSize="40px" color="#2e3040" mb="4" />
                            <Text color="#8A8A93" fontSize="14px">No workout history yet. Start your first workout!</Text>
                        </Box>
                    ) : (
                        <>
                            {filteredHistory.map(session => (
                                <Box key={session.id} position="relative" mb="6" pl="5">
                                    <Box position="absolute" left="0" top="6" w="5" h="1px" bg="rgba(255,255,255,0.06)" />
                                    <Box
                                        position="absolute" left="-13px" top="5"
                                        w="7px" h="7px" rounded="full" bg="#E03030"
                                        boxShadow="0 0 10px rgba(224,48,48,0.5)"
                                        zIndex="1"
                                    />

                                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5">
                                        <Flex justify="space-between" align="center" mb="4" pb="3" borderBottom="1px solid" borderColor="rgba(255,255,255,0.06)">
                                            <Heading fontSize="16px" fontWeight="600" color="white">
                                                {session.startedAt
                                                    ? new Date(session.startedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
                                                    : 'Unknown Date'}
                                            </Heading>
                                            <HStack spacing="2" color="#8A8A93" fontSize="12px">
                                                <Text>{session.details.length} Exercises</Text>
                                                <Text>•</Text>
                                                <Text>{session.totalDurationMinutes || 0} mins</Text>
                                            </HStack>
                                        </Flex>

                                        <Stack spacing="1">
                                            {session.details.map((detail, idx) => (
                                                <Flex
                                                    key={idx}
                                                    direction={{ base: 'column', md: 'row' }}
                                                    align={{ md: 'center' }}
                                                    justify="space-between"
                                                    gap="2"
                                                    p="3"
                                                    borderRadius="8px"
                                                    _hover={{ bg: 'rgba(255,255,255,0.02)' }}
                                                >
                                                    <Box flex="1">
                                                        <Text fontSize="14px" fontWeight="600" color="white" mb="1">
                                                            {detail.exerciseName || `Exercise #${detail.exerciseId}`}
                                                        </Text>
                                                        <Text fontSize="12px" color="#8A8A93">
                                                            {detail.setsDone} Sets x {detail.repsDone} Reps
                                                            {detail.weight ? ` | ${detail.weight}kg` : ''}
                                                        </Text>
                                                    </Box>
                                                    <HStack spacing="3">
                                                        <Flex align="center" gap="1" bg="rgba(74,222,128,0.1)" color="#4ade80" px="2" py="1" borderRadius="full" fontSize="10px" fontWeight="600" textTransform="uppercase" letterSpacing="wider">
                                                            <Icon as={FiCheckCircle} boxSize="12px" />
                                                            <Text>Completed</Text>
                                                        </Flex>
                                                        <HStack spacing="2">
                                                            <Button
                                                                size="xs" variant="outline" colorScheme="whiteAlpha"
                                                                borderColor="rgba(255,255,255,0.15)" color="white"
                                                                borderRadius="full" fontSize="11px" px="3" py="1" h="auto"
                                                                _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                                                                onClick={() => setSelectedExercise(buildExerciseData(detail))}
                                                            >
                                                                View
                                                            </Button>
                                                            <Button
                                                                size="xs"
                                                                bg="#E03030" color="white"
                                                                borderRadius="full" fontSize="11px" px="3" py="1" h="auto"
                                                                _hover={{ bg: '#C62828' }}
                                                                onClick={() => setSelectedExercise(buildExerciseData(detail))}
                                                            >
                                                                Retry
                                                            </Button>
                                                        </HStack>
                                                    </HStack>
                                                </Flex>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>
                            ))}

                            <Box pl="5" py="6" textAlign="center">
                                <Text fontSize="13px" color="#8A8A93">No more history to show.</Text>
                            </Box>
                        </>
                    )}
                </Box>
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
