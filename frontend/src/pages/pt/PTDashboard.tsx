import React from 'react'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { FiCalendar, FiUsers, FiStar, FiDollarSign, FiCheckCircle, FiMessageSquare, FiUserPlus } from 'react-icons/fi'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import StatCard from '../../features/pt/components/StatCard'
import ScheduleTimeline from '../../features/pt/components/ScheduleTimeline'
import EarningsChart from '../../features/pt/components/EarningsChart'
import ActivityFeed from '../../features/pt/components/ActivityFeed'
import ContentLibrary from '../../features/pt/components/ContentLibrary'
import { adminColors } from '../admin/AdminPrimitives'
import type { SlotData } from '../../features/pt/components/ScheduleTimeline'

const statCards = [
    { label: 'Sessions This Week', value: '24', trend: '+3 from last week', icon: FiCalendar },
    { label: 'Active Clients', value: '18', trend: '+2 new', icon: FiUsers },
    { label: 'Avg Rating', value: '4.9', trend: 'Based on 142 reviews', icon: FiStar },
    { label: 'Earnings (Oct)', value: '$4,250', trend: '+12% vs Sep', icon: FiDollarSign, highlight: true },
] as const

const todaySlots: SlotData[] = [
    { time: '08:00', ampm: 'AM', name: 'Sarah Jenkins', type: '1-on-1 • Strength Focus', status: 'completed', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiTVd15cCxagvFy--NUjsE2L80OekVMlrXEFlJEkZyNnqKJrzx3tWIRoOlESrP1hEJ7IbtdXBMxZ44Vrk7chJglwk2fos4KWX7hMeiRlO096uApzuXCJpOGEHUwDgtNJs52Xb-zF8B2bvGkw5RRsRg7ggQCtbZeovO4nNjv3_Q6aht2mlJEEq8C1-_HLxiaah4tGTJ1JI56ZYDTPt19RCHH4-UEiMvcKgB_l_rxALHPesasLy46dn4G0LBiZJpP8ah73Ql4oaz95eM' },
    { time: '10:30', ampm: 'AM', name: 'Marcus Reed', type: 'Group Virtual • HIIT', status: 'next', initials: 'MR' },
    { time: '14:00', ampm: 'PM', name: 'David Chen', type: 'Consultation • Mobility', status: 'pending', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlssBLAoEhwo21QxgaeBJCjKSUnucqF6rxX5oPcFilOj_FRXwssrQ836W_-jyrLBmBVimaZfrX5N81gBCSgO080xd9BT4BH2XtWVjTQ_LLyb9MkHOQOjguavD5EBvyvekpLzylzXz17VJTC18oysK4LpiyjyjuNzz09dVgNy_mLZBiq4G1ocjFx1M4u6fNiGDOlSHouSJkC-O4PX0l4hvzxao7_Vc7HP06nnom-zm59w0jkis6obh0q6rP1crpIaQWUz2HoBv80tEJ' },
] as const

const activities = [
    { icon: FiCheckCircle, iconColor: '#4ade80', text: <><Text as="span" fontWeight="700">Sarah J.</Text> completed <Text as="span" color={adminColors.dim}>Core Crusher V2</Text></>, time: '45 mins ago' },
    { icon: FiMessageSquare, iconColor: adminColors.primary, text: <><Text as="span" fontWeight="700">Marcus R.</Text> sent a message regarding form check.</>, time: '2 hours ago' },
    { icon: FiStar, iconColor: adminColors.dim, text: <><Text as="span" fontWeight="700">David C.</Text> left a 5-star review for yesterday's session.</>, time: 'Yesterday' },
    { icon: FiUserPlus, iconColor: adminColors.dim, text: <>New client <Text as="span" fontWeight="700">Emma W.</Text> signed up for Premium Tier.</>, time: 'Yesterday' },
] as const

const PTDashboard: React.FC = () => (
    <AdminLayout title="PT Portal">
        <Box maxW="1440px" mx="auto">
            <Flex justify="space-between" align="flex-end" mb="6">
                <Box>
                    <Heading fontSize="22px" fontWeight="700" color={adminColors.text} letterSpacing="-0.02em">Overview</Heading>
                    <Text fontSize="12px" color={adminColors.dim} mt="1">Your performance matrix for this week.</Text>
                </Box>
                <Flex
                    as="span" fontSize="10px" fontWeight="700" letterSpacing="0.05em" textTransform="uppercase"
                    color={adminColors.dim} bg={adminColors.surfaceMid}
                    px="3" py="1.5" borderRadius="full"
                    borderWidth="1px" borderColor={adminColors.surfaceVariant}
                >
                    Oct 24 - Oct 30
                </Flex>
            </Flex>

            <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4" mb="6">
                {statCards.map((card, i) => (
                    <StatCard key={i} {...card} />
                ))}
            </Grid>

            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="5" mb="5">
                <ScheduleTimeline slots={todaySlots as SlotData[]} />
                <EarningsChart />
            </Grid>

            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="5">
                <ActivityFeed items={activities as any} />
                <ContentLibrary />
            </Grid>
        </Box>
    </AdminLayout>
)

export default PTDashboard
