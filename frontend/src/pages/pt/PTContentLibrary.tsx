import React, { useMemo } from 'react'
import { Box, Flex, Grid, Heading, Icon, Text, Spinner } from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import ExerciseCard from '../../features/pt/components/ExerciseCard'
import FilterTabs from '../../features/pt/components/FilterTabs'
import { adminColors } from '../admin/AdminPrimitives'

interface MyExercise {
    id: number
    title: string
    description?: string
    videoUrl?: string
    duration?: number
    muscleGroup?: string
    difficulty?: number
    creatorName?: string
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

const PTContentLibrary: React.FC = () => {
    const { data, error, isLoading } = useSWR<MyExercise[]>('/exercises/my', fetcher)

    const items = useMemo(() => data ?? [], [data])

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
                        _hover={{ bg: adminColors.primarySoft, color: adminColors.surface }}
                        transition="all 0.15s"
                    >
                        <Icon as={FiUpload} boxSize="16px" />
                        New Upload
                    </Flex>
                </Flex>

                <FilterTabs tabs={[
                    { label: 'All', count: items.length },
                    { label: 'Draft' },
                ]} active="All" onChange={() => {}} />

                {isLoading ? (
                    <Flex justify="center" p="10">
                        <Spinner color="red.500" />
                    </Flex>
                ) : error ? (
                    <Text color="red.500" p="5" textAlign="center">Failed to load exercises</Text>
                ) : items.length === 0 ? (
                    <Text color={adminColors.dim} p="10" textAlign="center" fontSize="14px">
                        No exercises yet. Create your first exercise!
                    </Text>
                ) : (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="4">
                        {items.map((ex) => {
                            const tags: string[] = []
                            if (ex.muscleGroup) tags.push(ex.muscleGroup)
                            if (ex.difficulty !== undefined) tags.push(difficultyLabels[ex.difficulty] || '')

                            return (
                                <ExerciseCard
                                    key={ex.id}
                                    title={ex.title || ex.description || 'Untitled'}
                                    status="published"
                                    duration={formatDuration(ex.duration)}
                                    tags={tags.filter(Boolean)}
                                    thumbnail={getThumbnail(ex.videoUrl, ex.creatorName || 'PT')}
                                />
                            )
                        })}
                    </Grid>
                )}
            </Box>
        </AdminLayout>
    )
}

export default PTContentLibrary
