import React, { useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Spinner,
    Button,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Stack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Grid,
} from '@chakra-ui/react'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import PTLayout from '../../components/shared/Layout/PTLayout'
import { submitExercise, type ExerciseRequestDto } from '../../api/exerciseRequests'
import { uploadVideo } from '../../api/upload'

const difficultyLabels: Record<number, string> = {
    0: 'Beginner',
    1: 'Intermediate',
    2: 'Advanced',
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const PtExerciseRequests: React.FC = () => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const { data: requests, error, isLoading, mutate } = useSWR<ExerciseRequestDto[]>('/exercise-requests/my', fetcher)

    // Form submission states
    const [selectedRequest, setSelectedRequest] = useState<ExerciseRequestDto | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [duration, setDuration] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploadingVideo, setIsUploadingVideo] = useState(false)

    const openSubmitModal = (req: ExerciseRequestDto) => {
        setSelectedRequest(req)
        setTitle(req.title || '')
        setDescription(req.description || '')
        setVideoUrl(req.videoUrl || '')
        setDuration(req.duration?.toString() || '')
        onOpen()
    }

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploadingVideo(true)
        try {
            const { url } = await uploadVideo(file)
            setVideoUrl(url)
            toast({ title: 'Video uploaded', status: 'success', duration: 3000, isClosable: true })
        } catch (error: any) {
            toast({
                title: 'Failed to upload video',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true,
            })
        } finally {
            setIsUploadingVideo(false)
        }
    }

    const handleFormSubmit = async () => {
        if (!selectedRequest) return
        if (!title || !videoUrl) {
            toast({ title: 'Title and Video URL are required', status: 'warning', duration: 3000, isClosable: true })
            return
        }

        const isValidUrl = (url: string) => {
            try {
                const parsed = new URL(url)
                return parsed.protocol === 'http:' || parsed.protocol === 'https:'
            } catch {
                return false
            }
        }

        if (!isValidUrl(videoUrl)) {
            toast({
                title: 'Invalid Video URL',
                description: 'The video URL must be a valid absolute link starting with http:// or https://',
                status: 'warning',
                duration: 4000,
                isClosable: true
            })
            return
        }

        if (duration) {
            const mins = parseInt(duration)
            if (isNaN(mins) || mins <= 0 || mins > 180) {
                toast({
                    title: 'Invalid Duration',
                    description: 'Duration must be a positive number between 1 and 180 minutes.',
                    status: 'warning',
                    duration: 4000,
                    isClosable: true
                })
                return
            }
        }

        setIsSubmitting(true)
        try {
            await submitExercise(selectedRequest.id, {
                title,
                description: description || undefined,
                videoUrl,
                duration: duration ? parseInt(duration) : undefined,
            })
            
            toast({ title: 'Exercise submitted successfully!', status: 'success', duration: 3000, isClosable: true })
            onClose()
            mutate()
        } catch (err: any) {
            toast({
                title: 'Submission failed',
                description: err.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const getPriorityBadgeColor = (p: string) => {
        switch (p?.toUpperCase()) {
            case 'HIGH': return 'red'
            case 'MEDIUM': return 'orange'
            case 'LOW': return 'blue'
            default: return 'gray'
        }
    }

    const getStatusBadgeColor = (s: string) => {
        switch (s?.toUpperCase()) {
            case 'PENDING': return 'yellow'
            case 'SUBMITTED': return 'blue'
            case 'APPROVED': return 'green'
            case 'REJECTED': return 'red'
            default: return 'gray'
        }
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <PTLayout title="PT Exercise Requests">
            <Box maxW="1200px" mx="auto" pt="4">
                <Box mb="6">
                    <Heading fontSize="24px" fontWeight="800" color="white" mb="2">
                        Assigned Exercise Requests
                    </Heading>
                    <Text color="#8A8A93" fontSize="14px">
                        Create and submit new movement patterns requested by AISTHEA Administrators.
                    </Text>
                </Box>

                {/* Main requests table */}
                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="20px" p="6" mb="8">
                    {isLoading ? (
                        <Flex justify="center" p="10">
                            <Spinner color="red.500" />
                        </Flex>
                    ) : error ? (
                        <Text color="red.500" p="5">Failed to load assigned requests</Text>
                    ) : (
                        <Table variant="simple" size="sm">
                            <Thead bg="#0A0C10">
                                <Tr>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Request Details</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Assigned By</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Priority</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Deadline</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Status</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {requests?.map((req) => (
                                    <React.Fragment key={req.id}>
                                        <Tr _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                            <Td borderColor="#1e2028" py="4" maxW="400px">
                                                <Text color="white" fontWeight="700">
                                                    Target: {req.muscleGroup || 'General'}
                                                </Text>
                                                <Text fontSize="12px" color="#8A8A93" mb="2">
                                                    Difficulty requested: {difficultyLabels[req.difficulty ?? 1]}
                                                </Text>
                                                {req.instructions && (
                                                    <Box bg="#0A0C10" p="3" borderRadius="8px" border="1px solid" borderColor="#1e2028" fontSize="12px">
                                                        <Text color="#8A8A93" fontWeight="600" mb="1">INSTRUCTIONS:</Text>
                                                        <Text color="#E2E1EB">{req.instructions}</Text>
                                                    </Box>
                                                )}
                                            </Td>
                                            <Td color="#E2E1EB" borderColor="#1e2028" py="4">
                                                {req.requestedByName || 'Administrator'}
                                            </Td>
                                            <Td borderColor="#1e2028" py="4">
                                                <Badge colorScheme={getPriorityBadgeColor(req.priority || 'MEDIUM')} px="2" py="0.5" borderRadius="md">
                                                    {req.priority}
                                                </Badge>
                                            </Td>
                                            <Td color="#E2E1EB" borderColor="#1e2028" py="4">{formatDate(req.deadline)}</Td>
                                            <Td borderColor="#1e2028" py="4">
                                                <Badge colorScheme={getStatusBadgeColor(req.status || 'PENDING')} px="2" py="0.5" borderRadius="md">
                                                    {req.status}
                                                </Badge>
                                            </Td>
                                            <Td borderColor="#1e2028" py="4">
                                                {req.status?.toUpperCase() === 'PENDING' || req.status?.toUpperCase() === 'REJECTED' ? (
                                                    <Button size="xs" colorScheme="red" onClick={() => openSubmitModal(req)}>
                                                        {req.status?.toUpperCase() === 'REJECTED' ? 'Resubmit Exercise' : 'Create Exercise'}
                                                    </Button>
                                                ) : req.status?.toUpperCase() === 'SUBMITTED' ? (
                                                    <Badge colorScheme="blue" variant="outline">Awaiting Review</Badge>
                                                ) : (
                                                    <Badge colorScheme="green" variant="solid">Approved ✓</Badge>
                                                )}
                                            </Td>
                                        </Tr>

                                        {/* Display rejection note if status is REJECTED */}
                                        {req.status?.toUpperCase() === 'REJECTED' && req.reviewNote && (
                                            <Tr bg="rgba(224, 48, 48, 0.05)">
                                                <Td colSpan={6} borderColor="#1e2028" py="3" px="6">
                                                    <Alert status="error" variant="subtle" py="2" borderRadius="8px" bg="transparent" border="none">
                                                        <AlertIcon />
                                                        <Box flex="1">
                                                            <AlertTitle fontSize="13px" fontWeight="700">Rejection Note from Administrator:</AlertTitle>
                                                            <AlertDescription fontSize="12px">{req.reviewNote}</AlertDescription>
                                                        </Box>
                                                    </Alert>
                                                </Td>
                                            </Tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                {requests?.length === 0 && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" color="#8A8A93" py="8">
                                            No exercise requests assigned to you yet.
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Box>

            {/* Exercise Submission Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent bg="#141720" color="white" borderColor="#1e2028" borderWidth="1px">
                    <ModalHeader borderBottom="1px solid" borderColor="#1e2028">
                        {selectedRequest?.status?.toUpperCase() === 'REJECTED' ? 'Resubmit Exercise Plan' : 'Submit Created Exercise'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py="5">
                        {selectedRequest && (
                            <Stack spacing="4">
                                <Box bg="#0A0C10" p="4" borderRadius="10px" border="1px solid" borderColor="#1e2028">
                                    <Grid templateColumns="1fr 1fr" gap="2" fontSize="13px">
                                        <Text color="#8A8A93">Target Muscle Group:</Text>
                                        <Text color="white" fontWeight="700">{selectedRequest.muscleGroup || 'General'}</Text>
                                        
                                        <Text color="#8A8A93">Required Difficulty:</Text>
                                        <Text color="white" fontWeight="700">{difficultyLabels[selectedRequest.difficulty ?? 1]}</Text>
                                    </Grid>
                                </Box>

                                <FormControl isRequired>
                                    <FormLabel color="#8A8A93" fontSize="13px">EXERCISE TITLE</FormLabel>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Deficit Deadlift"
                                        bg="#0A0C10"
                                        borderColor="#1e2028"
                                        color="white"
                                        h="44px"
                                        _hover={{ borderColor: "#E03030" }}
                                        _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel color="#8A8A93" fontSize="13px">VIDEO DEMONSTRATION URL</FormLabel>
                                    <Flex gap={3} align="center">
                                        <Input
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            placeholder="e.g. https://www.youtube.com/watch?v=..."
                                            bg="#0A0C10"
                                            borderColor="#1e2028"
                                            color="white"
                                            h="44px"
                                            _hover={{ borderColor: "#E03030" }}
                                            _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                        />
                                        <Button
                                            as="label" htmlFor="video-upload"
                                            bg="#333" color="white" h="44px" borderRadius="md"
                                            _hover={{ bg: "#444" }} isLoading={isUploadingVideo} cursor="pointer" px={6}
                                        >
                                            Upload
                                        </Button>
                                        <Input
                                            id="video-upload"
                                            type="file"
                                            accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm,image/gif"
                                            display="none"
                                            onChange={handleVideoUpload}
                                        />
                                    </Flex>
                                </FormControl>

                                <Grid templateColumns="1fr" gap="4">
                                    <FormControl>
                                        <FormLabel color="#8A8A93" fontSize="13px">DURATION (MINUTES)</FormLabel>
                                        <Input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="e.g. 15"
                                            bg="#0A0C10"
                                            borderColor="#1e2028"
                                            color="white"
                                            h="44px"
                                            _hover={{ borderColor: "#E03030" }}
                                            _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                        />
                                    </FormControl>
                                </Grid>

                                <FormControl>
                                    <FormLabel color="#8A8A93" fontSize="13px">DESCRIPTION & EXECUTION NOTES</FormLabel>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Explain setup, cues, concentric/eccentric tempo, rest recommendations..."
                                        bg="#0A0C10"
                                        borderColor="#1e2028"
                                        color="white"
                                        minH="120px"
                                        _hover={{ borderColor: "#E03030" }}
                                        _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                    />
                                </FormControl>
                            </Stack>
                        )}
                    </ModalBody>

                    <ModalFooter borderTop="1px solid" borderColor="#1e2028">
                        <Button variant="ghost" mr="3" onClick={onClose} color="#8A8A93" _hover={{ bg: "rgba(255,255,255,0.05)" }}>
                            Cancel
                        </Button>
                        <Button
                            bg="#E03030"
                            color="white"
                            _hover={{ bg: "#C92424" }}
                            onClick={handleFormSubmit}
                            isLoading={isSubmitting}
                        >
                            Submit Exercise Plan
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </PTLayout>
    )
}

export default PtExerciseRequests
