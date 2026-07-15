import React, { useEffect, useState } from 'react'
import { HStack, IconButton, Icon, Avatar } from '@chakra-ui/react'
import { FiSettings } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getProfile, type UserProfile } from '../../../api/user'
import NotificationBell from './NotificationBell'

const HeaderActions: React.FC = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<UserProfile | null>(null)

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
        <HStack spacing="3">
            <NotificationBell />
            <IconButton
                aria-label="Settings"
                icon={<Icon as={FiSettings} boxSize="18px" />}
                variant="ghost"
                color="#8A8A93"
                _hover={{ color: 'white', bg: 'rgba(255,255,255,0.05)' }}
                borderRadius="10px"
                onClick={() => navigate('/profile')}
            />
            <Avatar
                size="sm"
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
    )
}

export default HeaderActions
