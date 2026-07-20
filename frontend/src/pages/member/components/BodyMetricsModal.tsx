import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Box,
    Grid,
    Stack,
    HStack,
    Text,
    InputGroup,
    Input,
    InputRightAddon,
    useToast,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react'
import AppButton from '../../../components/shared/Button/AppButton'

interface BodyMetricsModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: { gender: string, age: number, height: number, weight: number }) => Promise<void>
}

const BodyMetricsModal: React.FC<BodyMetricsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [gender, setGender] = useState('')
    const [age, setAge] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const toast = useToast()

    const clearError = (field: string) => {
        setErrors(prev => {
            const next = { ...prev }
            delete next[field]
            return next
        })
    }

    const handleSave = async () => {
        const newErrors: Record<string, string> = {}
        if (!gender) newErrors.gender = 'Please select your gender'
        if (!age) newErrors.age = 'Please enter your age'
        if (!height) newErrors.height = 'Please enter your height'
        if (!weight) newErrors.weight = 'Please enter your weight'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            setLoading(true)
            setErrors({})
            await onSave({
                gender,
                age: Number(age),
                height: Number(height),
                weight: Number(weight)
            })
            onClose()
        } catch (error: any) {
            const data = error?.response?.data
            if (data && typeof data === 'object') {
                const fieldErrors: Record<string, string> = {}
                for (const [key, msgs] of Object.entries(data)) {
                    if (Array.isArray(msgs) && msgs.length > 0) {
                        fieldErrors[key.toLowerCase()] = msgs[0] as string
                    }
                }
                if (Object.keys(fieldErrors).length > 0) {
                    setErrors(fieldErrors)
                    return
                }
                if (data.message) {
                    setErrors({ general: data.message })
                    return
                }
            }
            toast({ title: 'Error', description: error.message, status: 'error', duration: 3000 })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {}} isCentered closeOnOverlayClick={false} size="xl">
            <ModalOverlay bg="rgba(10,12,16,0.8)" backdropFilter="blur(10px)" />
            <ModalContent bg="#111318" border="1px solid #1e2028" borderRadius="24px" p="2">
                <ModalHeader color="white" textAlign="center" pt="6" pb="2">
                    <Text fontSize="20px" fontWeight="800">Basic Information</Text>
                    <Text fontSize="13px" fontWeight="400" color="#8A8A93" mt="1">
                        Help AI calculate the best program for you.
                    </Text>
                </ModalHeader>
                <ModalBody pb="6">
                    <Stack spacing="5">
                        {errors.general && (
                            <Alert status="error" bg="red.900" borderRadius="8px">
                                <AlertIcon color="red.300" />
                                <AlertDescription color="red.300" fontSize="13px">{errors.general}</AlertDescription>
                            </Alert>
                        )}

                        <Box>
                            <Text fontSize="12px" fontWeight="700" color="#8A8A93" mb="2" textTransform="uppercase" letterSpacing="wider">
                                Gender
                            </Text>
                            <HStack spacing="3">
                                {[
                                    { id: 'male', label: 'Male' },
                                    { id: 'female', label: 'Female' },
                                ].map((g) => (
                                    <Box
                                        key={g.id}
                                        flex="1"
                                        py="3"
                                        borderRadius="12px"
                                        border="1.5px solid"
                                        borderColor={gender === g.id ? '#E03030' : '#2e3040'}
                                        bg={gender === g.id ? 'rgba(224,48,48,0.1)' : '#141720'}
                                        cursor="pointer"
                                        textAlign="center"
                                        transition="all 0.15s"
                                        onClick={() => { setGender(g.id); clearError('gender') }}
                                    >
                                        <Text fontSize="15px" fontWeight="700" color={gender === g.id ? 'white' : '#8A8A93'}>
                                            {g.label}
                                        </Text>
                                    </Box>
                                ))}
                            </HStack>
                            {errors.gender && <Text color="red.300" fontSize="12px" mt="1">{errors.gender}</Text>}
                        </Box>

                        <Grid templateColumns="repeat(3, 1fr)" gap="3">
                            <Box>
                                <Text fontSize="12px" fontWeight="700" color="#8A8A93" mb="2" textTransform="uppercase" letterSpacing="wider">Age</Text>
                                <InputGroup size="md">
                                    <Input
                                        type="number"
                                        placeholder="25"
                                        value={age}
                                        onChange={(e) => { setAge(e.target.value); clearError('age') }}
                                        bg="#0f1117"
                                        border="1.5px solid"
                                        borderColor={errors.age ? '#E03030' : '#2e3040'}
                                        color="white"
                                        borderRadius="10px"
                                        h="44px"
                                        _focus={{ borderColor: errors.age ? '#E03030' : '#E03030', boxShadow: 'none' }}
                                    />
                                    <InputRightAddon bg="#1e2028" border="1.5px solid #2e3040" color="#8A8A93" fontSize="11px" fontWeight="600" h="44px" borderRadius="0 10px 10px 0">
                                        years
                                    </InputRightAddon>
                                </InputGroup>
                                {errors.age && <Text color="red.300" fontSize="12px" mt="1">{errors.age}</Text>}
                            </Box>
                            <Box>
                                <Text fontSize="12px" fontWeight="700" color="#8A8A93" mb="2" textTransform="uppercase" letterSpacing="wider">Height</Text>
                                <InputGroup size="md">
                                    <Input
                                        type="number"
                                        placeholder="170"
                                        value={height}
                                        onChange={(e) => { setHeight(e.target.value); clearError('height') }}
                                        bg="#0f1117"
                                        border="1.5px solid"
                                        borderColor={errors.height ? '#E03030' : '#2e3040'}
                                        color="white"
                                        borderRadius="10px"
                                        h="44px"
                                        _focus={{ borderColor: errors.height ? '#E03030' : '#E03030', boxShadow: 'none' }}
                                    />
                                    <InputRightAddon bg="#1e2028" border="1.5px solid #2e3040" color="#8A8A93" fontSize="11px" fontWeight="600" h="44px" borderRadius="0 10px 10px 0">
                                        cm
                                    </InputRightAddon>
                                </InputGroup>
                                {errors.height && <Text color="red.300" fontSize="12px" mt="1">{errors.height}</Text>}
                            </Box>
                            <Box>
                                <Text fontSize="12px" fontWeight="700" color="#8A8A93" mb="2" textTransform="uppercase" letterSpacing="wider">Weight</Text>
                                <InputGroup size="md">
                                    <Input
                                        type="number"
                                        placeholder="65"
                                        value={weight}
                                        onChange={(e) => { setWeight(e.target.value); clearError('weight') }}
                                        bg="#0f1117"
                                        border="1.5px solid"
                                        borderColor={errors.weight ? '#E03030' : '#2e3040'}
                                        color="white"
                                        borderRadius="10px"
                                        h="44px"
                                        _focus={{ borderColor: errors.weight ? '#E03030' : '#E03030', boxShadow: 'none' }}
                                    />
                                    <InputRightAddon bg="#1e2028" border="1.5px solid #2e3040" color="#8A8A93" fontSize="11px" fontWeight="600" h="44px" borderRadius="0 10px 10px 0">
                                        kg
                                    </InputRightAddon>
                                </InputGroup>
                                {errors.weight && <Text color="red.300" fontSize="12px" mt="1">{errors.weight}</Text>}
                            </Box>
                        </Grid>
                    </Stack>
                </ModalBody>
                <ModalFooter borderTop="1px solid #1e2028" pt="4" pb="2">
                    <AppButton
                        label="Save Information"
                        w="full"
                        h="48px"
                        fontSize="14px"
                        onClick={handleSave}
                        isLoading={loading}
                        isDisabled={!gender || !age || !height || !weight}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default BodyMetricsModal
