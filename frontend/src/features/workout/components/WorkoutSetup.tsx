import React, { useState } from 'react'
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Stack,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import AppButton from '../../../components/shared/Button/AppButton'
import type { WorkoutFormData } from '../types/workout'
import {
  BodyDiagram,
  GoalCard,
  LevelPill,
  OptionChip,
  SectionLabel,
  StepDots,
} from './WorkoutSetupControls'
import { muscleZones } from '../data/muscleZones'

interface WorkoutSetupProps {
  onComplete: (data: WorkoutFormData) => void
}

/* ─── Main Wizard ──────────────────────────── */
const WorkoutSetup: React.FC<WorkoutSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const TOTAL = 4

  const [form, setForm] = useState<WorkoutFormData>({
    goal: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    level: 'Intermediate',
    duration: 30,
    frequency: 3,
    equipment: [],
    muscles: [],
    targetCalories: 300,
  })

  const set = (key: keyof WorkoutFormData, value: WorkoutFormData[keyof WorkoutFormData]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleArr = (key: 'equipment' | 'muscles', val: string) =>
    setForm((prev) => {
      const arr = prev[key] as string[]
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      }
    })

  const canNext = () => {
    if (step === 0) return !!form.goal
    if (step === 1) return !!form.gender && !!form.age && !!form.height && !!form.weight
    if (step === 2) return form.muscles.length > 0
    return true
  }

  const next = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1)
    else onComplete(form)
  }
  const back = () => setStep((s) => s - 1)

  /* Step titles */
  const stepMeta = [
    { title: 'Mục tiêu tập luyện', sub: 'Chọn mục tiêu chính để AI hiệu chỉnh chương trình.' },
    { title: 'Thông tin cơ bản', sub: 'Giúp AI tính toán chương trình phù hợp với bạn.' },
    { title: 'Nhóm cơ muốn tập', sub: 'Chọn vùng cơ bạn muốn AISTHEA tập trung vào.' },
    { title: 'Điều kiện & Lịch tập', sub: 'Tuỳ chỉnh thời lượng, tần suất và dụng cụ.' },
  ]

  return (
    <Box
      minH="100vh"
      bg="#0A0C10"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="4"
    >
      {/* Card */}
      <Box
        w="full"
        maxW="680px"
        bg="#111318"
        border="1px solid"
        borderColor="#1e2028"
        borderRadius="24px"
        overflow="hidden"
        boxShadow="0 32px 80px rgba(0,0,0,0.6)"
      >
        {/* Header */}
        <Box px="8" pt="7" pb="2" textAlign="center">
          <Heading fontSize="22px" fontWeight="900" color="white" letterSpacing="-0.02em" mb="1">
            AISTHEA
          </Heading>
          <Text fontSize="12px" color="#8A8A93" mb="5">
            Step {step + 1} of {TOTAL}
          </Text>
          <StepDots current={step} total={TOTAL} />
          <Heading fontSize="20px" fontWeight="800" color="white" mb="1">
            {stepMeta[step].title}
          </Heading>
          <Text fontSize="13px" color="#8A8A93" mb="6">
            {stepMeta[step].sub}
          </Text>
        </Box>

        {/* Body */}
        <Box px="8" pb="6">
          {/* ── STEP 0: Goal selection ── */}
          {step === 0 && (
            <Stack spacing="5">
              <SectionLabel>Chọn mục tiêu của bạn</SectionLabel>
              <Grid templateColumns="repeat(2, 1fr)" gap="3">
                {[
                  { id: 'lose_weight', label: 'Giảm cân' },
                  { id: 'build_muscle', label: 'Tăng cơ nhẹ' },
                  { id: 'stay_active', label: 'Giữ dáng' },
                  { id: 'endurance', label: 'Tăng sức bền' },
                  { id: 'health', label: 'Cải thiện sức khoẻ' },
                  { id: 'performance', label: 'Hiệu suất thể thao' },
                ].map((g) => (
                  <GoalCard
                    key={g.id}
                    label={g.label}
                    selected={form.goal === g.id}
                    onClick={() => set('goal', g.id)}
                  />
                ))}
              </Grid>

              <Box>
                <SectionLabel>Mức độ hiện tại</SectionLabel>
                <HStack spacing="2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lv) => (
                    <LevelPill
                      key={lv}
                      label={lv}
                      selected={form.level === lv}
                      onClick={() => set('level', lv)}
                    />
                  ))}
                </HStack>
              </Box>
            </Stack>
          )}

          {/* ── STEP 1: Basic info ── */}
          {step === 1 && (
            <Stack spacing="4">
              <Box>
                <SectionLabel>Giới tính</SectionLabel>
                <HStack spacing="3">
                  {[
                    { id: 'male', label: 'Nam' },
                    { id: 'female', label: 'Nữ' },
                  ].map((g) => (
                    <Box
                      key={g.id}
                      flex="1"
                      py="3"
                      borderRadius="12px"
                      border="1.5px solid"
                      borderColor={form.gender === g.id ? '#E03030' : '#2e3040'}
                      bg={form.gender === g.id ? 'rgba(224,48,48,0.1)' : '#141720'}
                      cursor="pointer"
                      textAlign="center"
                      transition="all 0.15s"
                      onClick={() => set('gender', g.id)}
                    >
                      <Text fontSize="15px" fontWeight="700" color={form.gender === g.id ? 'white' : '#8A8A93'}>
                        {g.label}
                      </Text>
                    </Box>
                  ))}
                </HStack>
              </Box>

              <Grid templateColumns="repeat(3, 1fr)" gap="3">
                {[
                  { key: 'age' as const, label: 'Tuổi', unit: 'tuổi', placeholder: '25' },
                  { key: 'height' as const, label: 'Chiều cao', unit: 'cm', placeholder: '170' },
                  { key: 'weight' as const, label: 'Cân nặng', unit: 'kg', placeholder: '65' },
                ].map((field) => (
                  <Box key={field.key}>
                    <SectionLabel>{field.label}</SectionLabel>
                    <InputGroup size="md">
                      <Input
                        type="number"
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={(e) => set(field.key, e.target.value)}
                        bg="#0f1117"
                        border="1.5px solid"
                        borderColor="#2e3040"
                        color="white"
                        borderRadius="10px"
                        h="44px"
                        _placeholder={{ color: '#4e5060' }}
                        _focus={{ borderColor: '#E03030', boxShadow: '0 0 0 1px #E03030' }}
                        _hover={{ borderColor: '#3e4050' }}
                      />
                      <InputRightAddon
                        bg="#1e2028"
                        border="1.5px solid"
                        borderColor="#2e3040"
                        color="#8A8A93"
                        fontSize="11px"
                        fontWeight="600"
                        h="44px"
                        borderRadius="0 10px 10px 0"
                      >
                        {field.unit}
                      </InputRightAddon>
                    </InputGroup>
                  </Box>
                ))}
              </Grid>

              {/* BMI preview */}
              {form.height && form.weight && (
                <Box
                  p="4"
                  bg="rgba(224,48,48,0.06)"
                  border="1px solid"
                  borderColor="rgba(224,48,48,0.2)"
                  borderRadius="12px"
                >
                  <Flex justify="space-between">
                    <Text fontSize="12px" color="#8A8A93">BMI ước tính</Text>
                    <Text fontSize="13px" fontWeight="700" color="#E03030">
                      {(Number(form.weight) / (Number(form.height) / 100) ** 2).toFixed(1)}
                    </Text>
                  </Flex>
                </Box>
              )}
            </Stack>
          )}

          {/* ── STEP 2: Target muscles ── */}
          {step === 2 && (
            <Flex gap="5" h="100%">
              {/* Left: step sidebar */}
              <Box w="160px" flexShrink={0}>
                <Stack spacing="4" mb="5">
                  {[
                    { label: 'Mục tiêu', sub: 'Goal & Level', done: true },
                    { label: 'Cơ bản', sub: 'Age, Weight, Goal', done: true },
                    { label: 'Nhóm cơ', sub: 'Muscle Targeting', active: true },
                    { label: 'Lịch tập', sub: 'Availability', done: false },
                  ].map((item, i) => (
                    <HStack key={i} spacing="3" align="flex-start">
                      <Box
                        w="18px"
                        h="18px"
                        borderRadius="full"
                        bg={item.done ? '#E03030' : item.active ? '#E03030' : '#2e3040'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                        mt="2px"
                      >
                        <Text fontSize="9px" fontWeight="800" color={item.done || item.active ? 'white' : '#8A8A93'}>
                          {i + 1}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontSize="13px"
                          fontWeight={item.active ? '700' : '500'}
                          color={item.active ? 'white' : item.done ? '#E2E1EB' : '#8A8A93'}
                        >
                          {item.label}
                        </Text>
                        <Text fontSize="10px" color="#4e5060">{item.sub}</Text>
                      </Box>
                    </HStack>
                  ))}
                </Stack>

                {/* Selected zones chips */}
                {form.muscles.length > 0 && (
                  <Box>
                    <Text fontSize="9px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="2">
                      Selected Zones
                    </Text>
                    <Flex flexWrap="wrap" gap="1">
                      {form.muscles.map((m) => {
                        const zone = muscleZones.find((z) => z.id === m)
                        return (
                          <HStack
                            key={m}
                            spacing="1"
                            px="2"
                            py="1"
                            bg="#1e2028"
                            borderRadius="6px"
                            border="1px solid"
                            borderColor="#2e3040"
                          >
                            <Text fontSize="10px" color="#E2E1EB">{zone?.label ?? m}</Text>
                            <Box
                              fontSize="10px"
                              color="#8A8A93"
                              cursor="pointer"
                              _hover={{ color: '#E03030' }}
                              onClick={() => toggleArr('muscles', m)}
                            >
                              ×
                            </Box>
                          </HStack>
                        )
                      })}
                    </Flex>
                  </Box>
                )}
              </Box>

              {/* Right: body diagram */}
              <Box flex="1">
                <BodyDiagram selected={form.muscles} onToggle={(id) => toggleArr('muscles', id)} />
                <Flex
                  justify="center"
                  mt="3"
                  align="center"
                  gap="2"
                  px="4"
                  py="2"
                  bg="#1e2028"
                  borderRadius="full"
                  w="fit-content"
                  mx="auto"
                >
                  <Text fontSize="12px" color="#8A8A93">Chọn vùng cơ trên hình</Text>
                </Flex>

                {/* Also allow clicking muscle chips */}
                <Flex flexWrap="wrap" gap="2" justify="center" mt="3">
                  {muscleZones.map((z) => (
                    <OptionChip
                      key={z.id}
                      label={z.label}
                      selected={form.muscles.includes(z.id)}
                      onClick={() => toggleArr('muscles', z.id)}
                    />
                  ))}
                  <OptionChip
                    label="Toàn thân"
                    selected={form.muscles.length === muscleZones.length}
                    onClick={() => {
                      if (form.muscles.length === muscleZones.length) {
                        setForm((p) => ({ ...p, muscles: [] }))
                      } else {
                        setForm((p) => ({ ...p, muscles: muscleZones.map((z) => z.id) }))
                      }
                    }}
                  />
                </Flex>
              </Box>
            </Flex>
          )}

          {/* ── STEP 3: Schedule & conditions ── */}
          {step === 3 && (
            <Stack spacing="5">
              {/* Duration */}
              <Box>
                <SectionLabel>Thời gian mỗi buổi tập</SectionLabel>
                <HStack spacing="2" flexWrap="wrap">
                  {[10, 20, 30, 45].map((d) => (
                    <OptionChip
                      key={d}
                      label={`${d} phút`}
                      selected={form.duration === d}
                      onClick={() => set('duration', d)}
                    />
                  ))}
                </HStack>
              </Box>

              {/* Frequency */}
              <Box>
                <SectionLabel>Tần suất mỗi tuần</SectionLabel>
                <HStack spacing="2">
                  {[3, 4, 5].map((f) => (
                    <OptionChip
                      key={f}
                      label={`${f} buổi/tuần`}
                      selected={form.frequency === f}
                      onClick={() => set('frequency', f)}
                    />
                  ))}
                </HStack>
              </Box>

              {/* Equipment */}
              <Box>
                <SectionLabel>Dụng cụ hiện có</SectionLabel>
                <HStack spacing="2" flexWrap="wrap">
                  {[
                    { id: 'none', label: 'Không dụng cụ' },
                    { id: 'mat', label: 'Thảm tập' },
                    { id: 'bands', label: 'Dây kháng lực' },
                  ].map((eq) => (
                    <OptionChip
                      key={eq.id}
                      label={eq.label}
                      selected={form.equipment.includes(eq.id)}
                      onClick={() => toggleArr('equipment', eq.id)}
                      multi
                    />
                  ))}
                </HStack>
              </Box>

              {/* Target calories */}
              <Box>
                <SectionLabel>Lượng Calories muốn đốt</SectionLabel>
                <HStack spacing="2" mb="3">
                  {[100, 200, 300, 400, 500].map((c) => (
                    <OptionChip
                      key={c}
                      label={`${c} kcal`}
                      selected={form.targetCalories === c}
                      onClick={() => set('targetCalories', c)}
                    />
                  ))}
                </HStack>
                <Box
                  p="3"
                  bg="rgba(224,48,48,0.06)"
                  border="1px solid"
                  borderColor="rgba(224,48,48,0.2)"
                  borderRadius="10px"
                >
                  <Flex justify="space-between" align="center">
                    <Text fontSize="12px" color="#8A8A93">Mục tiêu đốt cháy</Text>
                    <Text fontSize="16px" fontWeight="800" color="#E03030">
                      {form.targetCalories} <Text as="span" fontSize="11px" fontWeight="400">kcal</Text>
                    </Text>
                  </Flex>
                </Box>
              </Box>

              {/* Summary preview */}
              <Box
                p="4"
                bg="#0f1117"
                border="1px solid"
                borderColor="#1e2028"
                borderRadius="14px"
              >
                <Text fontSize="11px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="3">
                  Tóm tắt chương trình
                </Text>
                <Grid templateColumns="repeat(4, 1fr)" gap="3">
                  {[
                    { val: form.level, label: 'Level' },
                    { val: `${form.duration}m`, label: 'Thời gian' },
                    { val: `${form.frequency}x`, label: 'Tuần' },
                    { val: `${form.targetCalories}`, label: 'kcal' },
                  ].map((s, i) => (
                    <Box key={i} textAlign="center">
                      <Text fontSize="14px" fontWeight="800" color="white">{s.val}</Text>
                      <Text fontSize="9px" color="#8A8A93">{s.label}</Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
            </Stack>
          )}
        </Box>

        {/* Footer nav */}
        <Flex
          px="8"
          py="5"
          borderTop="1px solid"
          borderColor="#1e2028"
          justify="space-between"
          align="center"
        >
          {step > 0 ? (
            <AppButton
              label="Back"
              variant="outline"
              h="42px"
              px="5"
              fontSize="13px"
              onClick={back}
            />
          ) : (
            <Box />
          )}

          <AppButton
            label={step === TOTAL - 1 ? 'Tạo bài tập' : 'Continue'}
            variant="solid"
            h="42px"
            px="6"
            fontSize="13px"
            isDisabled={!canNext()}
            opacity={canNext() ? 1 : 0.4}
            onClick={next}
          />
        </Flex>
      </Box>
    </Box>
  )
}

export default WorkoutSetup
