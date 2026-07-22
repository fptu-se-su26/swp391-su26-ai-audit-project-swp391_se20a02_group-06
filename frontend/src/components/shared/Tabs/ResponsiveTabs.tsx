import React from 'react'
import { Flex, Box, Button, useBreakpointValue } from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'

type TabItem = {
  id: string // route path, e.g. '/dashboard'
  label: string
  badgeCount?: number
}

type ResponsiveTabsProps = {
  tabs: TabItem[]
}

const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({ tabs }) => {
  const location = useLocation()
  const activePath = location.pathname

  // Mobile: scrollable overflow-x, Desktop: space-evenly
  const flexDirection = useBreakpointValue({ base: 'row', md: 'row' })
  const overflowX = useBreakpointValue({ base: 'auto', md: 'hidden' })

    const primary = '#E03030'
    const dim = '#8A8A93'
    const bg = '#141414'

    return (
        <Box bg={bg} py="4" px="2" overflowX={overflowX as 'auto' | 'hidden' | undefined} width="100%" borderBottom="1px solid" borderColor="rgba(255,255,255,0.1)" mb="2">
            <Flex direction={flexDirection as 'row' | undefined} justify="center" align="center" gap="2">
        {tabs.map((tab) => {
          const isActive = activePath === tab.id
          return (
            <Button
              as={NavLink}
              to={tab.id}
              key={tab.id}
              h="36px"
              minW="80px"
              px="4"
              bg={isActive ? primary : 'transparent'}
              color={isActive ? 'white' : dim}
              _hover={{ bg: isActive ? primary : 'rgba(224,48,48,0.08)' }}
              borderRadius="full"
              fontWeight="600"
              fontSize="14px"
              position="relative"
            >
              {tab.label}
              {tab.badgeCount !== undefined && (
                <Box
                  as="span"
                  ml="2"
                  px="2"
                  py="0.5"
                  bg="rgba(255,255,255,0.15)"
                  color="white"
                  fontSize="10px"
                  borderRadius="8px"
                >
                  {tab.badgeCount}
                </Box>
              )}
            </Button>
          )
        })}
      </Flex>
    </Box>
  )
}

export default ResponsiveTabs
