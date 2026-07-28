import React, { useCallback, useEffect, useState } from 'react'
import {
    Badge,
    Box,
    Flex,
    Heading,
    HStack,
    Icon,
    Image,
    Stack,
    Text,
} from '@chakra-ui/react'
import { FiClock, FiCpu, FiDroplet, FiPlus } from 'react-icons/fi'
import AppButton from '../../../components/shared/Button/AppButton'

export const DonutRing: React.FC<{ current: number; total: number }> = ({ current, total }) => {
    const pct = Math.min((current / total) * 100, 100)
    const r = 70
    const strokeW = 10
    const cx = 90
    const cy = 90
    const c = 2 * Math.PI * r
    const offset = c - (pct / 100) * c

    return (
        <Box position="relative" w="180px" h="180px" flexShrink={0}>
            <svg width="180" height="180">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2028" strokeWidth={strokeW} />
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="#E03030"
                    strokeWidth={strokeW}
                    strokeDasharray={c}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
            </svg>
            <Box position="absolute" inset="0" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Text fontSize="28px" fontWeight="900" color="white" lineHeight="1">
                    {current.toLocaleString()}
                </Text>
                <Text fontSize="12px" color="#8A8A93">
                    / {total.toLocaleString()} kcal
                </Text>
            </Box>
        </Box>
    )
}

export const MacroCard: React.FC<{
    label: string
    icon: React.ElementType
    current: number
    total: number
    unit: string
    color: string
}> = ({ label, icon, current, total, unit, color }) => (
    <Box
        bg="#141720"
        border="1px solid"
        borderColor="#1e2028"
        borderRadius="14px"
        p="4"
        flex="1"
    >
        <Flex justify="space-between" align="center" mb="3">
            <Text fontSize="13px" fontWeight="600" color="white">
                {label}
            </Text>
            <Box
                w="26px"
                h="26px"
                borderRadius="8px"
                bg="#1e2028"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Icon as={icon} color={color} boxSize="12px" />
            </Box>
        </Flex>
        <Text fontSize="26px" fontWeight="800" color="white" lineHeight="1">
            {current}
            <Text as="span" fontSize="12px" color="#8A8A93" fontWeight="400" ml="1">
                g
            </Text>
        </Text>
        <Text fontSize="11px" color="#8A8A93" mb="3">
            / {total}{unit}
        </Text>
        <Box h="3px" bg="#1e2028" borderRadius="full">
            <Box
                h="full"
                borderRadius="full"
                bg={color}
                style={{ width: `${Math.min((current / total) * 100, 100)}%` }}
                transition="width 1s ease"
            />
        </Box>
    </Box>
)

export const FoodItem: React.FC<{
    name: string
    serving: string
    kcal: number
    pro: number
    carb: number
    fat: number
    img?: string
}> = ({ name, serving, kcal, pro, carb, fat, img }) => (
    <Flex
        align="center"
        gap="3"
        p="3"
        bg="#0f1117"
        border="1px solid"
        borderColor="#1e2028"
        borderRadius="12px"
        transition="all 0.15s"
        _hover={{ borderColor: '#2e3040' }}
    >
        <Box
            w="44px"
            h="44px"
            borderRadius="10px"
            bg="#1e2028"
            overflow="hidden"
            flexShrink={0}
        >
            {img ? (
                <Image src={img} w="full" h="full" objectFit="cover" />
            ) : (
                <Box w="full" h="full" bg="#2a2d38" />
            )}
        </Box>
        <Box flex="1">
            <Text fontSize="13px" fontWeight="600" color="white">
                {name}
            </Text>
            <Text fontSize="11px" color="#8A8A93">
                {serving} • {kcal} kcal
            </Text>
        </Box>
        <HStack spacing="4" flexShrink={0}>
            {[
                { label: 'PRO', val: pro },
                { label: 'CARB', val: carb },
                { label: 'FAT', val: fat },
            ].map((m, i) => (
                <Box key={i} textAlign="center">
                    <Text fontSize="9px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">
                        {m.label}
                    </Text>
                    <Text fontSize="12px" fontWeight="700" color="#E2E1EB">
                        {m.val}g
                    </Text>
                </Box>
            ))}
        </HStack>
    </Flex>
)

export const MealSection: React.FC<{
    label: string
    kcal: number
    items: React.ReactNode
}> = ({ label, kcal, items }) => (
    <Box>
        <Flex justify="space-between" align="center" mb="3">
            <HStack spacing="2">
                <Text fontSize="14px" fontWeight="700" color="white">
                    {label}
                </Text>
                <Badge
                    bg="#1e2028"
                    color="#8A8A93"
                    fontSize="10px"
                    px="2"
                    py="0.5"
                    borderRadius="6px"
                >
                    {kcal} kcal
                </Badge>
            </HStack>
            <AppButton
                label={
                    <HStack spacing="1">
                        <Icon as={FiPlus} boxSize="12px" />
                        <Text>Add Food</Text>
                    </HStack>
                }
                variant="ghost"
                size="sm"
                h="28px"
                fontSize="12px"
                color="#8A8A93"
                _hover={{ color: '#E03030' }}
            />
        </Flex>
        <Stack spacing="2">{items}</Stack>
    </Box>
)

export const HydrationTracker: React.FC<{ current: number; total: number; onLogWater?: () => void }> = ({ current, total, onLogWater }) => (
    <Box
        bg="#141720"
        border="1px solid"
        borderColor="#1e2028"
        borderRadius="14px"
        p="4"
    >
        <Flex justify="space-between" align="center" mb="3">
            <Heading fontSize="14px" fontWeight="700" color="white">
                Hydration
            </Heading>
            <Text fontSize="11px" color="#8A8A93">
                {current} / {total} Glasses
            </Text>
        </Flex>
        <Flex gap="2" flexWrap="wrap">
            {Array.from({ length: total }).map((_, i) => {
                const filled = i < current
                const isNext = i === current
                return (
                    <Box
                        key={i}
                        w="28px"
                        h="34px"
                        borderRadius="8px"
                        bg={filled ? 'rgba(59,130,246,0.3)' : '#1e2028'}
                        border="1px solid"
                        borderColor={isNext && current < total ? 'rgba(59,130,246,0.7)' : filled ? 'rgba(59,130,246,0.5)' : '#2e3040'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        transition="all 0.2s"
                        cursor={isNext && onLogWater ? 'pointer' : 'default'}
                        _hover={isNext && onLogWater ? { bg: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6' } : undefined}
                        onClick={() => { if (isNext && onLogWater) onLogWater() }}
                    >
                        <Icon as={FiDroplet} color={filled ? '#3b82f6' : '#3e4050'} boxSize="12px" />
                    </Box>
                )
            })}
        </Flex>
    </Box>
)

export const HydrationCountdown: React.FC<{
    current: number
    target: number
    startTime?: string
    endTime?: string
    onRemind?: () => void
}> = ({ current, target, startTime, endTime, onRemind }) => {
    const [display, setDisplay] = useState('--:--')
    const [progress, setProgress] = useState(0)
    const [endTimestamp, setEndTimestamp] = useState(0)
    const [totalInterval, setTotalInterval] = useState(0)

    const calcInterval = useCallback(() => {
        const remaining = target - current
        if (remaining <= 0) {
            setDisplay('Done!')
            setProgress(1)
            setEndTimestamp(0)
            return
        }

        const now = new Date()
        const start = startTime || '07:00'
        const end = endTime || '22:00'
        const [startH, startM] = start.split(':').map(Number)
        const [endH, endM] = end.split(':').map(Number)
        const startMin = startH * 60 + startM
        const endMin = endH * 60 + endM
        const nowMin = now.getHours() * 60 + now.getMinutes()

        if (nowMin >= endMin || nowMin < startMin) {
            setDisplay(nowMin >= endMin ? 'Tomorrow' : '--:--')
            setProgress(0)
            setEndTimestamp(0)
            return
        }

        const hoursLeft = (endMin - nowMin) / 60
        const intervalMs = (hoursLeft / remaining) * 3600 * 1000
        setTotalInterval(intervalMs)
        setEndTimestamp(Date.now() + intervalMs)
    }, [current, target, startTime, endTime])

    useEffect(() => {
        calcInterval()
    }, [calcInterval])

    useEffect(() => {
        if (endTimestamp <= 0) return

        const tick = () => {
            const remaining = endTimestamp - Date.now()
            if (remaining <= 0) {
                setDisplay('00:00')
                setProgress(1)
                if (onRemind) onRemind()
                calcInterval()
                return
            }

            const mins = Math.floor(remaining / 60000)
            const secs = Math.floor((remaining % 60000) / 1000)
            setDisplay(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
            setProgress(1 - remaining / totalInterval)
        }

        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [endTimestamp, totalInterval])

    return (
        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="14px" p="4">
            <Flex align="center" justify="space-between" mb="2">
                <HStack spacing="2">
                    <Icon as={FiClock} color="teal.300" boxSize="14px" />
                    <Text fontSize="12px" fontWeight="700" color="white">
                        Next glass in
                    </Text>
                </HStack>
                <Text fontSize="18px" fontWeight="800" color="teal.300" fontFamily="mono">
                    {display}
                </Text>
            </Flex>
            <Box h="4px" bg="#1e2028" borderRadius="full" overflow="hidden">
                <Box
                    h="full"
                    borderRadius="full"
                    bg="teal.400"
                    style={{ width: `${Math.min(progress * 100, 100)}%`, transition: 'width 1s linear' }}
                />
            </Box>
        </Box>
    )
}

export const AIDietPlanCard: React.FC<{
    dietPlan?: any
    onNavigateToAI: () => void
}> = ({ dietPlan, onNavigateToAI }) => {
    if (!dietPlan) {
        return (
            <Box
                bg="#141720"
                border="1px dashed"
                borderColor="#2e3040"
                borderRadius="14px"
                p="4"
                textAlign="center"
            >
                <Icon as={FiCpu} color="#E03030" boxSize="24px" mb="2" />
                <Text fontSize="13px" fontWeight="600" color="white" mb="1">
                    Chưa có Thực đơn AI
                </Text>
                <Text fontSize="11px" color="#8A8A93" mb="3">
                    Hãy để trợ lý AI thiết kế thực đơn riêng cho bạn.
                </Text>
                <AppButton
                    label="Trò chuyện ngay"
                    variant="solid"
                    size="sm"
                    w="full"
                    h="32px"
                    fontSize="12px"
                    onClick={onNavigateToAI}
                />
            </Box>
        )
    }

    const firstMeal = dietPlan.meals?.[0]

    return (
        <Box
            bg="#141720"
            border="1px solid"
            borderColor="#1e2028"
            borderRadius="14px"
            p="4"
        >
            <Flex justify="space-between" align="center" mb="4">
                <HStack spacing="2">
                    <Icon as={FiCpu} color="#E03030" boxSize="13px" />
                    <Text fontSize="10px" fontWeight="700" color="#E03030" textTransform="uppercase" letterSpacing="wider">
                        AI Recommendation
                    </Text>
                </HStack>
                <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" maxW="100px" isTruncated>
                    {dietPlan.diet_title || 'Diet Plan'}
                </Text>
            </Flex>
            {firstMeal && (
                <>
                    <Text fontSize="12px" fontWeight="600" color="white" mb="2">
                        {firstMeal.name} - {firstMeal.calories} kcal
                    </Text>
                    <Stack spacing="2" mb="3">
                        {firstMeal.foods.map((item: any, i: number) => (
                            <Flex key={i} align="center" justify="space-between" py="1">
                                <HStack spacing="2" maxW="140px">
                                    <Box w="5px" h="5px" borderRadius="full" bg="#E03030" flexShrink={0} />
                                    <Text fontSize="12px" color="#E2E1EB" isTruncated>
                                        {item.food_name} ({item.amount})
                                    </Text>
                                </HStack>
                                <HStack spacing="2">
                                    <Text fontSize="10px" color="#8A8A93">
                                        PRO {item.protein}g
                                    </Text>
                                </HStack>
                            </Flex>
                        ))}
                    </Stack>
                </>
            )}
            <AppButton
                label="Xem toàn bộ"
                variant="outline"
                size="sm"
                w="full"
                h="32px"
                fontSize="11px"
                borderColor="#2e3040"
                _hover={{ borderColor: '#E03030', color: '#E03030' }}
                onClick={onNavigateToAI}
            />
        </Box>
    )
}