import { useState, useCallback, useMemo } from 'react'
import useSWR from 'swr'
import apiClient from '../../../lib/axios'
import type { Session, SessionType, BookingState, WeekDay, SessionStatus, SessionPeriod } from '../types/pt'
import { useToast } from '@chakra-ui/react'
import { useAuthStore } from '../../../store/useAuthStore'
import { jwtDecode } from 'jwt-decode'

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

interface BookedSlotDto {
    id: number
    startTime: string
    endTime: string
    status: string
    description?: string
    memberId?: number
}

interface PTBookingContext {
    weekOffset: number
    weekDays: WeekDay[]
    selectedDayIdx: number
    weekLabel: string
    onPrevWeek: () => void
    onNextWeek: () => void
    onSelectDay: (idx: number) => void
    sessions: Session[]
    bookedIds: Set<string>
    pendingSession: Session | null
    bookingForm: BookingState | null
    isModalOpen: boolean
    isSubmitting: boolean
    onBookClick: (session: Session) => void
    onSessionTypeChange: (type: SessionType) => void
    onNotesChange: (notes: string) => void
    onConfirm: () => void
    onSimulate: () => void
    onCancel: () => void
    getSessionDate: () => string
}

const generateWeekDays = (offset: number): WeekDay[] => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setDate(monday.getDate() + offset * 7);

    const weekDays: WeekDay[] = [];
    const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const isToday = new Date().toDateString() === d.toDateString();
        weekDays.push({
            label: dayLabels[i],
            date: d.getDate(),
            fullDate: d,
            isToday
        });
    }
    return weekDays;
}

export const usePTBooking = (ptId: number | null): PTBookingContext => {
    const toast = useToast()
    const { accessToken } = useAuthStore()
    const currentUserId = useMemo(() => {
        if (!accessToken) return null
        try {
            const decoded: any = jwtDecode(accessToken)
            return parseInt(decoded.nameid || decoded.sub || decoded.UserId)
        } catch { return null }
    }, [accessToken])

    const [weekOffset, setWeekOffset] = useState(0)
    const [selectedDayIdx, setSelectedDayIdx] = useState(1) // TUE default
    const [pendingSession, setPendingSession] = useState<Session | null>(null)
    const [bookingForm, setBookingForm] = useState<BookingState | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch booked schedules for this PT
    const { data: bookedSlots } = useSWR<BookedSlotDto[]>(
        ptId ? `/schedules/pt/${ptId}` : null,
        fetcher,
        { refreshInterval: 10000 }
    )

    // Week days offset for display
    const weekDays: WeekDay[] = useMemo(() => generateWeekDays(weekOffset), [weekOffset])

    // Week label
    const weekLabel = useMemo(() => {
        const start = weekDays[0].fullDate!
        const end = weekDays[6].fullDate!
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return `${monthNames[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`
    }, [weekDays])

    const getSessionDate = useCallback((): string => {
        const day = weekDays[selectedDayIdx]
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return `${dayNames[selectedDayIdx]}, ${monthNames[day.fullDate!.getMonth()]} ${day.date}`
    }, [weekDays, selectedDayIdx])

    // Sessions derived from selected day and backend data
    const sessions = useMemo(() => {
        if (!bookedSlots) return []

        const dayDate = weekDays[selectedDayIdx].fullDate!
        const startOfDay = new Date(dayDate)
        startOfDay.setHours(0,0,0,0)
        const endOfDay = new Date(dayDate)
        endOfDay.setHours(23,59,59,999)

        // Find slots for this day
        const daySlots = bookedSlots.filter(s => {
            const stStr = s.startTime.endsWith('Z') ? s.startTime : `${s.startTime}Z`
            const t = new Date(stStr).getTime()
            return t >= startOfDay.getTime() && t <= endOfDay.getTime()
        })

        // Sort by time
        daySlots.sort((a,b) => {
            const aT = new Date(a.startTime.endsWith('Z') ? a.startTime : `${a.startTime}Z`).getTime()
            const bT = new Date(b.startTime.endsWith('Z') ? b.startTime : `${b.startTime}Z`).getTime()
            return aT - bT
        })

        return daySlots.map((slot) => {
            const st = new Date(slot.startTime.endsWith('Z') ? slot.startTime : `${slot.startTime}Z`)
            let hours = st.getHours()
            const ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12
            if (hours === 0) hours = 12
            const timeStr = `${hours.toString().padStart(2, '0')}:${st.getMinutes().toString().padStart(2, '0')} ${ampm}`
            
            let status: SessionStatus = 'available'
            let label = slot.description || 'Available'
            if (slot.status === 'Pending' || slot.status === 'Confirmed') {
                if (slot.memberId && slot.memberId === currentUserId) {
                    status = 'booked'
                    label = 'Booked'
                } else {
                    status = 'locked'
                    label = 'Reserved'
                }
            }

            return {
                id: slot.id.toString(),
                time: timeStr,
                label: label,
                period: (st.getHours() < 12 ? 'morning' : st.getHours() < 17 ? 'afternoon' : 'evening') as SessionPeriod,
                status: status
            }
        })
    }, [selectedDayIdx, bookedSlots, weekDays])

    const onPrevWeek = useCallback(() => setWeekOffset((o) => o - 1), [])
    const onNextWeek = useCallback(() => setWeekOffset((o) => o + 1), [])
    const onSelectDay = useCallback((idx: number) => setSelectedDayIdx(idx), [])

    const onBookClick = useCallback((session: Session) => {
        setPendingSession(session)
        setBookingForm({
            sessionId: session.id,
            sessionTime: session.time,
            sessionDate: getSessionDate(),
            sessionType: 'Video Call',
            notes: '',
        })
    }, [getSessionDate])

    const onSessionTypeChange = useCallback((type: SessionType) => {
        setBookingForm((prev) => prev ? { ...prev, sessionType: type } : prev)
    }, [])

    const onNotesChange = useCallback((notes: string) => {
        setBookingForm((prev) => prev ? { ...prev, notes } : prev)
    }, [])

    const onConfirm = useCallback(async () => {
        if (!ptId || !pendingSession) return
        setIsSubmitting(true)
        try {
            const dayDate = weekDays[selectedDayIdx].fullDate!
            const [timePart, modifier] = pendingSession.time.split(' ')
            let [hours, minutes] = timePart.split(':')
            if (hours === '12') hours = '00'
            if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString()
            
            const start = new Date(dayDate)
            start.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
            
            const end = new Date(start.getTime() + 60 * 60 * 1000) // 1 hr later

            const res = await apiClient.post('/schedules/checkout', {
                ptId,
                startTime: start.toISOString(),
                endTime: end.toISOString()
            })

            if (res.data.checkoutUrl) {
                window.location.href = res.data.checkoutUrl
            }
        } catch (error: any) {
            toast({
                title: 'Checkout Failed',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        } finally {
            setIsSubmitting(false)
        }
    }, [ptId, pendingSession, weekDays, selectedDayIdx, toast])

    const onSimulate = useCallback(async () => {
        if (!ptId || !pendingSession) return
        setIsSubmitting(true)
        try {
            const dayDate = weekDays[selectedDayIdx].fullDate!
            const [timePart, modifier] = pendingSession.time.split(' ')
            let [hours, minutes] = timePart.split(':')
            if (hours === '12') hours = '00'
            if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString()
            
            const start = new Date(dayDate)
            start.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
            
            const end = new Date(start.getTime() + 60 * 60 * 1000)

            // Step 1: Create checkout (creates Pending schedule)
            const res = await apiClient.post('/schedules/checkout', {
                ptId,
                startTime: start.toISOString(),
                endTime: end.toISOString()
            })

            // Step 2: Simulate payment confirmation
            if (res.data.orderCode) {
                await apiClient.post(`/jobs/simulate-schedule-payment?orderCode=${res.data.orderCode}`)
                toast({
                    title: 'Payment Simulated',
                    description: 'Booking successfully confirmed via simulation!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                })
                setPendingSession(null)
                setBookingForm(null)
            }
        } catch (error: any) {
            toast({
                title: 'Simulation Failed',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        } finally {
            setIsSubmitting(false)
        }
    }, [ptId, pendingSession, weekDays, selectedDayIdx, toast])

    const onCancel = useCallback(() => {
        setPendingSession(null)
        setBookingForm(null)
    }, [])

    return {
        weekOffset,
        weekDays,
        selectedDayIdx,
        weekLabel,
        onPrevWeek,
        onNextWeek,
        onSelectDay,
        sessions,
        bookedIds: new Set(),
        pendingSession,
        bookingForm,
        isModalOpen: pendingSession !== null,
        isSubmitting,
        onBookClick,
        onSessionTypeChange,
        onNotesChange,
        onConfirm,
        onSimulate,
        onCancel,
        getSessionDate,
    }
}
