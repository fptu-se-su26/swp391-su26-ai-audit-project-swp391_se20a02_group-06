import React from 'react'
import { Box, Flex, Grid, HStack, Icon, IconButton, Text } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { WeekDay } from '../types/pt'

interface PTCalendarProps {
  weekLabel: string
  weekDays: WeekDay[]
  selectedDayIdx: number
  onSelectDay: (idx: number) => void
  onPrevWeek: () => void
  onNextWeek: () => void
}

const PTCalendar: React.FC<PTCalendarProps> = ({
  weekLabel,
  weekDays,
  selectedDayIdx,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
}) => (
  <Box>
    <Flex align="center" justify="space-between" mb="7" gap="4">
      <Text fontSize="18px" fontWeight="800" color="white" letterSpacing="-0.01em">
        Session Availability
      </Text>
      <Flex align="center" gap="3">
        <Text fontSize="13px" color="#C8C6C5" whiteSpace="nowrap">
          {weekLabel}
        </Text>
        <HStack spacing="1">
          <IconButton
            aria-label="Previous week"
            icon={<Icon as={FiChevronLeft} boxSize="18px" />}
            variant="ghost"
            color="#E2E1EB"
            borderRadius="10px"
            _hover={{ bg: 'rgba(255,255,255,0.06)', color: '#E03030' }}
            onClick={onPrevWeek}
          />
          <IconButton
            aria-label="Next week"
            icon={<Icon as={FiChevronRight} boxSize="18px" />}
            variant="ghost"
            color="#E2E1EB"
            borderRadius="10px"
            _hover={{ bg: 'rgba(255,255,255,0.06)', color: '#E03030' }}
            onClick={onNextWeek}
          />
        </HStack>
      </Flex>
    </Flex>

    <Grid templateColumns="repeat(7, minmax(0, 1fr))" gap="2" borderBottom="1px solid" borderColor="#262626" pb="5">
      {weekDays.map((day, i) => {
        const isSelected = i === selectedDayIdx
        return (
          <Box
            as="button"
            key={`${day.label}-${day.date}`}
            aria-label={`Select ${day.label} ${day.date}`}
            minH="50px"
            py="1"
            borderRadius="10px"
            bg="transparent"
            cursor="pointer"
            textAlign="center"
            transition="all 0.15s"
            position="relative"
            _hover={{ bg: 'rgba(255,255,255,0.04)' }}
            onClick={() => onSelectDay(i)}
          >
            <Text
              fontSize="10px"
              fontWeight="800"
              color={isSelected ? '#FFB4AC' : '#C8C6C5'}
              textTransform="uppercase"
              mb="1"
            >
              {day.label}
            </Text>
            <Text
              fontSize="20px"
              fontWeight="800"
              color={isSelected ? '#FFB4AC' : '#E2E1EB'}
              lineHeight="1.3"
            >
              {day.date}
            </Text>
            {isSelected && (
              <Box
                position="absolute"
                bottom="-21px"
                left="50%"
                transform="translateX(-50%)"
                w="4px"
                h="4px"
                borderRadius="full"
                bg="#E03030"
              />
            )}
          </Box>
        )
      })}
    </Grid>
  </Box>
)

export default PTCalendar
