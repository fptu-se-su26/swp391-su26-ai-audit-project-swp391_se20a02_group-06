import React from 'react'
import { Avatar, Box, Flex, Grid, Heading, Icon, IconButton } from '@chakra-ui/react'
import { FiBell, FiSettings } from 'react-icons/fi'
import MemberLayout from '../../components/shared/Layout/MemberLayout'
import PTBookingModal from '../../features/pt/components/PTBookingModal'
import PTCalendar from '../../features/pt/components/PTCalendar'
import PTCoachCard from '../../features/pt/components/PTCoachCard'
import PTSessionPanel from '../../features/pt/components/PTSessionPanel'
import { usePTBooking } from '../../features/pt/hooks/usePTBooking'
import { MOCK_COACH } from '../../features/pt/types/pt'

const MEMBER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD3PMe9IyKrw0EOIdL772Dk-WDQV-pgB9z_txDSrg48pRsQLlDW05myJJxmSR2BSsuXi2T2tk0g63EhJ2B8iTM-qu67pwHSI_g0mgWoqBwWfeBBil_ui2hcz_BU-0ZENiBUdjGxRKoGKzdDfTBD8uEsoHygm0z-Tgm1hON3YB2QDDA8YkLuvGoO1QFzNIQxAOci2oGjLcRrVpLC0DOgYn_4uPYJ2fvv_eYQLeZ7woEi38c6L_fFDRy09w2xQLy_dZhjGHHVeqqt7Xv6'

const PTBooking: React.FC = () => {
  const booking = usePTBooking()

  return (
    <MemberLayout>
      <Box px={{ base: '5', md: '7' }} py="6" maxW="1200px">
        <Flex align="center" justify="space-between" gap="4" mb="9">
          <Heading fontSize={{ base: '18px', md: '20px' }} fontWeight="800" color="#E2E1EB">
            Elite Performance Coaching
          </Heading>

          <Flex align="center" gap="2">
            <Box position="relative">
              <IconButton
                aria-label="Notifications"
                icon={<Icon as={FiBell} boxSize="18px" />}
                variant="ghost"
                color="#C8C6C5"
                borderRadius="10px"
                _hover={{ bg: 'rgba(255,255,255,0.05)', color: '#E03030' }}
              />
              <Box position="absolute" top="9px" right="9px" w="8px" h="8px" borderRadius="full" bg="#E03030" />
            </Box>
            <IconButton
              aria-label="Settings"
              icon={<Icon as={FiSettings} boxSize="18px" />}
              variant="ghost"
              color="#C8C6C5"
              borderRadius="10px"
              _hover={{ bg: 'rgba(255,255,255,0.05)', color: '#E03030' }}
            />
            <Avatar
              src={MEMBER_AVATAR_URL}
              name="Alex Morgan"
              size="sm"
              bg="#262626"
              border="1px solid"
              borderColor="#33343c"
              ml="1"
            />
          </Flex>
        </Flex>

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
