import React from 'react'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiActivity } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'
import type { IconType } from 'react-icons'

interface ActivityItem {
    icon: IconType
    iconColor?: string
    text: React.ReactNode
    time: string
}

interface ActivityFeedProps {
    items: ActivityItem[]
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => (
    <Box bg={adminColors.surface} borderRadius="xl" borderWidth="1px" borderColor={adminColors.surfaceVariant} p="5">
        <Flex align="center" gap="2" mb="4" pb="3" borderBottomWidth="1px" borderColor={adminColors.surfaceVariant}>
            <Icon as={FiActivity} color={adminColors.dim} boxSize="16px" />
            <Text fontSize="16px" fontWeight="600" color={adminColors.text}>Recent Activity</Text>
        </Flex>
        <Flex direction="column" gap="2">
            {items.map((item, i) => (
                <Flex key={i} gap="3" p="2" borderRadius="lg" _hover={{ bg: 'rgba(51,52,60,0.5)' }} transition="background 0.2s">
                    <Flex
                        w="28px" h="28px" borderRadius="full"
                        bg={item.iconColor === '#4ade80' ? 'rgba(74,222,128,0.1)' : adminColors.surfaceHigh}
                        color={item.iconColor || adminColors.dim}
                        align="center" justify="center" flexShrink={0} mt="0.5"
                        borderWidth={item.iconColor !== '#4ade80' ? '1px' : '0'}
                        borderColor={adminColors.surfaceVariant}
                    >
                        <Icon as={item.icon} boxSize="14px" />
                    </Flex>
                    <Box>
                        <Text fontSize="13px" color={adminColors.text}>{item.text}</Text>
                        <Text fontSize="11px" color={adminColors.dim} mt="0.5">{item.time}</Text>
                    </Box>
                </Flex>
            ))}
        </Flex>
    </Box>
)

export default ActivityFeed
