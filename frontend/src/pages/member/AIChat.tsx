import React from 'react'
import { Box, Heading, Text, Icon, Stack } from '@chakra-ui/react'
import { FiMessageSquare } from 'react-icons/fi'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'

const AIChat: React.FC = () => (
    <MemberLayout>
        <Box p="7" display="flex" alignItems="center" justifyContent="center" minH="80vh">
            <Stack align="center" spacing="3">
                <Box
                    w="64px"
                    h="64px"
                    borderRadius="16px"
                    bg="rgba(224,48,48,0.12)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={FiMessageSquare} color="#E03030" boxSize="28px" />
                </Box>
                <Heading fontSize="20px" fontWeight="700" color="white">
                    AI Chat
                </Heading>
                <Text fontSize="13px" color="#8A8A93" textAlign="center" maxW="300px">
                    Your AI fitness coach is ready to answer questions and adapt your plan.
                </Text>
            </Stack>
        </Box>
    </MemberLayout>
)

export default AIChat