import React from 'react'
import { Box, Grid, Heading, Text } from '@chakra-ui/react'
import { FiCalendar, FiUsers, FiStar, FiDollarSign } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import PTLayout from '../../components/shared/Layout/PTLayout'
import StatCard from '../../features/pt/components/StatCard'
import ScheduleTimeline from '../../features/pt/components/ScheduleTimeline'
import ActivityFeed from '../../features/pt/components/ActivityFeed'
import ContentLibrary from '../../features/pt/components/ContentLibrary'
import { adminColors } from '../admin/AdminPrimitives'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const PTDashboard: React.FC = () => {
    const { data: stats } = useSWR('/pt/dashboard/stats', fetcher)

    const formatCurrency = (val: number) => {
        if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
        if (val >= 1_000)     return `${(val / 1_000).toFixed(0)}K`
        return val.toLocaleString()
    }

    const earningsLabel  = `Earnings (${stats?.monthName ?? '...'})`
    const earningsValue  = stats?.monthlyEarnings != null
        ? `${formatCurrency(stats.monthlyEarnings)} ₫`
        : '—'

    const statCards = [
        {
            label: 'Sessions This Week',
            value: stats?.sessionsThisWeek?.toString() ?? '0',
            trend: 'Total booked this week',
            icon: FiCalendar,
        },
        {
            label: 'Active Clients',
            value: stats?.activeClients?.toString() ?? '0',
            trend: 'Total distinct clients',
            icon: FiUsers,
        },
        {
            label: 'Avg Rating',
            value: '4.9',
            trend: 'Based on 142 reviews',
            icon: FiStar,
            trendUp: false,
        },
        {
            label: earningsLabel,
            value: earningsValue,
            trend: 'Total from confirmed sessions',
            icon: FiDollarSign,
            trendUp: false,
            highlight: true,
        },
    ]

    return (
        <PTLayout title="PT Portal">
            <Box maxW="1440px" mx="auto">
                {/* Header — date badge removed */}
                <Box mb="6">
                    <Heading fontSize="22px" fontWeight="700" color={adminColors.text} letterSpacing="-0.02em">
                        Overview
                    </Heading>
                    <Text fontSize="12px" color={adminColors.dim} mt="1">
                        Your performance matrix for this week.
                    </Text>
                </Box>

                {/* Stat cards */}
                <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4" mb="6">
                    {statCards.map((card, i) => (
                        <StatCard key={i} {...card} />
                    ))}
                </Grid>

                {/* Today's Schedule — full width, EarningsChart removed */}
                <Box mb="5">
                    <ScheduleTimeline />
                </Box>

                {/* Recent Activity + Content Library */}
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="5">
                    <ActivityFeed />
                    <ContentLibrary />
                </Grid>
            </Box>
        </PTLayout>
    )
}

export default PTDashboard
