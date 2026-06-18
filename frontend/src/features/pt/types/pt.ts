/* ─── PT Booking — Types & Mock Data ─────────────────────────────────── */

export type SessionStatus = 'available' | 'reserved' | 'booked' | 'locked'

export type SessionPeriod = 'morning' | 'afternoon' | 'evening'

export type SessionType = 'Video Call' | 'In-Person at Elite Lab' | 'Recovery Review'

export interface Session {
    id: string
    time: string           // e.g. "08:00 AM"
    label: string          // e.g. "60 min Strength"
    period: SessionPeriod
    status: SessionStatus
}

export interface WeekDay {
    label: string  // "MON"
    date: number   // 17
    isToday: boolean
}

export interface Coach {
    id: string
    name: string
    title: string
    tagline: string
    bio: string
    tags: string[]
    philosophy: string
    isOnline: boolean
    imageUrl: string
    imageAlt: string
}

export interface BookingState {
    sessionId: string
    sessionTime: string
    sessionDate: string  // "Tuesday, June 18"
    sessionType: SessionType
    notes: string
}

/* ─── Mock Data ──────────────────────────────────────────────────────── */

export const MOCK_COACH: Coach = {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    title: 'Elite Performance Coach',
    tagline: 'ELITE PERFORMANCE COACH',
    bio: '15 years coaching elite athletes across NFL and CrossFit. Specialized in systematic strength development and neurological performance optimization.',
    tags: ['Strength', 'Hypertrophy', 'Mobility', 'Metabolic'],
    philosophy:
        '"Precision in movement is the foundation of peak performance. We don\'t just train hard; we train with intent."',
    isOnline: true,
    imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBu6FAbKLDtjhBIwvmD7LGzOfV3tZQC4DY8uj1bTd7MRL6dsiQzAvCVxw0RkkeVSYhmE4V0CmJjYuGjCyqOfTmVZQ7AH--PLBKr8PUQCWw4A0Kak_X_WPqZ4TntN4S38Js79ZSvisG6v7LJCH6rfLI2pBEijzZkSUE9A-6jstg9SJcc_kf3KtRcp0gpH_fOUrMiJ_X-N7Gaa-F5vhmxYktpNgqoMGGCXvOLrNbTa8hem1HdfdHLXgWsIm3JT5DCgGyxl2eEosLwIDNA',
    imageAlt:
        'Elite performance coach Marcus Thorne standing in a dark high-tech gym with red accent lighting.',
}

export const MOCK_WEEK_DAYS: WeekDay[] = [
    { label: 'MON', date: 17, isToday: false },
    { label: 'TUE', date: 18, isToday: true },
    { label: 'WED', date: 19, isToday: false },
    { label: 'THU', date: 20, isToday: false },
    { label: 'FRI', date: 21, isToday: false },
    { label: 'SAT', date: 22, isToday: false },
    { label: 'SUN', date: 23, isToday: false },
]

const buildSessions = (): Session[] => [
    // Morning
    { id: 'mon-0800', time: '08:00 AM', label: '60 min Strength', period: 'morning', status: 'available' },
    { id: 'mon-0930', time: '09:30 AM', label: 'Reserved', period: 'morning', status: 'reserved' },
    // Afternoon
    { id: 'mon-1400', time: '02:00 PM', label: 'Elite Mobility Peak', period: 'afternoon', status: 'available' },
    { id: 'mon-1530', time: '03:30 PM', label: 'Power & Velocity', period: 'afternoon', status: 'available' },
    { id: 'mon-1700', time: '05:00 PM', label: 'Hypertrophy Lab', period: 'afternoon', status: 'available' },
    // Evening
    { id: 'mon-1900', time: '07:00 PM', label: 'Recovery Protocol', period: 'evening', status: 'available' },
]

/** Generate sessions per day index (0=MON) */
export const getSessionsForDay = (dayIndex: number): Session[] => {
    const base = buildSessions()
    // Vary availability per day for realism
    const dayVariants: Partial<Record<number, Partial<Record<string, SessionStatus>>>> = {
        0: { 'mon-1400': 'booked' },
        2: { 'mon-0800': 'locked', 'mon-1700': 'reserved' },
        3: { 'mon-0930': 'available', 'mon-1900': 'locked' },
        4: { 'mon-1400': 'booked', 'mon-1530': 'reserved' },
        5: { 'mon-0800': 'available', 'mon-0930': 'available' },
        6: { 'mon-0800': 'locked', 'mon-0930': 'locked', 'mon-1900': 'locked' },
    }
    const overrides = dayVariants[dayIndex] ?? {}
    return base.map((s) => ({
        ...s,
        id: s.id.replace('mon', MOCK_WEEK_DAYS[dayIndex].label.toLowerCase()),
        status: (overrides[s.id] as SessionStatus | undefined) ?? s.status,
    }))
}