import React, { useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Spinner,
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
    useToast,
    IconButton,
    Switch,
} from '@chakra-ui/react'
import { FiTrash2, FiEdit2 } from 'react-icons/fi'
import useSWR from 'swr'
import apiClient from '../../lib/axios'
import AdminLayout from '../../components/shared/Layout/AdminLayout.tsx'
import AppButton from '../../components/shared/Button/AppButton'

interface ProductPackageDto {
    id: number
    name: string
    type: number // 0 = Membership, 1 = OnlineWorkout
    price: number
    durationDays: number
    description?: string
    isActive: boolean
    isPopular: boolean
}

const typeLabels: Record<number, string> = {
    0: 'Membership',
    1: 'Online Workout',
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data)

const AdminPackages: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const { data: packages, error, isLoading, mutate } = useSWR<ProductPackageDto[]>('/product-packages', fetcher)
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        type: '0',
        price: '',
        durationDays: '',
        description: '',
        isActive: true,
        isPopular: false,
    })

    const totalPackages = packages?.length || 0
    const activePackages = packages?.filter(p => p.isActive).length || 0
    const popularPackages = packages?.filter(p => p.isPopular).length || 0

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (name: string, isChecked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: isChecked }))
    }

    const openCreateModal = () => {
        setEditingId(null)
        setFormData({
            name: '',
            type: '0',
            price: '',
            durationDays: '',
            description: '',
            isActive: true,
            isPopular: false,
        })
        onOpen()
    }

    const openEditModal = (pkg: ProductPackageDto) => {
        setEditingId(pkg.id)
        setFormData({
            name: pkg.name,
            type: pkg.type.toString(),
            price: pkg.price.toString(),
            durationDays: pkg.durationDays.toString(),
            description: pkg.description || '',
            isActive: pkg.isActive,
            isPopular: pkg.isPopular,
        })
        onOpen()
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.durationDays) return

        setIsSubmitting(true)
        const payload = {
            name: formData.name,
            type: parseInt(formData.type),
            price: parseFloat(formData.price),
            durationDays: parseInt(formData.durationDays),
            description: formData.description || null,
            isActive: formData.isActive,
            isPopular: formData.isPopular,
        }

        try {
            if (editingId) {
                await apiClient.put(`/product-packages/${editingId}`, payload)
                toast({ title: 'Package updated', status: 'success', duration: 3000, isClosable: true })
            } else {
                await apiClient.post('/product-packages', payload)
                toast({ title: 'Package created', status: 'success', duration: 3000, isClosable: true })
            }
            onClose()
            mutate()
        } catch (error: any) {
            toast({
                title: editingId ? 'Failed to update package' : 'Failed to create package',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this package?')) return

        try {
            await apiClient.delete(`/product-packages/${id}`)
            toast({ title: 'Package deleted', status: 'info', duration: 3000, isClosable: true })
            mutate()
        } catch (error: any) {
            toast({
                title: 'Failed to delete package',
                description: error.response?.data?.message || 'Something went wrong.',
                status: 'error', duration: 3000, isClosable: true,
            })
        }
    }

    const togglePopularStatus = async (pkg: ProductPackageDto) => {
        try {
            // Send PUT request with existing data but flipped isPopular
            await apiClient.put(`/product-packages/${pkg.id}`, {
                name: pkg.name,
                type: pkg.type,
                price: pkg.price,
                durationDays: pkg.durationDays,
                description: pkg.description,
                isActive: pkg.isActive,
                isPopular: !pkg.isPopular,
            })
            mutate()
            toast({ title: `Package marked as ${!pkg.isPopular ? 'popular' : 'not popular'}`, status: 'success', duration: 2000 })
        } catch (error: any) {
            toast({ title: 'Failed to update status', status: 'error', duration: 3000 })
        }
    }

    return (
        <AdminLayout>
            <Box>
                <Flex justify="space-between" align="center" mb="6">
                    <Box>
                        <Heading fontSize="24px" color="white" mb="1">Pricing & Packages</Heading>
                        <Text color="#8A8A93" fontSize="14px">Manage subscription tiers and workout plans</Text>
                    </Box>
                    <AppButton
                        label="Add Package"
                        variant="solid"
                        onClick={openCreateModal}
                    />
                </Flex>

                {/* Summary Cards */}
                <Flex gap="4" mb="8">
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="12px" p="5" flex="1">
                        <Text color="#8A8A93" fontSize="13px" fontWeight="600" textTransform="uppercase" mb="2">Total Packages</Text>
                        <Heading color="white" fontSize="28px">{totalPackages}</Heading>
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="12px" p="5" flex="1">
                        <Text color="#8A8A93" fontSize="13px" fontWeight="600" textTransform="uppercase" mb="2">Active</Text>
                        <Heading color="#10b981" fontSize="28px">{activePackages}</Heading>
                    </Box>
                    <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="12px" p="5" flex="1">
                        <Text color="#8A8A93" fontSize="13px" fontWeight="600" textTransform="uppercase" mb="2">Popular / Featured</Text>
                        <Heading color="#e03030" fontSize="28px">{popularPackages}</Heading>
                    </Box>
                </Flex>

                <Box bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px" overflow="hidden">
                    <Table variant="unstyled" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <Thead bg="#0A0C10">
                            <Tr>
                                <Th color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase" py="4">Name</Th>
                                <Th color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase" py="4">Type</Th>
                                <Th color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase" py="4">Price</Th>
                                <Th color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase" py="4">Duration</Th>
                                <Th color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase" py="4">Popular</Th>
                                <Th color="#8A8A93" fontSize="12px" fontWeight="600" textTransform="uppercase" py="4" textAlign="right">Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {isLoading ? (
                                <Tr>
                                    <Td colSpan={6} textAlign="center" py="10">
                                        <Spinner color="#e03030" />
                                    </Td>
                                </Tr>
                            ) : error ? (
                                <Tr>
                                    <Td colSpan={6} textAlign="center" py="10" color="red.500">
                                        Failed to load packages
                                    </Td>
                                </Tr>
                            ) : packages?.length === 0 ? (
                                <Tr>
                                    <Td colSpan={6} textAlign="center" py="10" color="#8A8A93">
                                        No packages found
                                    </Td>
                                </Tr>
                            ) : (
                                packages?.map((pkg) => (
                                    <Tr key={pkg.id} _hover={{ bg: '#1a1d27' }} transition="all 0.2s" borderTop="1px solid" borderColor="#1e2028">
                                        <Td borderTop="1px solid" borderColor="#1e2028">
                                            <Flex align="center" gap="3">
                                                <Box>
                                                    <Text color="white" fontWeight="600" fontSize="14px">{pkg.name}</Text>
                                                    {!pkg.isActive && <Badge colorScheme="gray" fontSize="10px" mt="1">Inactive</Badge>}
                                                </Box>
                                            </Flex>
                                        </Td>
                                        <Td borderTop="1px solid" borderColor="#1e2028">
                                            <Badge
                                                bg={pkg.type === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(224, 48, 48, 0.1)'}
                                                color={pkg.type === 0 ? '#3b82f6' : '#e03030'}
                                                px="2" py="1" borderRadius="md"
                                            >
                                                {typeLabels[pkg.type] || 'Unknown'}
                                            </Badge>
                                        </Td>
                                        <Td borderTop="1px solid" borderColor="#1e2028">
                                            <Text color="white" fontSize="14px">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                                            </Text>
                                        </Td>
                                        <Td borderTop="1px solid" borderColor="#1e2028">
                                            <Text color="#8A8A93" fontSize="14px">{pkg.durationDays} days</Text>
                                        </Td>
                                        <Td borderTop="1px solid" borderColor="#1e2028">
                                            <Switch 
                                                colorScheme="red" 
                                                isChecked={pkg.isPopular} 
                                                onChange={() => togglePopularStatus(pkg)} 
                                            />
                                        </Td>
                                        <Td borderTop="1px solid" borderColor="#1e2028" textAlign="right">
                                            <IconButton
                                                aria-label="Edit"
                                                icon={<FiEdit2 />}
                                                size="sm"
                                                variant="ghost"
                                                color="#8A8A93"
                                                _hover={{ color: 'white', bg: '#262a36' }}
                                                mr="2"
                                                onClick={() => openEditModal(pkg)}
                                            />
                                            <IconButton
                                                aria-label="Delete"
                                                icon={<FiTrash2 />}
                                                size="sm"
                                                variant="ghost"
                                                color="#8A8A93"
                                                _hover={{ color: '#e03030', bg: 'rgba(224, 48, 48, 0.1)' }}
                                                onClick={() => handleDelete(pkg.id)}
                                            />
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent bg="#141720" border="1px solid" borderColor="#1e2028" borderRadius="16px">
                    <ModalHeader color="white">{editingId ? 'Edit Package' : 'Create Package'}</ModalHeader>
                    <ModalCloseButton color="#8A8A93" />
                    <ModalBody>
                        <Flex direction="column" gap="4">
                            <FormControl isRequired>
                                <FormLabel color="#8A8A93" fontSize="12px">Name</FormLabel>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    bg="#0A0C10" border="1px solid" borderColor="#262a36" color="white"
                                    _focus={{ borderColor: '#e03030', boxShadow: 'none' }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color="#8A8A93" fontSize="12px">Type</FormLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    bg="#0A0C10" border="1px solid" borderColor="#262a36" color="white"
                                    _focus={{ borderColor: '#e03030', boxShadow: 'none' }}
                                >
                                    <option value="0">Membership</option>
                                    <option value="1">Online Workout</option>
                                </Select>
                            </FormControl>

                            <Flex gap="4">
                                <FormControl isRequired>
                                    <FormLabel color="#8A8A93" fontSize="12px">Price (VND)</FormLabel>
                                    <Input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        bg="#0A0C10" border="1px solid" borderColor="#262a36" color="white"
                                        _focus={{ borderColor: '#e03030', boxShadow: 'none' }}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel color="#8A8A93" fontSize="12px">Duration (Days)</FormLabel>
                                    <Input
                                        name="durationDays"
                                        type="number"
                                        value={formData.durationDays}
                                        onChange={handleInputChange}
                                        bg="#0A0C10" border="1px solid" borderColor="#262a36" color="white"
                                        _focus={{ borderColor: '#e03030', boxShadow: 'none' }}
                                    />
                                </FormControl>
                            </Flex>

                            <FormControl>
                                <FormLabel color="#8A8A93" fontSize="12px">Description</FormLabel>
                                <Input
                                    as="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    bg="#0A0C10" border="1px solid" borderColor="#262a36" color="white"
                                    _focus={{ borderColor: '#e03030', boxShadow: 'none' }}
                                    rows={3}
                                    p={3}
                                />
                            </FormControl>
                            
                            <Flex justify="space-between">
                                <FormControl display="flex" alignItems="center">
                                    <FormLabel htmlFor="is-active" mb="0" color="#8A8A93" fontSize="14px">Active Package</FormLabel>
                                    <Switch id="is-active" colorScheme="red" isChecked={formData.isActive} onChange={(e) => handleSwitchChange('isActive', e.target.checked)} />
                                </FormControl>
                                
                                <FormControl display="flex" alignItems="center">
                                    <FormLabel htmlFor="is-popular" mb="0" color="#8A8A93" fontSize="14px">Mark as Popular</FormLabel>
                                    <Switch id="is-popular" colorScheme="red" isChecked={formData.isPopular} onChange={(e) => handleSwitchChange('isPopular', e.target.checked)} />
                                </FormControl>
                            </Flex>
                        </Flex>
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor="#1e2028" mt="4">
                        <Button variant="ghost" color="#8A8A93" _hover={{ color: 'white', bg: '#262a36' }} mr="3" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            bg="#e03030" color="white" _hover={{ bg: '#c92424' }}
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                        >
                            {editingId ? 'Save Changes' : 'Create Package'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AdminLayout>
    )
}

export default AdminPackages
