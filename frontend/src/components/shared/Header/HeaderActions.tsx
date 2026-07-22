import React, { useEffect, useState } from 'react'
import { HStack, IconButton, Icon, Avatar, Menu, MenuButton, MenuList, MenuItem, useDisclosure } from '@chakra-ui/react'
import { FiSettings, FiLock } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getProfile, type UserProfile } from '../../../api/user'
import NotificationBell from './NotificationBell'
import ChangePasswordModal from '../../../pages/member/components/ChangePasswordModal'

const HeaderActions: React.FC = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const { isOpen: isPwOpen, onOpen: onPwOpen, onClose: onPwClose } = useDisclosure()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile()
                setProfile(data)
            } catch (error) {
                console.error("Failed to fetch profile for header", error)
            }
        }
        fetchProfile()
    }, [])

    return (
        <>
            <HStack spacing="8px">
                <NotificationBell />
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="Settings"
                        icon={<Icon as={FiSettings} boxSize="18px" />}
                        variant="ghost"
                        color="#8A8A93"
                        _hover={{ color: 'white', bg: 'rgba(255,255,255,0.05)' }}
                        borderRadius="10px"
                    />
                    <MenuList bg="#1e2028" borderColor="#2e3040" minW="160px">
                        <MenuItem
                            bg="transparent"
                            color="white"
                            _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                            icon={<Icon as={FiSettings} boxSize="14px" />}
                            onClick={() => navigate('/profile')}
                        >
                            Settings
                        </MenuItem>
                        <MenuItem
                            bg="transparent"
                            color="white"
                            _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                            icon={<Icon as={FiLock} boxSize="14px" />}
                            onClick={onPwOpen}
                        >
                            Change Password
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Avatar
                    boxSize="36px"
                    name={profile?.name || "Member"}
                    src={profile?.avatarUrl || ""}
                    bg="#E03030"
                    color="white"
                    fontSize="12px"
                    fontWeight="700"
                    cursor="pointer"
                    onClick={() => navigate('/profile')}
                />
            </HStack>
            <ChangePasswordModal isOpen={isPwOpen} onClose={onPwClose} onSuccess={onPwClose} />
        </>
    )
}

export default HeaderActions
