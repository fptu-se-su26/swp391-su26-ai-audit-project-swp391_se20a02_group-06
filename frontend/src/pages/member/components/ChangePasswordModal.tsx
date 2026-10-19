import React, { useState } from 'react'
import {
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
    VStack,
    useToast
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { changePassword } from '../../../api/user'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast({ title: t('profile.fillAllFields', 'Please fill in all fields'), status: 'warning', duration: 3000 })
            return
        }
        if (newPassword !== confirmPassword) {
            toast({ title: t('profile.passwordsDoNotMatch', 'New passwords do not match'), status: 'error', duration: 3000 })
            return
        }

        setLoading(true)
        const success = await changePassword(currentPassword, newPassword)
        setLoading(false)

        if (success) {
            toast({ title: t('profile.passwordChangedSuccess', 'Password changed successfully'), status: 'success', duration: 3000 })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            onSuccess()
            onClose()
        } else {
            toast({ title: t('profile.currentPasswordIncorrect', 'Current password is incorrect'), status: 'error', duration: 3000 })
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
            <ModalContent bg="#111318" border="1px solid #1e2028" borderRadius="20px">
                <ModalHeader color="white">{t('profile.changePassword', 'Change Password')}</ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel color="#8A8A93" fontSize="13px">{t('profile.currentPassword', 'Current Password')}</FormLabel>
                            <Input 
                                type="password" 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                bg="#0A0A0A"
                                borderColor="#262626"
                                color="#e2e1eb"
                                h="42px"
                                _placeholder={{ color: '#8A8A93' }}
                                _hover={{ borderColor: '#E03030' }}
                                _focus={{
                                  borderColor: '#E03030',
                                  boxShadow: '0 0 0 1px #E03030',
                                  bg: '#0A0A0A',
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel color="#8A8A93" fontSize="13px">{t('profile.newPassword', 'New Password')}</FormLabel>
                            <Input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                bg="#0A0A0A"
                                borderColor="#262626"
                                color="#e2e1eb"
                                h="42px"
                                _placeholder={{ color: '#8A8A93' }}
                                _hover={{ borderColor: '#E03030' }}
                                _focus={{
                                  borderColor: '#E03030',
                                  boxShadow: '0 0 0 1px #E03030',
                                  bg: '#0A0A0A',
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel color="#8A8A93" fontSize="13px">{t('profile.confirmNewPassword', 'Confirm New Password')}</FormLabel>
                            <Input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                bg="#0A0A0A"
                                borderColor="#262626"
                                color="#e2e1eb"
                                h="42px"
                                _placeholder={{ color: '#8A8A93' }}
                                _hover={{ borderColor: '#E03030' }}
                                _focus={{
                                  borderColor: '#E03030',
                                  boxShadow: '0 0 0 1px #E03030',
                                  bg: '#0A0A0A',
                                }}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} color="#8A8A93" _hover={{ bg: '#1e2028' }}>
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button 
                        bg="#E03030" 
                        color="white" 
                        _hover={{ bg: '#c22727' }} 
                        onClick={handleSubmit}
                        isLoading={loading}
                    >
                        {t('profile.savePassword', 'Save Password')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ChangePasswordModal
