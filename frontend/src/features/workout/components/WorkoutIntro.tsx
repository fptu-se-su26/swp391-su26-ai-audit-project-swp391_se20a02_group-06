import React from 'react'
import { Box, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import { FiActivity } from 'react-icons/fi'
import AppButton from '../../../components/shared/Button/AppButton'
import MemberLayout from '../../../components/shared/Layout/MemberLayout.tsx'

interface WorkoutIntroProps {
    onStart: () => void
}

const WorkoutIntro: React.FC<WorkoutIntroProps> = ({ onStart }) => {
    return (
        <MemberLayout>
            <Box p="7" display="flex" alignItems="center" justifyContent="center" minH="80vh">
                <Stack align="center" spacing="3">
                    <Box
                        borderRadius="16px"
                        bg="rgba(224,48,48,0.12)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        h="64px"
                        w="64px"
                    >
                        <Icon as={FiActivity} color="#E03030" boxSize="28px" />
                    </Box>
                    <Heading fontSize="20px" fontWeight="700" color="white">
                        Workouts
                    </Heading>
                    <Text fontSize="16px" color="#8A8A93" textAlign="center" maxW="400px" lineHeight="1.6">
                        Create a personalized workout program based on your goals, body metrics, and schedule.
                    </Text>
                    <AppButton
                        label="Start"
                        variant="solid"
                        h="38px"
                        px="6"
                        fontSize="13px"
                        mt="2"
                        onClick={onStart}
                    />
                </Stack>
            </Box>
        </MemberLayout>
    )
}

export default WorkoutIntro