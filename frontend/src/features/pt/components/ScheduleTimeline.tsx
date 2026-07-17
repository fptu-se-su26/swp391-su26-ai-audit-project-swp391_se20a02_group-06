import React from 'react'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiClock } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'
import ScheduleSlot from './ScheduleSlot'

export interface SlotData {
    time: string
    ampm: string
    name: string
    type: string
    status: 'completed' | 'next' | 'pending'
    avatar?: string
    initials?: string
}

interface ScheduleTimelineProps {
    slots: SlotData[]
}

const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ slots }) => (
    <Box
        bg={adminColors.surface}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={adminColors.surfaceVariant}
        overflow="hidden"
    >
        <Flex
            justify="space-between"
            align="center"
            px="5" py="4"
            borderBottomWidth="1px"
            borderColor={adminColors.surfaceVariant}
            bg={adminColors.surfaceHigh}
        >
            <Flex align="center" gap="2">
                <Icon as={FiClock} color={adminColors.primary} boxSize="16px" />
                <Text fontSize="16px" fontWeight="600" color={adminColors.text}>
                    Today's Schedule
                </Text>
            </Flex>
            <Text
                fontSize="13px" color={adminColors.dim} cursor="pointer"
                _hover={{ color: adminColors.primary }}
            >
                View All
            </Text>
        </Flex>
        <Box px="4" py="2">
            {slots.map((slot, i) => (
                <ScheduleSlot key={i} slot={slot} />
            ))}
        </Box>
    </Box>
)

export default ScheduleTimeline
