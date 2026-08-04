import React, { useState } from 'react'
import { Box, Grid, Heading, Text, Flex, Spinner, Button, Icon } from '@chakra-ui/react'
import { FiArrowLeft } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import MemberLayout from '../../components/shared/Layout/MemberLayout'

import PTBookingModal from '../../features/pt/components/PTBookingModal'
import PTCalendar from '../../features/pt/components/PTCalendar'
import PTCoachCard from '../../features/pt/components/PTCoachCard'
import PTSessionPanel from '../../features/pt/components/PTSessionPanel'
import { usePTBooking } from '../../features/pt/hooks/usePTBooking'
import type { Coach } from '../../features/pt/types/pt'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

interface PtDto {
    id: number
    name: string
    email: string
    rating: number | null
    experience: string
    status: string
    avatarUrl: string | null
    coachingPhilosophy?: string
    sessionRate?: number
}

const PTBooking: React.FC = () => {
    const { data: pts, error, isLoading } = useSWR<PtDto[]>('/pt', fetcher)
    const [selectedPt, setSelectedPt] = useState<Coach | null>(null)

    const booking = usePTBooking(selectedPt?.id ? parseInt(selectedPt.id) : null)

    const handlePtSelect = (pt: PtDto) => {
        setSelectedPt({
            id: pt.id.toString(),
            name: pt.name || 'Unknown Trainer',
            title: 'Elite Performance Coach', // Placeholder
            tagline: 'ELITE PERFORMANCE COACH',
            bio: pt.experience || 'Experienced personal trainer.',
            tags: ['Strength', 'Conditioning'],
            philosophy: pt.coachingPhilosophy,
            sessionRate: pt.sessionRate,
            isOnline: true,
            imageUrl: pt.avatarUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3',
            imageAlt: pt.name || 'Trainer',
        })
    }

    if (isLoading) return <MemberLayout><Flex justify="center" p="10"><Spinner color="#E03030" /></Flex></MemberLayout>
    if (error) return <MemberLayout><Text color="red.500" p="10">Failed to load PTs.</Text></MemberLayout>

    return (
        <MemberLayout>
            <Box px={{ base: '5', md: '7' }} py="6" maxW="1200px" minH="70vh">
                <Box mb="9">
                    {selectedPt ? (
                        <Flex align="center" gap="4">
                            <Button variant="ghost" color="#8A8A93" _hover={{ color: 'white', bg: 'rgba(255,255,255,0.05)' }} onClick={() => setSelectedPt(null)} leftIcon={<Icon as={FiArrowLeft} />}>
                                Back to PTs
                            </Button>
                            <Heading fontSize={{ base: '18px', md: '20px' }} fontWeight="800" color="#E2E1EB">
                                Book Session with {selectedPt.name}
                            </Heading>
                        </Flex>
                    ) : (
                        <Heading fontSize={{ base: '18px', md: '20px' }} fontWeight="800" color="#E2E1EB">
                            Select a Personal Trainer
                        </Heading>
                    )}
                </Box>

                {!selectedPt ? (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
                        {pts?.map(pt => {
                            const mockCoach: Coach = {
                                id: pt.id.toString(),
                                name: pt.name || 'Unknown Trainer',
                                title: 'Elite Performance Coach',
                                tagline: 'ELITE PERFORMANCE COACH',
                                bio: pt.experience || 'Experienced personal trainer ready to help you reach your goals.',
                                tags: ['Strength', 'Mobility'],
                                philosophy: pt.coachingPhilosophy,
                                sessionRate: pt.sessionRate,
                                isOnline: true,
                                imageUrl: pt.avatarUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3',
                                imageAlt: pt.name || 'Trainer',
                            }
                            return (
                                <Box key={pt.id} cursor="pointer" onClick={() => handlePtSelect(pt)} transition="all 0.2s" _hover={{ transform: 'translateY(-4px)' }}>
                                    <PTCoachCard coach={mockCoach} />
                                </Box>
                            )
                        })}
                    </Grid>
                ) : (
                    <Grid templateColumns={{ base: '1fr', xl: '390px minmax(0, 1fr)' }} gap={{ base: '6', xl: '8' }} alignItems="start">
                        <PTCoachCard coach={selectedPt} />

                        <Box bg="#141414" border="1px solid" borderColor="#262626" borderRadius="32px" p={{ base: '5', md: '6' }} minH={{ base: 'auto', xl: '820px' }} boxShadow="0 12px 32px rgba(0, 0, 0, 0.18)">
                            <PTCalendar weekLabel={booking.weekLabel} weekDays={booking.weekDays} selectedDayIdx={booking.selectedDayIdx} onSelectDay={booking.onSelectDay} onPrevWeek={booking.onPrevWeek} onNextWeek={booking.onNextWeek} />
                            <PTSessionPanel sessions={booking.sessions} onBookClick={booking.onBookClick} />
                        </Box>
                    </Grid>
                )}
            </Box>

            <PTBookingModal isOpen={booking.isModalOpen} session={booking.pendingSession} bookingForm={booking.bookingForm} onSessionTypeChange={booking.onSessionTypeChange} onNotesChange={booking.onNotesChange} onConfirm={booking.onConfirm} onSimulate={booking.onSimulate} onCancel={booking.onCancel} isSubmitting={booking.isSubmitting} />
        </MemberLayout>
    )
}

export default PTBooking
