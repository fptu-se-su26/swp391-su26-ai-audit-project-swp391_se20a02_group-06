import React, { useEffect, useState } from 'react'
import { Box, Flex, Heading, Text, Stack } from '@chakra-ui/react'

interface WorkoutLoadingProps {
    onComplete: () => void
}

const loadingPhases = [
    'Phân tích thông tin của bạn...',
    'Tối ưu hóa chương trình AI...',
    'Xây dựng lịch tập cá nhân...',
    'Hoàn thiện bài tập cho bạn...',
]

const WorkoutLoading: React.FC<WorkoutLoadingProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0)
    const [phase, setPhase] = useState(0)

    useEffect(() => {
        // Tăng progress từ 0 đến 100 trong ~3 giây
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + 1.4
                if (next >= 100) {
                    clearInterval(interval)
                    setTimeout(onComplete, 400)
                    return 100
                }
                return next
            })
        }, 40)

        // Phase text cycling
        const phaseInterval = setInterval(() => {
            setPhase((prev) => (prev + 1) % loadingPhases.length)
        }, 900)

        return () => {
            clearInterval(interval)
            clearInterval(phaseInterval)
        }
    }, [onComplete])

    // Ring animation
    const r = 90
    const circumference = 2 * Math.PI * r
    const strokeDash = circumference
    const strokeOffset = circumference - (progress / 100) * circumference

    // Random sys id
    const sysId = '0x9A4F2'

    return (
        <Box
            minH="100vh"
            bg="#080a0e"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="10"
        >
            {/* Ring */}
            <Box position="relative" w="220px" h="220px">
                <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Outer thin ring */}
                    <circle
                        cx="110"
                        cy="110"
                        r={r + 12}
                        fill="none"
                        stroke="#1e2028"
                        strokeWidth="1"
                    />
                    {/* Base track */}
                    <circle
                        cx="110"
                        cy="110"
                        r={r}
                        fill="none"
                        stroke="#1e2028"
                        strokeWidth="6"
                    />
                    {/* Progress arc — red */}
                    <circle
                        cx="110"
                        cy="110"
                        r={r}
                        fill="none"
                        stroke="#E03030"
                        strokeWidth="6"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                    />
                    {/* Inner thin ring decoration */}
                    <circle
                        cx="110"
                        cy="110"
                        r={r - 14}
                        fill="none"
                        stroke="#1e2028"
                        strokeWidth="1"
                    />
                    {/* Small red accent tick */}
                    <line
                        x1="110"
                        y1="10"
                        x2="110"
                        y2="22"
                        stroke="#E03030"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Center label */}
                <Flex
                    position="absolute"
                    inset="0"
                    direction="column"
                    align="center"
                    justify="center"
                    gap="1"
                >
                    <Heading
                        fontSize="18px"
                        fontWeight="900"
                        color="white"
                        letterSpacing="-0.02em"
                        textAlign="center"
                    >
                        AISTHEA
                    </Heading>
                    <Text fontSize="9px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="widest">
                        ENGINE
                    </Text>
                </Flex>
            </Box>

            {/* Phase text */}
            <Stack spacing="4" align="center" w="full" maxW="340px">
                <Text
                    fontSize="14px"
                    color="#E2E1EB"
                    textAlign="center"
                    minH="20px"
                    key={phase}
                    style={{
                        animation: 'fadeIn 0.4s ease',
                    }}
                >
                    {loadingPhases[phase]}
                </Text>

                {/* Neural Sync bar */}
                <Box w="full">
                    <Flex justify="space-between" mb="2">
                        <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="widest">
                            Neural Sync
                        </Text>
                        <Text fontSize="10px" fontWeight="700" color="#E03030">
                            {Math.round(progress)}%
                        </Text>
                    </Flex>
                    <Box h="2px" bg="#1e2028" borderRadius="full" w="full">
                        <Box
                            h="full"
                            borderRadius="full"
                            bg="#E03030"
                            style={{
                                width: `${progress}%`,
                                transition: 'width 0.05s linear',
                                boxShadow: '0 0 8px rgba(224,48,48,0.5)',
                            }}
                        />
                    </Box>
                </Box>

                {/* Sys info row */}
                <Flex w="full" justify="space-between">
                    <Text fontSize="10px" color="#3e4050" fontFamily="monospace">
                        SYS_ID: {sysId}
                    </Text>
                    <Text fontSize="10px" color="#3e4050" fontFamily="monospace">
                        SECURE
                    </Text>
                </Flex>
            </Stack>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </Box>
    )
}

export default WorkoutLoading