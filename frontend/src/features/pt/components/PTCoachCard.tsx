import React from 'react'
import { Box, Button, Flex, Heading, Icon, Image, Stack, Text } from '@chakra-ui/react'
import { FiMessageSquare } from 'react-icons/fi'
import type { Coach } from '../types/pt'

const OnlineDot = (
    <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg="#16a34a"
        flexShrink={0}
        boxShadow="0 0 6px rgba(34,197,94,0.6)"
    />
)

interface PTCoachCardProps {
    coach: Coach
}

const PTCoachCard: React.FC<PTCoachCardProps> = ({ coach }) => (
    <Stack spacing="6">
        <Box
            bg="#141414"
            border="1px solid"
            borderColor="#262626"
            borderRadius="32px"
            p={{ base: '5', md: '6' }}
            w="full"
            boxShadow="0 12px 32px rgba(0, 0, 0, 0.18)"
        >
            <Box
                position="relative"
                overflow="hidden"
                borderRadius="24px"
                bg="#0c0e14"
                mb="6"
                sx={{ aspectRatio: '1 / 1' }}
            >
                <Image
                    src={coach.imageUrl}
                    alt={coach.imageAlt}
                    w="full"
                    h="full"
                    objectFit="cover"
                    transition="transform 0.7s ease"
                    _hover={{ transform: 'scale(1.04)' }}
                />
                <Box
                    position="absolute"
                    inset="0"
                    bgGradient="linear(to-t, rgba(0,0,0,0.28), transparent 46%)"
                    pointerEvents="none"
                />
                {coach.isOnline && (
                    <Flex
                        position="absolute"
                        top="4"
                        left="4"
                        align="center"
                        gap="2"
                        px="3"
                        py="1.5"
                        bg="rgba(0,0,0,0.55)"
                        backdropFilter="blur(8px)"
                        borderRadius="full"
                        border="1px solid rgba(255,255,255,0.1)"
                    >
                        {OnlineDot}
                        <Text fontSize="11px" fontWeight="700" color="white">
                            Online
                        </Text>
                    </Flex>
                )}
            </Box>

            <Heading fontSize="22px" fontWeight="800" color="white" mb="1" letterSpacing="-0.01em">
                {coach.name}
            </Heading>
            <Text fontSize="10px" fontWeight="700" color="#E03030" textTransform="uppercase" letterSpacing="wider" mb="3">
                {coach.tagline}
            </Text>
            <Text fontSize="14px" color="#C8C6C5" lineHeight="1.7" mb="5">
                {coach.bio}
            </Text>

            <Flex wrap="wrap" gap="2" mb="8">
                {coach.tags.map((tag) => (
                    <Box
                        key={tag}
                        px="10px"
                        py="5px"
                        bg="#262626"
                        borderRadius="full"
                    >
                        <Text fontSize="10px" fontWeight="700" color="#C8C6C5">
                            {tag}
                        </Text>
                    </Box>
                ))}
            </Flex>

            <Button
                leftIcon={<Icon as={FiMessageSquare} boxSize="15px" />}
                w="full"
                h="56px"
                bg="#E03030"
                color="white"
                borderRadius="full"
                fontSize="14px"
                fontWeight="800"
                _hover={{ bg: '#c92a2a' }}
            >
                Message {coach.name.split(' ')[0]}
            </Button>
        </Box>

        <Box
            bg="#141414"
            border="1px solid"
            borderColor="#262626"
            borderRadius="32px"
            p={{ base: '5', md: '6' }}
        >
            <Text fontSize="10px" fontWeight="800" color="#C8C6C5" textTransform="uppercase" letterSpacing="wider" mb="4">
                Coaching Philosophy
            </Text>
            <Text fontSize="14px" color="#C8C6C5" fontStyle="italic" lineHeight="1.7">
                {coach.philosophy}
            </Text>
        </Box>
    </Stack>
)

export default PTCoachCard