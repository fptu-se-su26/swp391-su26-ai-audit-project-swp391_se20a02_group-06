import React from 'react'
import { Box, Flex, HStack, Icon, Text } from '@chakra-ui/react'

export const StatCard: React.FC<{
  label: string
  value: React.ReactNode
  icon: React.ElementType
  sub?: React.ReactNode
}> = ({ label, value, icon, sub }) => (
  <Box
    bg="#141720"
    border="1px solid"
    borderColor="#1e2028"
    borderRadius="16px"
    p="5"
    position="relative"
    overflow="hidden"
    transition="all 0.2s"
    _hover={{ borderColor: '#2e3040', transform: 'translateY(-2px)' }}
  >
    <Text fontSize="10px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="2">
      {label}
    </Text>
    <Flex align="center" justify="space-between">
      <Text fontSize="28px" fontWeight="800" color="white" lineHeight="1">
        {value}
      </Text>
      <Box
        w="36px"
        h="36px"
        borderRadius="10px"
        bg="rgba(224,48,48,0.12)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={icon} color="#E03030" boxSize="16px" />
      </Box>
    </Flex>
    {sub && <Box mt="3">{sub}</Box>}
  </Box>
)

export const MiniBarChart: React.FC = () => {
  const bars = [4, 6, 5, 8, 9, 7, 10]
  const max = Math.max(...bars)
  return (
    <Flex align="flex-end" gap="3px" h="28px">
      {bars.map((v, i) => (
        <Box
          key={i}
          flex="1"
          borderRadius="3px"
          bg={i === bars.length - 1 ? '#E03030' : '#2e3040'}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </Flex>
  )
}

export const StreakDots: React.FC = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const active = [0, 1, 2, 3, 4]
  return (
    <HStack spacing="4px" mt="1">
      {days.map((d, i) => (
        <Flex key={i} direction="column" align="center" gap="2px">
          <Box
            w="22px"
            h="22px"
            borderRadius="full"
            bg={active.includes(i) ? '#E03030' : '#1e2028'}
            border="1px solid"
            borderColor={active.includes(i) ? '#E03030' : '#2e3040'}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="7px" fontWeight="700" color={active.includes(i) ? 'white' : '#8A8A93'}>
              {d}
            </Text>
          </Box>
        </Flex>
      ))}
    </HStack>
  )
}

export const GoalRing: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const pct = (current / total) * 100
  const r = 28
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <Box position="relative" w="70px" h="70px">
      <svg width="70" height="70">
        <circle cx="35" cy="35" r={r} fill="none" stroke="#1e2028" strokeWidth="5" />
        <circle
          cx="35"
          cy="35"
          r={r}
          fill="none"
          stroke="#E03030"
          strokeWidth="5"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 35 35)"
        />
      </svg>
      <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="11px" fontWeight="800" color="white">
          {Math.round(pct)}%
        </Text>
      </Box>
    </Box>
  )
}

export const WeeklyVolumeChart: React.FC = () => {
  const data = [
    { day: 'M', val: 60 },
    { day: 'T', val: 40 },
    { day: 'W', val: 100 },
    { day: 'T', val: 50 },
    { day: 'F', val: 70 },
    { day: 'S', val: 30 },
    { day: 'S', val: 20 },
  ]
  const max = Math.max(...data.map((d) => d.val))
  return (
    <Box>
      <Flex align="flex-end" gap="6px" h="80px">
        {data.map((d, i) => (
          <Flex key={i} direction="column" align="center" flex="1" gap="4px" h="full">
            <Box
              w="full"
              borderRadius="4px"
              bg={d.day === 'W' ? '#E03030' : '#2e3040'}
              style={{ height: `${(d.val / max) * 100}%` }}
              position="relative"
            >
              {d.day === 'W' && (
                <Text
                  position="absolute"
                  top="-18px"
                  left="50%"
                  transform="translateX(-50%)"
                  fontSize="9px"
                  fontWeight="700"
                  color="white"
                  whiteSpace="nowrap"
                >
                  12k
                </Text>
              )}
            </Box>
          </Flex>
        ))}
      </Flex>
      <Flex gap="6px" mt="2">
        {data.map((d, i) => (
          <Box key={i} flex="1" textAlign="center">
            <Text fontSize="9px" color="#8A8A93">
              {d.day}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

export const MacroBar: React.FC<{
  label: string
  current: number
  total: number
  unit: string
  color: string
}> = ({ label, current, total, unit, color }) => (
  <Box>
    <Flex justify="space-between" mb="1">
      <Text fontSize="12px" color="#E2E1EB">
        {label}
      </Text>
      <Text fontSize="12px" color="#8A8A93">
        {current} / {total}
        {unit}
      </Text>
    </Flex>
    <Box h="3px" bg="#1e2028" borderRadius="full">
      <Box
        h="full"
        borderRadius="full"
        bg={color}
        style={{ width: `${(current / total) * 100}%` }}
        transition="width 1s ease"
      />
    </Box>
  </Box>
)
