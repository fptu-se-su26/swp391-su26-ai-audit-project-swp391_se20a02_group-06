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
  IconButton,
} from '@chakra-ui/react'
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiDroplet,
  FiZap,
  FiActivity,
} from 'react-icons/fi'
import AppButton from '../../components/shared/Button/AppButton'
import MemberLayout from '../../components/shared/Layout/MemberLayout'
import {
  AIDinnerCard,
  DonutRing,
  FoodItem,
  HydrationTracker,
  MacroCard,
  MealSection,
} from '../../features/nutrition/components/NutritionWidgets'

/* ── Nutrition Page ─────────────────────────── */
const Nutrition: React.FC = () => {
  const dateStr = 'Oct 24, 2025'

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
        <Grid templateColumns="1fr 280px" gap="5">
          {/* LEFT */}
          <Stack spacing="5">
            {/* Calorie + Macros Row */}
            <Grid templateColumns="1fr 1fr 1fr 1fr" gap="3">
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

            {/* Dinner placeholder */}
            <MealSection
              label="Dinner"
              kcal={750}
              items={
                <Box
                  p="4"
                  bg="#0f1117"
                  border="1px dashed"
                  borderColor="#2e3040"
                  borderRadius="12px"
                  textAlign="center"
                >
                  <Text fontSize="12px" color="#8A8A93">
                    No meals logged yet
                  </Text>
                  <Text fontSize="11px" color="#6a6a73" mt="1">
                    Use the AI recommendation →
                  </Text>
                </Box>
              }
            />
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
