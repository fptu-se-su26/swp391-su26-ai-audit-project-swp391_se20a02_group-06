import React from 'react'
import { Box, Grid, Heading, Text } from '@chakra-ui/react'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'

import PTBookingModal from '../../features/pt/components/PTBookingModal.tsx'
import PTCalendar from '../../features/pt/components/PTCalendar.tsx'
import PTCoachCard from '../../features/pt/components/PTCoachCard.tsx'
import PTSessionPanel from '../../features/pt/components/PTSessionPanel.tsx'
import { usePTBooking } from '../../features/pt/hooks/usePTBooking'
import { MOCK_COACH } from '../../features/pt/types/pt'

const PTBooking: React.FC = () => {
    const booking = usePTBooking()

    return (
        <MemberLayout>
            <Box px={{ base: '5', md: '7' }} py="6" maxW="1200px" position="relative" minH="70vh">
                <Box
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                    borderRadius="16px"
                    pointerEvents="none"
                >
                    <Box bg="#1a1d27" border="1px solid" borderColor="#E03030" borderRadius="12px" px="8" py="4" boxShadow="0 0 30px rgba(224,48,48,0.25)">
                        <Text fontSize="28px" fontWeight="800" color="#E03030">
                            Coming Soon
                        </Text>
                    </Box>
                </Box>

                <Box mb="9">
                    <Heading fontSize={{ base: '18px', md: '20px' }} fontWeight="800" color="#E2E1EB">
                        Elite Performance Coaching
                    </Heading>
                </Box>

                <Grid templateColumns={{ base: '1fr', xl: '390px minmax(0, 1fr)' }} gap={{ base: '6', xl: '8' }} alignItems="start">
                    <PTCoachCard coach={MOCK_COACH} />

                    <Box
                        bg="#141414"
                        border="1px solid"
                        borderColor="#262626"
                        borderRadius="32px"
                        p={{ base: '5', md: '6' }}
                        minH={{ base: 'auto', xl: '820px' }}
                        boxShadow="0 12px 32px rgba(0, 0, 0, 0.18)"
                    >
                        <PTCalendar
                            weekLabel={booking.weekLabel}
                            weekDays={booking.weekDays}
                            selectedDayIdx={booking.selectedDayIdx}
                            onSelectDay={booking.onSelectDay}
                            onPrevWeek={booking.onPrevWeek}
                            onNextWeek={booking.onNextWeek}
                        />
                        <PTSessionPanel sessions={booking.sessions} onBookClick={booking.onBookClick} />
                    </Box>
                </Grid>
            </Box>

            <PTBookingModal
                isOpen={booking.isModalOpen}
                session={booking.pendingSession}
                bookingForm={booking.bookingForm}
                onSessionTypeChange={booking.onSessionTypeChange}
                onNotesChange={booking.onNotesChange}
                onConfirm={booking.onConfirm}
                onCancel={booking.onCancel}
            />
        </MemberLayout>
    )
}

export default PTBooking