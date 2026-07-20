import React, { useState, useMemo, useRef } from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
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
    VStack,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
} from '@chakra-ui/react'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import { uploadVideo } from '../../api/upload'
import { useAuthStore } from '../../store/useAuthStore'
import ExerciseFilters from '../../features/admin/components/ExerciseFilters'
import ExerciseTable from '../../features/admin/components/ExerciseTable'
import PaginationFooter from '../../features/admin/components/PaginationFooter'

interface ExerciseDto {
    id: number
    title: string
    description?: string
    videoUrl?: string
    muscleGroup?: string
    category?: string
    muscleTarget?: string
    difficulty: number
    duration?: number
    createdBy?: number
    creatorName?: string
    packageId?: number | null
    status?: 'published' | 'pending' | 'rejected'
    thumbnailUrl?: string
}

interface ProductPackageDto {
    id: number
    name: string
    tier: number
}

const difficultyLabels: Record<number, string> = {
    0: 'Beginner',
    1: 'Intermediate',
    2: 'Advanced',
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminWorkouts: React.FC = () => {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const toast = useToast()
    const { data: exercises, error, isLoading, mutate } = useSWR<ExerciseDto[]>('/exercises', fetcher)
    const { data: packages } = useSWR<ProductPackageDto[]>('/product-packages', fetcher)
    const roleId = useAuthStore(state => state.roleId)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploadingVideo, setIsUploadingVideo] = useState(false)
    const [editingExercise, setEditingExercise] = useState<ExerciseDto | null>(null)
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const cancelRef = useRef<HTMLButtonElement>(null)

    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [difficultyFilter, setDifficultyFilter] = useState('all')
    const [muscleTargetFilter, setMuscleTargetFilter] = useState('all')
    const [packageFilter, setPackageFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const [formData, setFormData] = useState({
        title: '',
        muscleGroup: '',
        difficulty: '',
        description: '',
        videoUrl: '',
        duration: '',
        packageId: '',
    })

    const filteredExercises = useMemo(() => {
        if (!exercises) return []
        return exercises.filter((ex) => {
            const q = searchQuery.toLowerCase()
            const matchesSearch = !q || ex.title.toLowerCase().includes(q)
            const cat = ex.category || ex.muscleGroup || 'General'
            const matchesCategory = categoryFilter === 'All' || cat === categoryFilter
            const matchesDifficulty = difficultyFilter === 'all' || ex.difficulty.toString() === difficultyFilter
            const mt = ex.muscleTarget || ex.muscleGroup || ''
            const matchesMuscle = muscleTargetFilter === 'all' || mt === muscleTargetFilter
            const matchesPackage = packageFilter === 'all'
                || (packageFilter === 'free' && ex.packageId == null)
                || ex.packageId?.toString() === packageFilter
            return matchesSearch && matchesCategory && matchesDifficulty && matchesMuscle && matchesPackage
        })
    }, [exercises, searchQuery, categoryFilter, difficultyFilter, muscleTargetFilter, packageFilter])

    const uniqueCategories = useMemo(() => {
        if (!exercises) return []
        return Array.from(new Set(exercises.map(e => e.category || e.muscleGroup || 'General').filter(Boolean))).sort()
    }, [exercises])

    const uniqueMuscleTargets = useMemo(() => {
        if (!exercises) return []
        return Array.from(new Set(exercises.map(e => e.muscleTarget || e.muscleGroup || '').filter(Boolean))).sort()
    }, [exercises])

    const packageOptions = useMemo(() => {
        if (!packages) return []
        return packages.filter(p => p.tier > 0).map(p => ({ id: p.id, name: p.name }))
    }, [packages])

    const totalPages = Math.max(1, Math.ceil((filteredExercises.length || 0) / pageSize))
    const safePage = Math.min(currentPage, totalPages)
    const paginatedExercises = filteredExercises.slice((safePage - 1) * pageSize, safePage * pageSize)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const resetForm = () => {
        setFormData({ title: '', muscleGroup: '', difficulty: '', description: '', videoUrl: '', duration: '', packageId: '' })
        setEditingExercise(null)
    }

    const openEdit = (ex: ExerciseDto) => {
        setEditingExercise(ex)
        setFormData({
            title: ex.title,
            muscleGroup: ex.muscleGroup || '',
            difficulty: ex.difficulty.toString(),
            description: ex.description || '',
            videoUrl: ex.videoUrl || '',
            duration: ex.duration?.toString() || '',
            packageId: ex.packageId?.toString() || '',
        })
        onEditOpen()
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
                packageId: formData.packageId ? parseInt(formData.packageId) : null,
            })
            toast({ title: 'Exercise created', status: 'success', duration: 3000, isClosable: true })
            resetForm()
            onCreateClose()
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

    const handleUpdate = async () => {
        if (!editingExercise || !formData.title || !formData.difficulty) return

        setIsSubmitting(true)
        try {
            await apiClient.put(`/exercises/${editingExercise.id}`, {
                title: formData.title,
                muscleGroup: formData.muscleGroup || null,
                difficulty: parseInt(formData.difficulty),
                description: formData.description || null,
                videoUrl: formData.videoUrl || null,
                duration: formData.duration ? parseInt(formData.duration) : null,
                packageId: formData.packageId ? parseInt(formData.packageId) : null,
            })
            toast({ title: 'Exercise updated', status: 'success', duration: 3000, isClosable: true })
            resetForm()
            onEditClose()
            mutate()
        } catch (error: any) {
            toast({
                title: 'Failed to update exercise',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        setDeleteId(id)
        onDeleteOpen()
    }

    const confirmDelete = async () => {
        if (deleteId === null) return
        try {
            await apiClient.delete(`/exercises/${deleteId}`)
            toast({ title: 'Exercise deleted', status: 'success', duration: 3000, isClosable: true })
            mutate()
        } catch (error: any) {
            toast({
                title: 'Failed to delete',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true,
            })
        } finally {
            onDeleteClose()
            setDeleteId(null)
        }
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

    const getPackageBadge = (packageId: number | null | undefined) => {
        if (!packageId) return <Badge bg="#2e3040" color="#8A8A93" px="2" py="0.5" borderRadius="md">Free</Badge>
        const pkg = packages?.find(p => p.id === packageId)
        const color = pkg ? (pkg.tier >= 3 ? '#E03030' : pkg.tier >= 2 ? '#3182ce' : '#48BB78') : '#8A8A93'
        return <Badge bg={`${color}22`} color={color} px="2" py="0.5" borderRadius="md">{pkg?.name || `Package #${packageId}`}</Badge>
    }

    const modalForm = (isEdit: boolean) => (
        <VStack spacing={5} align="stretch">
            <FormControl isRequired>
                <FormLabel color="#8A8A93">Title</FormLabel>
                <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Barbell Squat"
                    bg="#0A0C10" border="1px solid #1e2028" h="44px" borderRadius="md"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                />
            </FormControl>
            <FormControl>
                <FormLabel color="#8A8A93">Muscle Group</FormLabel>
                <Input
                    name="muscleGroup"
                    value={formData.muscleGroup}
                    onChange={handleInputChange}
                    placeholder="e.g. Legs, Chest"
                    bg="#0A0C10" border="1px solid #1e2028" h="44px" borderRadius="md"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel color="#8A8A93">Difficulty</FormLabel>
                <Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    bg="#0A0C10" border="1px solid #1e2028" h="44px" borderRadius="md"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                >
                    <option value="" style={{ color: "black" }}>Select difficulty</option>
                    <option value="0" style={{ color: "black" }}>Beginner</option>
                    <option value="1" style={{ color: "black" }}>Intermediate</option>
                    <option value="2" style={{ color: "black" }}>Advanced</option>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel color="#8A8A93">Description</FormLabel>
                <Input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Optional description"
                    bg="#0A0C10" border="1px solid #1e2028" h="44px" borderRadius="md"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                />
            </FormControl>
            <FormControl>
                <FormLabel color="#8A8A93">Video URL</FormLabel>
                <Flex gap={3} align="center">
                    <Input
                        name="videoUrl"
                        type="url"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        placeholder="e.g. https://youtube.com/..."
                        bg="#0A0C10" border="1px solid #1e2028" h="44px" borderRadius="md"
                        _hover={{ borderColor: "#E03030" }}
                        _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                    />
                    <Button
                        as="label" htmlFor={isEdit ? "video-upload-edit" : "video-upload"}
                        bg="#333" color="white" h="44px" borderRadius="md"
                        _hover={{ bg: "#444" }} isLoading={isUploadingVideo} cursor="pointer" px={6}
                    >
                        Upload
                    </Button>
                    <Input
                        id={isEdit ? "video-upload-edit" : "video-upload"}
                        type="file"
                        accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm,image/gif"
                        display="none"
                        onChange={handleVideoUpload}
                    />
                </Flex>
            </FormControl>
            <FormControl>
                <FormLabel color="#8A8A93">Duration (minutes)</FormLabel>
                <Input
                    name="duration" type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 15"
                    bg="#0A0C10" border="1px solid #1e2028" h="44px" borderRadius="md"
                    min={1}
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                />
            </FormControl>
            <FormControl>
                <FormLabel color="#8A8A93">Package (membership tier)</FormLabel>
                <Select
                    name="packageId"
                    value={formData.packageId}
                    onChange={handleInputChange}
                    bg="#0A0C10" border="1px solid #1e2028" h="44px" borderRadius="md"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                >
                    <option value="" style={{ color: "black" }}>Free (no package required)</option>
                    {packages?.filter(p => p.tier > 0).map(pkg => (
                        <option key={pkg.id} value={pkg.id.toString()} style={{ color: "black" }}>
                            {pkg.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
        </VStack>
    )

    return (
        <AdminLayout>
            <Box p="7" maxW="1440px">
                <Heading fontSize="24px" fontWeight="800" color="white" mb="7">
                    Exercise Management
                </Heading>

                <Flex gap={6} align="flex-start">
                    <ExerciseFilters
                        searchQuery={searchQuery}
                        onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                        categoryFilter={categoryFilter}
                        onCategoryChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}
                        difficultyFilter={difficultyFilter}
                        onDifficultyChange={(val) => { setDifficultyFilter(val); setCurrentPage(1); }}
                        muscleTargetFilter={muscleTargetFilter}
                        onMuscleTargetChange={(val) => { setMuscleTargetFilter(val); setCurrentPage(1); }}
                        packageFilter={packageFilter}
                        onPackageChange={(val) => { setPackageFilter(val); setCurrentPage(1); }}
                        categories={uniqueCategories}
                        muscleTargets={uniqueMuscleTargets}
                        packages={packageOptions}
                        onAddExercise={() => { resetForm(); onCreateOpen(); }}
                        showAddButton={roleId === 1}
                    />

                    <Box flex={1} bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
                        {isLoading ? (
                            <Flex justify="center" p="10">
                                <Spinner color="red.500" />
                            </Flex>
                        ) : error ? (
                            <Text color="red.500" p="5">Failed to load exercises</Text>
                        ) : paginatedExercises.length === 0 ? (
                            <Flex justify="center" align="center" p="10" minH="300px">
                                <Text color="#8A8A93" fontSize="14px">No exercises match your filters.</Text>
                            </Flex>
                        ) : (
                            <>
                                <ExerciseTable
                                    exercises={paginatedExercises}
                                    difficultyLabels={difficultyLabels}
                                    getPackageBadge={getPackageBadge}
                                    handlePreviewVideo={handlePreviewVideo}
                                    handleDelete={handleDelete}
                                    openEdit={openEdit}
                                    isAdmin={roleId === 1}
                                />
                                <PaginationFooter
                                    currentPage={safePage}
                                    totalPages={totalPages}
                                    totalItems={filteredExercises.length}
                                    pageSize={pageSize}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </Box>
                </Flex>
            </Box>

            <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
                <ModalOverlay />
                <ModalContent bg="#141720" color="white" borderColor="#1e2028" borderWidth="1px">
                    <ModalHeader>Create New Exercise</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <ModalBody>
                            {modalForm(false)}
                        </ModalBody>
                        <ModalFooter mt={2}>
                            <Button variant="ghost" color="#8A8A93" mr={3} onClick={onCreateClose} h="44px">Cancel</Button>
                            <Button type="submit" bg="#E03030" color="white" _hover={{ bg: "#C92828" }} isLoading={isSubmitting} h="44px" px={6}>
                                Create
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent bg="#141720" color="white" borderColor="#1e2028" borderWidth="1px">
                    <ModalHeader>Edit Exercise</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <ModalBody>
                            {modalForm(true)}
                        </ModalBody>
                        <ModalFooter mt={2}>
                            <Button variant="ghost" color="#8A8A93" mr={3} onClick={onEditClose} h="44px">Cancel</Button>
                            <Button type="submit" bg="#E03030" color="white" _hover={{ bg: "#C92828" }} isLoading={isSubmitting} h="44px" px={6}>
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose} isCentered>
                <AlertDialogOverlay />
                <AlertDialogContent bg="#141720" color="white" borderColor="#1e2028" borderWidth="1px">
                    <AlertDialogHeader fontSize="18px" fontWeight="700">Delete Exercise</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody fontSize="14px" color="#8A8A93">
                        Are you sure you want to delete this exercise? This action cannot be undone.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost" color="#8A8A93" h="44px">
                            Cancel
                        </Button>
                        <Button bg="#E03030" color="white" _hover={{ bg: '#C92828' }} onClick={confirmDelete} ml={3} h="44px" px={6}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    )
}

export default AdminWorkouts
