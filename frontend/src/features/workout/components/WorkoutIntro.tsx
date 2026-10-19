import React from 'react'
import { Box, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import { FiActivity } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import AppButton from '../../../components/shared/Button/AppButton'
import MemberLayout from '../../../components/shared/Layout/MemberLayout.tsx'

interface WorkoutIntroProps {
    onStart: () => void
}

const WorkoutIntro: React.FC<WorkoutIntroProps> = ({ onStart }) => {
    const { t } = useTranslation()
    return (
        <MemberLayout>
            <Box p={{ base: '4', md: '7' }} display="flex" alignItems="center" justifyContent="center" minH="80vh">
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
                        {t('workouts.title', 'Workouts')}
                    </Heading>
                    <Text fontSize="16px" color="#8A8A93" textAlign="center" maxW="400px" lineHeight="1.6">
                        {t('workouts.introDesc', 'Create a personalized workout program based on your goals, body metrics, and schedule.')}
                    </Text>
                    <AppButton
                        label={t('workouts.start', 'Start')}
                        variant="solid"
                        h="38px"
                        px="6"
                        w={{ base: 'full', sm: 'auto' }}
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
