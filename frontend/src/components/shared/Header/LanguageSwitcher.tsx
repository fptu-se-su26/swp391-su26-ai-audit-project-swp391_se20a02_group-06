import React, { useState, useEffect } from 'react'
import { HStack, Button, Icon, Tooltip } from '@chakra-ui/react'
import { FiGlobe } from 'react-icons/fi'
import i18n from '../../../i18n'

interface LanguageSwitcherProps {
    compact?: boolean
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
    const [currentLang, setCurrentLang] = useState<'en' | 'vi'>(() => {
        const initial =
            i18n.language ||
            (typeof window !== 'undefined' ? localStorage.getItem('netfit_lang') : 'vi') ||
            'vi'
        return initial.startsWith('vi') ? 'vi' : 'en'
    })

    useEffect(() => {
        const handleLangChange = (lng: string) => {
            setCurrentLang(lng.startsWith('vi') ? 'vi' : 'en')
        }
        i18n.on('languageChanged', handleLangChange)
        return () => {
            i18n.off('languageChanged', handleLangChange)
        }
    }, [])

    const handleSwitch = (lang: 'en' | 'vi') => {
        if (currentLang === lang) return
        i18n.changeLanguage(lang)
        setCurrentLang(lang)
        try {
            localStorage.setItem('netfit_lang', lang)
            document.documentElement.lang = lang
        } catch (e) {
            console.error('Failed to save language preference', e)
        }
    }

    return (
        <Tooltip
            label={currentLang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
            placement="bottom"
            hasArrow
        >
            <HStack
                bg="#141720"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.12)"
                borderRadius="full"
                p="2px"
                spacing="2px"
                align="center"
                transition="all 0.2s ease"
                _hover={{ borderColor: 'rgba(255, 255, 255, 0.25)', bg: '#171a24' }}
                aria-label="Language Switcher"
            >
                {!compact && (
                    <Icon
                        as={FiGlobe}
                        color="#8A8A93"
                        boxSize="13px"
                        ml="6px"
                        mr="1px"
                        pointerEvents="none"
                    />
                )}
                <Button
                    id="btn-lang-en"
                    data-testid="btn-lang-en"
                    size="xs"
                    variant="unstyled"
                    h="20px"
                    minW="24px"
                    px="6px"
                    borderRadius="full"
                    fontSize="11px"
                    fontWeight="700"
                    lineHeight="20px"
                    letterSpacing="0.4px"
                    cursor="pointer"
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    bg={currentLang === 'en' ? '#E03030' : 'transparent'}
                    color={currentLang === 'en' ? 'white' : '#8A8A93'}
                    boxShadow={currentLang === 'en' ? '0 1px 6px rgba(224, 48, 48, 0.4)' : 'none'}
                    _hover={{ color: 'white' }}
                    onClick={() => handleSwitch('en')}
                >
                    EN
                </Button>
                <Button
                    id="btn-lang-vi"
                    data-testid="btn-lang-vi"
                    size="xs"
                    variant="unstyled"
                    h="20px"
                    minW="24px"
                    px="6px"
                    borderRadius="full"
                    fontSize="11px"
                    fontWeight="700"
                    lineHeight="20px"
                    letterSpacing="0.4px"
                    cursor="pointer"
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    bg={currentLang === 'vi' ? '#E03030' : 'transparent'}
                    color={currentLang === 'vi' ? 'white' : '#8A8A93'}
                    boxShadow={currentLang === 'vi' ? '0 1px 6px rgba(224, 48, 48, 0.4)' : 'none'}
                    _hover={{ color: 'white' }}
                    onClick={() => handleSwitch('vi')}
                >
                    VI
                </Button>
            </HStack>
        </Tooltip>
    )
}

export default LanguageSwitcher
