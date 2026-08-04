import React, { useState, useEffect } from 'react'
import {
    Box,
    Flex,
    Grid,
    Heading,
    Text,
    Stack,
    HStack,
    useToast,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from '@chakra-ui/react'
import { FiLock } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
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
import { muscleShapes } from '../data/muscleShapes'
import { getMuscleGroups } from '../../../api/muscleGroups'
import { getWeeklyPlanAccess } from '../../../api/workouts'

interface WorkoutSetupProps {
    onComplete: (data: WorkoutFormData) => void
}

/* ─── Main Wizard ──────────────────────────── */
const WorkoutSetup: React.FC<WorkoutSetupProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0)
    const TOTAL = 3
    const toast = useToast()
    const [hasWeeklyAccess, setHasWeeklyAccess] = useState(false)
    const [requiredPackageName, setRequiredPackageName] = useState<string>('cao cấp nhất')
    const [showInjuryWarning, setShowInjuryWarning] = useState(false)
    const navigate = useNavigate()

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
        injuries: [],
        targetCalories: 300,
    })

    const [muscleZones, setMuscleZones] = useState<{ id: string; label: string; d: string }[]>(muscleShapes)

    useEffect(() => {
        const fetchMusclesAndAccess = async () => {
            try {
                const apiMuscles = await getMuscleGroups()
                const mappedZones = apiMuscles.map(apiM => {
                    const shape = muscleShapes.find(s => s.label.toLowerCase() === apiM.name.toLowerCase() || s.id === apiM.name.toLowerCase())
                    return {
                        id: apiM.name.toLowerCase(),
                        label: apiM.name,
                        d: shape?.d || ''
                    }
                })
                setMuscleZones(mappedZones)

                // Quyen truy cap Weekly Plan lay truc tiep tu backend (cung nguon voi check o API ai-generate-weekly)
                const access = await getWeeklyPlanAccess()
                setHasWeeklyAccess(access.hasAccess)
                if (access.requiredPackageName) setRequiredPackageName(access.requiredPackageName)
            } catch (err) {
                console.error("Failed to fetch data:", err)
            }
        }
        fetchMusclesAndAccess()
    }, [])

    const set = (key: keyof WorkoutFormData, value: WorkoutFormData[keyof WorkoutFormData]) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const toggleMuscle = (val: string) =>
        setForm((prev) => ({
            ...prev,
            muscles: prev.muscles.includes(val)
                ? prev.muscles.filter(m => m !== val)
                : [...prev.muscles, val],
        }))

    const toggleInjury = (val: string) =>
        setForm((prev) => {
            const exists = prev.injuries.find((i) => i.id === val)
            return {
                ...prev,
                injuries: exists
                    ? prev.injuries.filter((i) => i.id !== val)
                    : [...prev.injuries, { id: val, severity: 1 }],
            }
        })

    const updateInjurySeverity = (val: string, severity: number) => {
        setForm((prev) => ({
            ...prev,
            injuries: prev.injuries.map(i => i.id === val ? { ...i, severity } : i)
        }))
    }

    const canNext = () => {
        if (step === 0) {
            if (form.planType === 'weekly' && !hasWeeklyAccess) return false
            return !!form.planType
        }
        if (step === 1) return !!form.goal
        if (step === 2) return form.muscles.length > 0
        return true
    }

    const next = () => {
        if (step < TOTAL - 1) {
            setStep((s) => s + 1)
        } else {
            const hasSevereInjury = form.injuries.some(i => i.severity >= 4)
            if (form.injuries.length >= 2 || (form.injuries.length === 1 && hasSevereInjury)) {
                setShowInjuryWarning(true)
            } else {
                onComplete(form)
            }
        }
    }
    const back = () => setStep((s) => s - 1)

    const stepMeta = [
        { title: 'Plan Type', sub: 'Do you want a single day or a full week plan?' },
        { title: 'Training Goal', sub: 'Choose your main goal for the AI to adjust your program.' },
        { title: 'Target Muscles', sub: 'Select the target muscles you want AISTHEA to focus on.' },
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
                    {/* ── STEP 1: Goal selection ── */}
                    {step === 1 && (
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

                    {/* ── STEP 2: Target muscles ── */}
                    {step === 2 && (
                        <Flex gap="5" h="100%">
                            {/* Left: step sidebar */}
                            <Box w="160px" flexShrink={0}>
                                <Stack spacing="4" mb="5">
                                    {[
                                        { label: 'Plan', sub: 'Daily or Weekly', done: true },
                                        { label: 'Goal', sub: 'Goal & Level', active: true },
                                        { label: 'Muscles', sub: 'Muscle Targeting', done: false },
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
                                                            onClick={() => toggleMuscle(m)}
                                                        >
                                                            ×
                                                        </Box>
                                                    </HStack>
                                                )
                                            })}
                                        </Flex>
                                    </Box>
                                )}

                                {/* Selected injuries chips */}
                                {form.planType === 'weekly' && form.injuries.length > 0 && (
                                    <Box mt="3">
                                        <Text fontSize="9px" fontWeight="700" color="#E03030" textTransform="uppercase" letterSpacing="wider" mb="2">
                                            Injuries / Pain
                                        </Text>
                                        <Flex flexWrap="wrap" gap="1">
                                            {form.injuries.map((m) => {
                                                const zone = muscleZones.find((z) => z.id === m.id)
                                                return (
                                                    <HStack
                                                        key={m.id}
                                                        spacing="1"
                                                        px="2"
                                                        py="1"
                                                        bg="rgba(224,48,48,0.1)"
                                                        borderRadius="6px"
                                                        border="1px solid"
                                                        borderColor="#E03030"
                                                    >
                                                        <Text fontSize="10px" color="#E03030">{zone?.label ?? m.id} (Lvl {m.severity})</Text>
                                                        <Box
                                                            fontSize="10px"
                                                            color="#E03030"
                                                            cursor="pointer"
                                                            _hover={{ color: 'white' }}
                                                            onClick={() => toggleInjury(m.id)}
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
                                <BodyDiagram selected={form.muscles} onToggle={(id) => toggleMuscle(id)} muscleZones={muscleZones} />
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
                                            onClick={() => toggleMuscle(z.id)}
                                        />
                                    ))}
                                    <OptionChip
                                        label="Full Body"
                                        selected={form.muscles.length === muscleZones.length && muscleZones.length > 0}
                                        onClick={() => {
                                            setForm((p) => ({
                                                ...p,
                                                muscles: p.muscles.length === muscleZones.length ? [] : muscleZones.map((z) => z.id),
                                            }))
                                        }}
                                    />
                                </Flex>

                                {form.planType === 'weekly' && (
                                    <>
                                        <Flex
                                            justify="center"
                                            mt="5"
                                            align="center"
                                            gap="2"
                                            px="4"
                                            py="2"
                                            bg="rgba(224,48,48,0.1)"
                                            borderRadius="full"
                                            w="fit-content"
                                            mx="auto"
                                        >
                                            <Text fontSize="12px" color="#E03030" fontWeight="600">Are you experiencing pain or injury in any muscle group?</Text>
                                        </Flex>

                                        <Flex flexWrap="wrap" gap="2" justify="center" mt="3">
                                            {muscleZones.map((z) => {
                                                const injury = form.injuries.find((i) => i.id === z.id)
                                                const isInjured = !!injury
                                                return (
                                                    <Box key={z.id}>
                                                        <Box
                                                            px="3"
                                                            py="1.5"
                                                            borderRadius="full"
                                                            border="1px solid"
                                                            borderColor={isInjured ? '#E03030' : '#2e3040'}
                                                            bg={isInjured ? 'rgba(224,48,48,0.2)' : 'transparent'}
                                                            color={isInjured ? 'white' : '#8A8A93'}
                                                            fontSize="12px"
                                                            cursor="pointer"
                                                            transition="all 0.2s"
                                                            _hover={{ borderColor: '#E03030' }}
                                                            onClick={() => toggleInjury(z.id)}
                                                        >
                                                            {z.label}
                                                        </Box>
                                                        {isInjured && (
                                                            <HStack mt="2" spacing="1" justify="center">
                                                                {[1, 2, 3, 4, 5].map(lvl => (
                                                                    <Box
                                                                        key={lvl}
                                                                        w="18px" h="18px"
                                                                        borderRadius="full"
                                                                        bg={injury.severity >= lvl ? '#E03030' : '#2e3040'}
                                                                        cursor="pointer"
                                                                        onClick={() => updateInjurySeverity(z.id, lvl)}
                                                                        fontSize="10px"
                                                                        fontWeight="bold"
                                                                        display="flex"
                                                                        alignItems="center"
                                                                        justifyContent="center"
                                                                        color="white"
                                                                        title={`Severity: ${lvl}`}
                                                                    >
                                                                        {lvl}
                                                                    </Box>
                                                                ))}
                                                            </HStack>
                                                        )}
                                                    </Box>
                                                )
                                            })}
                                        </Flex>
                                    </>
                                )}
                            </Box>
                        </Flex>
                    )}

                    {/* ── STEP 0: Plan Type ── */}
                    {step === 0 && (
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
                                    cursor={hasWeeklyAccess ? 'pointer' : 'not-allowed'}
                                    opacity={hasWeeklyAccess ? 1 : 0.55}
                                    transition="all 0.2s"
                                    onClick={() => {
                                        if (!hasWeeklyAccess) {
                                            toast({
                                                title: 'Tính năng Premium',
                                                description: `Bạn cần đăng ký gói "${requiredPackageName}" để dùng Weekly Plan. Bấm để xem các gói.`,
                                                status: 'warning',
                                                duration: 5000,
                                                isClosable: true,
                                                position: 'top',
                                            })
                                            navigate('/pricing')
                                            return
                                        }
                                        set('planType', 'weekly')
                                    }}
                                    _hover={{ borderColor: form.planType === 'weekly' ? '#E03030' : (!hasWeeklyAccess ? '#2e3040' : '#3e4050') }}
                                >
                                    <Flex justify="space-between" align="center" mb="2">
                                        <Heading fontSize="18px" fontWeight="800" color={form.planType === 'weekly' ? 'white' : '#E2E1EB'}>
                                            Weekly
                                        </Heading>
                                        {!hasWeeklyAccess && (
                                            <HStack spacing="1.5" px="2" py="0.5" bg="rgba(224,48,48,0.15)" borderRadius="full" border="1px solid" borderColor="#E03030">
                                                <Icon as={FiLock} color="#E03030" boxSize="10px" />
                                                <Text fontSize="9px" fontWeight="700" color="#E03030" textTransform="uppercase" letterSpacing="wider">
                                                    {requiredPackageName}
                                                </Text>
                                            </HStack>
                                        )}
                                    </Flex>
                                    <Text fontSize="13px" color="#8A8A93">
                                        Generate a personalized weekly plan aligned with your schedule.
                                    </Text>
                                </Box>
                            </Grid>
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

            {/* Injury Warning Modal */}
            <Modal isOpen={showInjuryWarning} onClose={() => setShowInjuryWarning(false)} isCentered>
                <ModalOverlay />
                <ModalContent bg="#111318" border="1px solid #1e2028" color="white" borderRadius="16px">
                    <ModalHeader color="#E03030">Health Warning</ModalHeader>
                    <ModalBody>
                        <Text fontSize="15px" color="#E2E1EB">
                            You should rest and take care your health before doing exercises!
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        {form.injuries.length >= 2 ? (
                            <Button
                                bg="#E03030"
                                color="white"
                                _hover={{ bg: '#C02020' }}
                                onClick={() => navigate('/dashboard')}
                            >
                                Exit
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    color="#8A8A93"
                                    _hover={{ bg: '#1e2028', color: 'white' }}
                                    mr={3}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Exit
                                </Button>
                                <Button
                                    bg="#E03030"
                                    color="white"
                                    _hover={{ bg: '#C02020' }}
                                    onClick={() => {
                                        setShowInjuryWarning(false)
                                        onComplete(form)
                                    }}
                                >
                                    Continue
                                </Button>
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default WorkoutSetup