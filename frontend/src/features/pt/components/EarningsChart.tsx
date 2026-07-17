import React from 'react'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiBarChart2, FiMoreHorizontal } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'

interface BarData {
    label: string
    height: string
    value: string
    active?: boolean
    dashed?: boolean
}

const bars: BarData[] = [
    { label: 'W1', height: '40%', value: '$850' },
    { label: 'W2', height: '65%', value: '$1.1k' },
    { label: 'W3', height: '85%', value: '$1.4k', active: true },
    { label: 'W4', height: '100%', value: 'Proj', dashed: true },
]

const EarningsChart: React.FC = () => (
    <Box
        bg={adminColors.surface}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={adminColors.surfaceVariant}
        p="5"
        position="relative"
        overflow="hidden"
    >
        <Box
            position="absolute" top="0" right="0"
            w="32" h="32" bg={`${adminColors.primary}0D`}
            borderBottomLeftRadius="full" pointerEvents="none"
        />

        <Flex justify="space-between" align="flex-start" mb="5">
            <Box>
                <Text fontSize="16px" fontWeight="600" color={adminColors.text}>Earnings Trajectory</Text>
                <Text fontSize="12px" color={adminColors.dim} mt="0.5">Last 4 Weeks</Text>
            </Box>
            <Icon as={FiMoreHorizontal} color={adminColors.dim} boxSize="18px" cursor="pointer" _hover={{ color: adminColors.text }} />
        </Flex>

        <Box
            h="160px" display="flex" alignItems="flex-end" justifyContent="space-between" gap="2"
            mt="4" position="relative"
            borderBottomWidth="1px" borderColor={adminColors.surfaceVariant} pb="3"
        >
            {bars.map((bar, i) => (
                <Flex key={i} direction="column" align="center" gap="2" flex="1" position="relative" zIndex={1}>
                    <Box
                        w="full" maxW="32px"
                        bg={bar.active ? adminColors.primary : adminColors.surfaceMid}
                        borderRadius="md" h={bar.height}
                        borderWidth={bar.dashed ? '1px' : '0'}
                        borderStyle={bar.dashed ? 'dashed' : undefined}
                        borderColor={bar.dashed ? adminColors.surfaceVariant : undefined}
                        opacity={bar.dashed ? 0.7 : 1}
                        _hover={{ bg: bar.active ? adminColors.primary : adminColors.dim }}
                        transition="background 0.2s"
                        boxShadow={bar.active ? `0 0 12px ${adminColors.primary}33` : undefined}
                    >
                        <Text
                            position="absolute" top="-24px" left="50%" transform="translateX(-50%)"
                            fontSize="10px" fontWeight="700"
                            color={bar.active ? adminColors.primary : adminColors.dim}
                            whiteSpace="nowrap"
                        >
                            {bar.value}
                        </Text>
                    </Box>
                    <Text fontSize="10px" fontWeight="700" color={bar.active ? adminColors.text : adminColors.dim} textTransform="uppercase">
                        {bar.label}
                    </Text>
                </Flex>
            ))}
        </Box>

        <Flex justify="space-between" align="center" mt="4">
            <Box>
                <Text fontSize="12px" color={adminColors.dim}>Projected Total</Text>
                <Text fontSize="22px" fontWeight="700" color={adminColors.text}>$5,100</Text>
            </Box>
            <Flex
                w="36px" h="36px" borderRadius="full"
                bg={adminColors.surfaceMid} align="center" justify="center"
                color={adminColors.primary} borderWidth="1px" borderColor={adminColors.surfaceVariant}
            >
                <Icon as={FiBarChart2} boxSize="16px" />
            </Flex>
        </Flex>
    </Box>
)

export default EarningsChart
