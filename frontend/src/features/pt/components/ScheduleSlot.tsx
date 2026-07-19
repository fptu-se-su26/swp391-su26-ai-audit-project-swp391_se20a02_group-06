import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { adminColors } from '../../../pages/admin/AdminPrimitives'
import type { SlotData } from './ScheduleTimeline'

const statusBadge = {
    completed: {
        label: 'Completed',
        color: '#4ade80',
        bg: 'rgba(74,222,128,0.1)',
        border: 'rgba(74,222,128,0.3)',
    },
    next: {
        label: 'Next',
        color: adminColors.primary,
        bg: `${adminColors.primary}10`,
        border: `${adminColors.primary}4D`,
    },
    pending: {
        label: 'Pending',
        color: adminColors.dim,
        bg: adminColors.surfaceMid,
        border: adminColors.surfaceVariant,
    },
}

interface ScheduleSlotProps {
    slot: SlotData
}

const ScheduleSlot: React.FC<ScheduleSlotProps> = ({ slot }) => {
    const badge = statusBadge[slot.status]
    const isNext = slot.status === 'next'
    const isPending = slot.status === 'pending'

    return (
        <Flex
            direction={{ base: 'column', sm: 'row' }}
            gap="4" py="3" px="2"
            position="relative"
            borderRadius="lg"
            _hover={{ bg: 'rgba(51,52,60,0.3)' }}
            transition="background 0.2s"
        >
            <Box w={{ sm: '60px' }} flexShrink={0} textAlign={{ sm: 'right' }} pt="1">
                <Text fontSize="16px" fontWeight="600" color={adminColors.text} lineHeight="1.2">
                    {slot.time}
                </Text>
                <Text fontSize="10px" fontWeight="700" color={adminColors.dim} textTransform="uppercase" letterSpacing="0.05em">
                    {slot.ampm}
                </Text>
            </Box>

            <Box
                flex="1"
                bg={isNext ? adminColors.surfaceHigh : adminColors.surfaceMid}
                borderWidth="1px"
                borderColor={isNext ? `${adminColors.primary}4D` : adminColors.surfaceVariant}
                borderRadius="lg" p="4"
                position="relative" overflow="hidden"
            >
                {isNext && (
                    <Box position="absolute" left="0" top="0" bottom="0" w="4px" bg={adminColors.primary} />
                )}
                <Flex justify="space-between" align="center" wrap="wrap" gap="3">
                    <Flex align="center" gap="3">
                        <Box
                            w="36px" h="36px" borderRadius="full" overflow="hidden"
                            bg={adminColors.surfaceHigh}
                            borderWidth="1px" borderColor={adminColors.surfaceVariant}
                            flexShrink={0} display="flex" alignItems="center" justifyContent="center"
                        >
                            {slot.avatar ? (
                                <Box
                                    as="img" src={slot.avatar}
                                    w="full" h="full" objectFit="cover"
                                    filter={isPending ? 'grayscale(1)' : undefined}
                                />
                            ) : (
                                <Text fontSize="14px" fontWeight="600" color={adminColors.dim}>
                                    {slot.initials}
                                </Text>
                            )}
                        </Box>
                        <Box>
                            <Text fontSize="14px" fontWeight="600" color={adminColors.text}>{slot.name}</Text>
                            <Text fontSize="12px" color={adminColors.dim}>{slot.type}</Text>
                        </Box>
                    </Flex>
                    <Flex align="center" gap="3">
                        <Flex
                            as="span" px="2" py="0.5" borderRadius="md"
                            borderWidth="1px" borderColor={badge.border}
                            color={badge.color} bg={badge.bg}
                            fontSize="9px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em"
                            display={isNext ? { base: 'none', sm: 'inline-flex' } : 'inline-flex'}
                        >
                            {badge.label}
                        </Flex>
                        {isNext && (
                            <Box
                                as="button"
                                bg={adminColors.primary} color="white"
                                borderRadius="full" px="4" py="1.5"
                                fontSize="13px" fontWeight="600"
                                _hover={{ bg: adminColors.primarySoft, color: adminColors.surface }}
                                transition="all 0.15s"
                            >
                                Start
                            </Box>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    )
}

export default ScheduleSlot
