import React from 'react'
import { Box, Flex, Icon, Text, Spinner } from '@chakra-ui/react'
import { FiClock, FiVideo } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'
import useSWR from 'swr'
import apiClient from '../../../lib/axios'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

interface ScheduleItem {
    id: number
    startTime: string
    endTime: string
    description: string | null
    meetingUrl: string | null
    status: string
    memberName: string | null
    memberEmail: string | null
}

const formatTime = (iso: string) => {
    const d = new Date(iso)
    const h = d.getHours()
    const m = d.getMinutes().toString().padStart(2, '0')
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return { time: `${hour12}:${m}`, ampm }
}

const ScheduleTimeline: React.FC = () => {
    const { data, isLoading } = useSWR<ScheduleItem[]>('/pt/dashboard/today-schedule', fetcher)

    return (
        <Box
            bg={adminColors.surface}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={adminColors.surfaceVariant}
            overflow="hidden"
        >
            {/* Header */}
            <Flex
                align="center"
                gap="2"
                px="5" py="4"
                borderBottomWidth="1px"
                borderColor={adminColors.surfaceVariant}
                bg={adminColors.surfaceHigh}
            >
                <Icon as={FiClock} color={adminColors.primary} boxSize="16px" />
                <Text fontSize="16px" fontWeight="600" color={adminColors.text}>
                    Today's Schedule
                </Text>
            </Flex>

            {/* Body */}
            <Box px="4" py="2">
                {isLoading && (
                    <Flex justify="center" py="8">
                        <Spinner color={adminColors.primary} />
                    </Flex>
                )}

                {!isLoading && (!data || data.length === 0) && (
                    <Flex justify="center" align="center" py="8">
                        <Text fontSize="13px" color={adminColors.dim}>No sessions scheduled for today.</Text>
                    </Flex>
                )}

                {data?.map((slot) => {
                    const { time, ampm } = formatTime(slot.startTime)
                    const isBooked = slot.status === 'Confirmed' || slot.status === 'Pending'
                    const hasMeet = !!slot.meetingUrl

                    return (
                        <Flex
                            key={slot.id}
                            direction={{ base: 'column', sm: 'row' }}
                            gap="4" py="3" px="2"
                            borderRadius="lg"
                            _hover={{ bg: 'rgba(51,52,60,0.3)' }}
                            transition="background 0.2s"
                        >
                            {/* Time column */}
                            <Box w={{ sm: '60px' }} flexShrink={0} textAlign={{ sm: 'right' }} pt="1">
                                <Text fontSize="16px" fontWeight="600" color={adminColors.text} lineHeight="1.2">
                                    {time}
                                </Text>
                                <Text fontSize="10px" fontWeight="700" color={adminColors.dim} textTransform="uppercase" letterSpacing="0.05em">
                                    {ampm}
                                </Text>
                            </Box>

                            {/* Session card */}
                            <Box
                                flex="1"
                                bg={adminColors.surfaceMid}
                                borderWidth="1px"
                                borderColor={adminColors.surfaceVariant}
                                borderRadius="lg" p="4"
                                position="relative" overflow="hidden"
                            >
                                <Flex justify="space-between" align="center" wrap="wrap" gap="3">
                                    <Box>
                                        {isBooked && slot.memberName ? (
                                            <>
                                                <Text fontSize="14px" fontWeight="600" color={adminColors.text}>
                                                    {slot.memberName}
                                                </Text>
                                                {slot.description && (
                                                    <Text fontSize="12px" color={adminColors.dim}>
                                                        {slot.description}
                                                    </Text>
                                                )}
                                            </>
                                        ) : (
                                            <Text fontSize="14px" fontWeight="600" color={adminColors.dim} fontStyle="italic">
                                                Available
                                            </Text>
                                        )}
                                    </Box>

                                    {isBooked && hasMeet && (
                                        <Box
                                            as="a"
                                            href={slot.meetingUrl!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            display="flex"
                                            alignItems="center"
                                            gap="2"
                                            bg={adminColors.primary}
                                            color="white"
                                            borderRadius="full"
                                            px="4" py="1.5"
                                            fontSize="13px"
                                            fontWeight="600"
                                            _hover={{ bg: adminColors.primarySoft, color: adminColors.surface }}
                                            transition="all 0.15s"
                                            flexShrink={0}
                                        >
                                            <Icon as={FiVideo} boxSize="13px" />
                                            Join Meet
                                        </Box>
                                    )}
                                </Flex>
                            </Box>
                        </Flex>
                    )
                })}
            </Box>
        </Box>
    )
}

export default ScheduleTimeline
