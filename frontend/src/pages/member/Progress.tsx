import React, { useEffect, useState } from 'react'
import { Box, Heading, Text, Icon, Flex, Badge, Stack, Spinner, HStack } from '@chakra-ui/react'
import { FiClock, FiZap, FiCheckCircle } from 'react-icons/fi'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'
import { getWorkoutHistory, type WorkoutSessionDto } from '../../api/workouts.ts'

const Progress: React.FC = () => {
    const [history, setHistory] = useState<WorkoutSessionDto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getWorkoutHistory()
            .then(data => setHistory(data))
            .catch(err => console.error("Failed to load history", err))
            .finally(() => setLoading(false))
    }, [])

    return (
        <MemberLayout>
            <Box p="7" maxW="1000px" mx="auto">
                <Flex align="center" gap="3" mb="6">
                    <Box w="40px" h="40px" borderRadius="12px" bg="rgba(224,48,48,0.12)" display="flex" alignItems="center" justifyContent="center">
                        <Icon as={FiClock} color="#E03030" boxSize="20px" />
                    </Box>
                    <Box>
                        <Heading fontSize="24px" fontWeight="800" color="white">Workout History</Heading>
                        <Text fontSize="13px" color="#8A8A93">Review your past training sessions and progress</Text>
                    </Box>
                </Flex>

                {loading ? (
                    <Flex justify="center" py="20">
                        <Spinner color="#E03030" />
                    </Flex>
                ) : history.length === 0 ? (
                    <Box p="10" bg="#141720" borderRadius="16px" border="1px solid" borderColor="#1e2028" textAlign="center">
                        <Text color="#8A8A93">You haven't completed any workouts yet.</Text>
                    </Box>
                ) : (
                    <Stack spacing="4">
                        {history.map(session => (
                            <Box key={session.id} bg="#141720" borderRadius="16px" border="1px solid" borderColor="#1e2028" p="5" transition="all 0.2s" _hover={{ borderColor: '#2e3040' }}>
                                <Flex justify="space-between" align="center" mb="4">
                                    <Box>
                                        <Text fontSize="16px" fontWeight="700" color="white" mb="1">
                                            {session.startedAt ? new Date(session.startedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Unknown Date'}
                                        </Text>
                                        <HStack spacing="3">
                                            <Badge bg="rgba(224,48,48,0.15)" color="#E03030" fontSize="10px" px="2" py="0.5" borderRadius="4px">COMPLETED</Badge>
                                            <Flex align="center" gap="1" color="#8A8A93" fontSize="12px">
                                                <Icon as={FiClock} />
                                                <Text>{session.totalDurationMinutes} min</Text>
                                            </Flex>
                                            <Flex align="center" gap="1" color="#8A8A93" fontSize="12px">
                                                <Icon as={FiZap} />
                                                <Text>{session.totalCaloriesBurned} kcal</Text>
                                            </Flex>
                                        </HStack>
                                    </Box>
                                </Flex>
                                
                                <Box bg="#0f1117" p="4" borderRadius="12px" border="1px solid" borderColor="#1e2028">
                                    <Text fontSize="11px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="3">Exercises Completed</Text>
                                    <Stack spacing="2">
                                        {session.details.map((detail, idx) => (
                                            <Flex key={idx} justify="space-between" align="center">
                                                <Flex align="center" gap="2">
                                                    <Icon as={FiCheckCircle} color="#E03030" boxSize="14px" />
                                                    <Text fontSize="13px" fontWeight="600" color="white">{detail.exerciseName || `Exercise #${detail.exerciseId}`}</Text>
                                                </Flex>
                                                <Text fontSize="12px" color="#8A8A93">{detail.setsDone} sets × {detail.repsDone} reps</Text>
                                            </Flex>
                                        ))}
                                        {session.details.length === 0 && (
                                            <Text fontSize="12px" color="#8A8A93">No exercises recorded.</Text>
                                        )}
                                    </Stack>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </MemberLayout>
    )
}

export default Progress