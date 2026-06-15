import React, { useState } from 'react'
import {
  Badge,
  Box,
  Checkbox,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import AppButton from '../../../components/shared/Button/AppButton'
import MemberLayout from '../../../components/shared/Layout/MemberLayout'
import { generateExercises } from '../data/workoutExercises'
import type { ExerciseCardData, WorkoutFormData } from '../types/workout'

const WeekStrip: React.FC<{ selectedDay: number; onSelect: (i: number) => void }> = ({
  selectedDay,
  onSelect,
}) => {
  const days = [
    { label: 'MON', date: 12 },
    { label: 'TUE', date: 13 },
    { label: 'WED', date: 14 },
    { label: 'THU', date: 15 },
    { label: 'FRI', date: 16 },
    { label: 'SAT', date: 17 },
    { label: 'SUN', date: 18 },
  ]
  return (
    <HStack spacing="2">
      {days.map((d, i) => {
        const isActive = i === selectedDay
        return (
          <Box
            key={i}
            px="3"
            py="2"
            borderRadius="10px"
            bg={isActive ? '#E03030' : 'transparent'}
            border="1px solid"
            borderColor={isActive ? '#E03030' : '#1e2028'}
            cursor="pointer"
            textAlign="center"
            minW="48px"
            transition="all 0.15s"
            _hover={{ borderColor: isActive ? '#E03030' : '#3e4050' }}
            onClick={() => onSelect(i)}
          >
            <Text fontSize="9px" fontWeight="700" color={isActive ? 'rgba(255,255,255,0.8)' : '#8A8A93'} textTransform="uppercase" letterSpacing="wider">
              {d.label}
            </Text>
            <Text fontSize="15px" fontWeight="800" color={isActive ? 'white' : '#E2E1EB'} lineHeight="1.2">
              {d.date}
            </Text>
          </Box>
        )
      })}
    </HStack>
  )
}

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

const ExerciseCard: React.FC<ExerciseCardData> = ({
  index,
  name,
  tags,
  sets,
  setsLabel,
  isActive,
  isLocked,
  isDone,
}) => {
  const [marked, setMarked] = useState(false)
  return (
    <Flex
      align="center"
      gap="4"
      bg={isActive ? '#141720' : '#0f1117'}
      border="1px solid"
      borderColor={isActive ? '#E03030' : '#1e2028'}
      borderRadius="14px"
      p="4"
      opacity={isLocked ? 0.5 : 1}
      transition="all 0.2s"
      _hover={!isLocked ? { borderColor: isActive ? '#E03030' : '#2e3040' } : {}}
    >
      <Box
        w="30px" h="30px" borderRadius="full"
        bg={isDone ? '#E03030' : isActive ? '#E03030' : '#1e2028'}
        border="1px solid"
        borderColor={isDone || isActive ? '#E03030' : '#2e3040'}
        display="flex" alignItems="center" justifyContent="center" flexShrink={0}
      >
        <Text fontSize="11px" fontWeight="700" color={isDone || isActive ? 'white' : '#8A8A93'}>{index}</Text>
      </Box>

      <Box w="70px" h="52px" borderRadius="10px" overflow="hidden" bg="#1e2028" flexShrink={0} position="relative">
        <Box w="full" h="full" bg={`hsl(${index * 40 + 200}, 18%, 18%)`} />
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
        {isActive && (
          <Box mt="2">
            <AppButton label="Start Exercise" variant="solid" size="sm" h="30px" fontSize="12px" px="4" />
          </Box>
        )}
      </Box>

      <Box textAlign="right" flexShrink={0}>
        <Text fontSize="16px" fontWeight="800" color={isActive ? '#E03030' : isLocked ? '#8A8A93' : '#E2E1EB'}>{sets}</Text>
        <Text fontSize="9px" fontWeight="600" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">{setsLabel}</Text>
        {isActive && (
          <Flex align="center" gap="1" justify="flex-end" mt="2">
            <Checkbox isChecked={marked} onChange={(e) => setMarked(e.target.checked)} colorScheme="red" size="sm" />
            <Text fontSize="10px" color="#8A8A93">Mark Done</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}

const WorkoutResults: React.FC<{ data: WorkoutFormData; onReset: () => void }> = ({ data, onReset }) => {
  const [selectedDay, setSelectedDay] = useState(2)

  const goalNames: Record<string, string> = {
    lose_weight: 'Fat Burn Phase',
    build_muscle: 'Strength Phase',
    stay_active: 'Active Lifestyle',
    endurance: 'Endurance Phase',
    health: 'Health & Wellness',
    performance: 'Athletic Phase',
  }
  const diffMap: Record<string, string> = { Beginner: 'Low', Intermediate: 'High', Advanced: 'Max' }

  const exercises = generateExercises(data)
  const completedCount = exercises.filter((e) => e.isDone).length

  return (
    <MemberLayout>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Box flex="1" p="7" pb="28" maxW="900px">
          <Box mb="6"><WeekStrip selectedDay={selectedDay} onSelect={setSelectedDay} /></Box>

          <Flex align="center" gap="3" mb="1" flexWrap="wrap">
            <Heading fontSize="24px" fontWeight="800" color="white">
              Week 1 — {goalNames[data.goal] ?? 'Custom Phase'}
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
            display="inline-block" onClick={onReset}
          >
            Tạo lại bài tập mới
          </Text>

          <HStack spacing="3" mb="6">
            <MiniStat value={String(exercises.length)} label="Exercises" />
            <MiniStat value={`${data.targetCalories}`} label="Calories" />
            <MiniStat value={`${data.duration}m`} label="Duration" />
            <MiniStat value={diffMap[data.level] ?? 'Medium'} label="Difficulty" />
          </HStack>

          <Stack spacing="3">
            {exercises.map((ex) => <ExerciseCard key={ex.index} {...ex} />)}
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
                style={{ width: `${(completedCount / exercises.length) * 100}%` }}
                transition="width 0.5s ease"
              />
            </Box>
          </Box>
          <AppButton
            label="Complete Workout"
            variant="solid" h="40px" px="6" fontSize="13px"
          />
        </Box>
      </Box>
    </MemberLayout>
  )
}

export default WorkoutResults
