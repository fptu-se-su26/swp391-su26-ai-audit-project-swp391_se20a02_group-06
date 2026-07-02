import React, { useState } from 'react'
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
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AppButton from '../../components/shared/Button/AppButton'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'
import {
    AIDinnerCard,
    DonutRing,
    FoodItem,
    HydrationTracker,
    MacroCard,
    MealSection,
} from '../../features/nutrition/components/NutritionWidgets.tsx'

const fetcher = (url: string) => apiClient.get(url).then((res) => res.data)

/* ── Nutrition Page ─────────────────────────── */
const Nutrition: React.FC = () => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch foods from API
    const { data: foods, isLoading, error } = useSWR('/foods', fetcher)

    const filteredFoods = foods?.filter((food: any) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

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
                        <HydrationTracker current={6} total={8} />

                        {/* AI Recommendation */}
                        <AIDinnerCard />

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
                                    { label: 'Water', val: '6 / 8 Glasses', pct: 75 },
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

export default Nutrition