import React, { useEffect, useState } from 'react'
import { HStack, IconButton, Icon, Avatar, Box } from '@chakra-ui/react'
import { FiBell, FiSettings } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getProfile, type UserProfile } from '../../../api/user'

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
            <Box position="relative">
                <IconButton
                    aria-label="Notifications"
                    icon={<Icon as={FiBell} boxSize="18px" />}
                    variant="ghost"
                    color="#8A8A93"
                    _hover={{ color: 'white', bg: 'rgba(255,255,255,0.05)' }}
                    borderRadius="10px"
                />
                <Box position="absolute" top="9px" right="9px" w="8px" h="8px" borderRadius="full" bg="#E03030" />
            </Box>
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
