import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    Box, Flex, Grid, Heading, Text, Icon, Button, Spinner,
} from '@chakra-ui/react'
import { FiChevronDown, FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../../lib/axios'
import MemberLayout from '../../../components/shared/Layout/MemberLayout'

import ExerciseGridCard from './components/ExerciseGridCard'
import PlanSidebar from './components/PlanSidebar'
import WorkoutExerciseModal from '../../../features/workout/components/WorkoutExerciseModal'
import type { ExerciseGridItem } from './components/ExerciseGridCard'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const difficultyLabels: Record<string, string> = {
    '0': 'Beginner',
    '1': 'Intermediate',
    '2': 'Advanced',
}

const packageBadgeMap: Record<string, { label: string; color: string; bg: string }> = {
    'Free': { label: 'FREE', color: '#4ADE80', bg: 'rgba(74,222,128,0.15)' },
    'Online Workout': { label: 'ONLINE WORKOUT', color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
    'Membership': { label: 'MEMBERSHIP', color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
    'VIP': { label: 'VIP', color: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
}

const PER_PAGE = 6

const ExerciseLibrary: React.FC = () => {
    const [muscleFilter, setMuscleFilter] = useState('')
    const [difficultyFilter, setDifficultyFilter] = useState('')
    const [showMuscleDropdown, setShowMuscleDropdown] = useState(false)
    const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
    const [planOpen, setPlanOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [selectedModal, setSelectedModal] = useState<{
        name: string
        videoUrl?: string
        description?: string
        tags: string[]
        duration?: number
    } | null>(null)
    const [loadingDetails, setLoadingDetails] = useState(false)
    const muscleRef = useRef<HTMLDivElement>(null)
    const diffRef = useRef<HTMLDivElement>(null)
    const resetPage = () => setPage(1)

    const { data: catalog, isLoading, error } = useSWR<any[]>('/exercises/catalog', fetcher)
    const { data: membership } = useSWR<any>('/membership/my', fetcher)

    const mapped: ExerciseGridItem[] = React.useMemo(() => {
        if (!catalog) return []
        return catalog.map((ex: any) => {
            const pkgName = ex.packageName || 'Free'
            const badge = packageBadgeMap[pkgName] || { label: pkgName.toUpperCase(), color: '#8A8A93', bg: 'rgba(138,138,147,0.15)' }
            const isLocked = ex.isLocked
            return {
                id: ex.id,
                title: ex.title || 'Untitled',
                muscleGroup: ex.muscleGroup || 'General',
                difficulty: ex.difficulty !== undefined ? (difficultyLabels[String(ex.difficulty)] || 'General') : 'General',
                duration: ex.durationMinutes ? `${ex.durationMinutes}m` : '--',
                packageBadge: badge,
                isLocked,
                requiredPlan: isLocked ? pkgName : undefined,
                thumbnailUrl: ex.thumbnailUrl || undefined,
            }
        })
    }, [catalog])

    const filtered = React.useMemo(() => {
        let result = mapped
        if (muscleFilter) {
            result = result.filter(e => e.muscleGroup.toLowerCase() === muscleFilter.toLowerCase())
        }
        if (difficultyFilter) {
            result = result.filter(e => e.difficulty.toLowerCase() === difficultyFilter.toLowerCase())
        }
        return result
    }, [mapped, muscleFilter, difficultyFilter])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const safePage = Math.min(page, totalPages)
    const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

    const handlePlay = useCallback(async (id: number) => {
        const grid = mapped.find(e => e.id === id)
        if (!grid) return
        setLoadingDetails(true)
        try {
            const res = await apiClient.get(`/exercises/${id}`)
            const full = res.data
            setSelectedModal({
                name: full.title || grid.title,
                videoUrl: full.videoUrl || undefined,
                description: full.description || undefined,
                tags: [full.muscleGroup || grid.muscleGroup, full.difficulty !== undefined ? (difficultyLabels[String(full.difficulty)] || 'General') : grid.difficulty],
                duration: full.duration || undefined,
            })
        } catch {
            setSelectedModal(null)
        } finally {
            setLoadingDetails(false)
        }
    }, [mapped])

    const handleModalComplete = () => {
        setSelectedModal(null)
    }

    const handleUpgrade = () => {
        setPlanOpen(true)
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (muscleRef.current && !muscleRef.current.contains(e.target as Node)) setShowMuscleDropdown(false)
            if (diffRef.current && !diffRef.current.contains(e.target as Node)) setShowDifficultyDropdown(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const muscleGroups = React.useMemo(() => {
        const set = new Set(mapped.map(e => e.muscleGroup))
        return Array.from(set).sort()
    }, [mapped])

    const difficulties = React.useMemo(() => {
        const set = new Set(mapped.map(e => e.difficulty))
        return Array.from(set).sort()
    }, [mapped])

    return (
        <MemberLayout>
            <Box p={{ base: '4', md: '7' }} maxW="1280px" mx="auto" position="relative">
                {/* Header */}
                <Flex
                    direction={{ base: 'column', lg: 'row' }}
                    justify="space-between"
                    align={{ lg: 'center' }}
                    gap="6"
                    mb="8"
                >
                    <Box>
                        <Heading fontSize={{ base: '22px', md: '32px' }} fontWeight="700" color="white" letterSpacing="-0.02em" mb="1">
                            Exercise Library
                        </Heading>
                        <Text fontSize="14px" color="#8A8A93">Browse our elite exercise catalog.</Text>
                    </Box>
                    <Flex direction={{ base: 'column', sm: 'row' }} gap="4" w={{ base: 'full', lg: 'auto' }} align="center">
                        {/* My Plan Trigger */}
                        <Flex
                            as="button"
                            align="center"
                            justify="space-between"
                            gap="3"
                            bg="#141414"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.06)"
                            borderRadius="32px"
                            px="4"
                            py="2"
                            w={{ base: 'full', sm: 'auto' }}
                            _hover={{ bg: '#1E1E1E' }}
                            transition="all 0.2s"
                            onClick={() => setPlanOpen(true)}
                        >
                            <Box textAlign="left">
                                <Text fontSize="10px" fontWeight="700" letterSpacing="0.05em" textTransform="uppercase" color="#8A8A93">
                                    My Plan
                                </Text>
                                <Text fontSize="14px" fontWeight="600" color="#FFB4AC">
                                    {membership?.packageName || 'Free'}
                                </Text>
                            </Box>
                            <Icon as={FiChevronRight} color="#8A8A93" />
                        </Flex>
                    </Flex>
                </Flex>

                {/* Filters */}
                <Flex wrap="wrap" gap="4" mb="8" align="center">
                    {/* Muscle Group Dropdown */}
                    <Box position="relative" ref={muscleRef}>
                        <Flex
                            as="button"
                            align="center"
                            gap="2"
                            bg="#1A1A1A"
                            border="1px solid"
                            borderColor={muscleFilter ? '#E03030' : 'rgba(255,255,255,0.08)'}
                            borderRadius="full"
                            px="4"
                            py="2"
                            fontSize="14px"
                            fontWeight="600"
                            color="white"
                            _hover={{ borderColor: '#E03030' }}
                            transition="all 0.15s"
                            onClick={() => { setShowMuscleDropdown(d => !d); setShowDifficultyDropdown(false) }}
                        >
                            <Icon as={FiChevronDown} boxSize="16px" color="#8A8A93" />
                            {muscleFilter || 'Muscle Group'}
                        </Flex>
                        {showMuscleDropdown && (
                            <Box
                                position="absolute"
                                top="calc(100% + 4px)"
                                left="0"
                                w="48"
                                bg="#141414"
                                border="1px solid"
                                borderColor="rgba(255,255,255,0.08)"
                                borderRadius="16px"
                                zIndex={20}
                                py="1"
                                overflow="hidden"
                                boxShadow="0 8px 24px rgba(0,0,0,0.4)"
                            >
                                <Box
                                    as="button"
                                    w="full"
                                    textAlign="left"
                                    px="4"
                                    py="2"
                                    fontSize="13px"
                                    color={muscleFilter === '' ? '#E03030' : 'white'}
                                    bg={muscleFilter === '' ? 'rgba(224,48,48,0.08)' : 'transparent'}
                                    _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                                    onClick={() => { setMuscleFilter(''); setShowMuscleDropdown(false); resetPage() }}
                                >
                                    All
                                </Box>
                                {muscleGroups.map(mg => (
                                    <Box
                                        key={mg}
                                        as="button"
                                        w="full"
                                        textAlign="left"
                                        px="4"
                                        py="2"
                                        fontSize="13px"
                                        color={muscleFilter === mg ? '#E03030' : 'white'}
                                        bg={muscleFilter === mg ? 'rgba(224,48,48,0.08)' : 'transparent'}
                                        _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                                        onClick={() => { setMuscleFilter(mg); setShowMuscleDropdown(false); resetPage() }}
                                    >
                                        {mg}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Difficulty Dropdown */}
                    <Box position="relative" ref={diffRef}>
                        <Flex
                            as="button"
                            align="center"
                            gap="2"
                            bg="#1A1A1A"
                            border="1px solid"
                            borderColor={difficultyFilter ? '#E03030' : 'rgba(255,255,255,0.08)'}
                            borderRadius="full"
                            px="4"
                            py="2"
                            fontSize="14px"
                            fontWeight="600"
                            color="white"
                            _hover={{ borderColor: '#E03030' }}
                            transition="all 0.15s"
                            onClick={() => { setShowDifficultyDropdown(d => !d); setShowMuscleDropdown(false) }}
                        >
                            <Icon as={FiChevronDown} boxSize="16px" color="#8A8A93" />
                            {difficultyFilter || 'Difficulty'}
                        </Flex>
                        {showDifficultyDropdown && (
                            <Box
                                position="absolute"
                                top="calc(100% + 4px)"
                                left="0"
                                w="48"
                                bg="#141414"
                                border="1px solid"
                                borderColor="rgba(255,255,255,0.08)"
                                borderRadius="16px"
                                zIndex={20}
                                py="1"
                                overflow="hidden"
                                boxShadow="0 8px 24px rgba(0,0,0,0.4)"
                            >
                                <Box
                                    as="button"
                                    w="full"
                                    textAlign="left"
                                    px="4"
                                    py="2"
                                    fontSize="13px"
                                    color={difficultyFilter === '' ? '#E03030' : 'white'}
                                    bg={difficultyFilter === '' ? 'rgba(224,48,48,0.08)' : 'transparent'}
                                    _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                                    onClick={() => { setDifficultyFilter(''); setShowDifficultyDropdown(false); resetPage() }}
                                >
                                    All
                                </Box>
                                {difficulties.map(d => (
                                    <Box
                                        key={d}
                                        as="button"
                                        w="full"
                                        textAlign="left"
                                        px="4"
                                        py="2"
                                        fontSize="13px"
                                        color={difficultyFilter === d ? '#E03030' : 'white'}
                                        bg={difficultyFilter === d ? 'rgba(224,48,48,0.08)' : 'transparent'}
                                        _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                                        onClick={() => { setDifficultyFilter(d); setShowDifficultyDropdown(false); resetPage() }}
                                    >
                                        {d}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Clear Filters */}
                    {(muscleFilter || difficultyFilter) && (
                        <Flex
                            as="button"
                            align="center"
                            gap="2"
                            bg="transparent"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.25)"
                            borderRadius="full"
                            px="4"
                            py="2"
                            fontSize="14px"
                            fontWeight="600"
                            color="#8A8A93"
                            _hover={{ color: 'white', borderColor: 'white' }}
                            transition="all 0.15s"
                            onClick={() => { setMuscleFilter(''); setDifficultyFilter(''); resetPage() }}
                        >
                            <Icon as={FiX} boxSize="16px" />
                            Clear Filters
                        </Flex>
                    )}
                </Flex>

                {/* Content */}
                {isLoading ? (
                    <Flex justify="center" py="20">
                        <Spinner color="#E03030" size="lg" />
                    </Flex>
                ) : error ? (
                    <Text color="#E03030" textAlign="center" py="10">Failed to load exercises.</Text>
                ) : filtered.length === 0 ? (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        py="24"
                        bg="#141414"
                        borderRadius="32px"
                        border="1px dashed"
                        borderColor="rgba(255,255,255,0.12)"
                    >
                        <Icon as={FiX} boxSize="36px" color="rgba(255,255,255,0.2)" mb="4" />
                        <Heading fontSize="18px" fontWeight="600" color="white" mb="2">No exercises found</Heading>
                        <Text fontSize="12px" color="#8A8A93" textAlign="center" maxW="md">
                            Try adjusting your filters to find what you're looking for.
                        </Text>
                        <Button
                            mt="6"
                            variant="outline"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.15)"
                            color="white"
                            bg="transparent"
                            borderRadius="full"
                            px="6"
                            py="5"
                            fontSize="14px"
                            fontWeight="600"
                            _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                            onClick={() => { setMuscleFilter(''); setDifficultyFilter(''); resetPage() }}
                        >
                            Reset Filters
                        </Button>
                    </Flex>
                ) : (
                    <>
                        <Grid
                            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                            gap={{ base: '4', md: '6', lg: '8' }}
                        >
                            {paginated.map(ex => (
                                <ExerciseGridCard
                                    key={ex.id}
                                    exercise={ex}
                                    onPlay={handlePlay}
                                    onUpgrade={handleUpgrade}
                                />
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Flex justify="center" align="center" gap="2" mt="12" mb="8">
                                <Flex
                                    as="button"
                                    align="center" justify="center"
                                    w="36px" h="36px"
                                    borderRadius="full"
                                    color={safePage === 1 ? '#555' : '#8A8A93'}
                                    bg={safePage === 1 ? 'transparent' : '#1A1A1A'}
                                    border="1px solid"
                                    borderColor={safePage === 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}
                                    cursor={safePage === 1 ? 'not-allowed' : 'pointer'}
                                    _hover={safePage > 1 ? { color: 'white', borderColor: 'white' } : undefined}
                                    onClick={() => { if (safePage > 1) setPage(safePage - 1) }}
                                >
                                    <Icon as={FiChevronLeft} boxSize="16px" />
                                </Flex>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <Flex
                                        key={p}
                                        as="button"
                                        align="center" justify="center"
                                        w="36px" h="36px"
                                        borderRadius="full"
                                        fontSize="13px" fontWeight="600"
                                        bg={safePage === p ? '#E03030' : '#1A1A1A'}
                                        color={safePage === p ? 'white' : '#8A8A93'}
                                        border="1px solid"
                                        borderColor={safePage === p ? '#E03030' : 'rgba(255,255,255,0.08)'}
                                        _hover={{ bg: safePage === p ? '#C62828' : '#262626', color: 'white' }}
                                        transition="all 0.15s"
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </Flex>
                                ))}

                                <Flex
                                    as="button"
                                    align="center" justify="center"
                                    w="36px" h="36px"
                                    borderRadius="full"
                                    color={safePage === totalPages ? '#555' : '#8A8A93'}
                                    bg={safePage === totalPages ? 'transparent' : '#1A1A1A'}
                                    border="1px solid"
                                    borderColor={safePage === totalPages ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}
                                    cursor={safePage === totalPages ? 'not-allowed' : 'pointer'}
                                    _hover={safePage < totalPages ? { color: 'white', borderColor: 'white' } : undefined}
                                    onClick={() => { if (safePage < totalPages) setPage(safePage + 1) }}
                                >
                                    <Icon as={FiChevronRight} boxSize="16px" />
                                </Flex>
                            </Flex>
                        )}
                    </>
                )}

                {/* Exercise Detail Modal */}
                <WorkoutExerciseModal
                    exercise={selectedModal}
                    isOpen={!!selectedModal}
                    onClose={() => setSelectedModal(null)}
                    onComplete={handleModalComplete}
                />

                {/* Plan Sidebar */}
                <PlanSidebar isOpen={planOpen} onClose={() => setPlanOpen(false)} />
            </Box>
        </MemberLayout>
    )
}

export default ExerciseLibrary