import React from 'react'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiTrendingUp } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'
import type { IconType } from 'react-icons'

interface StatCardProps {
    label: string
    value: string
    trend: string
    icon: IconType
    trendUp?: boolean
    highlight?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, trendUp = true, highlight = false }) => (
    <Box
        bg={adminColors.surface}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={adminColors.surfaceVariant}
        p="5"
        position="relative"
        overflow="hidden"
        _hover={{ borderColor: adminColors.dim }}
        transition="border-color 0.2s"
    >
        {highlight && (
            <Box
                position="absolute"
                inset="0"
                bgGradient="linear(to-br, rgba(224,48,48,0.05), transparent)"
                pointerEvents="none"
            />
        )}
        <Flex justify="space-between" align="flex-start" mb="4" position="relative">
            <Text fontSize="12px" color={adminColors.dim} textTransform="uppercase" letterSpacing="wider">
                {label}
            </Text>
            <Icon as={icon} color={adminColors.primary} boxSize="20px" opacity="0.8" />
        </Flex>
        <Box position="relative">
            <Text fontSize="32px" fontWeight="700" color={adminColors.text} lineHeight="1">
                {value}
            </Text>
            <Flex align="center" gap="1" mt="1.5">
                {trendUp && <Icon as={FiTrendingUp} color="#4ade80" boxSize="14px" />}
                <Text fontSize="12px" color={adminColors.dim}>{trend}</Text>
            </Flex>
        </Box>
    </Box>
)

export default StatCard
