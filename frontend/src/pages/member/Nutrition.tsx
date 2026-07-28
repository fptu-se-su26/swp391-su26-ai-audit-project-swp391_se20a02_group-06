import React, { useState, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box,
    Flex,
    Grid,
    Heading,
    Text,
    Stack,
    HStack,
    Icon,
    IconButton,
    Spinner,
    Input,
    Badge,
    useToast,
} from '@chakra-ui/react'
import {
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiDroplet,
    FiZap,
    FiActivity,
    FiSearch,
} from 'react-icons/fi'
import useSWR, { mutate as globalMutate } from 'swr'
import apiClient from '../../lib/axios'
import AppButton from '../../components/shared/Button/AppButton'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'
import {
    AIDietPlanCard,
    DonutRing,
    FoodItem,
    HydrationCountdown,
    HydrationTracker,
    MacroCard,
    MealSection,
} from '../../features/nutrition/components/NutritionWidgets.tsx'
import { logWater, updateReminderSettings } from '../../api/nutrition'
import { triggerTestWaterReminder } from '../../api/notifications'
import { useAuthStore } from '../../store/useAuthStore'

const fetcher = (url: string) => apiClient.get(url).then((res) => res.data)

/* ── Nutrition Page ─────────────────────────── */
const Nutrition: React.FC = () => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const [searchQuery, setSearchQuery] = useState('')
    const toast = useToast()
    const sessionId = useAuthStore(state => state.sessionId)

    // Fetch foods from API
    const { data: foods, isLoading, error } = useSWR(sessionId ? '/foods' : null, fetcher)

    // Fetch daily nutrition summary
    const { data: summary } = useSWR(sessionId ? `/nutrition/daily?date=${todayStr}` : null, fetcher)

    // Fetch AI Diet Histories
    const { data: dietHistories } = useSWR(sessionId ? '/AIChat/diet-history' : null, fetcher)
    const latestDiet = dietHistories && dietHistories.length > 0 ? dietHistories[0] : null

    const navigate = useNavigate()

    const handleLogWater = useCallback(async () => {
        const key = `/nutrition/daily?date=${todayStr}`
        try {
            await logWater(todayStr, 1)
            globalMutate(key)
            toast({
                title: 'Water logged!',
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

    const filteredFoods = foods?.filter((food: any) => {
        const foodName = typeof food?.name === 'string' ? food.name : ''
        return foodName.toLowerCase().includes(searchQuery.toLowerCase())
    }) || []

    // Pre-filled water count when navigated from notification
    const location = useLocation()
    const waterFromNotification = (location.state as { waterConsumedGlasses?: number } | null)?.waterConsumedGlasses
    useEffect(() => {
        if (waterFromNotification) {
            globalMutate(`/nutrition/daily?date=${todayStr}`)
        }
    }, [waterFromNotification])

    const waterCurrent = summary?.waterConsumedGlasses ?? 0
    const waterTotal = summary?.waterTargetGlasses ?? 8

    return (
        <MemberLayout>
            <Box p="7" maxW="1100px">
                {/* Date Header */}
                <Flex align="center" justify="space-between" mb="6">
                    <HStack spacing="3">
                        <IconButton
                            aria-label="Previous day"
                            icon={<Icon as={FiChevronLeft} />}
                            variant="ghost"
                            size="sm"
                            color="#8A8A93"
                            borderRadius="8px"
                            _hover={{ bg: '#1e2028', color: '#E2E1EB' }}
                        />
                        <Box>
                            <Heading fontSize="22px" fontWeight="800" color="white">
                                Today
                            </Heading>
                            <Text fontSize="12px" color="#8A8A93">
                                {dateStr}
                            </Text>
                        </Box>
                        <IconButton
                            aria-label="Next day"
                            icon={<Icon as={FiChevronRight} />}
                            variant="ghost"
                            size="sm"
                            color="#8A8A93"
                            borderRadius="8px"
                            _hover={{ bg: '#1e2028', color: '#E2E1EB' }}
                        />
                    </HStack>
                    <AppButton
                        label={
                            <HStack spacing="2">
                                <Icon as={FiPlus} boxSize="14px" />
                                <Text>Log Meal</Text>
                            </HStack>
                        }
                        variant="solid"
                        h="38px"
                        px="5"
                        fontSize="13px"
                    />
                </Flex>

                {/* Main Grid: left content + right panel */}
                <Grid templateColumns={{ base: "1fr", lg: "1fr 280px" }} gap="5">
                    {/* LEFT */}
                    <Stack spacing="5">
                        {/* Calorie + Macros Row */}
                        <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "1fr 1fr 1fr 1fr" }} gap="3">
                            {/* Calories Donut */}
                            <Box
                                bg="#141720"
                                border="1px solid"
                                borderColor="#1e2028"
                                borderRadius="14px"
                                p="5"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                            >
                                <Text fontSize="13px" fontWeight="700" color="white" mb="3">
                                    Calories
                                </Text>
                                <DonutRing current={1850} total={2400} />
                                <Text fontSize="12px" color="#8A8A93" mt="3">
                                    550 kcal remaining
                                </Text>
                            </Box>

                            {/* Macro cards: Protein, Carbs, Fat */}
                            <MacroCard
                                label="Protein"
                                icon={FiZap}
                                current={140}
                                total={180}
                                unit="g"
                                color="#E03030"
                            />
                            <MacroCard
                                label="Carbs"
                                icon={FiActivity}
                                current={120}
                                total={250}
                                unit="g"
                                color="#3b82f6"
                            />
                            <MacroCard
                                label="Fat"
                                icon={FiDroplet}
                                current={45}
                                total={70}
                                unit="g"
                                color="#f59e0b"
                            />
                        </Grid>

                        {/* Breakfast */}
                        <MealSection
                            label="Breakfast"
                            kcal={450}
                            items={
                                <FoodItem
                                    name="Protein Oats"
                                    serving="1 serving"
                                    kcal={350}
                                    pro={25}
                                    carb={45}
                                    fat={8}
                                />
                            }
                        />

                        {/* Lunch */}
                        <MealSection
                            label="Lunch"
                            kcal={650}
                            items={
                                <FoodItem
                                    name="Grilled Chicken Salad"
                                    serving="1 bowl"
                                    kcal={420}
                                    pro={45}
                                    carb={12}
                                    fat={18}
                                />
                            }
                        />

                        {/* Food Library */}
                        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6" mt="4">
                            <Flex justify="space-between" align="center" mb="4">
                                <Heading fontSize="18px" fontWeight="700" color="white">
                                    Food Library
                                </Heading>
                                <Flex align="center" bg="#0A0C10" border="1px solid" borderColor="#1e2028" borderRadius="8px" px="3" py="1">
                                    <Icon as={FiSearch} color="#8A8A93" />
                                    <Input
                                        placeholder="Search foods..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        variant="unstyled"
                                        size="sm"
                                        ml="2"
                                        color="white"
                                        _placeholder={{ color: '#8A8A93' }}
                                    />
                                </Flex>
                            </Flex>

                            {isLoading ? (
                                <Flex justify="center" p="6">
                                    <Spinner color="#E03030" />
                                </Flex>
                            ) : error ? (
                                <Text color="red.500">Failed to load foods.</Text>
                            ) : filteredFoods.length === 0 ? (
                                <Text color="#8A8A93" p="4" textAlign="center">No foods found.</Text>
                            ) : (
                                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="4">
                                    {filteredFoods.map((food: any) => (
                                        <Flex key={food.id} bg="#0A0C10" p="3" borderRadius="12px" border="1px solid" borderColor="#1e2028" align="center" justify="space-between">
                                            <Box>
                                                <Text color="white" fontWeight="600" fontSize="14px">{food.name}</Text>
                                                <Text color="#8A8A93" fontSize="12px">
                                                    {food.servingSize} {food.unit} • {food.calories} kcal
                                                </Text>
                                            </Box>
                                            <HStack spacing="2">
                                                <Badge bg="rgba(224, 48, 48, 0.1)" color="#E03030" px="2" py="0.5" borderRadius="md" fontSize="10px">
                                                    {food.protein}g P
                                                </Badge>
                                                <Badge bg="rgba(59, 130, 246, 0.1)" color="#3b82f6" px="2" py="0.5" borderRadius="md" fontSize="10px">
                                                    {food.carbs}g C
                                                </Badge>
                                                <Badge bg="rgba(245, 158, 11, 0.1)" color="#f59e0b" px="2" py="0.5" borderRadius="md" fontSize="10px">
                                                    {food.fat}g F
                                                </Badge>
                                                <IconButton
                                                    aria-label="Add food"
                                                    icon={<FiPlus />}
                                                    size="xs"
                                                    colorScheme="red"
                                                    variant="ghost"
                                                />
                                            </HStack>
                                        </Flex>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Stack>

                    {/* RIGHT panel */}
                    <Stack spacing="4">
                        {/* Hydration */}
                        <HydrationTracker current={waterCurrent} total={waterTotal} onLogWater={handleLogWater} />

                        {/* Hydration Countdown */}
                        <HydrationCountdown
                            current={waterCurrent}
                            target={waterTotal}
                            startTime={summary?.waterReminderStartTime}
                            endTime={summary?.waterReminderEndTime}
                            onRemind={() => {
                                toast({
                                    title: 'Time to drink water! 🥛',
                                    description: `Còn ${Math.max(0, waterTotal - waterCurrent)} cốc nước cần uống.`,
                                    status: 'success',
                                    duration: 5000,
                                    isClosable: true,
                                })
                                triggerTestWaterReminder()
                            }}
                        />

                        {/* Water Reminder Schedule */}
                        <WaterReminderSettings
                            startTime={summary?.waterReminderStartTime || '07:00'}
                            endTime={summary?.waterReminderEndTime || '22:00'}
                        />

                        {/* Test Water Reminder Button */}
                        <TestWaterReminderButton />

                        {/* AI Recommendation */}
                        <AIDietPlanCard 
                            dietPlan={latestDiet?.dietPlan}
                            onNavigateToAI={() => navigate('/ai-chat')}
                        />

                        {/* Quick Macros Summary */}
                        <Box
                            bg="#141720"
                            border="1px solid"
                            borderColor="#1e2028"
                            borderRadius="14px"
                            p="4"
                        >
                            <Text fontSize="11px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="3">
                                Daily Summary
                            </Text>
                            <Stack spacing="2">
                                {[
                                    { label: 'Total Calories', val: '1,850 / 2,400', pct: 77 },
                                    { label: 'Protein', val: '140 / 180g', pct: 78 },
                                    { label: 'Water', val: `${waterCurrent} / ${waterTotal} Glasses`, pct: waterTotal > 0 ? Math.round((waterCurrent / waterTotal) * 100) : 0 },
                                ].map((s, i) => (
                                    <Box key={i}>
                                        <Flex justify="space-between" mb="1">
                                            <Text fontSize="11px" color="#8A8A93">{s.label}</Text>
                                            <Text fontSize="11px" color="white" fontWeight="600">{s.val}</Text>
                                        </Flex>
                                        <Box h="2px" bg="#1e2028" borderRadius="full">
                                            <Box
                                                h="full"
                                                borderRadius="full"
                                                bg="#E03030"
                                                style={{ width: `${s.pct}%` }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
            </Box>
        </MemberLayout>
    )
}

/* ── Water Reminder Settings ─────────────────── */
const WaterReminderSettings: React.FC<{ startTime: string; endTime: string }> = ({ startTime, endTime }) => {
    const [start, setStart] = useState(startTime)
    const [end, setEnd] = useState(endTime)
    const [saving, setSaving] = useState(false)
    const toast = useToast()

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateReminderSettings(start, end)
            toast({ title: 'Reminder schedule saved', status: 'success', duration: 2000, isClosable: true })
        } catch {
            toast({ title: 'Failed to save', status: 'error', duration: 2000, isClosable: true })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="14px" p="4">
            <Flex justify="space-between" align="center" mb="3">
                <Text fontSize="11px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">
                    Water Reminder
                </Text>
                <Box
                    as="button"
                    fontSize="11px" fontWeight="600"
                    color="#E03030"
                    _hover={{ color: '#ff6b6b' }}
                    onClick={handleSave}
                >
                    {saving ? 'Saving...' : 'Save'}
                </Box>
            </Flex>
            <Flex gap="2" align="center">
                <Box flex="1">
                    <Text fontSize="10px" color="#8A8A93" mb="1">From</Text>
                    <Box
                        as="input"
                        type="time"
                        value={start}
                        onChange={(e: any) => setStart(e.target.value)}
                        bg="#0A0C10" border="1px solid" borderColor="#1e2028"
                        borderRadius="8px" color="white" fontSize="13px"
                        p="2" w="full"
                        _focus={{ borderColor: '#E03030', outline: 'none' }}
                    />
                </Box>
                <Box flex="1">
                    <Text fontSize="10px" color="#8A8A93" mb="1">To</Text>
                    <Box
                        as="input"
                        type="time"
                        value={end}
                        onChange={(e: any) => setEnd(e.target.value)}
                        bg="#0A0C10" border="1px solid" borderColor="#1e2028"
                        borderRadius="8px" color="white" fontSize="13px"
                        p="2" w="full"
                        _focus={{ borderColor: '#E03030', outline: 'none' }}
                    />
                </Box>
            </Flex>
        </Box>
    )
}

/* ── Test Water Reminder Button ─────────────── */
const TestWaterReminderButton: React.FC = () => {
    const toast = useToast()
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            await triggerTestWaterReminder()
            toast({
                title: 'Water Reminder Sent! 🥛',
                description: 'Check your notifications to log water.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch {
            toast({
                title: 'Failed to send reminder',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            as="button"
            w="full"
            bg="#141720"
            border="1px dashed"
            borderColor="#2e3040"
            borderRadius="14px"
            p="3"
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: '#E03030', bg: '#1a1c24' }}
            transition="all 0.2s"
            onClick={handleClick}
        >
            <Text fontSize="12px" fontWeight="600" color={loading ? '#E03030' : '#8A8A93'}>
                {loading ? 'Sending...' : '🔔 Test Water Reminder Notification'}
            </Text>
        </Box>
    )
}

export default Nutrition