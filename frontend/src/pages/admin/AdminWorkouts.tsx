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
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast,
    IconButton,
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import AppButton from '../../components/shared/Button/AppButton'
import { uploadVideo } from '../../api/upload'

interface ExerciseDto {
    id: number
    title: string
    description?: string
    videoUrl?: string
    muscleGroup?: string
    difficulty: number // 0=Beginner, 1=Intermediate, 2=Advanced
    duration?: number
    createdBy?: number
    creatorName?: string
}

const difficultyLabels: Record<number, string> = {
    0: 'Beginner',
    1: 'Intermediate',
    2: 'Advanced',
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminWorkouts: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const { data: exercises, error, isLoading, mutate } = useSWR<ExerciseDto[]>('/exercises', fetcher)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploadingVideo, setIsUploadingVideo] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        muscleGroup: '',
        difficulty: '',
        description: '',
        videoUrl: '',
        duration: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploadingVideo(true)
        try {
            const { url } = await uploadVideo(file)
            setFormData(prev => ({ ...prev, videoUrl: url }))
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

    const handleSubmit = async () => {
        if (!formData.title || !formData.difficulty) return

        setIsSubmitting(true)
        try {
            await apiClient.post('/exercises', {
                title: formData.title,
                muscleGroup: formData.muscleGroup || null,
                difficulty: parseInt(formData.difficulty),
                description: formData.description || null,
                videoUrl: formData.videoUrl || null,
                duration: formData.duration ? parseInt(formData.duration) : null,
            })
            toast({ title: 'Exercise created', status: 'success', duration: 3000, isClosable: true })
            setFormData({ title: '', muscleGroup: '', difficulty: '', description: '', videoUrl: '', duration: '' })
            onClose()
            mutate()
        } catch (error: any) {
            toast({
                title: 'Failed to create exercise',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await apiClient.delete(`/exercises/${id}`)
            toast({ title: 'Exercise deleted', status: 'success', duration: 3000, isClosable: true })
            mutate()
        } catch (error: any) {
            toast({
                title: 'Failed to delete',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true,
            })
        }
    }

    return (
        <AdminLayout>
            <Box p="7" maxW="1200px">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        Exercise Management
                    </Heading>
                    <AppButton label="Create Exercise" size="sm" onClick={onOpen} />
                </Flex>

                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
                    {isLoading ? (
                        <Flex justify="center" p="10">
                            <Spinner color="red.500" />
                        </Flex>
                    ) : error ? (
                        <Text color="red.500" p="5">Failed to load exercises</Text>
                    ) : (
                        <Table variant="simple" size="sm">
                            <Thead bg="#0A0C10">
                                <Tr>
                                    <Th color="#8A8A93" borderColor="#1e2028">Title</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Creator</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Muscle Group</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Difficulty</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028" isNumeric>Duration</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Video</Th>
                                    <Th color="#8A8A93" borderColor="#1e2028">Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {exercises?.map((ex) => (
                                    <Tr key={ex.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                        <Td color="white" borderColor="#1e2028" fontWeight="600">{ex.title}</Td>
                                        <Td color="#e2e1eb" borderColor="#1e2028">{ex.creatorName || '-'}</Td>
                                        <Td borderColor="#1e2028">
                                            <Badge bg="#2e3040" color="#E2E1EB" px="2" py="0.5" borderRadius="md">
                                                {ex.muscleGroup || '-'}
                                            </Badge>
                                        </Td>
                                        <Td color="#8A8A93" borderColor="#1e2028">
                                            {difficultyLabels[ex.difficulty] || '-'}
                                        </Td>
                                        <Td color="#e2e1eb" borderColor="#1e2028" isNumeric>
                                            {ex.duration ? `${ex.duration} min` : '-'}
                                        </Td>
                                        <Td borderColor="#1e2028">
                                            {ex.videoUrl ? (
                                                <Button
                                                    size="xs"
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    onClick={() => window.open(ex.videoUrl, '_blank')}
                                                >
                                                    Preview
                                                </Button>
                                            ) : (
                                                <Text fontSize="xs" color="#8A8A93">No Video</Text>
                                            )}
                                        </Td>
                                        <Td borderColor="#1e2028">
                                            <IconButton
                                                aria-label="Delete exercise"
                                                icon={<FiTrash2 />}
                                                size="xs"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => handleDelete(ex.id)}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg="#141720" color="white" borderColor="#1e2028" borderWidth="1px">
                    <ModalHeader>Create New Exercise</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Title *</FormLabel>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Barbell Squat"
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Muscle Group</FormLabel>
                            <Input
                                name="muscleGroup"
                                value={formData.muscleGroup}
                                onChange={handleInputChange}
                                placeholder="e.g. Legs, Chest"
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Difficulty *</FormLabel>
                            <Select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            >
                                <option value="" style={{ color: "black" }}>Select difficulty</option>
                                <option value="0" style={{ color: "black" }}>Beginner</option>
                                <option value="1" style={{ color: "black" }}>Intermediate</option>
                                <option value="2" style={{ color: "black" }}>Advanced</option>
                            </Select>
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Description</FormLabel>
                            <Input
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Optional description"
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Video URL</FormLabel>
                            <Flex gap={2} align="center">
                                <Input
                                    name="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleInputChange}
                                    placeholder="e.g. https://youtube.com/..."
                                    bg="#0A0C10"
                                    border="1px solid #1e2028"
                                    _hover={{ borderColor: "#E03030" }}
                                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                                />
                                <Button
                                    as="label"
                                    htmlFor="video-upload"
                                    bg="#333"
                                    color="white"
                                    _hover={{ bg: "#444" }}
                                    isLoading={isUploadingVideo}
                                    cursor="pointer"
                                    px={6}
                                >
                                    Upload
                                </Button>
                                <Input
                                    id="video-upload"
                                    type="file"
                                    accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm"
                                    display="none"
                                    onChange={handleVideoUpload}
                                />
                            </Flex>
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Duration (minutes)</FormLabel>
                            <Input
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="e.g. 15"
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose} color="#8A8A93" _hover={{ bg: "rgba(255,255,255,0.05)" }}>
                            Cancel
                        </Button>
                        <Button bg="#E03030" color="white" _hover={{ bg: "#C92424" }} onClick={handleSubmit} isLoading={isSubmitting}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AdminLayout>
    )
}

export default AdminWorkouts