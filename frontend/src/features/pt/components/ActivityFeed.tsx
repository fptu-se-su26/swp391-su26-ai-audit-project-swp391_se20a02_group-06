import React from 'react'
import { Box, Flex, Icon, Text, Spinner } from '@chakra-ui/react'
import { FiActivity, FiCalendar, FiZap } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'
import useSWR from 'swr'
import apiClient from '../../../lib/axios'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

interface BookingActivity {
    type: 'booking'
    memberName: string
    startTime: string
}

interface WorkoutActivity {
    type: 'workout'
    memberName: string
    workoutTitle: string
    completedAt: string
}

interface ActivityResponse {
    bookings: BookingActivity[]
    workouts: WorkoutActivity[]
}

const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const isFuture = diff < 0
    const absDiff = Math.abs(diff)
    
    const mins  = Math.floor(absDiff / 60000)
    const hours = Math.floor(absDiff / 3600000)
    const days  = Math.floor(absDiff / 86400000)
    
    let timeStr = ''
    if (mins < 60) timeStr = `${mins}m`
    else if (hours < 24) timeStr = `${hours}h`
    else timeStr = `${days}d`
    
    return isFuture ? `in ${timeStr}` : `${timeStr} ago`
}

const formatBookingTime = (iso: string) => {
    const d = new Date(iso)
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${time}, ${date}`
}

const ActivityFeed: React.FC = () => {
    const { data, isLoading } = useSWR<ActivityResponse>('/pt/dashboard/recent-activity', fetcher)

    // Merge and sort bookings + workouts together by time, newest first
    const items = [
        ...(data?.bookings ?? []).map(b => ({
            icon: FiCalendar,
            iconColor: adminColors.primary,
            text: (
                <>
                    <Text as="span" fontWeight="700">{b.memberName}</Text> booked a session for <Text as="span" color={adminColors.primary}>{formatBookingTime(b.startTime)}</Text>
                </>
            ),
            time: null,
        })),
        ...(data?.workouts ?? []).map(w => ({
            icon: FiZap,
            iconColor: '#4ade80',
            text: (
                <>
                    <Text as="span" fontWeight="700">{w.memberName}</Text> completed{' '}
                    <Text as="span" color={adminColors.dim}>{w.workoutTitle}</Text>
                </>
            ),
            time: timeAgo(w.completedAt),
        })),
    ]

    return (
        <Box bg={adminColors.surface} borderRadius="xl" borderWidth="1px" borderColor={adminColors.surfaceVariant} p="5">
            <Flex align="center" gap="2" mb="4" pb="3" borderBottomWidth="1px" borderColor={adminColors.surfaceVariant}>
                <Icon as={FiActivity} color={adminColors.dim} boxSize="16px" />
                <Text fontSize="16px" fontWeight="600" color={adminColors.text}>Recent Activity</Text>
            </Flex>

            {isLoading && (
                <Flex justify="center" py="6">
                    <Spinner color={adminColors.primary} />
                </Flex>
            )}

            {!isLoading && items.length === 0 && (
                <Flex justify="center" align="center" py="6">
                    <Text fontSize="13px" color={adminColors.dim}>No recent activity yet.</Text>
                </Flex>
            )}

            <Flex direction="column" gap="2">
                {items.map((item, i) => (
                    <Flex key={i} gap="3" p="2" borderRadius="lg" _hover={{ bg: 'rgba(51,52,60,0.5)' }} transition="background 0.2s">
                        <Flex
                            w="28px" h="28px" borderRadius="full"
                            bg={item.iconColor === '#4ade80' ? 'rgba(74,222,128,0.1)' : `${item.iconColor}18`}
                            color={item.iconColor}
                            align="center" justify="center" flexShrink={0} mt="0.5"
                            borderWidth="1px"
                            borderColor={item.iconColor === '#4ade80' ? 'rgba(74,222,128,0.3)' : `${item.iconColor}40`}
                        >
                            <Icon as={item.icon} boxSize="14px" />
                        </Flex>
                        <Box>
                            <Text fontSize="13px" color={adminColors.text}>{item.text}</Text>
                            {item.time && <Text fontSize="11px" color={adminColors.dim} mt="0.5">{item.time}</Text>}
                        </Box>
                    </Flex>
                ))}
            </Flex>
        </Box>
    )
}

export default ActivityFeed
