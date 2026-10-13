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
    1: 'Chưa hài lòng 😞',
    2: 'Cần cải thiện 😐',
    3: 'Tạm ổn, bình thường 🙂',
    4: 'Hài lòng và bổ ích 😊',
    5: 'Rất tuyệt vời! Trải nghiệm đỉnh cao 🔥',
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
                title: 'Vui lòng chọn số sao',
                description: 'Hãy chọn từ 1 đến 5 sao để đánh giá trải nghiệm của bạn.',
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
                title: 'Cảm ơn bạn rất nhiều! ⭐',
                description: 'Đánh giá quý giá của bạn đã được ghi nhận vào hệ thống.',
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
            const msg = error.response?.data?.message || 'Không thể gửi đánh giá lúc này.'
            toast({
                title: 'Gửi đánh giá thất bại',
                description: msg,
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top',
            })
            // Nếu lỗi do đã đánh giá rồi thì cũng đóng modal
            if (msg.includes('đã gửi') || msg.includes('đã đánh giá')) {
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
                        Đánh giá trải nghiệm của bạn
                    </Text>
                    <Text fontSize="13px" color="#8A8A93" fontWeight="normal" mt="1" px="3">
                        Chúc mừng bạn đã hoàn thành bài tập! Hãy dành 10 giây chấm điểm và góp ý để AISTHEA phục vụ bạn tốt hơn nhé.
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
                                            aria-label={`${star} sao`}
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
                                {currentDisplayRating > 0 ? RATING_LABELS[currentDisplayRating] : 'Bấm vào sao để chấm điểm'}
                            </Text>
                        </Box>

                        {/* Comment textarea */}
                        <Box w="full">
                            <Text fontSize="13px" color="#8A8A93" fontWeight="600" mb="2">
                                Nhận xét & Đóng góp ý kiến (tuỳ chọn)
                            </Text>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Bạn cảm thấy bài tập, AI hướng dẫn hay giao diện như thế nào? Có điểm nào cần cải thiện không..."
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
                                {comment.length}/1000 ký tự
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
                        Để sau
                    </Button>
                    <Button
                        bg="#E03030"
                        color="white"
                        _hover={{ bg: '#B82020', transform: 'translateY(-1px)' }}
                        _active={{ bg: '#9E1818' }}
                        borderRadius="10px"
                        flex="2"
                        isLoading={isSubmitting}
                        loadingText="Đang gửi..."
                        isDisabled={rating === 0}
                        onClick={handleSubmit}
                        boxShadow="0 4px 15px rgba(224, 48, 48, 0.4)"
                    >
                        Gửi đánh giá
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default WebsiteReviewModal
