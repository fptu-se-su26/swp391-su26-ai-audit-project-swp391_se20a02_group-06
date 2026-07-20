import React from 'react'
import { Flex } from '@chakra-ui/react'
import { adminColors } from '../../../pages/admin/AdminPrimitives'

interface FilterTab {
    label: string
    count?: number
    countColor?: string
}

interface FilterTabsProps {
    tabs: FilterTab[]
    active: string
    onChange: (label: string) => void
}

const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, active, onChange }) => (
    <Flex
        overflowX="auto"
        pb="3"
        mb="5"
        gap="1"
        borderBottomWidth="1px"
        borderColor="rgba(38,38,38,0.3)"
        sx={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
    >
        {tabs.map(tab => {
            const isActive = tab.label === active
            return (
                <Flex
                    key={tab.label}
                    as="button"
                    align="center"
                    gap="1.5"
                    px="4"
                    py="2"
                    fontSize="13px"
                    fontWeight="600"
                    color={isActive ? adminColors.primary : adminColors.dim}
                    borderBottomWidth="2px"
                    borderColor={isActive ? adminColors.primary : 'transparent'}
                    whiteSpace="nowrap"
                    _hover={{ color: isActive ? adminColors.primary : adminColors.text }}
                    transition="all 0.15s"
                    onClick={() => onChange(tab.label)}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <Flex
                            as="span"
                            bg={tab.countColor ? `${tab.countColor}33` : adminColors.surfaceMid}
                            color={tab.countColor || adminColors.dim}
                            fontSize="10px"
                            px="2"
                            borderRadius="full"
                        >
                            {tab.count}
                        </Flex>
                    )}
                </Flex>
            )
        })}
    </Flex>
)

export default FilterTabs
