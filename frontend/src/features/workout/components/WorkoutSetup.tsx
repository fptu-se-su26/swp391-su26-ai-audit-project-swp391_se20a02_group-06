import React, { useState } from 'react'
import {
    Box,
    Flex,
    Grid,
    Heading,
    Text,
    Stack,
    HStack,
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
        planType: 'daily',
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
        if (step === 1) return form.muscles.length > 0
        if (step === 2) return !!form.planType
        return true
    }

    const next = () => {
        if (step < TOTAL - 1) setStep((s) => s + 1)
        else onComplete(form)
    }
    const back = () => setStep((s) => s - 1)

    const stepMeta = [
        { title: 'Training Goal', sub: 'Choose your main goal for the AI to adjust your program.' },
        { title: 'Target Muscles', sub: 'Select the target muscles you want AISTHEA to focus on.' },
        { title: 'Plan Type', sub: 'Do you want a single day or a full week plan?' },
        { title: 'Availability & Schedule', sub: 'Customize duration, frequency, and equipment.' },
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
                            <SectionLabel>Select your goal</SectionLabel>
                            <Grid templateColumns="repeat(2, 1fr)" gap="3">
                                {[
                                    { id: 'lose_weight', label: 'Lose Weight' },
                                    { id: 'build_muscle', label: 'Build Muscle' },
                                    { id: 'stay_active', label: 'Stay Active' },
                                    { id: 'endurance', label: 'Increase Endurance' },
                                    { id: 'health', label: 'Improve Health' },
                                    { id: 'performance', label: 'Sports Performance' },
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
                                <SectionLabel>Current Level</SectionLabel>
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

                    {/* ── STEP 1: Target muscles ── */}
                    {step === 1 && (
                        <Flex gap="5" h="100%">
                            {/* Left: step sidebar */}
                            <Box w="160px" flexShrink={0}>
                                <Stack spacing="4" mb="5">
                                    {[
                                        { label: 'Goal', sub: 'Goal & Level', done: true },
                                        { label: 'Muscles', sub: 'Muscle Targeting', active: true },
                                        { label: 'Plan', sub: 'Daily or Weekly', done: false },
                                        { label: 'Schedule', sub: 'Availability', done: false },
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
                                    <Text fontSize="12px" color="#8A8A93">Select target muscles</Text>
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
                                        label="Full Body"
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

                    {/* ── STEP 2: Plan Type ── */}
                    {step === 2 && (
                        <Stack spacing="5">
                            <SectionLabel>Select plan type</SectionLabel>
                            <Grid templateColumns="repeat(2, 1fr)" gap="4">
                                <Box
                                    p="5"
                                    bg={form.planType === 'daily' ? 'rgba(224,48,48,0.1)' : '#141720'}
                                    border="1.5px solid"
                                    borderColor={form.planType === 'daily' ? '#E03030' : '#2e3040'}
                                    borderRadius="16px"
                                    cursor="pointer"
                                    transition="all 0.2s"
                                    onClick={() => set('planType', 'daily')}
                                    _hover={{ borderColor: form.planType === 'daily' ? '#E03030' : '#3e4050' }}
                                >
                                    <Heading fontSize="18px" fontWeight="800" color={form.planType === 'daily' ? 'white' : '#E2E1EB'} mb="2">
                                        Daily
                                    </Heading>
                                    <Text fontSize="13px" color="#8A8A93">
                                        Generate a quick single workout session for today.
                                    </Text>
                                </Box>
                                <Box
                                    p="5"
                                    bg={form.planType === 'weekly' ? 'rgba(224,48,48,0.1)' : '#141720'}
                                    border="1.5px solid"
                                    borderColor={form.planType === 'weekly' ? '#E03030' : '#2e3040'}
                                    borderRadius="16px"
                                    cursor="pointer"
                                    transition="all 0.2s"
                                    onClick={() => set('planType', 'weekly')}
                                    _hover={{ borderColor: form.planType === 'weekly' ? '#E03030' : '#3e4050' }}
                                >
                                    <Heading fontSize="18px" fontWeight="800" color={form.planType === 'weekly' ? 'white' : '#E2E1EB'} mb="2">
                                        Weekly
                                    </Heading>
                                    <Text fontSize="13px" color="#8A8A93">
                                        Create a detailed weekly plan based on your frequency.
                                    </Text>
                                </Box>
                            </Grid>
                        </Stack>
                    )}

                    {/* ── STEP 3: Schedule & conditions ── */}
                    {step === 3 && (
                        <Stack spacing="5">
                            {/* Duration */}
                            <Box>
                                <SectionLabel>Workout Duration</SectionLabel>
                                <HStack spacing="2" flexWrap="wrap">
                                    {[10, 20, 30, 45].map((d) => (
                                        <OptionChip
                                            key={d}
                                            label={`${d} mins`}
                                            selected={form.duration === d}
                                            onClick={() => set('duration', d)}
                                        />
                                    ))}
                                </HStack>
                            </Box>

                            {/* Frequency */}
                            {form.planType === 'weekly' && (
                                <Box>
                                    <SectionLabel>Weekly Frequency</SectionLabel>
                                    <HStack spacing="2">
                                        {[3, 4, 5].map((f) => (
                                            <OptionChip
                                                key={f}
                                                label={`${f} sessions/week`}
                                                selected={form.frequency === f}
                                                onClick={() => set('frequency', f)}
                                            />
                                        ))}
                                    </HStack>
                                </Box>
                            )}

                            {/* Equipment */}
                            <Box>
                                <SectionLabel>Available Equipment</SectionLabel>
                                <HStack spacing="2" flexWrap="wrap">
                                    {[
                                        { id: 'none', label: 'No Equipment' },
                                        { id: 'mat', label: 'Yoga Mat' },
                                        { id: 'bands', label: 'Resistance Bands' },
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
                                <SectionLabel>Target Calories Burn</SectionLabel>
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
                                        <Text fontSize="12px" color="#8A8A93">Target Burn</Text>
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
                                    Program Summary
                                </Text>
                                <Grid templateColumns={form.planType === 'weekly' ? "repeat(4, 1fr)" : "repeat(3, 1fr)"} gap="3">
                                    {[
                                        { val: form.level, label: 'Level' },
                                        { val: `${form.duration}m`, label: 'Duration' },
                                        ...(form.planType === 'weekly' ? [{ val: `${form.frequency}x`, label: 'Week' }] : []),
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
                        label={step === TOTAL - 1 ? 'Generate Workout' : 'Continue'}
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