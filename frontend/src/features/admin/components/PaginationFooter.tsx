import React from 'react'
import { Flex, Text, Button, HStack, Icon } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'

interface PaginationFooterColors {
    dim?: string
    text?: string
    primary?: string
    surfaceVariant?: string
}

interface PaginationFooterProps {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
    onPageChange: (page: number) => void
    /** Hide the "Showing X–Y of Z" text */
    hideItemCount?: boolean
    /** Override default admin color tokens */
    colors?: PaginationFooterColors
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    hideItemCount = false,
    colors: colorOverrides,
}) => {
    const c = { ...adminColors, ...colorOverrides }
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return (
        <Flex
            justify={hideItemCount ? 'center' : 'space-between'}
            align="center"
            px={6}
            py={4}
            borderTop="1px solid"
            borderColor={c.surfaceVariant}
        >
            {!hideItemCount && (
                <Text color={c.dim} fontSize="12px">
                    Showing {startItem}–{endItem} of {totalItems}
                </Text>
            )}
            <HStack spacing={1}>
                <Button
                    size="sm"
                    variant="ghost"
                    h="32px"
                    minW="32px"
                    p={0}
                    color={c.dim}
                    isDisabled={currentPage <= 1}
                    _hover={{ color: c.text }}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <Icon as={FiChevronLeft} boxSize="16px" />
                </Button>
                {pages.map((p) => (
                    <Button
                        key={p}
                        size="sm"
                        h="32px"
                        minW="32px"
                        p={0}
                        borderRadius="8px"
                        bg={p === currentPage ? c.primary : 'transparent'}
                        color={p === currentPage ? 'white' : c.dim}
                        fontSize="13px"
                        fontWeight={p === currentPage ? '700' : '500'}
                        _hover={{
                            bg: p === currentPage ? c.primary : c.surfaceVariant,
                        }}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </Button>
                ))}
                <Button
                    size="sm"
                    variant="ghost"
                    h="32px"
                    minW="32px"
                    p={0}
                    color={c.dim}
                    isDisabled={currentPage >= totalPages}
                    _hover={{ color: c.text }}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <Icon as={FiChevronRight} boxSize="16px" />
                </Button>
            </HStack>
        </Flex>
    )
}

export default PaginationFooter
