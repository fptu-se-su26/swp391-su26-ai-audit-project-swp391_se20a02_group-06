import React from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Box, useToast } from '@chakra-ui/react'
import { triggerTestWaterReminder } from '../../../api/notifications'
import { useAuthStore } from '../../../store/useAuthStore'

export const NotificationTestWidget: React.FC = () => {
    const location = useLocation()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const roleId = useAuthStore((state) => state.roleId)
    const toast = useToast()

    if (!isAuthenticated || roleId !== 3) return null
    if (location.pathname.includes('/workouts')) return null

    const handleTrigger = async () => {
        try {
            await triggerTestWaterReminder()
        } catch (error) {
            console.error("Failed to trigger test notification:", error)
            toast({
                title: "Trigger Failed",
                description: "Failed to connect to backend notifications tester.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-right"
            })
        }
    }

    return (
        <Box
            position="fixed"
            bottom="20px"
            right="20px"
            zIndex={99999}
        >
            <Button
                colorScheme="teal"
                size="sm"
                borderRadius="full"
                onClick={handleTrigger}
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.4)"
                _hover={{ bg: 'teal.600', transform: 'scale(1.05)' }}
                transition="all 0.2s"
            >
                Test Water Reminder 🥛
            </Button>
        </Box>
    )
}
export default NotificationTestWidget
