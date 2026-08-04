import React from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text,
    Textarea,
} from '@chakra-ui/react'
import type { BookingState, Session, SessionType } from '../types/pt'

const SESSION_TYPE_OPTIONS: SessionType[] = [
    'Video Call',
    'In-Person',
]

interface PTBookingModalProps {
    isOpen: boolean
    session: Session | null
    bookingForm: BookingState | null
    onSessionTypeChange: (type: SessionType) => void
    onNotesChange: (notes: string) => void

    onConfirm: () => void
    onSimulate: () => void
    onCancel: () => void
    isSubmitting?: boolean
}

const PTBookingModal: React.FC<PTBookingModalProps> = ({
    isOpen,
    session,
    bookingForm,
    onSessionTypeChange,
    onNotesChange,
    onConfirm,
    onSimulate,
    onCancel,
    isSubmitting = false,
}) => {
    if (!session || !bookingForm) {
        return null
    }

    return (
        <Modal isOpen={isOpen} onClose={onCancel} isCentered>
            <ModalOverlay bg="rgba(18, 19, 26, 0.84)" backdropFilter="blur(8px)" />
            <ModalContent
                bg="#141414"
                border="1px solid"
                borderColor="#262626"
                borderRadius="32px"
                maxW="464px"
                mx="4"
                p={{ base: '6', md: '8' }}
                boxShadow="0 24px 80px rgba(0, 0, 0, 0.45)"
            >
                <ModalHeader p="0" mb="7">
                    <Text fontSize="22px" fontWeight="800" color="#E2E1EB" letterSpacing="-0.01em">
                        Confirm Your Session
                    </Text>
                </ModalHeader>

                <ModalBody p="0">
                    <Stack spacing="6">
                        <Stack spacing="1">
                            <Text fontSize="14px" fontWeight="700" color="#8A8A93">
                                Selected detail:
                            </Text>
                            <Text fontSize="18px" fontWeight="800" color="#E2E1EB">
                                {bookingForm.sessionDate} at {session.time}
                            </Text>
                        </Stack>

                        <FormControl>
                            <FormLabel
                                fontSize="10px"
                                fontWeight="800"
                                color="#8A8A93"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                mb="2"
                            >
                                Session Type
                            </FormLabel>
                            <Select
                                value={bookingForm.sessionType}
                                onChange={(event) => onSessionTypeChange(event.target.value as SessionType)}
                                bg="#12131a"
                                borderColor="#262626"
                                borderRadius="8px"
                                h="48px"
                                color="#E2E1EB"
                                _hover={{ borderColor: '#33343c' }}
                                _focus={{ borderColor: '#E03030', boxShadow: '0 0 0 1px #E03030' }}
                            >
                                {SESSION_TYPE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel
                                fontSize="10px"
                                fontWeight="800"
                                color="#8A8A93"
                                textTransform="uppercase"
                                letterSpacing="wider"
                                mb="2"
                            >
                                Notes
                            </FormLabel>
                            <Textarea
                                value={bookingForm.notes}
                                onChange={(event) => onNotesChange(event.target.value)}
                                placeholder="Any specific goals for this session?"
                                bg="#12131a"
                                borderColor="#262626"
                                borderRadius="8px"
                                color="#E2E1EB"
                                minH="88px"
                                resize="none"
                                _placeholder={{ color: '#52525B' }}
                                _hover={{ borderColor: '#33343c' }}
                                _focus={{ borderColor: '#E03030', boxShadow: '0 0 0 1px #E03030' }}
                            />
                        </FormControl>

                        <Stack spacing="3" pt="2">
                            <Button
                                h="48px"
                                bg="#E03030"
                                color="white"
                                borderRadius="full"
                                fontSize="14px"
                                fontWeight="800"
                                _hover={{ bg: '#c92a2a' }}
                                onClick={onConfirm}
                                isLoading={isSubmitting}
                                loadingText="Redirecting..."
                                isDisabled={bookingForm.sessionType === 'In-Person'}
                            >
                                {bookingForm.sessionType === 'In-Person' ? 'Coming Soon' : 'Confirm Booking'}
                            </Button>
                            <Button
                                h="48px"
                                bg="#2b6cb0"
                                color="white"
                                borderRadius="full"
                                fontSize="14px"
                                fontWeight="800"
                                _hover={{ bg: '#2c5282' }}
                                onClick={onSimulate}
                                isLoading={isSubmitting}
                                loadingText="Processing..."
                                isDisabled={bookingForm.sessionType === 'In-Person'}
                            >
                                Simulate Payment (Dev Only)
                            </Button>
                            <Button
                                h="48px"
                                bg="transparent"
                                color="#E2E1EB"
                                border="1px solid"
                                borderColor="#C8C6C5"
                                borderRadius="full"
                                fontSize="14px"
                                fontWeight="800"
                                _hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'white' }}
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default PTBookingModal