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
    Grid,
    Input,
    Select,
    InputGroup,
    InputLeftElement,
    HStack,
    VStack,
    Button,
    Spinner,
    useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, IconButton
} from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import { FiSearch, FiCalendar, FiX, FiRefreshCw } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { 
    startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
    startOfYear, endOfYear, isWithinInterval 
} from 'date-fns'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import PaginationFooter from '../../features/admin/components/PaginationFooter'
import { useTranslation } from 'react-i18next'

const MotionBox = motion(Box)
const MotionTr = motion(Tr)

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const DetailRow: React.FC<{ label: string; value: string; mono?: boolean; color?: string; children?: React.ReactNode }> = ({ label, value, mono, color, children }) => (
  <Flex justify="space-between" align="center">
    <Text fontSize="13px" color="#8A8A93">{label}</Text>
    <HStack>
      <Text fontSize="13px" color={color || 'white'} fontWeight="600" fontFamily={mono ? 'monospace' : undefined}>{value}</Text>
      {children}
    </HStack>
  </Flex>
)

const AdminPayments: React.FC = () => {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [startDate, endDate] = dateRange
    const [activeQuickFilter, setActiveQuickFilter] = useState('All')
    const [selectedPayment, setSelectedPayment] = useState<any>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const toast = useToast()

    const { data: payments, isLoading, error, mutate } = useSWR<any[]>('/payments', fetcher)

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true)
            await mutate(undefined, { revalidate: true })
            toast({
                title: t('admin.refreshedTitle', 'Refreshed'),
                description: t('admin.refreshedDesc', 'Transaction records have been synchronized successfully.'),
                status: 'success',
                duration: 2500,
                isClosable: true,
                position: 'top-right',
            })
        } catch (err) {
            toast({
                title: t('admin.refreshFailedTitle', 'Refresh Failed'),
                description: t('admin.refreshFailedDesc', 'An error occurred while synchronizing transaction data.'),
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            })
        } finally {
            setIsRefreshing(false)
        }
    }

    const computedStats = useMemo(() => {
        if (!payments || !Array.isArray(payments)) return null
        const completed = payments.filter(p => p.status === 'SUCCESS')
        const grossRevenue = completed.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
        const pending = payments.filter(p => p.status === 'PENDING')
        const pendingAmount = pending.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
        const failed = payments.filter(p => p.status === 'FAILED')
        const failedAmount = failed.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
        return { grossRevenue, pendingAmount, failedAmount, totalPayments: payments.length }
    }, [payments])

    const handleQuickFilter = (type: string) => {
        setActiveQuickFilter(type)
        const today = new Date()
        switch (type) {
            case 'Week':
                setDateRange([startOfWeek(today), endOfWeek(today)])
                break
            case 'Month':
                setDateRange([startOfMonth(today), endOfMonth(today)])
                break
            case 'Year':
                setDateRange([startOfYear(today), endOfYear(today)])
                break
            default:
                setDateRange([null, null])
        }
    }

    const filteredTransactions = useMemo(() => {
        if (!payments || !Array.isArray(payments)) return []
        return payments.filter(t => {
            const searchStr = searchTerm.toLowerCase()
            const matchSearch = (t.orderCode?.toString() || '').includes(searchStr) || 
                                (t.userName || '').toLowerCase().includes(searchStr) ||
                                (t.userEmail || '').toLowerCase().includes(searchStr) ||
                                (t.transactionCode || '').toLowerCase().includes(searchStr)
            
            const pStatus = t.status === 'SUCCESS' ? 'Completed' : t.status === 'FAILED' ? 'Failed' : t.status === 'PENDING' ? 'Pending' : t.status
            const matchStatus = statusFilter === 'All' || pStatus === statusFilter

            let matchDate = true
            if (startDate && endDate) {
                if (!t.paidAt) {
                    matchDate = false
                } else {
                    const tDate = new Date(t.paidAt)
                    if (!isNaN(tDate.getTime())) {
                        matchDate = isWithinInterval(tDate, { start: startDate, end: endDate })
                    } else {
                        matchDate = false
                    }
                }
            }

            return matchSearch && matchStatus && matchDate
        })
    }, [payments, searchTerm, statusFilter, startDate, endDate])

    // Pagination state (10 transactions per page)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter, startDate, endDate, activeQuickFilter])

    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
    const safePage = Math.min(currentPage, totalPages)
    const paginatedTransactions = useMemo(() => {
        const start = (safePage - 1) * pageSize
        return filteredTransactions.slice(start, start + pageSize)
    }, [filteredTransactions, safePage, pageSize])

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Completed': return { bg: 'green.900', color: 'green.300' }
            case 'Pending': return { bg: 'yellow.900', color: 'yellow.300' }
            case 'Failed': return { bg: 'red.900', color: 'red.300' }
            default: return { bg: '#2e3040', color: '#e2e1eb' }
        }
    }

    // Custom CSS for DatePicker in Dark Mode
    const datePickerStyles = `
        .react-datepicker-wrapper { display: block; width: 100%; }
        .react-datepicker__input-container input {
            width: 100%;
            background-color: transparent;
            border: 1px solid #1e2028;
            border-radius: 8px;
            padding: 8px 12px 8px 36px;
            color: white;
            font-size: 14px;
            height: 40px;
        }
        .react-datepicker__input-container input:focus {
            outline: none;
            border-color: #3182ce;
        }
        .react-datepicker {
            background-color: #141720;
            border: 1px solid #1e2028;
            color: white;
            font-family: inherit;
        }
        .react-datepicker__header {
            background-color: #0A0C10;
            border-bottom: 1px solid #1e2028;
        }
        .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
            color: white;
        }
        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
            color: #8A8A93;
        }
        .react-datepicker__day:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover {
            background-color: #1e2028;
        }
        .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range {
            background-color: #E03030;
            color: white;
        }
        .react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected {
            background-color: #E03030;
        }
    `

    const toVnd = (amount?: number) => '₫' + Math.round(Number(amount) || 0).toLocaleString('vi-VN')

    const statWidgets = computedStats ? [
        { label: t('admin.grossRevenue', 'Gross Revenue (PayOS)'), value: toVnd(computedStats.grossRevenue), color: 'white' },
        { label: t('admin.netRevenue', 'Net Revenue'), value: toVnd(computedStats.grossRevenue - computedStats.failedAmount), color: '#E03030' },
        { label: t('admin.failed', 'Failed'), value: toVnd(computedStats.failedAmount), color: '#8A8A93' },
        { label: t('admin.pending', 'Pending'), value: toVnd(computedStats.pendingAmount), color: 'yellow.400' },
    ] : [
        { label: t('admin.grossRevenue', 'Gross Revenue (PayOS)'), value: '---', color: 'white' },
        { label: t('admin.netRevenue', 'Net Revenue'), value: '---', color: '#E03030' },
        { label: t('admin.failed', 'Failed'), value: '---', color: '#8A8A93' },
        { label: t('admin.pending', 'Pending'), value: '---', color: 'yellow.400' },
    ]

    return (
        <AdminLayout>
            <style>{datePickerStyles}</style>
            <Box p="7" maxW="1200px" mx="auto">
                <Flex justify="space-between" align="center" mb="7" flexWrap="wrap" gap="4">
                    <Box>
                        <Heading fontSize="28px" fontWeight="900" color="white" textTransform="uppercase">
                            {t('admin.paymentsRevenue', 'Payments & Revenue')}
                        </Heading>
                        <Text fontSize="13px" color="#8A8A93" mt="1">
                            {t('admin.paymentSubtitle', 'Track and manage all payment transactions and financial records across the platform')}
                        </Text>
                    </Box>
                    <Button
                        leftIcon={<FiRefreshCw />}
                        size="sm"
                        variant="outline"
                        borderColor="#1e2028"
                        color="white"
                        _hover={{ bg: '#1e2028' }}
                        isLoading={isRefreshing || isLoading}
                        loadingText={t('common.refreshing', 'Refreshing...')}
                        onClick={handleRefresh}
                    >
                        {t('common.refresh', 'Refresh')}
                    </Button>
                </Flex>

                <Grid templateColumns="repeat(4, 1fr)" gap="4" mb="7">
                    {statWidgets.map((stat, idx) => (
                        <MotionBox 
                            key={idx}
                            bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                        >
                            <Text fontSize="12px" color="#8A8A93" textTransform="uppercase" fontWeight="700" mb="2">{stat.label}</Text>
                            <Text fontSize="28px" fontWeight="900" color={stat.color} lineHeight="1">{stat.value}</Text>
                        </MotionBox>
                    ))}
                </Grid>

                {/* Filters Section */}
                <MotionBox 
                    bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="5" mb="6"
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                >
                    <Flex justify="space-between" align="center" flexWrap="wrap" gap="4">
                        <HStack spacing={4} flex="1">
                            <InputGroup maxW="300px" size="md">
                                <InputLeftElement pointerEvents="none" h="100%" display="flex" alignItems="center" justifyContent="center">
                                    <FiSearch color="#8A8A93" />
                                </InputLeftElement>
                                <Input 
                                    placeholder={t('admin.searchIdOrUser', 'Search ID or User...')} 
                                    variant="outline" 
                                    borderColor="#1e2028" 
                                    color="white"
                                    _hover={{ borderColor: '#3182ce' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    pl="10"
                                />
                            </InputGroup>
                            
                            <Select 
                                maxW="200px" 
                                borderColor="#1e2028" 
                                color="white" 
                                bg="#141720"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All" style={{ background: '#141720' }}>{t('admin.allStatus', 'All Status')}</option>
                                <option value="Completed" style={{ background: '#141720' }}>{t('admin.completed', 'Completed')}</option>
                                <option value="Pending" style={{ background: '#141720' }}>{t('admin.pending', 'Pending')}</option>
                                <option value="Failed" style={{ background: '#141720' }}>{t('admin.failed', 'Failed')}</option>
                            </Select>
                        </HStack>

                        <HStack spacing={3}>
                            <HStack spacing={2} bg="#0A0C10" p="1" borderRadius="md" border="1px solid #1e2028">
                                {[
                                    { key: 'All', label: t('admin.all', 'All') },
                                    { key: 'Week', label: t('admin.week', 'Week') },
                                    { key: 'Month', label: t('admin.month', 'Month') },
                                    { key: 'Year', label: t('admin.year', 'Year') }
                                ].map(f => (
                                    <Button 
                                        key={f.key} 
                                        size="xs" 
                                        variant={activeQuickFilter === f.key ? 'solid' : 'ghost'}
                                        bg={activeQuickFilter === f.key ? '#1e2028' : 'transparent'}
                                        color={activeQuickFilter === f.key ? 'white' : '#8A8A93'}
                                        _hover={{ bg: '#1e2028', color: 'white' }}
                                        onClick={() => handleQuickFilter(f.key)}
                                    >
                                        {f.label}
                                    </Button>
                                ))}
                            </HStack>

                            <Box position="relative" width="250px">
                                <Box position="absolute" left="12px" top="12px" zIndex={2}>
                                    <FiCalendar color="#8A8A93" />
                                </Box>
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update: [Date | null, Date | null]) => {
                                        setDateRange(update);
                                        setActiveQuickFilter('Custom');
                                    }}
                                    placeholderText={t('admin.selectDateRange', 'Select date range')}
                                    isClearable={true}
                                />
                            </Box>
                        </HStack>
                    </Flex>
                </MotionBox>

                <MotionBox 
                    bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden"
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                >
                    {isLoading ? (
                        <Flex justify="center" py="10">
                            <Spinner color="#E03030" />
                        </Flex>
                    ) : error ? (
                        <Flex direction="column" align="center" justify="center" py="10">
                            <Text color="red.400" mb="2" fontSize="13px">{t('admin.failedLoadTransactions', 'Failed to load payment transactions. Please check your admin privileges or try again.')}</Text>
                            <Button size="xs" colorScheme="red" variant="outline" onClick={() => mutate()}>{t('common.retry', 'Retry')}</Button>
                        </Flex>
                    ) : (
                        <>
                            <Table variant="simple" size="sm">
                        <Thead bg="#0A0C10">
                            <Tr>
                                <Th color="#8A8A93" borderColor="#1e2028">{t('admin.orderCode', 'Order Code')}</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">{t('admin.user', 'User')}</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">{t('common.package', 'Package')}</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">{t('common.date', 'Date')}</Th>
                                <Th color="#8A8A93" borderColor="#1e2028" isNumeric>{t('common.amount', 'Amount')}</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">{t('common.status', 'Status')}</Th>
                                <Th color="#8A8A93" borderColor="#1e2028" textAlign="right">{t('common.actions', 'Action')}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((tItem: any, idx) => {
                                    const rawStatus = tItem.status === 'SUCCESS' ? 'Completed' : tItem.status === 'FAILED' ? 'Failed' : tItem.status === 'PENDING' ? 'Pending' : tItem.status
                                    const localizedStatus = rawStatus === 'Completed' ? t('admin.completed', 'Completed') : rawStatus === 'Pending' ? t('admin.pending', 'Pending') : rawStatus === 'Failed' ? t('admin.failed', 'Failed') : rawStatus
                                    return (
                                    <MotionTr 
                                        key={`${safePage}-${tItem.id}`} 
                                        _hover={{ bg: 'rgba(255,255,255,0.02)' }}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.035, duration: 0.2 }}
                                    >
                                        <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px" fontFamily="monospace">{tItem.orderCode}</Td>
                                        <Td color="white" borderColor="#1e2028" fontWeight="600">{tItem.userName || tItem.userEmail || 'N/A'}</Td>
                                        <Td borderColor="#1e2028">
                                            <Text color={tItem.packageName ? '#E03030' : '#8A8A93'} fontWeight="700" fontSize="12px" textTransform="uppercase">{tItem.packageName || 'N/A'}</Text>
                                        </Td>
                                        <Td color="#8A8A93" borderColor="#1e2028">{tItem.paidAt ? new Date(tItem.paidAt).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric', year: 'numeric' }) : 'N/A'}</Td>
                                        <Td color="white" borderColor="#1e2028" isNumeric fontWeight="800">{toVnd(tItem.amount)}</Td>
                                        <Td borderColor="#1e2028">
                                            <Badge
                                                {...getStatusColor(rawStatus)}
                                                px="2" py="0.5" borderRadius="md" textTransform="none" fontSize="11px" fontWeight="700"
                                            >
                                                {localizedStatus}
                                            </Badge>
                                        </Td>
                                        <Td borderColor="#1e2028" textAlign="right">
                                            <Button size="xs" variant="ghost" color="#3182ce" _hover={{ bg: 'rgba(49, 130, 206, 0.1)' }} onClick={() => setSelectedPayment(tItem)}>{t('common.view', 'View')}</Button>
                                        </Td>
                                    </MotionTr>
                                    )
                                })
                            ) : (
                                <Tr>
                                    <Td colSpan={7} textAlign="center" py="10" color="#8A8A93" borderColor="#1e2028">
                                        {t('admin.noTransactionsFound', 'No transactions found matching your filters.')}
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>

                    {filteredTransactions.length > 0 && (
                        <PaginationFooter
                            currentPage={safePage}
                            totalPages={totalPages}
                            totalItems={filteredTransactions.length}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    )}
                    </>
                    )}
                </MotionBox>
            </Box>

            {/* Payment Detail Modal */}
            <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} isCentered>
                <ModalOverlay bg="rgba(0,0,0,0.7)" />
                <ModalContent bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" maxW="480px">
                    <ModalHeader borderBottom="1px solid" borderColor="#1e2028">
                        <HStack justify="space-between">
                            <Heading fontSize="18px" color="white" fontWeight="700">{t('admin.paymentDetail', 'Payment Detail')}</Heading>
                            <IconButton
                                aria-label={t('common.close', 'Close')}
                                icon={<FiX />}
                                variant="ghost"
                                color="#8A8A93"
                                onClick={() => setSelectedPayment(null)}
                            />
                        </HStack>
                    </ModalHeader>
                    <ModalBody py="6">
                        {selectedPayment && (
                            <VStack align="stretch" spacing="4">
                                <DetailRow label={t('admin.orderCode', 'Order Code')} value={selectedPayment.orderCode?.toString()} mono />
                                <DetailRow label={t('admin.transactionCode', 'Transaction Code')} value={selectedPayment.transactionCode || 'N/A'} mono />
                                <DetailRow label={t('admin.user', 'User')} value={`${selectedPayment.userName || 'N/A'} (${selectedPayment.userEmail || ''})`} />
                                <DetailRow label={t('common.package', 'Package')} value={selectedPayment.packageName || 'N/A'} />
                                <DetailRow label={t('common.amount', 'Amount')} value={toVnd(selectedPayment.amount)} color="#E03030" />
                                <DetailRow label={t('admin.paymentMethod', 'Payment Method')} value={selectedPayment.paymentMethod || 'N/A'} />
                                <DetailRow label={t('common.status', 'Status')} value={selectedPayment.status === 'SUCCESS' ? t('admin.completed', 'Completed') : selectedPayment.status}>
                                    {(selectedPayment.status === 'SUCCESS' || selectedPayment.status === 'FAILED' || selectedPayment.status === 'PENDING') && (
                                        <Badge ml="2" px="2" py="0.5" borderRadius="md" textTransform="none" fontSize="11px"
                                            bg={selectedPayment.status === 'SUCCESS' ? 'green.900' : selectedPayment.status === 'FAILED' ? 'red.900' : 'yellow.900'}
                                            color={selectedPayment.status === 'SUCCESS' ? 'green.300' : selectedPayment.status === 'FAILED' ? 'red.300' : 'yellow.300'}
                                        >
                                            {selectedPayment.status === 'SUCCESS' ? t('admin.completed', 'Completed') : selectedPayment.status === 'FAILED' ? t('admin.failed', 'Failed') : t('admin.pending', 'Pending')}
                                        </Badge>
                                    )}
                                </DetailRow>
                                <DetailRow label={t('admin.paidAt', 'Paid At')} value={selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'} />
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor="#1e2028">
                        <Button variant="ghost" color="#8A8A93" onClick={() => setSelectedPayment(null)}>{t('common.close', 'Close')}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AdminLayout>
    )
}

export default AdminPayments