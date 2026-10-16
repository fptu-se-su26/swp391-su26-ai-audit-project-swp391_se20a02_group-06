import React, { useState, useEffect, useCallback } from 'react'
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
    // Button,
    useToast,
} from '@chakra-ui/react'
import {
    FiZap,
    // FiCpu,
    FiPlay,
    // FiVideo,
    FiDroplet,
} from 'react-icons/fi'
import useSWR, { mutate as globalMutate } from 'swr'
import apiClient from '../../lib/axios'
import { logWater, updateReminderSettings } from '../../api/nutrition'
import { useAuthStore } from '../../store/useAuthStore'
import { HydrationCountdown } from '../../features/nutrition/components/NutritionWidgets'
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

const fetcher = (url: string) => apiClient.get(url).then((res) => res.data)

/* ── Dashboard Page ─────────────────────────── */
const Dashboard: React.FC = () => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const toast = useToast()
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)

    // Fetch daily nutrition summary (Water tracking)
    const { data: summary } = useSWR(isAuthenticated ? `/nutrition/daily?date=${todayStr}` : null, fetcher)

    const handleLogWater = useCallback(async () => {
        const key = `/nutrition/daily?date=${todayStr}`
        try {
            await logWater(todayStr, 1)
            globalMutate(key)
            toast({
                title: 'Water logged! 🥛',
                description: '1 glass of water added.',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        } catch {
            globalMutate(key)
            toast({
                title: 'Failed to log water',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [todayStr, toast])

    const waterCurrent = summary?.waterConsumedGlasses ?? 0
    const waterTotal = summary?.waterTargetGlasses ?? 8

    // Reminder schedule state
    const [reminderStart, setReminderStart] = useState('07:00')
    const [reminderEnd, setReminderEnd] = useState('22:00')
    const [savingSchedule, setSavingSchedule] = useState(false)

    useEffect(() => {
        if (summary?.waterReminderStartTime) setReminderStart(summary.waterReminderStartTime)
        if (summary?.waterReminderEndTime) setReminderEnd(summary.waterReminderEndTime)
    }, [summary?.waterReminderStartTime, summary?.waterReminderEndTime])

    const handleSaveReminder = async () => {
        setSavingSchedule(true)
        try {
            await updateReminderSettings(reminderStart, reminderEnd)
            globalMutate(`/nutrition/daily?date=${todayStr}`)
            toast({ title: 'Reminder schedule saved', status: 'success', duration: 2000, isClosable: true })
        } catch {
            toast({ title: 'Failed to save', status: 'error', duration: 2000, isClosable: true })
        } finally {
            setSavingSchedule(false)
        }
    }

    return (
        <MemberLayout>
            <Box w="full" minW="0" maxW="1200px" mx="auto" p={{ base: '4', md: '5', lg: '7' }}>

                {/* Stat Cards Row */}
                <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap="4" mb="5">
                    {/* Active Calories */}
                    <StatCard
                        label="Active Calories"
                        value={
                            <Box>
                                <Text as="span" fontSize="28px" fontWeight="800" color="white">1,240</Text>
                                <Text as="span" fontSize="13px" color="#8A8A93" ml="1">kcal</Text>
                            </Box>
                        }
                        icon={FiZap}
                        sub={<MiniBarChart />}
                    />

                    {/* Current Streak */}
                    <StatCard
                        label="Current Streak"
                        value={
                            <Box>
                                <Text as="span" fontSize="28px" fontWeight="800" color="white">12</Text>
                                <Text as="span" fontSize="13px" color="#8A8A93" ml="1">Days</Text>
                            </Box>
                        }
                        icon={FiZap}
                        sub={<StreakDots />}
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

                    {/* Daily Hydration Card (Replaces mock Next Up) */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="5"
                        transition="all 0.2s"
                        _hover={{ borderColor: '#2e3040', transform: 'translateY(-2px)' }}
                    >
                        <Flex justify="space-between" align="center" mb="1">
                            <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">
                                Daily Hydration
                            </Text>
                            <Icon as={FiDroplet} color="#3b82f6" boxSize="13px" />
                        </Flex>
                        <Text fontSize="24px" fontWeight="800" color="white" mb="1" lineHeight="1.1">
                            {waterCurrent} <Text as="span" fontSize="13px" color="#8A8A93" fontWeight="500">/ {waterTotal} Glasses</Text>
                        </Text>
                        <Text fontSize="11px" color="#8A8A93" mb="3">
                            {waterTotal > waterCurrent
                                ? `${waterTotal - waterCurrent} more glasses to reach goal`
                                : '🎉 Daily goal reached!'}
                        </Text>
                        <AppButton
                            label={
                                <HStack spacing="1.5">
                                    <Icon as={FiDroplet} boxSize="12px" />
                                    <Text>+ Log 1 Glass</Text>
                                </HStack>
                            }
                            variant="solid"
                            size="sm"
                            w="full"
                            h="34px"
                            fontSize="12px"
                            onClick={handleLogWater}
                        />
                    </Box>

                    {/* Temporarily hidden for production:
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
                    */}
                </Grid>

                {/* Middle Row */}
                <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 300px' }} gap="4" mb="5">
                    {/* Hypertrophy Block */}
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
                                Strength
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
                                45 MIN
                            </Badge>
                        </HStack>
                        <Heading fontSize="24px" fontWeight="800" color="white" mb="2">
                            Hypertrophy Block A
                        </Heading>
                        <Text fontSize="13px" color="#8A8A93" mb="5" maxW="500px">
                            Focus on controlled eccentrics and progressive overload on main compound lifts.
                        </Text>

                        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap="4" mb="5">
                            {[
                                { label: 'Block 1', name: 'Barbell Squat', sets: '4 x 8–10' },
                                { label: 'Block 2', name: 'Bulgarian Split', sets: '3 x 12 /leg' },
                                { label: 'Block 3', name: 'Leg Press', sets: '3 x 15' },
                                { label: 'Finisher', name: 'Calf Raises', sets: '4 x 20' },
                            ].map((b, i) => (
                                <Box key={i}>
                                    <Text fontSize="9px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="1">
                                        {b.label}
                                    </Text>
                                    <Text fontSize="13px" fontWeight="600" color="white">{b.name}</Text>
                                    <Text fontSize="11px" color="#8A8A93">{b.sets}</Text>
                                </Box>
                            ))}
                        </Grid>

                        <Flex
                            align={{ base: 'stretch', sm: 'center' }}
                            direction={{ base: 'column', sm: 'row' }}
                            justify="space-between"
                            gap="3"
                        >
                            <HStack spacing="2" minW="0">
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
                                px={{ base: '4', sm: '6' }}
                                w={{ base: 'full', sm: 'auto' }}
                                h="40px"
                                fontSize="13px"
                            />
                        </Flex>
                    </Box>

                    {/* Water Reminder & Schedule Card (Replaces mock AI Insight) */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="16px"
                        p="5"
                    >
                        <Flex justify="space-between" align="center" mb="3">
                            <HStack spacing="2">
                                <Icon as={FiDroplet} color="#3b82f6" boxSize="14px" />
                                <Text fontSize="10px" fontWeight="700" color="#3b82f6" textTransform="uppercase" letterSpacing="wider">
                                    Water Reminder
                                </Text>
                            </HStack>
                            <Badge bg="rgba(59, 130, 246, 0.15)" color="#60a5fa" fontSize="10px" px="2" py="0.5" borderRadius="md">
                                {waterCurrent}/{waterTotal} Glasses
                            </Badge>
                        </Flex>

                        {/* Next glass in countdown */}
                        <Box mb="4">
                            <HydrationCountdown
                                current={waterCurrent}
                                target={waterTotal}
                                startTime={summary?.waterReminderStartTime}
                                endTime={summary?.waterReminderEndTime}
                                onRemind={() => {
                                    toast({
                                        title: 'Time to drink water! 🥛',
                                        description: `You need to drink ${Math.max(0, waterTotal - waterCurrent)} more cups of water.`,
                                        status: 'success',
                                        duration: 5000,
                                        isClosable: true,
                                    })
                                }}
                            />
                        </Box>

                        {/* Interactive Droplet Grid */}
                        <Box mb="4">
                            <Text fontSize="11px" color="#8A8A93" fontWeight="600" mb="2">
                                Quick Log (Click next glass):
                            </Text>
                            <Flex gap="1.5" flexWrap="wrap">
                                {Array.from({ length: waterTotal }).map((_, i) => {
                                    const filled = i < waterCurrent
                                    const isNext = i === waterCurrent
                                    return (
                                        <Box
                                            key={i}
                                            w="25px"
                                            h="30px"
                                            borderRadius="7px"
                                            bg={filled ? 'rgba(59,130,246,0.3)' : '#1e2028'}
                                            border="1px solid"
                                            borderColor={isNext && waterCurrent < waterTotal ? 'rgba(59,130,246,0.7)' : filled ? 'rgba(59,130,246,0.5)' : '#2e3040'}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            transition="all 0.2s"
                                            cursor={isNext ? 'pointer' : 'default'}
                                            _hover={isNext ? { bg: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6' } : undefined}
                                            onClick={() => { if (isNext) handleLogWater() }}
                                            title={filled ? `Glass ${i + 1} logged` : isNext ? `Click to log glass ${i + 1}` : `Glass ${i + 1}`}
                                        >
                                            <Icon as={FiDroplet} color={filled ? '#3b82f6' : '#3e4050'} boxSize="11px" />
                                        </Box>
                                    )
                                })}
                            </Flex>
                        </Box>

                        {/* Reminder Schedule Settings */}
                        <Box borderTop="1px solid" borderColor="#1e2028" pt="3">
                            <Flex justify="space-between" align="center" mb="2">
                                <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">
                                    Reminder Schedule
                                </Text>
                                <Box
                                    as="button"
                                    fontSize="11px"
                                    fontWeight="600"
                                    color="#E03030"
                                    _hover={{ color: '#ff6b6b' }}
                                    onClick={handleSaveReminder}
                                >
                                    {savingSchedule ? 'Saving...' : 'Save'}
                                </Box>
                            </Flex>
                            <Flex gap="2" align="center">
                                <Box flex="1">
                                    <Text fontSize="10px" color="#8A8A93" mb="1">From</Text>
                                    <Box
                                        as="input"
                                        type="time"
                                        value={reminderStart}
                                        onChange={(e: any) => setReminderStart(e.target.value)}
                                        bg="#0A0C10"
                                        border="1px solid"
                                        borderColor="#1e2028"
                                        borderRadius="8px"
                                        color="white"
                                        fontSize="12px"
                                        p="1.5"
                                        w="full"
                                        _focus={{ borderColor: '#E03030', outline: 'none' }}
                                    />
                                </Box>
                                <Box flex="1">
                                    <Text fontSize="10px" color="#8A8A93" mb="1">To</Text>
                                    <Box
                                        as="input"
                                        type="time"
                                        value={reminderEnd}
                                        onChange={(e: any) => setReminderEnd(e.target.value)}
                                        bg="#0A0C10"
                                        border="1px solid"
                                        borderColor="#1e2028"
                                        borderRadius="8px"
                                        color="white"
                                        fontSize="12px"
                                        p="1.5"
                                        w="full"
                                        _focus={{ borderColor: '#E03030', outline: 'none' }}
                                    />
                                </Box>
                            </Flex>
                        </Box>
                    </Box>

                    {/* Temporarily hidden for production:
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
                                NETFIT Insight
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
                    */}
                </Grid>

                {/* Bottom Row */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'minmax(0, 1fr) minmax(0, 1fr) 300px' }} gap="4">
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
                            <MacroBar label="Protein" current={160} total={180} unit="g" color="#E03030" />
                            <MacroBar label="Carbs" current={210} total={300} unit="g" color="#3b82f6" />
                            <MacroBar label="Fats" current={45} total={65} unit="g" color="#f59e0b" />
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
