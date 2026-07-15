import React, { useState, useMemo } from 'react'
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
    Button
} from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout'
import AppButton from '../../components/shared/Button/AppButton'
import { paymentsMock } from '../../mock/admin/paymentsMock'
import { FiSearch, FiCalendar } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { 
    startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
    startOfYear, endOfYear, parse, isWithinInterval 
} from 'date-fns'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionTr = motion(Tr)

const AdminPayments: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [startDate, endDate] = dateRange

    const [activeQuickFilter, setActiveQuickFilter] = useState('All')

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
        return paymentsMock.recentTransactions.filter(t => {
            // Search filter
            const matchSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                t.user.toLowerCase().includes(searchTerm.toLowerCase())
            
            // Status filter
            const matchStatus = statusFilter === 'All' || t.status === statusFilter

            // Date filter
            let matchDate = true
            if (startDate && endDate) {
                try {
                    // Date format from mock is 'MMM dd, yyyy' e.g. 'Nov 14, 2023'
                    const tDate = parse(t.date, 'MMM dd, yyyy', new Date())
                    matchDate = isWithinInterval(tDate, { start: startDate, end: endDate })
                } catch(e) {
                    // if parsing fails, ignore date filter
                }
            }

            return matchSearch && matchStatus && matchDate
        })
    }, [searchTerm, statusFilter, startDate, endDate])

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Completed': return { bg: 'green.900', color: 'green.300' }
            case 'Pending': return { bg: 'yellow.900', color: 'yellow.300' }
            case 'Failed': return { bg: 'red.900', color: 'red.300' }
            case 'Refunded': return { bg: 'gray.700', color: 'gray.300' }
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

    const statWidgets = [
        { label: 'Gross Revenue', value: `$${paymentsMock.grossRevenue.toLocaleString()}`, color: 'white' },
        { label: 'Net Revenue', value: `$${paymentsMock.netRevenue.toLocaleString()}`, color: '#E03030' },
        { label: 'Failed & Returns', value: `$${paymentsMock.returns.toLocaleString()}`, color: '#8A8A93' },
        { label: 'Pending Payout', value: `$${paymentsMock.pendingPayout.toLocaleString()}`, color: 'yellow.400' },
    ]

    return (
        <AdminLayout>
            <style>{datePickerStyles}</style>
            <Box p="7" maxW="1200px" mx="auto">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="28px" fontWeight="900" color="white" textTransform="uppercase">
                        Payments & Revenue
                    </Heading>
                    <AppButton label="Export Report" size="sm" />
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
                                    placeholder="Search ID or User..." 
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
                                <option value="All" style={{ background: '#141720' }}>All Status</option>
                                <option value="Completed" style={{ background: '#141720' }}>Completed</option>
                                <option value="Pending" style={{ background: '#141720' }}>Pending</option>
                                <option value="Failed" style={{ background: '#141720' }}>Failed</option>
                                <option value="Refunded" style={{ background: '#141720' }}>Refunded</option>
                            </Select>
                        </HStack>

                        <HStack spacing={3}>
                            <HStack spacing={2} bg="#0A0C10" p="1" borderRadius="md" border="1px solid #1e2028">
                                {['All', 'Week', 'Month', 'Year'].map(filter => (
                                    <Button 
                                        key={filter} 
                                        size="xs" 
                                        variant={activeQuickFilter === filter ? 'solid' : 'ghost'}
                                        bg={activeQuickFilter === filter ? '#1e2028' : 'transparent'}
                                        color={activeQuickFilter === filter ? 'white' : '#8A8A93'}
                                        _hover={{ bg: '#1e2028', color: 'white' }}
                                        onClick={() => handleQuickFilter(filter)}
                                    >
                                        {filter}
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
                                    onChange={(update) => {
                                        setDateRange(update);
                                        setActiveQuickFilter('Custom');
                                    }}
                                    placeholderText="Select date range"
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
                    <Table variant="simple" size="sm">
                        <Thead bg="#0A0C10">
                            <Tr>
                                <Th color="#8A8A93" borderColor="#1e2028">Transaction ID</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">User</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">Plan</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">Date</Th>
                                <Th color="#8A8A93" borderColor="#1e2028" isNumeric>Amount</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">Status</Th>
                                <Th color="#8A8A93" borderColor="#1e2028" textAlign="right">Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((t: any, idx) => (
                                    <MotionTr 
                                        key={t.id} 
                                        _hover={{ bg: 'rgba(255,255,255,0.02)' }}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (idx * 0.05) }}
                                    >
                                        <Td color="#8A8A93" borderColor="#1e2028" fontSize="12px" fontFamily="monospace">{t.id}</Td>
                                        <Td color="white" borderColor="#1e2028" fontWeight="600">{t.user}</Td>
                                        <Td borderColor="#1e2028">
                                            <Text color={t.plan === 'Pro' || t.plan === 'Elite' ? '#E03030' : '#8A8A93'} fontWeight="700" fontSize="12px" textTransform="uppercase">{t.plan}</Text>
                                        </Td>
                                        <Td color="#8A8A93" borderColor="#1e2028">{t.date}</Td>
                                        <Td color="white" borderColor="#1e2028" isNumeric fontWeight="800">${t.amount.toFixed(2)}</Td>
                                        <Td borderColor="#1e2028">
                                            <Badge
                                                {...getStatusColor(t.status)}
                                                px="2" py="0.5" borderRadius="md" textTransform="none" fontSize="11px" fontWeight="700"
                                            >
                                                {t.status}
                                            </Badge>
                                        </Td>
                                        <Td borderColor="#1e2028" textAlign="right">
                                            <Button size="xs" variant="ghost" color="#3182ce" _hover={{ bg: 'rgba(49, 130, 206, 0.1)' }}>View</Button>
                                        </Td>
                                    </MotionTr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan={7} textAlign="center" py="10" color="#8A8A93" borderColor="#1e2028">
                                        No transactions found matching your filters.
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </MotionBox>
            </Box>
        </AdminLayout>
    )
}

export default AdminPayments