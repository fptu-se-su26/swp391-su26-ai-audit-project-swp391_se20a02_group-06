import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Textarea,
    VStack,
    HStack,
    Box,
    useToast,
    Icon,
} from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import apiClient from '../../../lib/axios.ts'

interface WebsiteReviewModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

const RATING_LABELS: Record<number, string> = {
    1: 'Needs Improvement 😞',
    2: 'Fair 😐',
    3: 'Good 🙂',
    4: 'Very Good 😊',
    5: 'Outstanding Experience! 🔥',
}

const WebsiteReviewModal: React.FC<WebsiteReviewModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [rating, setRating] = useState<number>(0)
    const [hoverRating, setHoverRating] = useState<number>(0)
    const [comment, setComment] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const toast = useToast()

    const currentDisplayRating = hoverRating || rating

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: 'Please select a star rating',
                description: 'Rate your experience from 1 to 5 stars to continue.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top',
            })
            return
        }

        setIsSubmitting(true)
        try {
            await apiClient.post('/website-reviews', {
                rating,
                comment: comment.trim() || null,
            })

            toast({
                title: 'Thank you very much! ⭐',
                description: 'Your valuable feedback has been recorded successfully.',
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: 'top',
            })

            if (onSuccess) {
                onSuccess()
            }
            onClose()
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Unable to submit review at this time.'
            toast({
                title: 'Submission Failed',
                description: msg,
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top',
            })
            // If already reviewed, close modal
            if (msg.toLowerCase().includes('already') || msg.includes('đã gửi') || msg.includes('đã đánh giá')) {
                onClose()
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            closeOnOverlayClick={false}
            size="md"
        >
            <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
            <ModalContent
                bg="#141720"
                border="1px solid"
                borderColor="#2A2D3A"
                borderRadius="20px"
                color="white"
                overflow="hidden"
                boxShadow="0 20px 50px rgba(0, 0, 0, 0.7)"
            >
                <ModalHeader pt="7" pb="2" textAlign="center">
                    <Box
                        w="56px"
                        h="56px"
                        mx="auto"
                        mb="3"
                        bg="linear-gradient(135deg, rgba(255, 184, 0, 0.2) 0%, rgba(224, 48, 48, 0.2) 100%)"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="1px solid"
                        borderColor="rgba(255, 184, 0, 0.4)"
                    >
                        <Icon as={FaStar} color="#FFB800" boxSize="28px" />
                    </Box>
                    <Text fontSize="20px" fontWeight="800" letterSpacing="-0.5px">
                        Rate Your Experience
                    </Text>
                    <Text fontSize="13px" color="#8A8A93" fontWeight="normal" mt="1" px="3">
                        Congratulations on finishing your workout! Take 10 seconds to rate and share your thoughts to help us improve.
                    </Text>
                </ModalHeader>

                <ModalBody py="4">
                    <VStack spacing="5">
                        {/* Star Rating Interactive */}
                        <Box textAlign="center" w="full">
                            <HStack justify="center" spacing="3" my="2">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= currentDisplayRating
                                    return (
                                        <Box
                                            key={star}
                                            as="button"
                                            cursor="pointer"
                                            p="1"
                                            transition="all 0.15s ease"
                                            transform={star <= currentDisplayRating ? 'scale(1.15)' : 'scale(1)'}
                                            _hover={{ transform: 'scale(1.25)' }}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            aria-label={`${star} stars`}
                                        >
                                            <Icon
                                                as={FaStar}
                                                boxSize="32px"
                                                color={isFilled ? '#FFB800' : '#2A2D3A'}
                                                filter={isFilled ? 'drop-shadow(0 0 8px rgba(255, 184, 0, 0.6))' : 'none'}
                                                transition="color 0.2s"
                                            />
                                        </Box>
                                    )
                                })}
                            </HStack>
                            <Text
                                fontSize="13px"
                                fontWeight="600"
                                color={currentDisplayRating > 0 ? '#FFB800' : '#8A8A93'}
                                minH="20px"
                                transition="all 0.2s"
                            >
                                {currentDisplayRating > 0 ? RATING_LABELS[currentDisplayRating] : 'Click stars to rate'}
                            </Text>
                        </Box>

                        {/* Comment textarea */}
                        <Box w="full">
                            <Text fontSize="13px" color="#8A8A93" fontWeight="600" mb="2">
                                Feedback & Suggestions (Optional)
                            </Text>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="How was the workout, AI guidance, or interface? Let us know what we can do better..."
                                bg="#0A0C10"
                                border="1px solid"
                                borderColor="#2A2D3A"
                                borderRadius="12px"
                                _focus={{ borderColor: '#E03030', boxShadow: '0 0 0 1px #E03030' }}
                                fontSize="14px"
                                color="white"
                                rows={3}
                                maxLength={1000}
                                resize="none"
                            />
                            <Text fontSize="11px" color="#555" textAlign="right" mt="1">
                                {comment.length}/1000 characters
                            </Text>
                        </Box>
                    </VStack>
                </ModalBody>

                <ModalFooter pb="6" pt="2" px="6" display="flex" gap="3">
                    <Button
                        variant="ghost"
                        color="#8A8A93"
                        _hover={{ bg: '#1E2028', color: 'white' }}
                        borderRadius="10px"
                        flex="1"
                        onClick={onClose}
                        isDisabled={isSubmitting}
                    >
                        Maybe Later
                    </Button>
                    <Button
                        bg="#E03030"
                        color="white"
                        _hover={{ bg: '#B82020', transform: 'translateY(-1px)' }}
                        _active={{ bg: '#9E1818' }}
                        borderRadius="10px"
                        flex="2"
                        isLoading={isSubmitting}
                        loadingText="Submitting..."
                        isDisabled={rating === 0}
                        onClick={handleSubmit}
                        boxShadow="0 4px 15px rgba(224, 48, 48, 0.4)"
                    >
                        Submit Review
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default WebsiteReviewModal
