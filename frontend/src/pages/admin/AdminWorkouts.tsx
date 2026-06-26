import React, { useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
} from '@chakra-ui/react'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import AppButton from '../../components/shared/Button/AppButton'
import { workoutsMock } from '../../mock/admin/workoutsMock.ts'

const AdminWorkouts: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [workouts, setWorkouts] = useState(workoutsMock)
    const [formData, setFormData] = useState({
        title: '',
        creator: '',
        type: '',
        level: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        if (!formData.title || !formData.creator || !formData.type || !formData.level) return;

        const newWorkout = {
            id: workouts.length > 0 ? Math.max(...workouts.map(w => w.id)) + 1 : 1,
            title: formData.title,
            creator: formData.creator,
            type: formData.type,
            level: formData.level,
            uses: 0,
        }

        setWorkouts([...workouts, newWorkout])
        setFormData({ title: '', creator: '', type: '', level: '' })
        onClose()
    }

    return (
        <AdminLayout>
            <Box p="7" maxW="1200px">
                <Flex justify="space-between" align="center" mb="7">
                    <Heading fontSize="24px" fontWeight="800" color="white">
                        Workout Management
                    </Heading>
                    <AppButton label="Create Program" size="sm" onClick={onOpen} />
                </Flex>

                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
                    <Table variant="simple" size="sm">
                        <Thead bg="#0A0C10">
                            <Tr>
                                <Th color="#8A8A93" borderColor="#1e2028">Program Title</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">Creator</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">Type</Th>
                                <Th color="#8A8A93" borderColor="#1e2028">Level</Th>
                                <Th color="#8A8A93" borderColor="#1e2028" isNumeric>Uses</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {workouts.map((w: any) => (
                                <Tr key={w.id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                                    <Td color="white" borderColor="#1e2028" fontWeight="600">{w.title}</Td>
                                    <Td color="#e2e1eb" borderColor="#1e2028">{w.creator}</Td>
                                    <Td borderColor="#1e2028">
                                        <Badge bg="#2e3040" color="#E2E1EB" px="2" py="0.5" borderRadius="md">{w.type}</Badge>
                                    </Td>
                                    <Td color="#8A8A93" borderColor="#1e2028">{w.level}</Td>
                                    <Td color="#e2e1eb" borderColor="#1e2028" isNumeric>{w.uses.toLocaleString()}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg="#141720" color="white" borderColor="#1e2028" borderWidth="1px">
                    <ModalHeader>Create New Program</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Program Title</FormLabel>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Hypertrophy Phase 2"
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Creator</FormLabel>
                            <Input
                                name="creator"
                                value={formData.creator}
                                onChange={handleInputChange}
                                placeholder="e.g. Marcus Cole"
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Type</FormLabel>
                            <Select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            >
                                <option value="" style={{ color: "black" }}>Select type</option>
                                <option value="Strength" style={{ color: "black" }}>Strength</option>
                                <option value="Cardio" style={{ color: "black" }}>Cardio</option>
                                <option value="Full Body" style={{ color: "black" }}>Full Body</option>
                                <option value="Flexibility" style={{ color: "black" }}>Flexibility</option>
                            </Select>
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel color="#8A8A93">Level</FormLabel>
                            <Select
                                name="level"
                                value={formData.level}
                                onChange={handleInputChange}
                                bg="#0A0C10"
                                border="1px solid #1e2028"
                                _hover={{ borderColor: "#E03030" }}
                                _focus={{ borderColor: "#E03030", boxShadow: "none" }}
                            >
                                <option value="" style={{ color: "black" }}>Select level</option>
                                <option value="Beginner" style={{ color: "black" }}>Beginner</option>
                                <option value="Intermediate" style={{ color: "black" }}>Intermediate</option>
                                <option value="Advanced" style={{ color: "black" }}>Advanced</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose} color="#8A8A93" _hover={{ bg: "rgba(255,255,255,0.05)" }}>
                            Cancel
                        </Button>
                        <Button bg="#E03030" color="white" _hover={{ bg: "#C92424" }} onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AdminLayout>
    )
}

export default AdminWorkouts