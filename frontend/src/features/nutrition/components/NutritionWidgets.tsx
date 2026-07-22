import React from 'react'
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
import { FiCpu, FiDroplet, FiPlus } from 'react-icons/fi'
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

export const HydrationTracker: React.FC<{ 
    current: number; 
    total: number;
    onLogWater?: () => void;
}> = ({ current, total, onLogWater }) => (
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
            {Array.from({ length: Math.max(total, current) }).map((_, i) => (
                <Box
                    key={i}
                    w="28px"
                    h="34px"
                    borderRadius="8px"
                    bg={i < current ? 'rgba(59,130,246,0.3)' : '#1e2028'}
                    border="1px solid"
                    borderColor={i < current ? 'rgba(59,130,246,0.5)' : '#2e3040'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.2s"
                    cursor={i === current && onLogWater ? "pointer" : "default"}
                    _hover={i === current && onLogWater ? { borderColor: 'rgba(59,130,246,0.7)', transform: 'translateY(-2px)' } : {}}
                    onClick={() => {
                        if (i === current && onLogWater) {
                            onLogWater()
                        }
                    }}
                >
                    <Icon as={FiDroplet} color={i < current ? '#3b82f6' : '#3e4050'} boxSize="12px" />
                </Box>
            ))}
            {/* Thêm nút + nếu user muốn uống thêm sau khi đạt target */}
            {onLogWater && current >= total && (
                 <Box
                 w="28px"
                 h="34px"
                 borderRadius="8px"
                 bg="#1e2028"
                 border="1px dashed"
                 borderColor="#2e3040"
                 display="flex"
                 alignItems="center"
                 justifyContent="center"
                 cursor="pointer"
                 transition="all 0.2s"
                 _hover={{ borderColor: 'rgba(59,130,246,0.7)', color: '#3b82f6' }}
                 onClick={onLogWater}
             >
                 <Icon as={FiPlus} color="#3e4050" boxSize="12px" />
             </Box>
            )}
        </Flex>
    </Box>
)

export const AIDinnerCard: React.FC = () => {
    const items = [
        { name: 'Lean Steak (200g)', macro: 'PRO 52g' },
        { name: 'Sweet Potato Mash', macro: 'CARB 40g' },
        { name: 'Asparagus', macro: 'FIBER 8g' },
    ]

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
                <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider">
                    Dinner Plan
                </Text>
            </Flex>
            <Stack spacing="2" mb="3">
                {items.map((item, i) => (
                    <Flex key={i} align="center" justify="space-between" py="1">
                        <HStack spacing="2">
                            <Box w="5px" h="5px" borderRadius="full" bg="#E03030" flexShrink={0} />
                            <Text fontSize="12px" color="#E2E1EB">
                                {item.name}
                            </Text>
                        </HStack>
                        <HStack spacing="2">
                            <Text fontSize="10px" color="#8A8A93">
                                {item.macro}
                            </Text>
                            <Box
                                w="18px"
                                h="18px"
                                borderRadius="full"
                                border="1px solid"
                                borderColor="#2e3040"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                _hover={{ borderColor: '#E03030', color: '#E03030' }}
                            >
                                <Icon as={FiPlus} boxSize="10px" color="#8A8A93" />
                            </Box>
                        </HStack>
                    </Flex>
                ))}
            </Stack>
            <AppButton
                label="Add All"
                variant="outline"
                size="sm"
                w="full"
                h="32px"
                fontSize="11px"
                borderColor="#2e3040"
                _hover={{ borderColor: '#E03030', color: '#E03030' }}
            />
        </Box>
    )
}