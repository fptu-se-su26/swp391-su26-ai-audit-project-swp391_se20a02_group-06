import React, { useState, useEffect, useRef } from 'react'
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Icon,
    Spinner,
    Stack,
    Text,
    Textarea,
    VStack,
    Badge,
    useToast,
    HStack,
    IconButton,
    Avatar,
    Grid,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
} from '@chakra-ui/react'
import {
    FiMessageSquare,
    FiSend,
    FiRefreshCw,
    FiCpu,
    FiZap,
    FiActivity,
    FiDroplet,
    FiInfo,
    FiPrinter,
    FiFileText,
} from 'react-icons/fi'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'
import { sendChatMessage, getChatMessages, getDietHistories, type AIDietHistoryDto } from '../../api/aiChat'
import { type DietPlanResponse } from '../../api/nutrition'

interface LocalMessage {
    role: 'user' | 'assistant' | 'system'
    message: string
    dietPlan?: DietPlanResponse | null
}

const AIChat: React.FC = () => {
    const [messages, setMessages] = useState<LocalMessage[]>([])
    const [inputText, setInputText] = useState('')
    const [sessionId, setSessionId] = useState<number | undefined>(undefined)
    const [activeDietPlan, setActiveDietPlan] = useState<DietPlanResponse | null>(null)
    const [loadingHistory, setLoadingHistory] = useState(false)
    const [sending, setSending] = useState(false)
    const [generatingPlan, setGeneratingPlan] = useState(false)
    const [dietHistories, setDietHistories] = useState<AIDietHistoryDto[]>([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const toast = useToast()

    const initialGreeting: LocalMessage = {
        role: 'assistant',
        message: 'Xin chào! Tôi là Trợ lý Dinh dưỡng AI của hệ thống. Tôi sẽ giúp thiết kế thực đơn ăn uống được cá nhân hóa hoàn toàn dành riêng cho bạn.\n\nĐể bắt đầu, hãy chia sẻ cho tôi biết mục tiêu dinh dưỡng của bạn (Ví dụ: tăng cân, giảm mỡ, giữ dáng), thói quen ăn uống (chay hay mặn), dị ứng thực phẩm, bệnh lý nền (nếu có) hoặc số lượng bữa ăn bạn muốn ăn mỗi ngày nhé!',
        dietPlan: null
    }

    // Load session from localStorage on mount
    useEffect(() => {
        const savedSessionId = localStorage.getItem('ai_chat_session_id')
        if (savedSessionId) {
            const parsedId = parseInt(savedSessionId, 10)
            if (!isNaN(parsedId)) {
                loadHistory(parsedId)
                return
            }
        }
        
        // No session found, use initial greeting
        setMessages([initialGreeting])
    }, [])

    // Scroll to bottom when messages change or typing state changes
    useEffect(() => {
        scrollToBottom()
    }, [messages, sending])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const loadHistory = async (id: number) => {
        setLoadingHistory(true)
        try {
            const history = await getChatMessages(id)
            if (history && history.length > 0) {
                const formattedMessages: LocalMessage[] = history.map(msg => ({
                    role: msg.role as 'user' | 'assistant' | 'system',
                    message: msg.message,
                    dietPlan: msg.dietPlan
                }))
                setMessages(formattedMessages)
                setSessionId(id)

                // Look for the diet plan in history
                const foundPlan = history.find(m => m.dietPlan != null)
                if (foundPlan && foundPlan.dietPlan) {
                    setActiveDietPlan(foundPlan.dietPlan)
                }
            } else {
                // Empty session logic
                localStorage.removeItem('ai_chat_session_id')
                setMessages([initialGreeting])
            }
        } catch (error) {
            console.error('Failed to load chat history:', error)
            toast({
                title: 'Không thể tải lịch sử cuộc trò chuyện.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            localStorage.removeItem('ai_chat_session_id')
            setMessages([initialGreeting])
        } finally {
            setLoadingHistory(false)
        }
    }

    const loadDietHistories = async () => {
        try {
            const data = await getDietHistories()
            setDietHistories(data)
        } catch (error) {
            console.error('Failed to load diet histories:', error)
        }
    }

    const handleOpenHistory = () => {
        loadDietHistories()
        onOpen()
    }

    const handleSelectHistory = (history: AIDietHistoryDto) => {
        if (history.dietPlan) {
            setActiveDietPlan(history.dietPlan)
            // Optionally set session ID if you want to switch chat context, but for now we just show the plan.
        }
        onClose()
    }

    const handleSendMessage = async (textToSend?: string) => {
        const messageText = (textToSend || inputText).trim()
        if (!messageText) return

        if (!textToSend) {
            setInputText('')
        }

        // Add user message to UI
        const newUserMsg: LocalMessage = {
            role: 'user',
            message: messageText,
        }
        setMessages(prev => [...prev, newUserMsg])
        setSending(true)

        try {
            const response = await sendChatMessage(messageText, sessionId)
            
            // Check if response generated a plan immediately
            if (response.isCompleted && response.dietPlan) {
                setGeneratingPlan(true)
                // Short timeout to simulate generating experience and visual transition
                setTimeout(() => {
                    setActiveDietPlan(response.dietPlan || null)
                    setGeneratingPlan(false)
                    toast({
                        title: 'Đã tạo thực đơn dinh dưỡng thành công!',
                        description: 'Hãy kiểm tra thực đơn chi tiết bên cạnh.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    })
                }, 1500)
            }

            // Save session ID
            if (response.sessionId) {
                setSessionId(response.sessionId)
                localStorage.setItem('ai_chat_session_id', response.sessionId.toString())
            }

            // Add assistant response to UI
            const newAssistantMsg: LocalMessage = {
                role: 'assistant',
                message: response.message,
                dietPlan: response.dietPlan,
            }
            setMessages(prev => [...prev, newAssistantMsg])

        } catch (error: any) {
            console.error(error)
            toast({
                title: 'Lỗi gửi tin nhắn.',
                description: error?.response?.data?.detail || error?.message || 'Có lỗi xảy ra khi kết nối với AI.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setSending(false)
        }
    }

    const handleRestartChat = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử cuộc trò chuyện hiện tại và bắt đầu lại không?')) {
            localStorage.removeItem('ai_chat_session_id')
            setSessionId(undefined)
            setMessages([initialGreeting])
            setActiveDietPlan(null)
            setInputText('')
            toast({
                title: 'Đã bắt đầu cuộc trò chuyện mới.',
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    const handleQuickSuggestion = (suggestion: string) => {
        handleSendMessage(suggestion)
    }

    const handlePrint = () => {
        window.print()
    }

    const suggestions = [
        'Tôi muốn giảm mỡ bụng',
        'Lên thực đơn tăng cân',
        'Tôi muốn ăn chay mặn',
        'Tôi bị dị ứng hải sản',
        'Chia làm 4 bữa một ngày',
    ]

    return (
        <MemberLayout>
            <Box p="6" maxW="1280px" mx="auto" className="print-container">
                {/* Header */}
                <Flex align="center" justify="space-between" mb="6" flexWrap="wrap" gap="4" className="no-print">
                    <Flex align="center" gap="4">
                        <Box
                            w="52px"
                            h="52px"
                            borderRadius="16px"
                            bg="rgba(224,48,48,0.1)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxShadow="inset 0 0 10px rgba(224,48,48,0.2)"
                        >
                            <Icon as={FiMessageSquare} color="#E03030" boxSize="22px" />
                        </Box>
                        <Box>
                            <Heading fontSize="22px" color="white" fontWeight="800">
                                Trợ lý Dinh dưỡng AI
                            </Heading>
                            <HStack spacing="2" mt="0.5">
                                <Box
                                    w="8px"
                                    h="8px"
                                    borderRadius="full"
                                    bg="#48BB78"
                                    sx={{
                                        animation: 'pulse 2s infinite',
                                        '@keyframes pulse': {
                                            '0%': { boxShadow: '0 0 0 0 rgba(72, 187, 120, 0.5)' },
                                            '70%': { boxShadow: '0 0 0 8px rgba(72, 187, 120, 0)' },
                                            '100%': { boxShadow: '0 0 0 0 rgba(72, 187, 120, 0)' }
                                        }
                                    }}
                                />
                                <Text fontSize="12px" color="#8A8A93" fontWeight="500">
                                    AI Expert Online
                                </Text>
                            </HStack>
                        </Box>
                    </Flex>
                    <HStack spacing="3">
                        {activeDietPlan && (
                            <Button
                                leftIcon={<Icon as={FiPrinter} />}
                                size="sm"
                                variant="outline"
                                colorScheme="gray"
                                color="white"
                                borderColor="#2e3040"
                                _hover={{ bg: '#1e2028', borderColor: '#8A8A93' }}
                                onClick={handlePrint}
                            >
                                In thực đơn
                            </Button>
                        )}
                        <Button
                            leftIcon={<Icon as={FiFileText} />}
                            size="sm"
                            variant="outline"
                            colorScheme="gray"
                            color="white"
                            borderColor="#2e3040"
                            _hover={{ bg: '#1e2028', borderColor: '#8A8A93' }}
                            onClick={handleOpenHistory}
                        >
                            Lịch sử thực đơn
                        </Button>
                        <Button
                            leftIcon={<Icon as={FiRefreshCw} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            color="#E03030"
                            _hover={{ bg: 'rgba(224,48,48,0.08)' }}
                            onClick={handleRestartChat}
                        >
                            Cuộc trò chuyện mới
                        </Button>
                    </HStack>
                </Flex>

                {/* Main Split Grid */}
                <Grid templateColumns={{ base: "1fr", lg: "1.1fr 1.4fr" }} gap="6" alignItems="stretch">
                    {/* Left Column: Chatbox */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="20px"
                        display="flex"
                        flexDirection="column"
                        h={{ base: "520px", lg: "650px" }}
                        overflow="hidden"
                        className="no-print"
                    >
                        {/* Conversation messages */}
                        <Box
                            flex="1"
                            p="5"
                            overflowY="auto"
                            css={{
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: 'transparent',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#2d313a',
                                    borderRadius: '10px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#3e4452',
                                },
                            }}
                        >
                            {loadingHistory ? (
                                <Flex align="center" justify="center" h="full" direction="column" gap="3">
                                    <Spinner color="#E03030" size="lg" />
                                    <Text fontSize="13px" color="#8A8A93">Đang tải lịch sử hội thoại...</Text>
                                </Flex>
                            ) : (
                                <Stack spacing="4">
                                    {messages.map((msg, idx) => (
                                        <Flex
                                            key={idx}
                                            justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                                            align="flex-start"
                                            gap="3"
                                        >
                                            {msg.role !== 'user' && (
                                                <Avatar
                                                    size="sm"
                                                    name="AI Nutrition"
                                                    bg="rgba(224,48,48,0.12)"
                                                    color="#E03030"
                                                    icon={<FiCpu size="14" />}
                                                />
                                            )}
                                            <Box
                                                maxW="82%"
                                                bg={msg.role === 'user' ? 'linear-gradient(135deg, #E03030 0%, #B91C1C 100%)' : '#1e2230'}
                                                color={msg.role === 'user' ? 'white' : '#E2E1EB'}
                                                px="4"
                                                py="3"
                                                borderRadius={
                                                    msg.role === 'user'
                                                        ? '18px 18px 4px 18px'
                                                        : '18px 18px 18px 4px'
                                                }
                                                boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                                                border={msg.role !== 'user' ? '1px solid' : 'none'}
                                                borderColor="#2d3142"
                                            >
                                                <Text
                                                    fontSize="14px"
                                                    lineHeight="1.6"
                                                    whiteSpace="pre-line"
                                                    fontWeight={msg.role === 'user' ? '500' : '400'}
                                                >
                                                    {msg.message}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    ))}

                                    {/* Typing Indicator */}
                                    {sending && (
                                        <Flex justify="flex-start" align="flex-start" gap="3">
                                            <Avatar
                                                size="sm"
                                                name="AI Nutrition"
                                                bg="rgba(224,48,48,0.12)"
                                                color="#E03030"
                                                icon={<FiCpu size="14" />}
                                            />
                                            <Box
                                                bg="#1e2230"
                                                px="4"
                                                py="3.5"
                                                borderRadius="18px 18px 18px 4px"
                                                border="1px solid"
                                                borderColor="#2d3142"
                                                display="flex"
                                                alignItems="center"
                                                gap="1.5"
                                            >
                                                <Box
                                                    w="6px"
                                                    h="6px"
                                                    bg="#8A8A93"
                                                    borderRadius="full"
                                                    sx={{
                                                        animation: 'bounce 1.4s infinite ease-in-out both',
                                                        '@keyframes bounce': {
                                                            '0%, 80%, 100%': { transform: 'scale(0)' },
                                                            '40%': { transform: 'scale(1)' }
                                                        }
                                                    }}
                                                />
                                                <Box
                                                    w="6px"
                                                    h="6px"
                                                    bg="#8A8A93"
                                                    borderRadius="full"
                                                    sx={{
                                                        animation: 'bounce 1.4s infinite ease-in-out both',
                                                        animationDelay: '0.2s',
                                                        '@keyframes bounce': {
                                                            '0%, 80%, 100%': { transform: 'scale(0)' },
                                                            '40%': { transform: 'scale(1)' }
                                                        }
                                                    }}
                                                />
                                                <Box
                                                    w="6px"
                                                    h="6px"
                                                    bg="#8A8A93"
                                                    borderRadius="full"
                                                    sx={{
                                                        animation: 'bounce 1.4s infinite ease-in-out both',
                                                        animationDelay: '0.4s',
                                                        '@keyframes bounce': {
                                                            '0%, 80%, 100%': { transform: 'scale(0)' },
                                                            '40%': { transform: 'scale(1)' }
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Flex>
                                    )}
                                    <div ref={messagesEndRef} />
                                </Stack>
                            )}
                        </Box>

                        {/* Quick Action Suggestions */}
                        {!sending && messages.length <= 3 && (
                            <Box px="5" pb="2" pt="1">
                                <Flex wrap="wrap" gap="2">
                                    {suggestions.map((suggestion) => (
                                        <Badge
                                            key={suggestion}
                                            bg="#1c1f2a"
                                            border="1px solid"
                                            borderColor="#2e3245"
                                            color="#E2E1EB"
                                            cursor="pointer"
                                            px="3"
                                            py="1.5"
                                            borderRadius="10px"
                                            fontSize="11px"
                                            fontWeight="500"
                                            transition="all 0.2s"
                                            _hover={{
                                                borderColor: '#E03030',
                                                bg: 'rgba(224,48,48,0.05)',
                                                color: 'white'
                                            }}
                                            onClick={() => handleQuickSuggestion(suggestion)}
                                        >
                                            {suggestion}
                                        </Badge>
                                    ))}
                                </Flex>
                            </Box>
                        )}

                        <Divider borderColor="#1e2028" />

                        {/* Input bottom area */}
                        <Box p="4" bg="#0B0D14">
                            <HStack align="flex-end" spacing="3">
                                <Textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSendMessage()
                                        }
                                    }}
                                    placeholder="Nhập tin nhắn trả lời trợ lý AI..."
                                    rows={1}
                                    minH="44px"
                                    maxH="100px"
                                    bg="#141720"
                                    borderColor="#1e2028"
                                    color="white"
                                    _placeholder={{ color: '#52525B' }}
                                    _focus={{
                                        borderColor: '#E03030',
                                        boxShadow: '0 0 0 1px #E03030'
                                    }}
                                    py="3"
                                    px="4"
                                    borderRadius="14px"
                                    resize="none"
                                    disabled={sending || loadingHistory}
                                />
                                <IconButton
                                    aria-label="Send message"
                                    icon={<Icon as={FiSend} />}
                                    colorScheme="red"
                                    bg="#E03030"
                                    _hover={{ bg: '#C52828' }}
                                    borderRadius="14px"
                                    w="44px"
                                    h="44px"
                                    onClick={() => handleSendMessage()}
                                    isLoading={sending}
                                    disabled={!inputText.trim() || loadingHistory}
                                />
                            </HStack>
                        </Box>
                    </Box>

                    {/* Right Column: Generated Diet Plan Panel */}
                    <Box
                        bg="#141720"
                        border="1px solid"
                        borderColor="#1e2028"
                        borderRadius="20px"
                        p="6"
                        display="flex"
                        flexDirection="column"
                        minH={{ base: "450px", lg: "650px" }}
                        maxH={{ lg: "650px" }}
                        overflowY="auto"
                        css={{
                            '@media print': {
                                border: 'none',
                                background: 'white',
                                color: 'black',
                                overflow: 'visible',
                                maxH: 'none'
                            },
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#2d313a',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#3e4452',
                            },
                        }}
                    >
                        {generatingPlan ? (
                            <Flex align="center" justify="center" direction="column" flex="1" gap="4" py="10">
                                <Spinner size="xl" color="#E03030" thickness="4px" speed="0.8s" />
                                <VStack spacing="1">
                                    <Heading size="sm" color="white">Đang sinh thực đơn dinh dưỡng...</Heading>
                                    <Text fontSize="12px" color="#8A8A93" textAlign="center">
                                        Thuật toán AI đang tính toán TDEE, phân bổ lượng Calo tiêu thụ và lựa chọn món ăn phù hợp với yêu cầu của bạn.
                                    </Text>
                                </VStack>
                            </Flex>
                        ) : activeDietPlan ? (
                            // Render active diet plan details
                            <Stack spacing="6">
                                <Box borderBottom="1px solid" borderColor="#1e2028" pb="4" className="print-header">
                                    <Flex align="center" justify="space-between" flexWrap="wrap" gap="2">
                                        <HStack spacing="2">
                                            <Icon as={FiFileText} color="#E03030" boxSize="18px" className="no-print" />
                                            <Heading fontSize="18px" color="white" sx={{ '@media print': { color: 'black' } }}>
                                                {activeDietPlan.diet_title || 'Thực đơn Dinh dưỡng Cá nhân hóa'}
                                            </Heading>
                                        </HStack>
                                        <Badge
                                            bg="rgba(224,48,48,0.12)"
                                            color="#E03030"
                                            fontSize="13px"
                                            py="1.5"
                                            px="3"
                                            borderRadius="8px"
                                            border="1px solid rgba(224,48,48,0.2)"
                                            sx={{ '@media print': { color: 'black', border: '1px solid black' } }}
                                        >
                                            {activeDietPlan.daily_calories} kcal / ngày
                                        </Badge>
                                    </Flex>
                                    <Text fontSize="13px" color="#8A8A93" mt="2" sx={{ '@media print': { color: '#333' } }}>
                                        Mục tiêu dinh dưỡng được phân bổ theo tỷ lệ chuẩn dành riêng cho chỉ số cơ thể của bạn.
                                    </Text>
                                </Box>

                                {/* Macros distribution grid */}
                                <Grid templateColumns="repeat(3, 1fr)" gap="4">
                                    {[
                                        { label: 'Protein (Đạm)', val: `${activeDietPlan.protein_target_g}g`, color: '#E03030', icon: FiZap, pct: 30 },
                                        { label: 'Carbs (Tinh bột)', val: `${activeDietPlan.carbs_target_g}g`, color: '#3182CE', icon: FiActivity, pct: 50 },
                                        { label: 'Fat (Chất béo)', val: `${activeDietPlan.fat_target_g}g`, color: '#DD6B20', icon: FiDroplet, pct: 20 },
                                    ].map((macro) => (
                                        <Box
                                            key={macro.label}
                                            bg="#0B0D14"
                                            p="4"
                                            borderRadius="14px"
                                            border="1px solid"
                                            borderColor="#1e2028"
                                            sx={{ '@media print': { bg: 'white', color: 'black', borderColor: '#ccc' } }}
                                        >
                                            <Flex align="center" justify="space-between" mb="2">
                                                <Text fontSize="11px" color="#8A8A93" fontWeight="600" sx={{ '@media print': { color: '#555' } }}>
                                                    {macro.label}
                                                </Text>
                                                <Icon as={macro.icon} color={macro.color} boxSize="12px" className="no-print" />
                                            </Flex>
                                            <Heading fontSize="20px" color="white" fontWeight="800" sx={{ '@media print': { color: 'black' } }}>
                                                {macro.val}
                                            </Heading>
                                        </Box>
                                    ))}
                                </Grid>

                                {/* Meals List */}
                                <Stack spacing="4" className="print-meals">
                                    {activeDietPlan.meals.map((meal, index) => (
                                        <Box
                                            key={index}
                                            bg="#0B0D14"
                                            border="1px solid"
                                            borderColor="#1e2028"
                                            borderRadius="16px"
                                            p="4"
                                            sx={{
                                                pageBreakInside: 'avoid',
                                                '@media print': { bg: 'white', color: 'black', borderColor: '#ccc' }
                                            }}
                                        >
                                            <Flex justify="space-between" align="center" mb="3">
                                                <Heading fontSize="15px" color="white" fontWeight="700" sx={{ '@media print': { color: 'black' } }}>
                                                    {meal.name}
                                                </Heading>
                                                <Badge colorScheme="red" variant="subtle" borderRadius="6px" fontSize="11px" px="2" py="0.5">
                                                    {meal.calories} kcal
                                                </Badge>
                                            </Flex>

                                            <Stack spacing="2">
                                                {meal.foods.map((food, foodIdx) => (
                                                    <Box
                                                        key={foodIdx}
                                                        bg="#141720"
                                                        p="3"
                                                        borderRadius="12px"
                                                        border="1px solid"
                                                        borderColor="#1e2028"
                                                        sx={{ '@media print': { bg: 'white', color: 'black', borderColor: '#eee' } }}
                                                    >
                                                        <Flex justify="space-between" align="center" mb="2">
                                                            <Box>
                                                                <Text fontSize="13px" fontWeight="600" color="white" sx={{ '@media print': { color: 'black' } }}>
                                                                    {food.food_name}
                                                                </Text>
                                                                <Text fontSize="11px" color="#8A8A93" sx={{ '@media print': { color: '#555' } }}>
                                                                    Khối lượng/Khẩu phần: {food.amount}
                                                                </Text>
                                                            </Box>
                                                            <Text fontSize="12px" fontWeight="600" color="#E2E1EB" sx={{ '@media print': { color: 'black' } }}>
                                                                {food.calories} kcal
                                                            </Text>
                                                        </Flex>
                                                        <HStack spacing="2">
                                                            <Badge bg="rgba(224, 48, 48, 0.08)" color="#E03030" fontSize="10px" px="1.5" py="0.2">
                                                                Đạm: {food.protein}g
                                                            </Badge>
                                                            <Badge bg="rgba(49, 130, 206, 0.08)" color="#3182CE" fontSize="10px" px="1.5" py="0.2">
                                                                Carbs: {food.carbs}g
                                                            </Badge>
                                                            <Badge bg="rgba(221, 107, 32, 0.08)" color="#DD6B20" fontSize="10px" px="1.5" py="0.2">
                                                                Béo: {food.fat}g
                                                            </Badge>
                                                        </HStack>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            </Stack>
                        ) : (
                            // Placeholder state when no plan has been generated yet
                            <Flex align="center" justify="center" direction="column" flex="1" py="10" px="4">
                                <Box
                                    w="70px"
                                    h="70px"
                                    borderRadius="22px"
                                    bg="rgba(224, 48, 48, 0.05)"
                                    border="1px dashed rgba(224, 48, 48, 0.2)"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    mb="5"
                                >
                                    <Icon as={FiCpu} color="#E03030" boxSize="28px" />
                                </Box>
                                <Heading fontSize="16px" color="white" mb="2" textAlign="center" fontWeight="700">
                                    Thực đơn dinh dưỡng cá nhân hóa
                                </Heading>
                                <Text fontSize="13px" color="#8A8A93" textAlign="center" maxW="320px" lineHeight="1.6" mb="6">
                                    Bản thiết kế thực đơn sẽ tự động xuất hiện ở đây sau khi bạn cung cấp đủ thông tin cho trợ lý AI.
                                </Text>
                                <Box bg="#0B0D14" border="1px solid" borderColor="#1e2028" borderRadius="14px" p="4" w="full">
                                    <Text fontSize="11px" fontWeight="700" color="#E03030" textTransform="uppercase" letterSpacing="wider" mb="3">
                                        AI cần bạn chia sẻ:
                                    </Text>
                                    <VStack align="stretch" spacing="2">
                                        {[
                                            'Mục tiêu dinh dưỡng (Tăng cơ, giảm mỡ, giữ cân...)',
                                            'Bạn có ăn chay mặn hay chế độ ăn kiêng đặc biệt?',
                                            'Dị ứng thực phẩm (không ăn được tôm, lạc, cua...)',
                                            'Số lượng bữa ăn mong muốn trong ngày (3, 4 hoặc 5 bữa)',
                                            'Các món ăn bạn không thích để AI loại bỏ khỏi thực đơn'
                                        ].map((item, idx) => (
                                            <HStack key={idx} spacing="2" align="flex-start">
                                                <Icon as={FiInfo} color="#E03030" mt="0.5" boxSize="12px" />
                                                <Text fontSize="12px" color="#E2E1EB" lineHeight="1.4">
                                                    {item}
                                                </Text>
                                            </HStack>
                                        ))}
                                    </VStack>
                                </Box>
                            </Flex>
                        )}
                    </Box>
                </Grid>
                
                {/* Print specific style overrides */}
                <style>{`
                    @media print {
                        body {
                            background: white !important;
                            color: black !important;
                        }
                        .no-print, header, nav, footer, aside {
                            display: none !important;
                        }
                        .print-container {
                            max-width: 100% !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        .print-header {
                            border-bottom: 2px solid black !important;
                            padding-bottom: 12px !important;
                            margin-bottom: 20px !important;
                        }
                        .print-meals {
                            margin-top: 20px !important;
                        }
                    }
                `}</style>
            </Box>

            {/* Diet History Drawer */}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
                <DrawerOverlay />
                <DrawerContent bg="#141720" color="white">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px" borderColor="#1e2028">Lịch sử thực đơn AI</DrawerHeader>
                    <DrawerBody p={0} css={{
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: '#2d313a', borderRadius: '10px' },
                    }}>
                        {dietHistories.length === 0 ? (
                            <Flex align="center" justify="center" h="200px" color="#8A8A93">
                                Chưa có thực đơn nào được tạo.
                            </Flex>
                        ) : (
                            <Stack spacing="0" divider={<Divider borderColor="#1e2028" />}>
                                {dietHistories.map((item) => (
                                    <Box
                                        key={item.id}
                                        p="4"
                                        cursor="pointer"
                                        _hover={{ bg: 'rgba(255,255,255,0.02)' }}
                                        onClick={() => handleSelectHistory(item)}
                                    >
                                        <Heading fontSize="15px" color="white" mb="2">
                                            {item.dietTitle || 'AI Diet Plan'}
                                        </Heading>
                                        <Flex justify="space-between" align="center" fontSize="13px" color="#8A8A93">
                                            <Text>{new Date(item.createdAt).toLocaleDateString('vi-VN')} {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
                                            <Badge bg="rgba(224,48,48,0.1)" color="#E03030">
                                                {item.totalCalories} kcal
                                            </Badge>
                                        </Flex>
                                        <HStack spacing="3" mt="2" fontSize="11px" color="#8A8A93">
                                            <Text>P: {item.protein}g</Text>
                                            <Text>C: {item.carbs}g</Text>
                                            <Text>F: {item.fat}g</Text>
                                        </HStack>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </MemberLayout>
    )
}

export default AIChat
