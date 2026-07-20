import React from 'react'
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    VStack,
    Select,
    Button,
    Icon,
} from '@chakra-ui/react'
import { FiSearch, FiPlus } from 'react-icons/fi'
import { adminColors } from '../../../pages/admin/AdminPrimitives'

interface ExerciseFiltersProps {
    searchQuery: string
    onSearchChange: (val: string) => void
    categoryFilter: string
    onCategoryChange: (val: string) => void
    difficultyFilter: string
    onDifficultyChange: (val: string) => void
    muscleTargetFilter: string
    onMuscleTargetChange: (val: string) => void
    categories: string[]
    muscleTargets: string[]
    onAddExercise: () => void
    showAddButton?: boolean
}

const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
    searchQuery,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    difficultyFilter,
    onDifficultyChange,
    muscleTargetFilter,
    onMuscleTargetChange,
    categories,
    muscleTargets,
    onAddExercise,
    showAddButton = true,
}) => {
    return (
        <VStack spacing={5} align="stretch" w="200px" flexShrink={0}>
            <InputGroup>
                <InputLeftElement pointerEvents="none" h="40px">
                    <Icon as={FiSearch} color={adminColors.dim} boxSize="16px" />
                </InputLeftElement>
                <Input
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    h="40px"
                    bg={adminColors.surfaceMid}
                    border="1px solid"
                    borderColor={adminColors.surfaceVariant}
                    borderRadius="10px"
                    color={adminColors.text}
                    fontSize="13px"
                    pl="40px"
                    _placeholder={{ color: adminColors.dim }}
                    _focus={{ borderColor: adminColors.primary, boxShadow: 'none' }}
                />
            </InputGroup>

            <Box>
                <Text color={adminColors.dim} fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" mb={2}>
                    Category
                </Text>
                <Select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    h="36px"
                    bg={adminColors.surfaceMid}
                    border="1px solid"
                    borderColor={adminColors.surfaceVariant}
                    borderRadius="10px"
                    color={adminColors.text}
                    fontSize="13px"
                    _focus={{ borderColor: adminColors.primary, boxShadow: 'none' }}
                    iconColor={adminColors.dim}
                >
                    <option value="All" style={{ color: '#000' }}>All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat} style={{ color: '#000' }}>{cat}</option>
                    ))}
                </Select>
            </Box>

            <Box>
                <Text color={adminColors.dim} fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" mb={2}>
                    Difficulty
                </Text>
                <Select
                    value={difficultyFilter}
                    onChange={(e) => onDifficultyChange(e.target.value)}
                    h="36px"
                    bg={adminColors.surfaceMid}
                    border="1px solid"
                    borderColor={adminColors.surfaceVariant}
                    borderRadius="10px"
                    color={adminColors.text}
                    fontSize="13px"
                    _focus={{ borderColor: adminColors.primary, boxShadow: 'none' }}
                    iconColor={adminColors.dim}
                >
                    <option value="all" style={{ color: '#000' }}>All Difficulties</option>
                    <option value="0" style={{ color: '#000' }}>Beginner</option>
                    <option value="1" style={{ color: '#000' }}>Intermediate</option>
                    <option value="2" style={{ color: '#000' }}>Advanced</option>
                </Select>
            </Box>

            <Box>
                <Text color={adminColors.dim} fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" mb={2}>
                    Muscle Target
                </Text>
                <Select
                    value={muscleTargetFilter}
                    onChange={(e) => onMuscleTargetChange(e.target.value)}
                    h="36px"
                    bg={adminColors.surfaceMid}
                    border="1px solid"
                    borderColor={adminColors.surfaceVariant}
                    borderRadius="10px"
                    color={adminColors.text}
                    fontSize="13px"
                    _focus={{ borderColor: adminColors.primary, boxShadow: 'none' }}
                    iconColor={adminColors.dim}
                >
                    <option value="all" style={{ color: '#000' }}>All Muscles</option>
                    {muscleTargets.map((m) => (
                        <option key={m} value={m} style={{ color: '#000' }}>{m}</option>
                    ))}
                </Select>
            </Box>

            {showAddButton && (
                <Button
                    leftIcon={<Icon as={FiPlus} boxSize="16px" />}
                    bg={adminColors.primary}
                    color="white"
                    borderRadius="10px"
                    h="40px"
                    fontSize="14px"
                    fontWeight="600"
                    _hover={{ bg: '#C92424' }}
                    onClick={onAddExercise}
                    mt={2}
                >
                    Add Exercise
                </Button>
            )}
        </VStack>
    )
}

export default ExerciseFilters
