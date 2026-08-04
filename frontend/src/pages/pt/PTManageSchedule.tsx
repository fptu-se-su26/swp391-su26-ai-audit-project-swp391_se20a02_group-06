import React, { useState } from 'react'
import { Box, Button, Flex, Heading, Text, Input, useToast, IconButton, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import apiClient from '../../lib/axios'
import useSWR from 'swr'
import { getPTProfile } from '../../api/ptProfile'
import AdminLayout from '../../components/shared/Layout/AdminLayout'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

interface ScheduleSlot {
    id: number
    startTime: string
    endTime: string
    status: string
    description: string
}

const PTManageSchedule: React.FC = () => {
    const toast = useToast()
    
    const { data: profile } = useSWR('ptProfile', getPTProfile)

    const { data: slots, mutate } = useSWR<ScheduleSlot[]>(
        profile?.id ? `/schedules/pt/${profile.id}` : null,
        fetcher
    )

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const availableSlots = slots?.filter(s => s.status === 'Available') || []
    const bookedSlotsList = slots?.filter(s => s.status === 'Pending' || s.status === 'Confirmed') || []

    // Bulk state
    const [bulkStartDate, setBulkStartDate] = useState('')
    const [bulkEndDate, setBulkEndDate] = useState('')
    const [bulkDays, setBulkDays] = useState<number[]>([])
    
    interface BulkTimeSlot {
        startTime: string;
        description: string;
    }
    const [bulkTimeSlots, setBulkTimeSlots] = useState<BulkTimeSlot[]>([{ startTime: '', description: '' }])
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false)

    const handleAddSlot = async () => {
        if (!date || !time) {
            toast({ title: 'Date and Time required', status: 'warning', duration: 2000 })
            return
        }
        setIsSubmitting(true)
        try {
            const startDateTime = new Date(`${date}T${time}`)
            if (startDateTime < new Date()) {
                toast({ title: 'Cannot publish slots in the past', status: 'error', duration: 3000 })
                setIsSubmitting(false)
                return
            }

            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1 hr default

            await apiClient.post('/schedules/availability', {
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                description: description || 'Available'
            })
            
            toast({ title: 'Slot added successfully', status: 'success', duration: 2000 })
            setDate('')
            setTime('')
            setDescription('')
            mutate() // Refresh slots
        } catch (error: any) {
            toast({ title: 'Failed to add slot', description: error.response?.data?.message, status: 'error', duration: 3000 })
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleDay = (day: number) => {
        setBulkDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
    }

    const handleBulkSubmit = async () => {
        // Filter out empty slots
        const validSlots = bulkTimeSlots.filter(s => s.startTime);

        if (!bulkStartDate || !bulkEndDate || bulkDays.length === 0 || validSlots.length === 0) {
            toast({ title: 'Please fill all required fields and add at least one valid time slot', status: 'warning', duration: 3000 })
            return
        }
        
        // Auto-calculate 1 hour duration and convert to UTC for backend
        const timeSlotsPayload = validSlots.map(slot => {
            const [hours, minutes] = slot.startTime.split(':').map(Number);
            const startLocal = new Date(2000, 0, 1, hours, minutes);
            const endLocal = new Date(2000, 0, 1, hours + 1, minutes);
            
            // Extract HH:mm from UTC ISO string
            const utcStartTimeStr = startLocal.toISOString().substring(11, 16);
            const utcEndTimeStr = endLocal.toISOString().substring(11, 16);
            
            return {
                startTime: utcStartTimeStr,
                endTime: utcEndTimeStr,
                description: slot.description
            };
        });

        setIsBulkSubmitting(true)
        try {
            await apiClient.post('/schedules/bulk-availability', {
                startDate: bulkStartDate,
                endDate: bulkEndDate,
                daysOfWeek: bulkDays,
                timeSlots: timeSlotsPayload
            })
            toast({ title: 'Recurring schedule added', status: 'success', duration: 2000 })
            setBulkStartDate('')
            setBulkEndDate('')
            setBulkDays([])
            setBulkTimeSlots([{ startTime: '', description: '' }])
            mutate()
        } catch (error: any) {
            toast({ title: 'Failed to add schedule', description: error.response?.data?.message, status: 'error', duration: 3000 })
        } finally {
            setIsBulkSubmitting(false)
        }
    }

    const handleDeleteSlot = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this open slot?')) return
        try {
            await apiClient.delete(`/schedules/availability/${id}`)
            toast({ title: 'Slot removed', status: 'success', duration: 2000 })
            mutate()
        } catch (error: any) {
            toast({ title: 'Failed to delete slot', description: error.response?.data?.message, status: 'error', duration: 3000 })
        }
    }

    return (
        <AdminLayout title="Schedule">
            <Box p="6">
                <Heading size="lg" mb="6" color="white">Manage Availability</Heading>

            <Box bg="#1a1b22" p="6" borderRadius="12px" border="1px solid #262626" mb="8">
                <Text fontSize="md" fontWeight="bold" color="white" mb="4">Publish a New Open Slot</Text>
                <Flex gap="4" direction={{ base: 'column', md: 'row' }} align="flex-end">
                    <Box flex="1">
                        <Text color="#C8C6C5" fontSize="sm" mb="1">Date</Text>
                        <Input type="date" bg="#141414" border="none" color="white" value={date} onChange={e => setDate(e.target.value)} />
                    </Box>
                    <Box flex="1">
                        <Text color="#C8C6C5" fontSize="sm" mb="1">Start Time</Text>
                        <Input type="time" bg="#141414" border="none" color="white" value={time} onChange={e => setTime(e.target.value)} />
                    </Box>
                    <Box flex="2">
                        <Text color="#C8C6C5" fontSize="sm" mb="1">Description (e.g. 60 min Strength)</Text>
                        <Input placeholder="Description" bg="#141414" border="none" color="white" value={description} onChange={e => setDescription(e.target.value)} />
                    </Box>
                    <Button bg="#E03030" color="white" _hover={{ bg: '#c92a2a' }} onClick={handleAddSlot} isLoading={isSubmitting} px="8">
                        Publish Slot
                    </Button>
                </Flex>
            </Box>

            <Box bg="#1a1b22" p="6" borderRadius="12px" border="1px solid #262626" mb="8">
                <Text fontSize="md" fontWeight="bold" color="white" mb="4">Set Recurring Schedule (Bulk Add)</Text>
                <Flex gap="4" direction={{ base: 'column', md: 'row' }} mb="4">
                    <Box flex="1">
                        <Text color="#C8C6C5" fontSize="sm" mb="1">Start Date</Text>
                        <Input type="date" bg="#141414" border="none" color="white" value={bulkStartDate} onChange={e => setBulkStartDate(e.target.value)} />
                    </Box>
                    <Box flex="1">
                        <Text color="#C8C6C5" fontSize="sm" mb="1">End Date</Text>
                        <Input type="date" bg="#141414" border="none" color="white" value={bulkEndDate} onChange={e => setBulkEndDate(e.target.value)} />
                    </Box>
                </Flex>

                <Box mb="4">
                    <Text color="#C8C6C5" fontSize="sm" mb="2">Daily Time Slots</Text>
                    {bulkTimeSlots.map((slot, index) => (
                        <Flex key={index} gap="4" direction={{ base: 'column', md: 'row' }} mb="3" align="center">
                            <Box flex="1">
                                <Input type="time" bg="#141414" border="none" color="white" value={slot.startTime} onChange={e => {
                                    const newSlots = [...bulkTimeSlots];
                                    newSlots[index].startTime = e.target.value;
                                    setBulkTimeSlots(newSlots);
                                }} />
                            </Box>
                            <Box flex="2">
                                <Input placeholder="Description (Optional)" bg="#141414" border="none" color="white" value={slot.description} onChange={e => {
                                    const newSlots = [...bulkTimeSlots];
                                    newSlots[index].description = e.target.value;
                                    setBulkTimeSlots(newSlots);
                                }} />
                            </Box>
                            <Button size="sm" bg="transparent" color="#E03030" _hover={{ bg: '#262626' }} onClick={() => {
                                const newSlots = bulkTimeSlots.filter((_, i) => i !== index);
                                setBulkTimeSlots(newSlots.length ? newSlots : [{ startTime: '', description: '' }]);
                            }}>
                                Remove
                            </Button>
                        </Flex>
                    ))}
                    <Button size="sm" bg="#262626" color="white" _hover={{ bg: '#333' }} onClick={() => setBulkTimeSlots([...bulkTimeSlots, { startTime: '', description: '' }])}>
                        + Add Time Slot
                    </Button>
                </Box>
                <Box mb="4">
                    <Text color="#C8C6C5" fontSize="sm" mb="2">Days of Week</Text>
                    <Flex gap="2" wrap="wrap">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                            <Button key={day} size="sm" onClick={() => toggleDay(idx)} bg={bulkDays.includes(idx) ? '#E03030' : '#262626'} color="white" _hover={{ bg: bulkDays.includes(idx) ? '#c92a2a' : '#333' }}>
                                {day}
                            </Button>
                        ))}
                    </Flex>
                </Box>
                <Button bg="#E03030" color="white" _hover={{ bg: '#c92a2a' }} onClick={handleBulkSubmit} isLoading={isBulkSubmitting} w="full" maxW="200px">
                    Add Bulk Slots
                </Button>
            </Box>

            <Box bg="#1a1b22" p="6" borderRadius="12px" border="1px solid #262626">
                <Text fontSize="md" fontWeight="bold" color="white" mb="4">Your Published Open Slots</Text>
                
                {availableSlots.length === 0 ? (
                    <Text color="#C8C6C5">No open slots published yet.</Text>
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th color="#C8C6C5">Date</Th>
                                <Th color="#C8C6C5">Time</Th>
                                <Th color="#C8C6C5">Description</Th>
                                <Th color="#C8C6C5">Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {availableSlots.map(slot => {
                                const st = new Date(slot.startTime.endsWith('Z') ? slot.startTime : `${slot.startTime}Z`)
                                const formattedDate = `${st.getDate().toString().padStart(2, '0')}/${(st.getMonth() + 1).toString().padStart(2, '0')}/${st.getFullYear()}`
                                return (
                                    <Tr key={slot.id}>
                                        <Td color="white">{formattedDate}</Td>
                                        <Td color="white">{st.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Td>
                                        <Td color="white">{slot.description}</Td>
                                        <Td>
                                            <IconButton aria-label="Delete" icon={<FiTrash2 />} size="sm" colorScheme="red" variant="ghost" onClick={() => handleDeleteSlot(slot.id)} />
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                )}
            </Box>

            <Box bg="#1a1b22" p="6" borderRadius="12px" border="1px solid #262626" mt="8">
                <Text fontSize="md" fontWeight="bold" color="white" mb="4">Booked Sessions</Text>
                
                {bookedSlotsList.length === 0 ? (
                    <Text color="#C8C6C5">No sessions booked yet.</Text>
                ) : (
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th color="#C8C6C5">Date</Th>
                                <Th color="#C8C6C5">Time</Th>
                                <Th color="#C8C6C5">Status</Th>
                                <Th color="#C8C6C5">Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bookedSlotsList.map(slot => {
                                const st = new Date(slot.startTime.endsWith('Z') ? slot.startTime : `${slot.startTime}Z`)
                                const formattedDate = `${st.getDate().toString().padStart(2, '0')}/${(st.getMonth() + 1).toString().padStart(2, '0')}/${st.getFullYear()}`
                                return (
                                    <Tr key={slot.id}>
                                        <Td color="white">{formattedDate}</Td>
                                        <Td color="white">{st.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Td>
                                        <Td color="white">
                                            <Box as="span" px="2" py="1" borderRadius="md" bg={slot.status === 'Confirmed' ? 'green.900' : 'yellow.900'} color={slot.status === 'Confirmed' ? 'green.200' : 'yellow.200'} fontSize="xs" fontWeight="bold">
                                                {slot.status}
                                            </Box>
                                        </Td>
                                        <Td>
                                            {slot.status === 'Confirmed' && (
                                                <Button as="a" href="https://meet.google.com/new" target="_blank" size="sm" colorScheme="blue" variant="outline">
                                                    Join Meet
                                                </Button>
                                            )}
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                )}
            </Box>
        </Box>
        </AdminLayout>
    )
}

export default PTManageSchedule
