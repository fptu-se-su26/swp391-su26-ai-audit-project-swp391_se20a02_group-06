import React from 'react';
import { Box, Flex, Input, Select, Button, VStack } from '@chakra-ui/react';

interface ExerciseFiltersProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    categoryFilter: string;
    onCategoryChange: (val: string) => void;
    difficultyFilter: string;
    onDifficultyChange: (val: string) => void;
    muscleTargetFilter: string;
    onMuscleTargetChange: (val: string) => void;
    packageFilter: string;
    onPackageChange: (val: string) => void;
    categories: string[];
    muscleTargets: string[];
    packages: { id: number; name: string }[];
    onAddExercise: () => void;
    showAddButton: boolean;
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
    packageFilter,
    onPackageChange,
    categories,
    muscleTargets,
    packages,
    onAddExercise,
    showAddButton,
}) => {
    return (
        <Box w="300px" bg="#141720" p="5" borderRadius="16px" border="1px solid" borderColor="#1e2028">
            <VStack spacing={4} align="stretch">
                <Box position="relative">
                    <Input
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search exercises..."
                        bg="#0A0C10"
                        border="1px solid #1e2028"
                        h="44px"
                        borderRadius="md"
                        color="white"
                        _hover={{ borderColor: "#E03030" }}
                        _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                    />
                </Box>

                <Select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    bg="#0A0C10"
                    border="1px solid #1e2028"
                    h="44px"
                    borderRadius="md"
                    color="white"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                >
                    <option value="All" style={{ color: "black" }}>All Categories</option>
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat} style={{ color: "black" }}>{cat}</option>
                    ))}
                </Select>

                <Select
                    value={difficultyFilter}
                    onChange={(e) => onDifficultyChange(e.target.value)}
                    bg="#0A0C10"
                    border="1px solid #1e2028"
                    h="44px"
                    borderRadius="md"
                    color="white"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                >
                    <option value="all" style={{ color: "black" }}>All Difficulties</option>
                    <option value="0" style={{ color: "black" }}>Beginner</option>
                    <option value="1" style={{ color: "black" }}>Intermediate</option>
                    <option value="2" style={{ color: "black" }}>Advanced</option>
                </Select>

                <Select
                    value={muscleTargetFilter}
                    onChange={(e) => onMuscleTargetChange(e.target.value)}
                    bg="#0A0C10"
                    border="1px solid #1e2028"
                    h="44px"
                    borderRadius="md"
                    color="white"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                >
                    <option value="all" style={{ color: "black" }}>All Muscle Targets</option>
                    {muscleTargets.map((mt, idx) => (
                        <option key={idx} value={mt} style={{ color: "black" }}>{mt}</option>
                    ))}
                </Select>

                <Select
                    value={packageFilter}
                    onChange={(e) => onPackageChange(e.target.value)}
                    bg="#0A0C10"
                    border="1px solid #1e2028"
                    h="44px"
                    borderRadius="md"
                    color="white"
                    _hover={{ borderColor: "#E03030" }}
                    _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                >
                    <option value="all" style={{ color: "black" }}>All Packages</option>
                    <option value="free" style={{ color: "black" }}>Free</option>
                    {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.id.toString()} style={{ color: "black" }}>{pkg.name}</option>
                    ))}
                </Select>

                {showAddButton && (
                    <Button
                        onClick={onAddExercise}
                        bg="#E03030"
                        color="white"
                        h="44px"
                        _hover={{ bg: "#C92828" }}
                        w="100%"
                        mt="2"
                    >
                        Create Exercise
                    </Button>
                )}
            </VStack>
        </Box>
    );
};

export default ExerciseFilters;
