import React, { useMemo, useState } from 'react'
import {
    Box, Flex, Grid, Heading, Icon, Text, Spinner, useDisclosure, useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    FormControl, FormLabel, Input, Textarea, Select, Button, Stack, HStack,
} from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import ExerciseCard from '../../features/pt/components/ExerciseCard'
import FilterTabs from '../../features/pt/components/FilterTabs'
import { adminColors } from '../admin/AdminPrimitives'
import { uploadVideo } from '../../api/upload'

interface MyExercise {
    id: number
    title: string
    description?: string
    videoUrl?: string
    duration?: number
    muscleGroup?: string
    difficulty?: number
    creatorName?: string
    isDraft?: boolean
}

interface MuscleGroup {
    id: number
    name: string
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const difficultyLabels: Record<number, string> = {
    0: 'Beginner',
    1: 'Intermediate',
    2: 'Advanced',
}

const formatDuration = (minutes?: number): string => {
    if (!minutes) return '--'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}` : `${m}:00`
}

const getYouTubeThumbnail = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null
}

const getCloudinaryThumbnail = (url: string): string | null => {
    const match = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(.+)$/)
    if (!match) return null
    return `${match[1]}so_0/${match[2].replace(/\.\w+$/, '.jpg')}`
}

const getImageUrl = (url: string): string | null => {
    if (/\.(gif|jpg|jpeg|png|webp)(\?|$)/i.test(url)) return url
    return null
}

const getInitialsSvg = (name: string): string => {
    const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
        <rect width="320" height="180" fill="#282A31"/>
        <text x="160" y="100" text-anchor="middle" fill="#FFB4AC" font-size="52" font-weight="700" font-family="sans-serif">${initials}</text>
    </svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}`
}

const getThumbnail = (videoUrl: string | undefined, creatorName: string): string => {
    if (!videoUrl) return getInitialsSvg(creatorName)
    return getYouTubeThumbnail(videoUrl) || getCloudinaryThumbnail(videoUrl) || getImageUrl(videoUrl) || videoUrl
}

// ─────────────────────────────────────────────────────────
// New Exercise Modal
// ─────────────────────────────────────────────────────────
interface NewExerciseModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const NewExerciseModal: React.FC<NewExerciseModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const toast = useToast()
    const { data: muscleGroups } = useSWR<MuscleGroup[]>('/muscle-groups', fetcher)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [muscleGroupId, setMuscleGroupId] = useState('')
    const [difficulty, setDifficulty] = useState<number>(0)
    const [duration, setDuration] = useState('')
    const [isUploadingVideo, setIsUploadingVideo] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setVideoUrl('')
        setMuscleGroupId('')
        setDifficulty(0)
        setDuration('')
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploadingVideo(true)
        try {
            const { url } = await uploadVideo(file)
            setVideoUrl(url)
            toast({ title: 'Video uploaded successfully', status: 'success', duration: 3000, isClosable: true })
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

    const handleSubmit = async (isDraft: boolean = false) => {
        if (!title.trim()) {
            toast({ title: 'Exercise title is required', status: 'warning', duration: 3000, isClosable: true })
            return
        }

        if (videoUrl) {
            try {
                const parsed = new URL(videoUrl)
                if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error()
            } catch {
                toast({
                    title: 'Invalid Video URL',
                    description: 'The video URL must start with http:// or https://',
                    status: 'warning', duration: 4000, isClosable: true,
                })
                return
            }
        }

        if (duration) {
            const mins = parseInt(duration)
            if (isNaN(mins) || mins <= 0 || mins > 1000) {
                toast({
                    title: 'Invalid Duration',
                    description: 'Duration must be a number between 1 and 1000 minutes.',
                    status: 'warning', duration: 4000, isClosable: true,
                })
                return
            }
        }

        setIsSubmitting(true)
        try {
            const selectedMuscleGroup = muscleGroupId
                ? muscleGroups?.find(mg => mg.id === parseInt(muscleGroupId))
                : undefined

            await apiClient.post('/exercises', {
                title: title.trim(),
                description: description.trim() || undefined,
                videoUrl: videoUrl.trim() || undefined,
                muscleGroupId: muscleGroupId ? parseInt(muscleGroupId) : undefined,
                muscleGroup: selectedMuscleGroup?.name || undefined,
                difficulty,
                duration: duration ? parseInt(duration) : undefined,
                isDraft,
            })

            toast({
                title: isDraft ? 'Draft saved!' : 'Exercise created successfully!',
                description: isDraft ? 'You can find it in the Draft tab.' : undefined,
                status: 'success', duration: 3000, isClosable: true,
            })
            handleClose()
            onSuccess()
        } catch (err: any) {
            toast({
                title: 'Failed to create exercise',
                description: err.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputStyles = {
        bg: '#0A0C10',
        borderColor: '#1e2028',
        color: 'white',
        h: '44px',
        _hover: { borderColor: adminColors.primary },
        _focus: { borderColor: adminColors.primary, boxShadow: 'none' },
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg="#141720" color="white" borderColor="#1e2028" borderWidth="1px" borderRadius="20px">
                <ModalHeader borderBottom="1px solid" borderColor="#1e2028" fontSize="18px" fontWeight="800">
                    New Exercise Upload
                </ModalHeader>
                <ModalCloseButton color={adminColors.dim} _hover={{ color: 'white' }} />

                <ModalBody py="6">
                    <Stack spacing="5">
                        {/* Title */}
                        <FormControl isRequired>
                            <FormLabel color="#8A8A93" fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em">
                                Exercise Title
                            </FormLabel>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Bulgarian Split Squat"
                                {...inputStyles}
                            />
                        </FormControl>

                        {/* Muscle Group + Difficulty */}
                        <Grid templateColumns="1fr 1fr" gap="4">
                            <FormControl>
                                <FormLabel color="#8A8A93" fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em">
                                    Muscle Group
                                </FormLabel>
                                <Select
                                    placeholder="Select group..."
                                    value={muscleGroupId}
                                    onChange={(e) => setMuscleGroupId(e.target.value)}
                                    bg="#0A0C10"
                                    borderColor="#1e2028"
                                    color="white"
                                    h="44px"
                                    _hover={{ borderColor: adminColors.primary }}
                                    _focus={{ borderColor: adminColors.primary, boxShadow: 'none' }}
                                >
                                    {muscleGroups?.map(mg => (
                                        <option key={mg.id} value={mg.id} style={{ backgroundColor: '#141720', color: 'white' }}>
                                            {mg.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel color="#8A8A93" fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em">
                                    Difficulty
                                </FormLabel>
                                <HStack bg="#0A0C10" p="1" borderRadius="8px" border="1px solid" borderColor="#1e2028" spacing="1" h="44px">
                                    {[0, 1, 2].map((lvl) => (
                                        <Button
                                            key={lvl}
                                            flex="1"
                                            h="34px"
                                            size="sm"
                                            variant="ghost"
                                            bg={difficulty === lvl ? adminColors.primary : 'transparent'}
                                            color={difficulty === lvl ? 'white' : '#8A8A93'}
                                            _hover={{ bg: difficulty === lvl ? adminColors.primary : 'rgba(255,255,255,0.05)' }}
                                            onClick={() => setDifficulty(lvl)}
                                            fontSize="12px"
                                        >
                                            {lvl === 0 ? 'Beg.' : lvl === 1 ? 'Int.' : 'Adv.'}
                                        </Button>
                                    ))}
                                </HStack>
                            </FormControl>
                        </Grid>

                        {/* Duration */}
                        <FormControl>
                            <FormLabel color="#8A8A93" fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em">
                                Duration (minutes)
                            </FormLabel>
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="e.g. 15"
                                {...inputStyles}
                            />
                        </FormControl>

                        {/* Video URL + Upload */}
                        <FormControl>
                            <FormLabel color="#8A8A93" fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em">
                                Video Demonstration URL
                            </FormLabel>
                            <Flex gap="3" align="center">
                                <Input
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    flex="1"
                                    {...inputStyles}
                                />
                                <Button
                                    as="label"
                                    htmlFor="new-exercise-video-upload"
                                    bg="#282A31"
                                    color="white"
                                    h="44px"
                                    px="5"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="#1e2028"
                                    _hover={{ bg: '#333', borderColor: adminColors.primary }}
                                    isLoading={isUploadingVideo}
                                    loadingText="Uploading..."
                                    cursor="pointer"
                                    flexShrink={0}
                                    leftIcon={<Icon as={FiUpload} boxSize="13px" />}
                                >
                                    Upload
                                </Button>
                                <Input
                                    id="new-exercise-video-upload"
                                    type="file"
                                    accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm,image/gif"
                                    display="none"
                                    onChange={handleVideoUpload}
                                />
                            </Flex>
                            {videoUrl && (
                                <Text fontSize="11px" color={adminColors.success} mt="1.5">
                                    ✓ Video URL set
                                </Text>
                            )}
                        </FormControl>

                        {/* Description */}
                        <FormControl>
                            <FormLabel color="#8A8A93" fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.05em">
                                Description & Execution Notes
                            </FormLabel>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Explain setup, cues, tempo, rest recommendations..."
                                bg="#0A0C10"
                                borderColor="#1e2028"
                                color="white"
                                minH="110px"
                                resize="vertical"
                                _hover={{ borderColor: adminColors.primary }}
                                _focus={{ borderColor: adminColors.primary, boxShadow: 'none' }}
                            />
                        </FormControl>
                    </Stack>
                </ModalBody>

                <ModalFooter borderTop="1px solid" borderColor="#1e2028" gap="3">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        color="#8A8A93"
                        _hover={{ bg: 'rgba(255,255,255,0.05)', color: 'white' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        borderColor="#1e2028"
                        color="#8A8A93"
                        _hover={{ borderColor: adminColors.primary, color: 'white', bg: 'transparent' }}
                        _active={{ transform: 'scale(0.98)' }}
                        onClick={() => handleSubmit(true)}
                        isLoading={isSubmitting}
                        loadingText="Saving..."
                    >
                        Save as Draft
                    </Button>
                    <Button
                        bg={adminColors.primary}
                        color="white"
                        _hover={{ bg: '#C92424' }}
                        _active={{ transform: 'scale(0.98)' }}
                        onClick={() => handleSubmit(false)}
                        isLoading={isSubmitting}
                        loadingText="Creating..."
                        leftIcon={<Icon as={FiUpload} boxSize="14px" />}
                    >
                        Create Exercise
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────
const PTContentLibrary: React.FC = () => {
    const { data, error, isLoading, mutate } = useSWR<MyExercise[]>('/exercises/my', fetcher)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [activeTab, setActiveTab] = useState<'All' | 'Draft'>('All')

    const items = useMemo(() => data ?? [], [data])
    const draftCount = useMemo(() => items.filter(e => e.isDraft).length, [items])
    const visibleItems = useMemo(
        () => activeTab === 'Draft' ? items.filter(e => e.isDraft) : items,
        [items, activeTab]
    )

    return (
        <AdminLayout title="PT Portal">
            <Box maxW="1280px" mx="auto" w="full">
                <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} mb="5" gap="4">
                    <Box>
                        <Heading fontSize="22px" fontWeight="700" color={adminColors.text} letterSpacing="-0.02em" mb="1">
                            Content Library
                        </Heading>
                        <Text fontSize="12px" color={adminColors.dim}>
                            Manage your uploaded exercises, monitor review status, and organize your digital coaching assets.
                        </Text>
                    </Box>
                    <Flex
                        as="button"
                        bg={adminColors.primary}
                        color="white"
                        borderRadius="full"
                        px="4" py="2"
                        fontSize="13px" fontWeight="600"
                        align="center" gap="1.5"
                        whiteSpace="nowrap"
                        _hover={{ bg: '#C92424' }}
                        _active={{ transform: 'scale(0.97)' }}
                        transition="all 0.15s"
                        onClick={onOpen}
                    >
                        <Icon as={FiUpload} boxSize="16px" />
                        New Upload
                    </Flex>
                </Flex>

                <FilterTabs tabs={[
                    { label: 'All', count: items.length },
                    { label: 'Draft', count: draftCount },
                ]} active={activeTab} onChange={(tab) => setActiveTab(tab as 'All' | 'Draft')} />

                {isLoading ? (
                    <Flex justify="center" p="10">
                        <Spinner color="red.500" />
                    </Flex>
                ) : error ? (
                    <Text color="red.500" p="5" textAlign="center">Failed to load exercises</Text>
                ) : visibleItems.length === 0 ? (
                    <Text color={adminColors.dim} p="10" textAlign="center" fontSize="14px">
                        {activeTab === 'Draft'
                            ? 'No drafts yet. Use "Save as Draft" in the upload modal to save work in progress.'
                            : 'No exercises yet. Click New Upload to create your first exercise!'}
                    </Text>
                ) : (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="4">
                        {visibleItems.map((ex) => {
                            const tags: string[] = []
                            if (ex.muscleGroup) tags.push(ex.muscleGroup)
                            if (ex.difficulty !== undefined) tags.push(difficultyLabels[ex.difficulty] || '')

                            return (
                                <ExerciseCard
                                    key={ex.id}
                                    title={ex.title || ex.description || 'Untitled'}
                                    status={ex.isDraft ? 'draft' : 'published'}
                                    duration={formatDuration(ex.duration)}
                                    tags={tags.filter(Boolean)}
                                    thumbnail={getThumbnail(ex.videoUrl, ex.creatorName || 'PT')}
                                />
                            )
                        })}
                    </Grid>
                )}
            </Box>

            <NewExerciseModal
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={() => mutate()}
            />
        </AdminLayout>
    )
}

export default PTContentLibrary
