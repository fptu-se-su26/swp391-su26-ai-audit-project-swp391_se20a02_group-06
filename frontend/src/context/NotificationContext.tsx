import React, { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useAuthStore } from '../store/useAuthStore'
import { getNotifications, markAsRead, markAllAsRead, type NotificationDto } from '../api/notifications'
import { logWater } from '../api/nutrition'
import { useNavigate } from 'react-router-dom'

interface NotificationContextProps {
    notifications: NotificationDto[]
    unreadCount: number
    isLoading: boolean
    markRead: (id: number) => Promise<void>
    markAllRead: () => Promise<void>
    drinkWaterFromNotification: (notificationId: number) => Promise<void>
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined)

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const toast = useToast()
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const accessToken = useAuthStore((state) => state.accessToken)
    
    const [notifications, setNotifications] = useState<NotificationDto[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [connection, setConnection] = useState<HubConnection | null>(null)
    const [connectionState, setConnectionState] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected')

    // 1. Fetch initial notifications
    const fetchNotifications = async () => {
        if (!isAuthenticated) return
        setIsLoading(true)
        try {
            const data = await getNotifications()
            setNotifications(data)
            setUnreadCount(data.filter((n) => !n.isRead).length)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications()
        } else {
            setNotifications([])
            setUnreadCount(0)
        }
    }, [isAuthenticated])

    // 2. Setup SignalR connection
    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            if (connection) {
                connection.stop()
                setConnection(null)
            }
            return
        }

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5007'
        // Strip trailing /api if present to get server root for Hub route
        const hubUrl = `${baseUrl.replace(/\/api$/, '')}/r/notifications`

        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => accessToken,
            })
            .withAutomaticReconnect()
            .build()

        setConnection(newConnection)
    }, [isAuthenticated, accessToken])

    // 3. Connect and listen
    useEffect(() => {
        if (!connection) return

        const startConnection = async () => {
            try {
                await connection.start()
                setConnectionState('connected')
                console.log('SignalR Notification Hub connected successfully.')

                connection.on('ReceiveNotification', (newNotif: NotificationDto) => {
                    setNotifications((prev) => [newNotif, ...prev])
                    setUnreadCount((prev) => prev + 1)

                    // Get notification style status
                    let toastStatus: 'info' | 'success' | 'warning' | 'error' = 'info'
                    if (newNotif.type === 'EXERCISE_APPROVAL' || newNotif.type === 'WATER_REMINDER') {
                        toastStatus = 'success'
                    } else if (newNotif.type === 'EXERCISE_REJECTION' || newNotif.type === 'DEADLINE_APPROACHING') {
                        toastStatus = 'warning'
                    }

                    toast({
                        title: newNotif.title,
                        description: newNotif.content,
                        status: toastStatus,
                        duration: 7000,
                        isClosable: true,
                        position: 'top-right',
                    })
                })

                connection.onreconnecting(() => {
                    console.log('SignalR reconnecting...')
                    setConnectionState('reconnecting')
                })
                connection.onreconnected(() => {
                    console.log('SignalR reconnected.')
                    setConnectionState('connected')
                    fetchNotifications()
                })
                connection.onclose(() => {
                    console.log('SignalR disconnected.')
                    setConnectionState('disconnected')
                })
            } catch (error) {
                console.error('SignalR Hub connection failed:', error)
            }
        }

        startConnection()

        return () => {
            connection.off('ReceiveNotification')
            connection.stop()
        }
    }, [connection, toast])

    // 4. Polling fallback: fetch every 30s when SignalR is not connected
    useEffect(() => {
        if (!isAuthenticated) return
        if (connectionState === 'connected') return

        const intervalId = setInterval(() => {
            fetchNotifications()
        }, 30000)

        return () => clearInterval(intervalId)
    }, [isAuthenticated, connectionState])

    // 5. Notification actions
    const markRead = async (id: number) => {
        try {
            await markAsRead(id)
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    const markAllRead = async () => {
        try {
            await markAllAsRead()
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
            setUnreadCount(0)
            toast({
                title: 'All marked as read',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    const getNextReminderTime = (remaining: number, startTime?: string, endTime?: string): string => {
        const now = new Date()
        const start = startTime || '07:00'
        const end = endTime || '22:00'
        const [startH, startM] = start.split(':').map(Number)
        const [endH, endM] = end.split(':').map(Number)
        const startMin = startH * 60 + startM
        const endMin = endH * 60 + endM
        const nowMin = now.getHours() * 60 + now.getMinutes()

        if (nowMin >= endMin) return `Tomorrow ${start}`
        if (nowMin < startMin) return `Today ${start}`
        if (remaining <= 0) return `Done for today!`

        const hoursLeft = (endMin - nowMin) / 60
        const intervalMinutes = Math.round((hoursLeft / remaining) * 60)
        const nextReminder = new Date(now.getTime() + intervalMinutes * 60000)
        const nextH = String(nextReminder.getHours()).padStart(2, '0')
        const nextM = String(nextReminder.getMinutes()).padStart(2, '0')
        return `${nextH}:${nextM}`
    }

    const drinkWaterFromNotification = async (notificationId: number) => {
        try {
            const todayStr = new Date().toISOString().split('T')[0]
            
            // Log 1 glass of water
            const result = await logWater(todayStr, 1)
            
            // Mark notification as read
            await markRead(notificationId)

            const waterConsumedGlasses = result?.waterConsumedGlasses ?? 0
            const waterTargetGlasses = result?.waterTargetGlasses ?? 8
            const remaining = Math.max(0, waterTargetGlasses - waterConsumedGlasses)
            const nextTime = getNextReminderTime(remaining, result?.waterReminderStartTime, result?.waterReminderEndTime)
            const nextMsg = nextTime.startsWith('Tomorrow') || nextTime.startsWith('Today')
                ? `Next reminder: ${nextTime}`
                : `Next reminder at ~${nextTime}`

            toast({
                title: 'Water Logged! 🥛',
                description: `+1 glass (${remaining} left). ${nextMsg}`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            })

            // Navigate to Nutrition page with updated water count
            navigate('/nutrition', { state: { waterConsumedGlasses } })
        } catch (error) {
            console.error('Failed to log water from notification:', error)
            toast({
                title: 'Failed to log water',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                markRead,
                markAllRead,
                drinkWaterFromNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}
