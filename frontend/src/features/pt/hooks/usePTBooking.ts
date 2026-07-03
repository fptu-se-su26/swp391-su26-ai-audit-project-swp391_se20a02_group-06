/* ─── usePTBooking — State management hook (composition-patterns: state-decouple-implementation) */
import { useState, useCallback, useMemo } from 'react'
import type { Session, SessionType, BookingState, WeekDay } from '../types/pt'
import { MOCK_WEEK_DAYS, getSessionsForDay } from '../types/pt'

interface PTBookingContext {
    // Week navigation
    weekOffset: number
    weekDays: WeekDay[]
    selectedDayIdx: number
    weekLabel: string
    onPrevWeek: () => void
    onNextWeek: () => void
    onSelectDay: (idx: number) => void

    // Sessions
    sessions: Session[]
    bookedIds: Set<string>

    // Booking modal
    pendingSession: Session | null
    bookingForm: BookingState | null
    isModalOpen: boolean
    onBookClick: (session: Session) => void
    onSessionTypeChange: (type: SessionType) => void
    onNotesChange: (notes: string) => void
    onConfirm: () => void
    onCancel: () => void

    // Derived
    getSessionDate: () => string
}

const BASE_MONTH = 'June'
const BASE_YEAR = 2024

export const usePTBooking = (): PTBookingContext => {
    const [weekOffset, setWeekOffset] = useState(0)
    const [selectedDayIdx, setSelectedDayIdx] = useState(1) // TUE default
    const [bookedIds, setBookedIds] = useState<Set<string>>(new Set())
    const [pendingSession, setPendingSession] = useState<Session | null>(null)
    const [bookingForm, setBookingForm] = useState<BookingState | null>(null)

    // Week label
    const weekLabel = useMemo(() => {
        const startDate = MOCK_WEEK_DAYS[0].date + weekOffset * 7
        const endDate = MOCK_WEEK_DAYS[6].date + weekOffset * 7
        return `${BASE_MONTH} ${startDate} – ${endDate}, ${BASE_YEAR}`
    }, [weekOffset])

    // Week days offset for display
    const weekDays: WeekDay[] = useMemo(
        () => MOCK_WEEK_DAYS.map((d) => ({ ...d, date: d.date + weekOffset * 7 })),
        [weekOffset]
    )

    const getSessionDate = useCallback((): string => {
        const day = weekDays[selectedDayIdx]
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        return `${dayNames[selectedDayIdx]}, ${BASE_MONTH} ${day.date}`
    }, [weekDays, selectedDayIdx])

    // Sessions derived from selected day and local booking state (rerender-derived-state).
    const sessions = useMemo(
        () =>
            getSessionsForDay(selectedDayIdx).map((session) =>
                bookedIds.has(session.id) ? { ...session, status: 'booked' as const } : session
            ),
        [selectedDayIdx, bookedIds]
    )

    // Navigation (rerender-functional-setstate)
    const onPrevWeek = useCallback(() => setWeekOffset((o) => o - 1), [])
    const onNextWeek = useCallback(() => setWeekOffset((o) => o + 1), [])
    const onSelectDay = useCallback((idx: number) => setSelectedDayIdx(idx), [])

    // Booking flow
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

    const onConfirm = useCallback(() => {
        if (pendingSession) {
            setBookedIds((prev) => new Set([...prev, pendingSession.id]))
        }
        setPendingSession(null)
        setBookingForm(null)
    }, [pendingSession])

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
        bookedIds,
        pendingSession,
        bookingForm,
        isModalOpen: pendingSession !== null,
        onBookClick,
        onSessionTypeChange,
        onNotesChange,
        onConfirm,
        onCancel,
        getSessionDate,
    }
}