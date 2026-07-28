import React from 'react'
import {
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    IconButton,
    Icon,
    Badge,
    Button,
    Flex,
    VStack,
    HStack,
    Text,
} from '@chakra-ui/react'
import { FiBell, FiCheckCircle, FiTrash2 } from 'react-icons/fi'
import { useNotifications } from '../../../context/NotificationContext'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/useAuthStore'

export const NotificationBell: React.FC = () => {
    const navigate = useNavigate()
    const roleId = useAuthStore((state) => state.roleId)
    const { notifications, unreadCount, markRead, markAllRead, clearAll, drinkWaterFromNotification } = useNotifications()

    const getNotificationTypeColor = (type?: string) => {
        switch (type) {
            case 'EXERCISE_REQUEST': return 'purple'
            case 'EXERCISE_SUBMISSION': return 'blue'
            case 'EXERCISE_APPROVAL': return 'green'
            case 'EXERCISE_REJECTION': return 'red'
            case 'DEADLINE_APPROACHING': return 'orange'
            case 'WATER_REMINDER': return 'teal'
            default: return 'gray'
        }
    }

    const formatTime = (timeStr: string) => {
        if (!timeStr) return ''
        let normalized = timeStr
        if (!normalized.endsWith('Z') && !normalized.includes('+')) {
            normalized = normalized + 'Z'
        }
        const date = new Date(normalized)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    const handleNotificationClick = async (notif: any) => {
        if (!notif.isRead) {
            await markRead(notif.id)
        }

        switch (notif.type) {
            case 'EXERCISE_REQUEST':
            case 'DEADLINE_APPROACHING':
            case 'EXERCISE_APPROVAL':
            case 'EXERCISE_REJECTION':
                if (roleId === 2) {
                    navigate('/admin/pt-requests')
                }
                break
            case 'EXERCISE_SUBMISSION':
                if (roleId === 1) {
                    navigate('/admin/exercise-requests')
                }
                break
            case 'WATER_REMINDER':
                if (roleId === 3) {
                    navigate('/nutrition')
                }
                break
            default:
                break
        }
    }

    return (
        <Popover placement="bottom-end" closeOnBlur={true}>
            <PopoverTrigger>
                <Box position="relative" cursor="pointer">
                    <IconButton
                        aria-label="Notifications"
                        icon={<Icon as={FiBell} boxSize="18px" />}
                        variant="ghost"
                        color="#8A8A93"
                        _hover={{ color: 'white', bg: 'rgba(255,255,255,0.05)' }}
                        borderRadius="10px"
                    />
                    {unreadCount > 0 && (
                        <Box
                            position="absolute"
                            top="6px"
                            right="6px"
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg="#E03030"
                        />
                    )}
                </Box>
            </PopoverTrigger>
            <PopoverContent
                bg="#141720"
                borderColor="#1e2028"
                color="white"
                w="320px"
                maxH="450px"
                borderRadius="16px"
                boxShadow="0px 10px 30px rgba(0,0,0,0.5)"
                _focus={{ boxShadow: 'none', outline: 'none' }}
                zIndex={9999}
            >
                <PopoverArrow bg="#141720" />
                <PopoverHeader borderColor="#1e2028" py="3">
                    <Flex justify="space-between" align="center">
                        <HStack spacing="2">
                            <Text fontWeight="800" fontSize="15px">Notifications</Text>
                            {unreadCount > 0 && (
                                <Badge bg="#E03030" color="white" borderRadius="full" px="2" fontSize="10px">
                                    {unreadCount}
                                </Badge>
                            )}
                        </HStack>
                        {unreadCount > 0 && (
                            <HStack spacing="1">
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="red"
                                    fontSize="11px"
                                    leftIcon={<FiCheckCircle />}
                                    onClick={markAllRead}
                                    _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                                >
                                    Mark Read
                                </Button>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    color="gray.400"
                                    fontSize="11px"
                                    leftIcon={<FiTrash2 />}
                                    onClick={clearAll}
                                    _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                                >
                                    Clear All
                                </Button>
                            </HStack>
                        )}
                        {notifications.length > 0 && unreadCount === 0 && (
                            <Button
                                size="xs"
                                variant="ghost"
                                color="gray.400"
                                fontSize="11px"
                                leftIcon={<FiTrash2 />}
                                onClick={clearAll}
                                _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                            >
                                Clear All
                            </Button>
                        )}
                    </Flex>
                </PopoverHeader>
                <PopoverBody overflowY="auto" maxH="350px" p="2">
                    <VStack spacing="2" align="stretch">
                        {notifications.length === 0 ? (
                            <Box py="6" textAlign="center">
                                <Text color="#8A8A93" fontSize="13px">No notifications yet.</Text>
                            </Box>
                        ) : (
                            notifications.map((notif) => (
                                <Box
                                    key={notif.id}
                                    p="3"
                                    borderRadius="10px"
                                    bg={notif.isRead ? 'transparent' : 'rgba(255,255,255,0.02)'}
                                    borderLeft="3px solid"
                                    borderLeftColor={notif.isRead ? 'transparent' : '#E03030'}
                                    _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                                    cursor="pointer"
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <Flex justify="space-between" align="start" mb="1">
                                        <Badge
                                            colorScheme={getNotificationTypeColor(notif.type)}
                                            fontSize="9px"
                                            borderRadius="md"
                                        >
                                            {notif.type?.replace('_', ' ') || 'SYSTEM'}
                                        </Badge>
                                        <Text fontSize="10px" color="#8A8A93">
                                            {formatTime(notif.createdAt)}
                                        </Text>
                                    </Flex>
                                    <Text fontSize="13px" fontWeight="700" color="white" mb="1">
                                        {notif.title}
                                    </Text>
                                    <Text fontSize="12px" color="#8A8A93" mb="2">
                                        {notif.content}
                                    </Text>

                                    {/* Water reminder direct action */}
                                    {notif.type === 'WATER_REMINDER' && !notif.isRead && (
                                        <Button
                                            size="xs"
                                            colorScheme="teal"
                                            w="full"
                                            mt="1"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                drinkWaterFromNotification(notif.id)
                                            }}
                                        >
                                            I drank a glass 🥛
                                        </Button>
                                    )}
                                </Box>
                            ))
                        )}
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
export default NotificationBell
