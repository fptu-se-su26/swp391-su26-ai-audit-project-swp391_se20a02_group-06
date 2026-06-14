import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { muscleZones } from '../data/muscleZones'

export const StepDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <Flex align="center" justify="center" gap="3" mb="6">
    {Array.from({ length: total }).map((_, i) => {
      const done = i < current
      const active = i === current
      return (
        <React.Fragment key={i}>
          <Box
            w={active ? '32px' : '28px'}
            h={active ? '32px' : '28px'}
            borderRadius="full"
            bg={done ? '#E03030' : active ? '#E03030' : '#1e2028'}
            border="2px solid"
            borderColor={done || active ? '#E03030' : '#2e3040'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.2s"
            flexShrink={0}
          >
            <Text fontSize={active ? '13px' : '11px'} fontWeight="800" color={done || active ? 'white' : '#8A8A93'}>
              {i + 1}
            </Text>
          </Box>
          {i < total - 1 && (
            <Box flex="1" h="1px" bg={done ? '#E03030' : '#1e2028'} maxW="40px" transition="all 0.3s" />
          )}
        </React.Fragment>
      )
    })}
  </Flex>
)

export const GoalCard: React.FC<{
  label: string
  selected: boolean
  onClick: () => void
}> = ({ label, selected, onClick }) => (
  <Box
    p="5"
    borderRadius="16px"
    border="1.5px solid"
    borderColor={selected ? '#E03030' : '#1e2028'}
    bg={selected ? 'rgba(224,48,48,0.08)' : '#141720'}
    cursor="pointer"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap="2"
    minH="110px"
    transition="all 0.2s"
    _hover={{ borderColor: selected ? '#E03030' : '#3e4050', transform: 'translateY(-1px)' }}
    onClick={onClick}
  >
    <Text fontSize="15px" fontWeight="700" color={selected ? 'white' : '#8A8A93'} textAlign="center">
      {label}
    </Text>
  </Box>
)

export const LevelPill: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({
  label,
  selected,
  onClick,
}) => (
  <Box
    px="5"
    py="2"
    borderRadius="full"
    border="1.5px solid"
    borderColor={selected ? '#E03030' : '#2e3040'}
    bg={selected ? '#E03030' : 'transparent'}
    cursor="pointer"
    transition="all 0.15s"
    _hover={{ borderColor: '#E03030' }}
    onClick={onClick}
  >
    <Text fontSize="13px" fontWeight="700" color={selected ? 'white' : '#8A8A93'}>
      {label}
    </Text>
  </Box>
)

export const BodyDiagram: React.FC<{
  selected: string[]
  onToggle: (id: string) => void
}> = ({ selected, onToggle }) => (
  <Box position="relative" display="flex" justifyContent="center">
    <svg width="260" height="440" viewBox="100 40 300 400">
      <circle cx="240" cy="70" r="28" fill="none" stroke="#2e3040" strokeWidth="2" />
      <rect x="228" y="96" width="24" height="20" fill="none" stroke="#2e3040" strokeWidth="2" />
      <rect x="190" y="115" width="100" height="155" rx="4" fill="none" stroke="#2e3040" strokeWidth="2" />
      <rect x="145" y="115" width="46" height="70" rx="6" fill="none" stroke="#2e3040" strokeWidth="2" />
      <rect x="289" y="115" width="46" height="70" rx="6" fill="none" stroke="#2e3040" strokeWidth="2" />
      <rect x="140" y="188" width="36" height="60" rx="6" fill="none" stroke="#2e3040" strokeWidth="2" />
      <rect x="304" y="188" width="36" height="60" rx="6" fill="none" stroke="#2e3040" strokeWidth="2" />
      <rect x="193" y="265" width="44" height="130" rx="6" fill="none" stroke="#2e3040" strokeWidth="2" />
      <rect x="243" y="265" width="44" height="130" rx="6" fill="none" stroke="#2e3040" strokeWidth="2" />
      {muscleZones.map((zone) => {
        const isSelected = selected.includes(zone.id)
        return (
          <path
            key={zone.id}
            d={zone.d}
            fill={isSelected ? 'rgba(224,48,48,0.55)' : 'rgba(255,255,255,0.04)'}
            stroke={isSelected ? '#E03030' : 'transparent'}
            strokeWidth="1"
            style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
            onClick={() => onToggle(zone.id)}
          />
        )
      })}
    </svg>
  </Box>
)

export const OptionChip: React.FC<{
  label: string
  selected: boolean
  onClick: () => void
  multi?: boolean
}> = ({ label, selected, onClick, multi }) => (
  <Box
    px="4"
    py="2"
    borderRadius={multi ? '8px' : 'full'}
    border="1.5px solid"
    borderColor={selected ? '#E03030' : '#2e3040'}
    bg={selected ? 'rgba(224,48,48,0.12)' : 'transparent'}
    cursor="pointer"
    transition="all 0.15s"
    _hover={{ borderColor: '#E03030' }}
    onClick={onClick}
  >
    <Text fontSize="13px" fontWeight="600" color={selected ? 'white' : '#8A8A93'}>
      {label}
    </Text>
  </Box>
)

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text fontSize="11px" fontWeight="700" color="#8A8A93" textTransform="uppercase" letterSpacing="wider" mb="3">
    {children}
  </Text>
)
