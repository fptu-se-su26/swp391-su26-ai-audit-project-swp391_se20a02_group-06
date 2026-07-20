import React from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'

const PTBooking: React.FC = () => {
    return (
        <MemberLayout>
            <Box px={{ base: '5', md: '7' }} py="6" maxW="1200px" position="relative" minH="70vh">
                <Box
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.700"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                    borderRadius="16px"
                >
                    <Text fontSize="28px" fontWeight="800" color="white">
                        Coming Soon
                    </Text>
                </Box>

                <Box mb="9">
                    <Heading fontSize={{ base: '18px', md: '20px' }} fontWeight="800" color="#E2E1EB">
                        Elite Performance Coaching
                    </Heading>
                </Box>
            </Box>
        </MemberLayout>
    )
}

export default PTBooking