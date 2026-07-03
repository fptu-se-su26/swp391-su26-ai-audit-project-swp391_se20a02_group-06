import React from 'react'
import { Box, Button, Flex, Grid, HStack, Icon, Stack, Text } from '@chakra-ui/react'
import { FiInfo, FiLock } from 'react-icons/fi'
import type { Session, SessionPeriod } from '../types/pt'

const PERIODS: SessionPeriod[] = ['morning', 'afternoon', 'evening']

const PERIOD_LABELS: Record<SessionPeriod, string> = {
    morning: 'Morning Sessions',
    afternoon: 'Afternoon Sessions',
    evening: 'Evening Sessions',
}

interface PTSessionPanelProps {
    sessions: Session[]
    onBookClick: (session: Session) => void
}

interface SessionCardProps {
    session: Session
    onBookClick: (session: Session) => void
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onBookClick }) => {
    const isAvailable = session.status === 'available'
    const isFeatured = session.label === 'Elite Mobility Peak' && isAvailable

    return (
        <Flex
            minH="96px"
            align="center"
            justify="space-between"
            gap="4"
            p={{ base: '4', md: '5' }}
            bg="#1a1b22"
            border="1px solid"
            borderColor={isFeatured ? '#E03030' : '#262626'}
            borderRadius="12px"
            opacity={isAvailable ? 1 : 0.52}
            transition="all 0.18s ease"
            _hover={isAvailable ? { bg: '#24262f', borderColor: '#E03030' } : undefined}
        >
            <Box minW="0">
                <Text fontSize={{ base: '18px', md: '20px' }} fontWeight="800" color="#E2E1EB" lineHeight="1.2">
                    {session.time}
                </Text>
                <Text fontSize="12px" fontWeight="600" color="#C8C6C5" noOfLines={1}>
                    {session.status === 'booked' ? 'Booked' : session.label}
                </Text>
            </Box>

            {isAvailable ? (
                <Button
                    minW="70px"
                    h="38px"
                    px="4"
                    bg={isFeatured ? '#E03030' : '#262626'}
                    color="white"
                    borderRadius="10px"
                    fontSize="14px"
                    fontWeight="800"
                    _hover={{ bg: '#E03030' }}
                    onClick={() => onBookClick(session)}
                >
                    Book
                </Button>
            ) : (
                <Icon as={FiLock} boxSize="18px" color="#C8C6C5" flexShrink={0} />
            )}
        </Flex>
    )
}

const PTSessionPanel: React.FC<PTSessionPanelProps> = ({ sessions, onBookClick }) => (
    <Stack spacing="7" mt="7">
        {PERIODS.map((period) => {
            const periodSessions = sessions.filter((session) => session.period === period)

            if (periodSessions.length === 0) {
                return null
            }

            return (
                <Box key={period}>
                    <Text fontSize="10px" fontWeight="800" color="#C8C6C5" textTransform="uppercase" letterSpacing="wider" mb="4">
                        {PERIOD_LABELS[period]}
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }} gap="4">
                        {periodSessions.map((session) => (
                            <SessionCard key={session.id} session={session} onBookClick={onBookClick} />
                        ))}
                    </Grid>
                </Box>
            )
        })}

        <Flex
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            gap="4"
            pt="6"
            borderTop="1px solid"
            borderColor="#262626"
            direction={{ base: 'column', md: 'row' }}
        >
            <HStack spacing="3">
                <Icon as={FiInfo} boxSize="18px" color="#FFB4AC" />
                <Text fontSize="12px" fontWeight="600" color="#C8C6C5">
                    24h cancellation policy applies.
                </Text>
            </HStack>
            <Button
                h="44px"
                px="8"
                bg="transparent"
                color="white"
                border="1px solid"
                borderColor="rgba(255,255,255,0.22)"
                borderRadius="full"
                fontSize="14px"
                fontWeight="800"
                _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'white' }}
            >
                View Full Schedule
            </Button>
        </Flex>
    </Stack>
)

export default PTSessionPanel