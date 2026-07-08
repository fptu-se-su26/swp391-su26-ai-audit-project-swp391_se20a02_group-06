import React, { useState } from 'react'
import {
    Box,
    Grid,
    GridItem,
    Flex,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
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
    Divider,
    Progress,
    Stack,
    HStack,
} from '@chakra-ui/react'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import { createExerciseRequest, reviewExerciseRequest, type ExerciseRequestDto } from '../../api/exerciseRequests'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface PtDto {
    id: number
    name: string
    email: string
    status: string
}

interface MuscleGroup {
    id: number
    name: string
}

const difficultyLabels: Record<number, string> = {
    0: 'Beginner',
    1: 'Intermediate',
    2: 'Advanced',
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminExerciseRequests: React.FC = () => {
    const toast = useToast()
    const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure()

    // API data
    const { data: requests, error: requestsError, isLoading: requestsLoading, mutate: mutateRequests } = useSWR<ExerciseRequestDto[]>('/exercise-requests', fetcher)
    const { data: pts } = useSWR<PtDto[]>('/pt', fetcher)
    const { data: muscleGroups } = useSWR<MuscleGroup[]>('/muscle-groups', fetcher)

    // Form states
    const [ptId, setPtId] = useState('')
    const [muscleGroup, setMuscleGroup] = useState('')
    const [difficulty, setDifficulty] = useState<number>(1) // Default to Intermediate (1)
    const [instructions, setInstructions] = useState('')
    const [priority, setPriority] = useState('MEDIUM')
    const [deadline, setDeadline] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Review states
    const [selectedRequest, setSelectedRequest] = useState<ExerciseRequestDto | null>(null)
    const [reviewNote, setReviewNote] = useState('')
    const [isReviewing, setIsReviewing] = useState(false)
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [isFormCollapsed, setIsFormCollapsed] = useState(false)

    const handleSendRequest = async () => {
        if (!ptId) {
            toast({ title: 'Please select a Personal Trainer', status: 'warning', duration: 3000, isClosable: true })
            return
        }

        setIsSubmitting(true)
        try {
            await createExerciseRequest({
                ptId: parseInt(ptId),
                muscleGroup: muscleGroup || undefined,
                difficulty: difficulty,
                instructions: instructions || undefined,
                priority: priority,
                deadline: deadline || undefined,
            })

            toast({ title: 'Request sent to Trainer', status: 'success', duration: 3000, isClosable: true })

            // Reset form
            setPtId('')
            setMuscleGroup('')
            setDifficulty(1)
            setInstructions('')
            setPriority('MEDIUM')
            setDeadline('')

            mutateRequests()
        } catch (err: any) {
            toast({
                title: 'Failed to send request',
                description: err.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const openReviewModal = (req: ExerciseRequestDto) => {
        setSelectedRequest(req)
        setReviewNote('')
        onReviewOpen()
    }

    const handlePreviewVideo = (url?: string) => {
        if (!url) return
        const trimmed = url.trim()
        if (/^(https?:\/\/)/i.test(trimmed)) {
            window.open(trimmed, '_blank')
        } else {
            toast({
                title: 'Invalid Video Link',
                description: `The video URL '${url}' is not a valid absolute web link (must start with http:// or https://).`,
                status: 'error',
                duration: 4000,
                isClosable: true
            })
        }
    }

    const handleReviewSubmit = async (status: 'APPROVED' | 'REJECTED') => {
        if (!selectedRequest) return

        setIsReviewing(true)
        try {
            await reviewExerciseRequest(selectedRequest.id, {
                status,
                reviewNote: reviewNote || undefined
            })

            toast({
                title: `Exercise request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
                status: 'success', duration: 3000, isClosable: true
            })

            onReviewClose()
            mutateRequests()
        } catch (err: any) {
            toast({
                title: 'Review action failed',
                description: err.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true
            })
        } finally {
            setIsReviewing(false)
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

    const activeTrainersCount = pts?.filter(p => p.status === 'Active').length || 0
    const totalTrainersCount = pts?.length || 0

    return (
        <AdminLayout title="Exercise Creation Requests">
            <Box maxW="1200px" mx="auto" pt="4">
                <Grid templateColumns={{ base: '1fr', lg: '3fr 1.5fr' }} gap="8" mb="8">

                    {/* Left Column - Request form */}
                    <GridItem>
                        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="20px" p="6">
                            <Flex align="center" justify="space-between" mb={isFormCollapsed ? "0" : "4"} cursor="pointer" onClick={() => setIsFormCollapsed(!isFormCollapsed)}>
                                <Flex align="center" gap="3">
                                    <Heading fontSize="20px" fontWeight="800" color="white">
                                        Exercise Creation Request
                                    </Heading>
                                    {/* <Badge colorScheme="purple" fontSize="10px" px="2" py="0.5" borderRadius="full">
                                        DRAFT MODE
                                    </Badge> */}
                                </Flex>
                                <Button size="sm" variant="ghost" color="#8A8A93" _hover={{ bg: "rgba(255,255,255,0.05)", color: "white" }} leftIcon={isFormCollapsed ? <FiChevronDown /> : <FiChevronUp />}>
                                    {isFormCollapsed ? "Expand" : "Collapse"}
                                </Button>
                            </Flex>

                            {!isFormCollapsed && (
                                <>
                                    <Text color="#8A8A93" fontSize="14px" mb="6">
                                        Draft and dispatch requirements for new movement patterns to the training staff.
                                    </Text>

                                    <Stack spacing="4">
                                        <FormControl isRequired>
                                            <FormLabel color="#8A8A93" fontSize="13px">SELECT PERSONAL TRAINER</FormLabel>
                                            <Select
                                                placeholder="Select a trainer..."
                                                value={ptId}
                                                onChange={(e) => setPtId(e.target.value)}
                                                bg="#0A0C10"
                                                borderColor="#1e2028"
                                                color="white"
                                                _hover={{ borderColor: "#E03030" }}
                                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                            >
                                                {pts?.map(pt => (
                                                    <option key={pt.id} value={pt.id} style={{ backgroundColor: '#141720', color: 'white' }}>
                                                        {pt.name} ({pt.email})
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Grid templateColumns="1fr 1fr" gap="4">
                                            <FormControl>
                                                <FormLabel color="#8A8A93" fontSize="13px">TARGETED MUSCLE GROUP</FormLabel>
                                                <Select
                                                    placeholder="Select group..."
                                                    value={muscleGroup}
                                                    onChange={(e) => setMuscleGroup(e.target.value)}
                                                    bg="#0A0C10"
                                                    borderColor="#1e2028"
                                                    color="white"
                                                    _hover={{ borderColor: "#E03030" }}
                                                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                                >
                                                    {muscleGroups?.map(mg => (
                                                        <option key={mg.id} value={mg.name} style={{ backgroundColor: '#141720', color: 'white' }}>
                                                            {mg.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel color="#8A8A93" fontSize="13px">DIFFICULTY LEVEL</FormLabel>
                                                <HStack bg="#0A0C10" p="1" borderRadius="8px" border="1px solid" borderColor="#1e2028" spacing="1">
                                                    {[0, 1, 2].map((lvl) => (
                                                        <Button
                                                            key={lvl}
                                                            flex="1"
                                                            size="sm"
                                                            variant="ghost"
                                                            bg={difficulty === lvl ? '#E03030' : 'transparent'}
                                                            color={difficulty === lvl ? 'white' : '#8A8A93'}
                                                            _hover={{ bg: difficulty === lvl ? '#E03030' : 'rgba(255,255,255,0.05)' }}
                                                            onClick={() => setDifficulty(lvl)}
                                                            fontSize="12px"
                                                        >
                                                            {lvl === 0 ? 'Beg.' : lvl === 1 ? 'Int.' : 'Adv.'}
                                                        </Button>
                                                    ))}
                                                </HStack>
                                            </FormControl>
                                        </Grid>

                                        <FormControl>
                                            <FormLabel color="#8A8A93" fontSize="13px">SPECIFIC INSTRUCTIONS / NOTES</FormLabel>
                                            <Textarea
                                                value={instructions}
                                                onChange={(e) => setInstructions(e.target.value)}
                                                placeholder="Provide details on mechanical focus, tempo, or required equipment..."
                                                bg="#0A0C10"
                                                borderColor="#1e2028"
                                                color="white"
                                                minH="100px"
                                                _hover={{ borderColor: "#E03030" }}
                                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                            />
                                        </FormControl>

                                        <Grid templateColumns="1fr 1fr" gap="4">
                                            <FormControl>
                                                <FormLabel color="#8A8A93" fontSize="13px">PRIORITY LEVEL</FormLabel>
                                                <Select
                                                    value={priority}
                                                    onChange={(e) => setPriority(e.target.value)}
                                                    bg="#0A0C10"
                                                    borderColor="#1e2028"
                                                    color="white"
                                                    _hover={{ borderColor: "#E03030" }}
                                                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                                >
                                                    <option value="LOW" style={{ backgroundColor: '#141720', color: 'white' }}>Low</option>
                                                    <option value="MEDIUM" style={{ backgroundColor: '#141720', color: 'white' }}>Medium</option>
                                                    <option value="HIGH" style={{ backgroundColor: '#141720', color: 'white' }}>High</option>
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel color="#8A8A93" fontSize="13px">DEADLINE</FormLabel>
                                                <Input
                                                    type="date"
                                                    value={deadline}
                                                    onChange={(e) => setDeadline(e.target.value)}
                                                    bg="#0A0C10"
                                                    borderColor="#1e2028"
                                                    color="white"
                                                    _hover={{ borderColor: "#E03030" }}
                                                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Button
                                            bg="#E03030"
                                            color="white"
                                            _hover={{ bg: "#C92424" }}
                                            py="6"
                                            borderRadius="10px"
                                            onClick={handleSendRequest}
                                            isLoading={isSubmitting}
                                            mt="2"
                                        >
                                            Send Request to Trainer
                                        </Button>
                                    </Stack>
                                </>
                            )}
                        </Box>
                    </GridItem>

                    {/* Right Column - System stats / Guidelines */}
                    <GridItem>
                        <Stack spacing="6">

                            {/* System Impact Card */}
                            <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="20px" p="6">
                                <Heading fontSize="16px" fontWeight="800" color="white" mb="5">
                                    System Impact
                                </Heading>
                                <Stack spacing="4">
                                    <Box>
                                        <Flex justify="space-between" mb="2" fontSize="13px">
                                            <Text color="#8A8A93">Active Trainers</Text>
                                            <Text color="white" fontWeight="700">{activeTrainersCount} / {totalTrainersCount}</Text>
                                        </Flex>
                                        <Progress value={totalTrainersCount > 0 ? (activeTrainersCount / totalTrainersCount) * 100 : 0} colorScheme="red" size="sm" borderRadius="full" bg="#0A0C10" />
                                    </Box>
                                    <Divider borderColor="#1e2028" />
                                    <Flex justify="space-between" fontSize="13px">
                                        <Text color="#8A8A93">Queue Load</Text>
                                        <Text color="orange.400" fontWeight="700">Moderate</Text>
                                    </Flex>
                                </Stack>
                            </Box>

                            {/* Creator Guidelines Card */}
                            <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="20px" p="6">
                                <Heading fontSize="16px" fontWeight="800" color="white" mb="5">
                                    Creator Guidelines
                                </Heading>
                                <Stack spacing="4" color="#8A8A93" fontSize="13px">
                                    <HStack align="start" spacing="3">
                                        <Text color="#E03030">✓</Text>
                                        <Text>Ensure exercise names are clinically accurate and follow the AISTHEA naming convention.</Text>
                                    </HStack>
                                    <HStack align="start" spacing="3">
                                        <Text color="#E03030">✓</Text>
                                        <Text>Include specific concentric and eccentric tempo requirements for technical movements.</Text>
                                    </HStack>
                                    <HStack align="start" spacing="3">
                                        <Text color="#E03030">✓</Text>
                                        <Text>Request a 4K video demonstration for all high-priority exercises.</Text>
                                    </HStack>
                                </Stack>
                            </Box>
                        </Stack>
                    </GridItem>
                </Grid>

                {/* Bottom - Pending/Historical Requests */}
                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="20px" p="6" mb="8">
                    <Flex justify="space-between" align="center" mb="5">
                        <Heading fontSize="18px" fontWeight="800" color="white">
                            Exercise Requests Log
                        </Heading>
                        <Select
                            w="180px"
                            size="sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            bg="#0A0C10"
                            borderColor="#1e2028"
                            color="white"
                            _hover={{ borderColor: "#E03030" }}
                            _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                        >
                            <option value="ALL" style={{ backgroundColor: '#141720', color: 'white' }}>All Statuses</option>
                            <option value="PENDING" style={{ backgroundColor: '#141720', color: 'white' }}>Pending</option>
                            <option value="SUBMITTED" style={{ backgroundColor: '#141720', color: 'white' }}>Submitted</option>
                            <option value="APPROVED" style={{ backgroundColor: '#141720', color: 'white' }}>Approved</option>
                            <option value="REJECTED" style={{ backgroundColor: '#141720', color: 'white' }}>Rejected</option>
                        </Select>
                    </Flex>

                    {requestsLoading ? (
                        <Flex justify="center" p="10">
                            <Spinner color="red.500" />
                        </Flex>
                    ) : requestsError ? (
                        <Text color="red.500" p="5">Failed to load requests log</Text>
                    ) : (
                        <Table variant="simple" size="sm">
                            <Thead bg="#0A0C10">
                                <Tr>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Exercise / Group</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Assigned Trainer</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Priority</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Deadline</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Status</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" py="3">Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {requests?.filter(req => {
                                    if (filterStatus === 'ALL') return true
                                    return req.status?.toUpperCase() === filterStatus.toUpperCase()
                                }).map((req) => (
                                    <Tr key={req.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                        <Td borderColor="#1e2028" py="4">
                                            <Text color="white" fontWeight="700">
                                                {req.title || `Requested: ${req.muscleGroup || 'General'}`}
                                            </Text>
                                            <Text fontSize="12px" color="#8A8A93">
                                                {req.muscleGroup || '-'} • {difficultyLabels[req.difficulty ?? 1]}
                                            </Text>
                                        </Td>
                                        <Td color="#E2E1EB" borderColor="#1e2028" py="4">{req.ptName}</Td>
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
                                            {req.status?.toUpperCase() === 'SUBMITTED' ? (
                                                <Button size="xs" colorScheme="red" variant="solid" onClick={() => openReviewModal(req)}>
                                                    Review Submission
                                                </Button>
                                            ) : req.status?.toUpperCase() === 'APPROVED' ? (
                                                <Badge colorScheme="green" variant="outline">Completed ✓</Badge>
                                            ) : req.status?.toUpperCase() === 'REJECTED' ? (
                                                <Text fontSize="xs" color="red.300">Rejected</Text>
                                            ) : (
                                                <Text fontSize="xs" color="#8A8A93">Waiting for PT...</Text>
                                            )}
                                        </Td>
                                    </Tr>
                                ))}
                                {requests?.length === 0 && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" color="#8A8A93" py="8">
                                            No requests created yet.
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Box>

            {/* Approval / Rejection Modal */}
            <Modal isOpen={isReviewOpen} onClose={onReviewClose} size="lg">
                <ModalOverlay />
                <ModalContent bg="#141720" color="white" borderColor="#1e2028" borderWidth="1px">
                    <ModalHeader borderBottom="1px solid" borderColor="#1e2028">Review PT Submission</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py="5">
                        {selectedRequest && (
                            <Stack spacing="4">
                                <Box>
                                    <Text color="#8A8A93" fontSize="12px">PT SUBMISSION TITLE</Text>
                                    <Text fontSize="16px" fontWeight="700" color="white">{selectedRequest.title}</Text>
                                </Box>

                                <Box>
                                    <Text color="#8A8A93" fontSize="12px">DESCRIPTION</Text>
                                    <Text fontSize="14px" color="#E2E1EB">{selectedRequest.description || 'No description provided.'}</Text>
                                </Box>

                                <Grid templateColumns="1fr 1fr" gap="4">
                                    <Box>
                                        <Text color="#8A8A93" fontSize="12px">MUSCLE GROUP</Text>
                                        <Text fontSize="14px" color="white">{selectedRequest.muscleGroup}</Text>
                                    </Box>
                                    <Box>
                                        <Text color="#8A8A93" fontSize="12px">DURATION</Text>
                                        <Text fontSize="14px" color="white">{selectedRequest.duration ? `${selectedRequest.duration} min` : '-'}</Text>
                                    </Box>
                                </Grid>

                                <Box>
                                    <Text color="#8A8A93" fontSize="12px" mb="1">VIDEO DEMONSTRATION</Text>
                                    {selectedRequest.videoUrl ? (
                                        <Button
                                            size="sm"
                                            colorScheme="blue"
                                            leftIcon={<span>▶</span>}
                                            onClick={() => handlePreviewVideo(selectedRequest.videoUrl)}
                                        >
                                            Open Video Preview
                                        </Button>
                                    ) : (
                                        <Text fontSize="14px" color="red.400">No video URL provided.</Text>
                                    )}
                                </Box>

                                <Divider borderColor="#1e2028" />

                                <FormControl>
                                    <FormLabel color="#8A8A93" fontSize="13px">REVIEW NOTES / FEEDBACK</FormLabel>
                                    <Textarea
                                        placeholder="Provide reasons if rejecting, or notes for approval..."
                                        value={reviewNote}
                                        onChange={(e) => setReviewNote(e.target.value)}
                                        bg="#0A0C10"
                                        borderColor="#1e2028"
                                        color="white"
                                        _hover={{ borderColor: "#E03030" }}
                                        _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                    />
                                </FormControl>
                            </Stack>
                        )}
                    </ModalBody>

                    <ModalFooter borderTop="1px solid" borderColor="#1e2028">
                        <Button
                            colorScheme="red"
                            variant="outline"
                            mr="3"
                            onClick={() => handleReviewSubmit('REJECTED')}
                            isLoading={isReviewing}
                        >
                            Reject & Request Fix
                        </Button>
                        <Button
                            bg="#38A169"
                            color="white"
                            _hover={{ bg: "#2F855A" }}
                            onClick={() => handleReviewSubmit('APPROVED')}
                            isLoading={isReviewing}
                        >
                            Approve & Add to Library
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AdminLayout>
    )
}

export default AdminExerciseRequests
