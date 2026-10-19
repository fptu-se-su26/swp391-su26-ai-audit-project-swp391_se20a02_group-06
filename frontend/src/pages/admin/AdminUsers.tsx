import React, { useState, useMemo, useEffect } from 'react'
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
    HStack,
    VStack,
    IconButton,
    Circle,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Switch,
    Tooltip,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    SimpleGrid,
} from '@chakra-ui/react'
import {
    FiSearch,
    FiUserPlus,
    FiEdit2,
    FiSlash,
    FiCheckCircle,
    FiMoreVertical,
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiAward,
} from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import { useAuthStore } from '../../store/useAuthStore'
import PaginationFooter from '../../features/admin/components/PaginationFooter'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionBox = motion(Box)
const MotionTr = motion(Tr)

interface UserDto {
    id: number
    name: string
    email: string
    phone?: string | null
    plan: string | null
    planStartDate?: string | null
    planEndDate?: string | null
    joinDate: string
    status: string
    avatarUrl?: string | null
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const getInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const AdminUsers: React.FC = () => {
    const { t } = useTranslation()
    const { data: users, error, isLoading, mutate } = useSWR<UserDto[]>('/user', fetcher)
    const roleId = useAuthStore(state => state.roleId)
    const toast = useToast()

    // Permissions: Admin (roleId = 1) has full control; PT (roleId = 2) is read-only
    const isAdmin = roleId === 1
    const isPT = roleId === 2

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [planFilter, setPlanFilter] = useState('ALL')

    // Modal state
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

    // Form state for Add
    const [addForm, setAddForm] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
    })
    const [isSubmittingAdd, setIsSubmittingAdd] = useState(false)

    // Form state for Edit
    const [editForm, setEditForm] = useState<{
        id: number
        fullname: string
        email: string
        phone: string
        status: string
    }>({
        id: 0,
        fullname: '',
        email: '',
        phone: '',
        status: 'ACTIVE',
    })
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

    // Filtered users
    const filteredUsers = useMemo(() => {
        if (!users) return []
        return users.filter(u => {
            const matchesSearch =
                u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase())

            const isUserActive = u.status?.toUpperCase() === 'ACTIVE'
            const matchesStatus =
                statusFilter === 'ALL' ||
                (statusFilter === 'ACTIVE' && isUserActive) ||
                (statusFilter === 'BANNED' && !isUserActive)

            const isFree = !u.plan || u.plan.toLowerCase() === 'free' || u.plan === '-'
            const matchesPlan =
                planFilter === 'ALL' ||
                (planFilter === 'FREE' && isFree) ||
                (planFilter === 'PRO' && !isFree)

            return matchesSearch && matchesStatus && matchesPlan
        })
    }, [users, searchQuery, statusFilter, planFilter])

    // Pagination state (10 users per page as requested)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    // Reset to page 1 whenever search query or filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter, planFilter])

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
    const safePage = Math.min(currentPage, totalPages)
    const paginatedUsers = useMemo(() => {
        const start = (safePage - 1) * pageSize
        return filteredUsers.slice(start, start + pageSize)
    }, [filteredUsers, safePage, pageSize])

    // Summary statistics
    const stats = useMemo(() => {
        if (!users) return { total: 0, active: 0, banned: 0, premium: 0 }
        const total = users.length
        const active = users.filter(u => u.status?.toUpperCase() === 'ACTIVE').length
        const banned = total - active
        const premium = users.filter(
            u => u.plan && u.plan.toLowerCase() !== 'free' && u.plan !== '-'
        ).length
        return { total, active, banned, premium }
    }, [users])

    // Ban / Unban toggle handler
    const handleToggleStatus = async (id: number, currentStatus: string) => {
        if (!isAdmin) {
            toast({
                title: 'Permission Denied',
                description: 'Only administrators can ban or unban accounts.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        const isActive = currentStatus?.toUpperCase() === 'ACTIVE'
        setActionLoadingId(id)

        try {
            if (isActive) {
                await apiClient.put(`/user/${id}/deactivate`)
                toast({
                    title: 'Account Banned / Deactivated',
                    description: 'User access has been suspended.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                })
            } else {
                await apiClient.put(`/user/${id}/activate`)
                toast({
                    title: 'Account Activated',
                    description: 'User can now log in and use the platform.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                })
            }
            await mutate()
        } catch (err: any) {
            toast({
                title: 'Action Failed',
                description: err.response?.data?.message || 'Failed to update user status.',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setActionLoadingId(null)
        }
    }

    // Open Edit modal
    const handleOpenEdit = (user: UserDto) => {
        setEditForm({
            id: user.id,
            fullname: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            status: user.status?.toUpperCase() === 'ACTIVE' ? 'ACTIVE' : 'BANNED',
        })
        setIsEditOpen(true)
    }

    // Submit Edit
    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editForm.fullname.trim()) {
            toast({ title: 'Full name is required', status: 'warning' })
            return
        }

        setIsSubmittingEdit(true)
        try {
            await apiClient.put(`/user/${editForm.id}`, {
                fullname: editForm.fullname.trim(),
                email: editForm.email.trim(),
                phone: editForm.phone.trim(),
                status: editForm.status,
            })
            toast({
                title: 'User Updated',
                description: 'User details have been successfully saved.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
            setIsEditOpen(false)
            await mutate()
        } catch (err: any) {
            toast({
                title: 'Update Failed',
                description: err.response?.data?.message || 'Could not update user.',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setIsSubmittingEdit(false)
        }
    }

    // Submit Add
    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!addForm.fullname.trim() || !addForm.email.trim()) {
            toast({ title: 'Full name and email are required', status: 'warning' })
            return
        }

        setIsSubmittingAdd(true)
        try {
            await apiClient.post('/user', {
                fullname: addForm.fullname.trim(),
                email: addForm.email.trim(),
                password: addForm.password.trim() || '123456',
                phone: addForm.phone.trim(),
            })
            toast({
                title: 'User Created',
                description: `Created account for ${addForm.fullname}. Default password: ${addForm.password || '123456'}`,
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: 'top-right',
            })
            setAddForm({ fullname: '', email: '', password: '', phone: '' })
            setIsAddOpen(false)
            await mutate()
        } catch (err: any) {
            toast({
                title: 'Create Failed',
                description: err.response?.data?.message || 'Could not create user.',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setIsSubmittingAdd(false)
        }
    }

    return (
        <AdminLayout>
            <Box p={{ base: '4', md: '7' }} maxW="1320px" mx="auto">
                {/* Header */}
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    justify="space-between"
                    align={{ base: 'flex-start', sm: 'center' }}
                    gap="4"
                    mb="6"
                >
                    <Box>
                        <HStack spacing="3" align="center">
                            <Heading fontSize={{ base: '20px', md: '24px' }} fontWeight="800" color="white">
                                {isPT ? t('nav.myClients', 'My Clients') : t('admin.userManagement', 'User Management')}
                            </Heading>
                            {isPT && (
                                <Badge bg="#1e2028" color="#8A8A93" px="2.5" py="1" borderRadius="full" fontSize="11px">
                                    {t('admin.trainerAccess', 'Trainer Access (Read-Only)')}
                                </Badge>
                            )}
                            {isAdmin && (
                                <Badge bg="rgba(224, 48, 48, 0.15)" color="#E03030" border="1px solid rgba(224, 48, 48, 0.3)" px="2.5" py="1" borderRadius="full" fontSize="11px">
                                    {t('admin.adminControl', 'Admin Full Control')}
                                </Badge>
                            )}
                        </HStack>
                        <Text color="#8A8A93" fontSize="13px" mt="1">
                            {isPT
                                ? t('admin.ptSubtitle', 'View client progress, membership plans, and account details')
                                : t('admin.adminSubtitle', 'Manage member accounts, modify profile details, and enforce ban/unban status')}
                        </Text>
                    </Box>

                    {isAdmin && (
                        <Button
                            leftIcon={<FiUserPlus />}
                            bg="#E03030"
                            color="white"
                            size="md"
                            fontWeight="700"
                            px="5"
                            borderRadius="12px"
                            _hover={{ bg: '#c52828', transform: 'translateY(-1px)' }}
                            _active={{ bg: '#a32020' }}
                            boxShadow="0 4px 14px rgba(224, 48, 48, 0.35)"
                            transition="all 0.2s"
                            onClick={() => setIsAddOpen(true)}
                        >
                            {t('admin.addUser', 'Add User')}
                        </Button>
                    )}
                </Flex>

                {/* Stat Cards */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing="4" mb="6">
                    <MotionBox
                        bg="#141720" border="1px solid #1e2028" borderRadius="16px" p="4"
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }}
                    >
                        <Flex justify="space-between" align="center">
                            <Text color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase">
                                {t('admin.totalMembers', 'Total Members')}
                            </Text>
                            <Circle size="32px" bg="#1e2028" color="#8A8A93">
                                <FiUsers size={15} />
                            </Circle>
                        </Flex>
                        <Text color="white" fontSize="24px" fontWeight="800" mt="2">
                            {stats.total}
                        </Text>
                    </MotionBox>

                    <MotionBox
                        bg="#141720" border="1px solid #1e2028" borderRadius="16px" p="4"
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
                    >
                        <Flex justify="space-between" align="center">
                            <Text color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase">
                                {t('admin.active', 'Active')}
                            </Text>
                            <Circle size="32px" bg="rgba(16, 185, 129, 0.15)" color="#34d399">
                                <FiUserCheck size={15} />
                            </Circle>
                        </Flex>
                        <Text color="#34d399" fontSize="24px" fontWeight="800" mt="2">
                            {stats.active}
                        </Text>
                    </MotionBox>

                    <MotionBox
                        bg="#141720" border="1px solid #1e2028" borderRadius="16px" p="4"
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.16 }}
                    >
                        <Flex justify="space-between" align="center">
                            <Text color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase">
                                {t('admin.banned', 'Banned / Inactive')}
                            </Text>
                            <Circle size="32px" bg="rgba(239, 68, 68, 0.15)" color="#f87171">
                                <FiUserX size={15} />
                            </Circle>
                        </Flex>
                        <Text color="#f87171" fontSize="24px" fontWeight="800" mt="2">
                            {stats.banned}
                        </Text>
                    </MotionBox>

                    <MotionBox
                        bg="#141720" border="1px solid #1e2028" borderRadius="16px" p="4"
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.24 }}
                    >
                        <Flex justify="space-between" align="center">
                            <Text color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase">
                                {t('admin.paidMemberships', 'Paid Memberships')}
                            </Text>
                            <Circle size="32px" bg="rgba(224, 48, 48, 0.15)" color="#E03030">
                                <FiAward size={15} />
                            </Circle>
                        </Flex>
                        <Text color="#E03030" fontSize="24px" fontWeight="800" mt="2">
                            {stats.premium}
                        </Text>
                    </MotionBox>
                </SimpleGrid>

                {/* Filters & Search */}
                <MotionBox
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }}
                    mb="5"
                >
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap="3"
                        justify="space-between"
                        align={{ base: 'stretch', md: 'center' }}
                    >
                        <InputGroup maxW={{ base: '100%', md: '360px' }}>
                            <InputLeftElement pointerEvents="none">
                                <FiSearch color="#8A8A93" />
                            </InputLeftElement>
                            <Input
                                placeholder={t('admin.searchUser', 'Search by name or email...')}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                bg="#141720"
                                border="1px solid #1e2028"
                                color="white"
                                fontSize="13px"
                                borderRadius="12px"
                                _placeholder={{ color: '#555968' }}
                                _focus={{ borderColor: '#E03030', boxShadow: '0 0 0 1px #E03030' }}
                            />
                        </InputGroup>

                        <HStack spacing="3">
                            <Select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                bg="#141720"
                                border="1px solid #1e2028"
                                color="white"
                                fontSize="13px"
                                borderRadius="12px"
                                w="150px"
                                _focus={{ borderColor: '#E03030' }}
                            >
                                <option value="ALL" style={{ background: '#141720' }}>{t('admin.allStatus', 'Status: All')}</option>
                                <option value="ACTIVE" style={{ background: '#141720' }}>{t('admin.active', 'Active Only')}</option>
                                <option value="BANNED" style={{ background: '#141720' }}>{t('admin.banned', 'Banned Only')}</option>
                            </Select>

                            <Select
                                value={planFilter}
                                onChange={e => setPlanFilter(e.target.value)}
                                bg="#141720"
                                border="1px solid #1e2028"
                                color="white"
                                fontSize="13px"
                                borderRadius="12px"
                                w="160px"
                                _focus={{ borderColor: '#E03030' }}
                            >
                                <option value="ALL" style={{ background: '#141720' }}>{t('admin.allPlans', 'Plan: All')}</option>
                                <option value="FREE" style={{ background: '#141720' }}>{t('admin.freePlan', 'Free Plan')}</option>
                                <option value="PRO" style={{ background: '#141720' }}>{t('admin.proPlan', 'Paid / Pro')}</option>
                            </Select>
                        </HStack>
                    </Flex>
                </MotionBox>

                {/* User Table */}
                <MotionBox
                    bg="#141720"
                    border="1px solid"
                    borderColor="#1e2028"
                    borderRadius="16px"
                    overflow="hidden"
                    boxShadow="0 8px 24px rgba(0,0,0,0.25)"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {isLoading ? (
                        <Flex justify="center" align="center" p="16" direction="column" gap="3">
                            <Spinner color="#E03030" size="xl" thickness="3px" />
                            <Text color="#8A8A93" fontSize="13px">{t('common.loading', 'Loading members...')}</Text>
                        </Flex>
                    ) : error ? (
                        <Flex justify="center" p="10" direction="column" align="center">
                            <Text color="red.400" fontWeight="600" mb="2">{t('admin.failedLoadUsers', 'Failed to load users')}</Text>
                            <Button size="sm" onClick={() => mutate()} colorScheme="red" variant="outline">
                                {t('common.retry', 'Try Again')}
                            </Button>
                        </Flex>
                    ) : filteredUsers.length === 0 ? (
                        <Flex justify="center" align="center" p="12" direction="column">
                            <Text color="#8A8A93" fontSize="14px">{t('admin.noUsersFound', 'No users found matching your filters.')}</Text>
                        </Flex>
                    ) : (
                        <>
                            <Box overflowX="auto">
                                <Table variant="simple" size="sm">
                                <Thead bg="#0A0C10">
                                    <Tr>
                                        <Th color="#8A8A93" borderColor="#1e2028" py="4" fontSize="11px" letterSpacing="0.05em">{t('common.name', 'NAME')}</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028" py="4" fontSize="11px" letterSpacing="0.05em">{t('common.email', 'EMAIL')}</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028" py="4" fontSize="11px" letterSpacing="0.05em">{t('admin.plan', 'PLAN')}</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028" py="4" fontSize="11px" letterSpacing="0.05em">{t('admin.joined', 'JOIN DATE')}</Th>
                                        <Th color="#8A8A93" borderColor="#1e2028" py="4" fontSize="11px" letterSpacing="0.05em">{t('common.status', 'STATUS')}</Th>
                                        {isAdmin && (
                                            <Th color="#8A8A93" borderColor="#1e2028" py="4" fontSize="11px" letterSpacing="0.05em" textAlign="right">
                                                {t('common.actions', 'ACTIONS')}
                                            </Th>
                                        )}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedUsers.map((u, idx) => {
                                        const isActive = u.status?.toUpperCase() === 'ACTIVE'
                                        const isPaidPlan = u.plan && u.plan.toLowerCase() !== 'free' && u.plan !== '-'
                                        const isActionLoading = actionLoadingId === u.id

                                        return (
                                            <MotionTr
                                                key={`${safePage}-${u.id}`}
                                                _hover={{ bg: 'rgba(255,255,255,0.02)' }}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.035, duration: 0.2 }}
                                            >
                                                {/* Name + Avatar */}
                                                <Td borderColor="#1e2028" py="3.5">
                                                    <HStack spacing="3">
                                                        <Circle
                                                            size="36px"
                                                            bg="#1e2028"
                                                            border="1px solid"
                                                            borderColor={isActive ? 'rgba(255,255,255,0.1)' : 'rgba(239,68,68,0.3)'}
                                                            flexShrink={0}
                                                            overflow="hidden"
                                                        >
                                                            {u.avatarUrl ? (
                                                                <Box
                                                                    as="img"
                                                                    src={u.avatarUrl}
                                                                    alt={u.name}
                                                                    w="100%"
                                                                    h="100%"
                                                                    objectFit="cover"
                                                                />
                                                            ) : (
                                                                <Text color={isActive ? '#E03030' : '#8A8A93'} fontSize="11px" fontWeight="800">
                                                                    {getInitials(u.name)}
                                                                </Text>
                                                            )}
                                                        </Circle>
                                                        <Box>
                                                            <Text color="white" fontWeight="700" fontSize="13px">
                                                                {u.name}
                                                            </Text>
                                                            {u.phone && (
                                                                <Text color="#555968" fontSize="11px">
                                                                    {u.phone}
                                                                </Text>
                                                            )}
                                                        </Box>
                                                    </HStack>
                                                </Td>

                                                {/* Email */}
                                                <Td color="#8A8A93" borderColor="#1e2028" fontSize="13px">
                                                    {u.email}
                                                </Td>

                                                {/* Plan */}
                                                <Td borderColor="#1e2028">
                                                    {isPaidPlan ? (
                                                        <Badge
                                                            bg="rgba(224, 48, 48, 0.15)"
                                                            color="#E03030"
                                                            border="1px solid rgba(224, 48, 48, 0.3)"
                                                            px="2.5"
                                                            py="0.5"
                                                            borderRadius="md"
                                                            fontSize="11px"
                                                            fontWeight="700"
                                                            textTransform="uppercase"
                                                        >
                                                            {u.plan}
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            bg="#1e2028"
                                                            color="#8A8A93"
                                                            px="2"
                                                            py="0.5"
                                                            borderRadius="md"
                                                            fontSize="11px"
                                                            fontWeight="600"
                                                        >
                                                            {t('admin.freePlan', 'FREE')}
                                                        </Badge>
                                                    )}
                                                </Td>

                                                {/* Join Date */}
                                                <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px">
                                                    {u.joinDate || '-'}
                                                </Td>

                                                {/* Status Badge + Toggle */}
                                                <Td borderColor="#1e2028">
                                                    <HStack spacing="2.5">
                                                        <Badge
                                                            bg={isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}
                                                            color={isActive ? '#34d399' : '#f87171'}
                                                            border="1px solid"
                                                            borderColor={isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}
                                                            px="2.5"
                                                            py="0.5"
                                                            borderRadius="full"
                                                            fontSize="11px"
                                                            fontWeight="700"
                                                            textTransform="uppercase"
                                                            letterSpacing="0.04em"
                                                        >
                                                            {isActive ? t('common.active', 'ACTIVE') : t('admin.banned', 'BANNED')}
                                                        </Badge>

                                                        {/* Quick Switch for Admin */}
                                                        {isAdmin && (
                                                            <Tooltip
                                                                 label={isActive ? t('admin.banUser', 'Click to Ban User') : t('admin.unbanUser', 'Click to Unban / Activate User')}
                                                                hasArrow
                                                                placement="top"
                                                            >
                                                                <Box display="inline-flex" alignItems="center">
                                                                    {isActionLoading ? (
                                                                        <Spinner size="xs" color="#E03030" />
                                                                    ) : (
                                                                        <Switch
                                                                            isChecked={isActive}
                                                                            onChange={() => handleToggleStatus(u.id, u.status)}
                                                                            colorScheme="red"
                                                                            size="sm"
                                                                            cursor="pointer"
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Tooltip>
                                                        )}
                                                    </HStack>
                                                </Td>

                                                {/* Actions (Admin Only) */}
                                                {isAdmin && (
                                                    <Td borderColor="#1e2028" textAlign="right">
                                                        <HStack spacing="1.5" justify="flex-end">
                                                             {/* Edit Button */}
                                                             <Tooltip label={t('admin.editUser', 'Edit Member Profile')} hasArrow placement="top">
                                                                <IconButton
                                                                     aria-label={t('admin.editUser', 'Edit User')}
                                                                    icon={<FiEdit2 />}
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    color="#8A8A93"
                                                                    _hover={{ color: 'white', bg: '#1e2028' }}
                                                                    onClick={() => handleOpenEdit(u)}
                                                                />
                                                            </Tooltip>

                                                             {/* Ban/Unban Button */}
                                                             <Tooltip
                                                                 label={isActive ? t('admin.banUser', 'Ban Account') : t('admin.unbanUser', 'Unban Account')}
                                                                hasArrow
                                                                placement="top"
                                                            >
                                                                <IconButton
                                                                     aria-label={isActive ? t('admin.banUser', 'Ban User') : t('admin.unbanUser', 'Unban User')}
                                                                    icon={isActive ? <FiSlash /> : <FiCheckCircle />}
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    color={isActive ? '#f87171' : '#34d399'}
                                                                    _hover={{
                                                                        bg: isActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                                    }}
                                                                    isLoading={isActionLoading}
                                                                    onClick={() => handleToggleStatus(u.id, u.status)}
                                                                />
                                                            </Tooltip>

                                                            {/* 3-dot Menu */}
                                                            <Menu placement="bottom-end">
                                                                <MenuButton
                                                                    as={IconButton}
                                                                     aria-label={t('common.actions', 'More actions')}
                                                                    icon={<FiMoreVertical />}
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    color="#8A8A93"
                                                                    _hover={{ color: 'white', bg: '#1e2028' }}
                                                                />
                                                                <MenuList bg="#181B24" borderColor="#262933" minW="170px" p="1.5" boxShadow="0 10px 25px rgba(0,0,0,0.5)">
                                                                    <MenuItem
                                                                        bg="transparent"
                                                                        _hover={{ bg: '#232734' }}
                                                                        color="white"
                                                                        fontSize="13px"
                                                                        icon={<FiEdit2 />}
                                                                        borderRadius="8px"
                                                                        onClick={() => handleOpenEdit(u)}
                                                                    >
                                                                         {t('common.edit', 'Edit Details')}
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        bg="transparent"
                                                                        _hover={{ bg: isActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)' }}
                                                                        color={isActive ? '#f87171' : '#34d399'}
                                                                        fontSize="13px"
                                                                        icon={isActive ? <FiSlash /> : <FiCheckCircle />}
                                                                        borderRadius="8px"
                                                                        onClick={() => handleToggleStatus(u.id, u.status)}
                                                                    >
                                                                         {isActive ? t('admin.banUser', 'Ban / Deactivate') : t('admin.unbanUser', 'Unban / Activate')}
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </HStack>
                                                    </Td>
                                                )}
                                            </MotionTr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </Box>

                        {filteredUsers.length > 0 && (
                            <PaginationFooter
                                currentPage={safePage}
                                totalPages={totalPages}
                                totalItems={filteredUsers.length}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
                </MotionBox>
            </Box>

            {/* Modal: Edit User */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} isCentered size="md">
                <ModalOverlay bg="rgba(0,0,0,0.7)" backdropFilter="blur(4px)" />
                <ModalContent bg="#141720" border="1px solid #1e2028" borderRadius="18px" color="white">
                    <form onSubmit={handleSubmitEdit}>
                        <ModalHeader borderBottom="1px solid #1e2028" fontSize="18px" fontWeight="800">
                            {t('admin.editUser', 'Edit Member Profile')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody py="5">
                            <VStack spacing="4">
                                <FormControl isRequired>
                                    <FormLabel fontSize="12px" color="#8A8A93" fontWeight="600" textTransform="uppercase">
                                        {t('common.name', 'Full Name')}
                                    </FormLabel>
                                    <Input
                                        value={editForm.fullname}
                                        onChange={e => setEditForm({ ...editForm, fullname: e.target.value })}
                                        bg="#0A0C10"
                                        border="1px solid #1e2028"
                                        borderRadius="10px"
                                        fontSize="13px"
                                        _focus={{ borderColor: '#E03030' }}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontSize="12px" color="#8A8A93" fontWeight="600" textTransform="uppercase">
                                        {t('common.email', 'Email Address')}
                                    </FormLabel>
                                    <Input
                                        type="email"
                                        value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        bg="#0A0C10"
                                        border="1px solid #1e2028"
                                        borderRadius="10px"
                                        fontSize="13px"
                                        _focus={{ borderColor: '#E03030' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize="12px" color="#8A8A93" fontWeight="600" textTransform="uppercase">
                                        {t('admin.phone', 'Phone Number')}
                                    </FormLabel>
                                    <Input
                                        value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        placeholder="e.g. 0912345678"
                                        bg="#0A0C10"
                                        border="1px solid #1e2028"
                                        borderRadius="10px"
                                        fontSize="13px"
                                        _focus={{ borderColor: '#E03030' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize="12px" color="#8A8A93" fontWeight="600" textTransform="uppercase">
                                        {t('common.status', 'Account Status')}
                                    </FormLabel>
                                    <Select
                                        value={editForm.status}
                                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                        bg="#0A0C10"
                                        border="1px solid #1e2028"
                                        borderRadius="10px"
                                        fontSize="13px"
                                        _focus={{ borderColor: '#E03030' }}
                                    >
                                        <option value="ACTIVE" style={{ background: '#141720' }}>{t('common.active', 'ACTIVE')} ({t('admin.active', 'Normal Access')})</option>
                                        <option value="BANNED" style={{ background: '#141720' }}>{t('admin.banned', 'BANNED')} ({t('admin.banned', 'Suspended')})</option>
                                    </Select>
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter borderTop="1px solid #1e2028">
                            <Button variant="ghost" mr="3" onClick={() => setIsEditOpen(false)} color="#8A8A93" size="sm">
                                {t('common.cancel', 'Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                bg="#E03030"
                                color="white"
                                size="sm"
                                fontWeight="700"
                                px="5"
                                _hover={{ bg: '#c52828' }}
                                isLoading={isSubmittingEdit}
                            >
                                {t('common.save', 'Save Changes')}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            {/* Modal: Add User */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} isCentered size="md">
                <ModalOverlay bg="rgba(0,0,0,0.7)" backdropFilter="blur(4px)" />
                <ModalContent bg="#141720" border="1px solid #1e2028" borderRadius="18px" color="white">
                    <form onSubmit={handleSubmitAdd}>
                        <ModalHeader borderBottom="1px solid #1e2028" fontSize="18px" fontWeight="800">
                            {t('admin.createUser', 'Create New Member Account')}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody py="5">
                            <VStack spacing="4">
                                <FormControl isRequired>
                                    <FormLabel fontSize="12px" color="#8A8A93" fontWeight="600" textTransform="uppercase">
                                        {t('common.name', 'Full Name')}
                                    </FormLabel>
                                    <Input
                                        placeholder="e.g. Nguyen Van A"
                                        value={addForm.fullname}
                                        onChange={e => setAddForm({ ...addForm, fullname: e.target.value })}
                                        bg="#0A0C10"
                                        border="1px solid #1e2028"
                                        borderRadius="10px"
                                        fontSize="13px"
                                        _focus={{ borderColor: '#E03030' }}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontSize="12px" color="#8A8A93" fontWeight="600" textTransform="uppercase">
                                        {t('common.email', 'Email Address')}
                                    </FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={addForm.email}
                                        onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                                        bg="#0A0C10"
                                        border="1px solid #1e2028"
                                        borderRadius="10px"
                                        fontSize="13px"
                                        _focus={{ borderColor: '#E03030' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize="12px" color="#8A8A93" fontWeight="600" textTransform="uppercase">
                                        {t('auth.password', 'Initial Password')} (123456)
                                    </FormLabel>
                                    <Input
                                        type="password"
                                        placeholder="Leave blank for 123456"
                                        value={addForm.password}
                                        onChange={e => setAddForm({ ...addForm, password: e.target.value })}
                                        bg="#0A0C10"
                                        border="1px solid #1e2028"
                                        borderRadius="10px"
                                        fontSize="13px"
                                        _focus={{ borderColor: '#E03030' }}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize="12px" color="#8A8A93" fontWeight="600" textTransform="uppercase">
                                        {t('admin.phone', 'Phone Number')}
                                    </FormLabel>
                                    <Input
                                        placeholder="0912345678"
                                        value={addForm.phone}
                                        onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                                        bg="#0A0C10"
                                        border="1px solid #1e2028"
                                        borderRadius="10px"
                                        fontSize="13px"
                                        _focus={{ borderColor: '#E03030' }}
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter borderTop="1px solid #1e2028">
                            <Button variant="ghost" mr="3" onClick={() => setIsAddOpen(false)} color="#8A8A93" size="sm">
                                {t('common.cancel', 'Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                bg="#E03030"
                                color="white"
                                size="sm"
                                fontWeight="700"
                                px="5"
                                _hover={{ bg: '#c52828' }}
                                isLoading={isSubmittingAdd}
                            >
                                {t('admin.addUser', 'Create Account')}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </AdminLayout>
    )
}

export default AdminUsers