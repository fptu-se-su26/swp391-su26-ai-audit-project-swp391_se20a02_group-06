import React, { useState } from 'react'
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Icon,
    Spinner,
    Stack,
    Text,
    Textarea,
    VStack,
    Badge,
    useToast,
} from '@chakra-ui/react'
import { FiMessageSquare } from 'react-icons/fi'
import MemberLayout from '../../components/shared/Layout/MemberLayout.tsx'
import { generateDietPlan, type DietPlanResponse } from '../../api/nutrition'

const AIChat: React.FC = () => {
    const [requestText, setRequestText] = useState('')
    const [dietPlan, setDietPlan] = useState<DietPlanResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const toast = useToast()

    const handleGenerateDietPlan = async () => {
    if (!requestText.trim()) {
        toast({
            title: 'Vui lòng nhập yêu cầu.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
        })
        return
    }

    setLoading(true)
    setErrorMessage(null)
    setDietPlan(null)

    try {
        const response = await generateDietPlan(requestText.trim())
        console.log("FULL RESPONSE")
        console.log(JSON.stringify(response, null, 2))
        console.log("========== RESPONSE ==========")
        console.log(response)

        console.log("dietTitle =", response.diet_title)
        console.log("dailyCalories =", response.daily_calories)

        if (response.meals.length > 0) {
            console.log("Meal =", response.meals[0])

            if (response.meals[0].foods.length > 0) {
                console.log("Food =", response.meals[0].foods[0])
                console.log("foodName =", response.meals[0].foods[0].food_name)
                console.log("foodId =", response.meals[0].foods[0].food_id)
            }
        }

        console.log("==============================")

        setDietPlan(response)
    } catch (error: any) {
        console.error(error)

        const message =
            error?.response?.data?.detail ||
            error?.message ||
            'Không thể tạo thực đơn.'

        setErrorMessage(message)
    } finally {
        setLoading(false)
    }
}       
    return (
        <MemberLayout>
            <Box p="7" maxW="1000px" mx="auto">
                <Stack spacing="6">
                    <Flex align="center" justify="space-between" flexWrap="wrap" gap="4">
                        <Flex align="center" gap="4">
                            <Box
                                w="56px"
                                h="56px"
                                borderRadius="16px"
                                bg="rgba(224,48,48,0.12)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={FiMessageSquare} color="#E03030" boxSize="24px" />
                            </Box>
                            <Box>
                                <Heading fontSize="24px" color="white">
                                    Tạo thực đơn
                                </Heading>
            
                            </Box>
                        </Flex>
                        <Button colorScheme="red" onClick={handleGenerateDietPlan} isLoading={loading} loadingText="Đang xử lý">
                            Tạo thực đơn AI
                        </Button>
                    </Flex>

                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6">
                        <VStack spacing="4" align="stretch">
                            <Text color="#8A8A93" fontSize="14px">
                                Ví dụ ghi yêu cầu:
                            </Text>
                            <Box bg="#0A0C10" borderRadius="12px" p="4">
                                <Text color="#E2E1EB" fontSize="13px" lineHeight="1.8">
                                    "Tạo thực đơn 4 bữa cho người giảm mỡ, cao 170cm, nặng 70kg, không ăn thịt bò, ưu tiên gà và rau xanh."
                                </Text>
                            </Box>
                            <Textarea
                                value={requestText}
                                onChange={(e) => setRequestText(e.target.value)}
                                placeholder="Nhập yêu cầu của bạn tại đây..."
                                minH="180px"
                                resize="vertical"
                                borderColor="#1e2028"
                                _placeholder={{ color: '#6B7280' }}
                                color="white"
                                bg="#0A0C10"
                            />
                        </VStack>
                    </Box>

                    {errorMessage && (
                        <Box bg="#2f1b1b" border="1px solid #7f1d1d" borderRadius="16px" p="4">
                            <Text color="#F87171">{errorMessage}</Text>
                        </Box>
                    )}

                    {loading && (
                        <Flex justify="center" py="10">
                            <Spinner color="#E03030" size="xl" />
                        </Flex>
                    )}

                    {dietPlan && (
                        <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" p="6">
                            <Stack spacing="5">
                                <Box>
                                    <Flex align="center" justify="space-between" flexWrap="wrap" gap="3">
                                        <Heading fontSize="20px" color="white">
                                            {dietPlan.diet_title || 'Kế hoạch dinh dưỡng'}
                                        </Heading>
                                        <Badge colorScheme="red" variant="subtle" fontSize="12px" py="2" px="3">
                                            {dietPlan.daily_calories} kcal/ngày
                                        </Badge>
                                    </Flex>
                                    <Text color="#8A8A93" mt="2">
                                        Mục tiêu macros: Protein {dietPlan.protein_target_g}g • Carbs {dietPlan.carbs_target_g}g • Fat {dietPlan.fat_target_g}g
                                    </Text>
                                </Box>

                                <Divider borderColor="#2d313a" />

                                {dietPlan.meals.map((meal) => (
                                    <Box key={meal.name} bg="#0A0C10" border="1px solid" borderColor="#1e2028" borderRadius="14px" p="4">
                                        <Flex align="center" justify="space-between" flexWrap="wrap" gap="3" mb="4">
                                            <Heading fontSize="18px" color="white">
                                                {meal.name}
                                            </Heading>
                                            <Badge colorScheme="red" variant="subtle" fontSize="12px" py="2" px="3">
                                                {meal.calories} kcal
                                            </Badge>
                                        </Flex>

                                        <Stack spacing="3">
                                            {meal.foods.map((food) => (
                                                <Box key={`${meal.name}-${food.food_id}-${food.amount}`} p="4" bg="#121419" borderRadius="12px">
                                                    <Flex justify="space-between" flexWrap="wrap" gap="3">
                                                        <Box>
                                                            <Text color="white" fontWeight="600">{food.food_name}</Text>
                                                            <Text color="#8A8A93" fontSize="12px">{food.amount}</Text>
                                                        </Box>
                                                        <Text color="#8A8A93" fontSize="12px">{food.calories} kcal</Text>
                                                    </Flex>
                                                    <Flex mt="3" gap="2" flexWrap="wrap">
                                                        <Badge colorScheme="red" variant="subtle">P {food.protein}g</Badge>
                                                        <Badge colorScheme="blue" variant="subtle">C {food.carbs}g</Badge>
                                                        <Badge colorScheme="yellow" variant="subtle">F {food.fat}g</Badge>
                                                    </Flex>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Stack>
            </Box>
        </MemberLayout>
    )

    }
     export default AIChat

    
