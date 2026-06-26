import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import MemberSidebar from '../Sidebar/MemberSidebar'

interface MemberLayoutProps {
    children: React.ReactNode
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
    return (
        <Flex minH="100vh" bg="#0A0C10">
            <MemberSidebar />
            <Box
                flex="1"
                ml="190px"
                minH="100vh"
                overflowY="auto"
                bg="#0A0C10"
            >
                {children}
            </Box>
        </Flex>
    )
}

export default MemberLayout