import React, { useState } from 'react'
import { Box, Flex, Heading, Text, HStack, IconButton } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import AppButton from '../Button/AppButton'
import { useAuthStore } from '../../../store/useAuthStore'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Training', href: '/dashboard' },
  { label: 'About', href: '/about' },
]

const PublicNavbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, logout, roleId } = useAuthStore()

  const handleLoginClick = () => navigate('/login')

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)

    // Redirect to login if trying to access protected routes while not authenticated
    if (href === '/dashboard' && !isAuthenticated) {
      navigate('/login')
      return
    }

    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '#')
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const el = document.querySelector(targetId)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        const el = document.querySelector(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(href)
    }
  }

  return (
    <>
      <Box
        as="nav"
        position="fixed"
        top="0"
        left="0"
        right="0"
        h="70px"
        bg={location.pathname === '/' ? 'rgba(12, 14, 20, 0.8)' : 'rgba(10, 10, 10, 0.8)'}
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="#33343c"
        zIndex="100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: '4', md: '8' }}
      >
        <Flex maxW="1200px" w="full" justify="space-between" align="center" position="relative">
          {/* Logo */}
          <Heading
            fontSize="2xl"
            fontWeight="bold"
            letterSpacing="tighter"
            cursor="pointer"
            zIndex="50"
            color="white"
            onClick={() => navigate('/')}
          >
            AISTHEA
          </Heading>

          {/* Desktop Nav Links — Centered */}
          <HStack
            spacing="8"
            display={{ base: 'none', md: 'flex' }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || (location.pathname === '/' && link.href === '/#')
              return (
                <Text
                  key={link.label}
                  fontSize="sm"
                  fontWeight="500"
                  color={isActive ? '#e03030' : '#8A8A93'}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ color: 'white', opacity: 0.8 }}
                  _active={{ transform: 'scale(0.95)' }}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </Text>
              )
            })}
          </HStack>

          {/* Right Side CTA */}
          <HStack spacing="4" zIndex="50">
            {isAuthenticated ? (
              <AppButton
                variant="outline"
                label="Logout"
                fontSize="xs"
                px="5"
                h="9"
                display={{ base: 'none', md: 'block' }}
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              />
            ) : (
              <AppButton
                variant="outline"
                label="Login"
                fontSize="xs"
                px="5"
                h="9"
                display={{ base: 'none', md: 'block' }}
                onClick={handleLoginClick}
              />
            )}
            <AppButton
              variant="solid"
              label={isAuthenticated ? "Dashboard" : "Start Training"}
              fontSize="xs"
              px="5"
              h="9"
              onClick={() => {
                if (!isAuthenticated) handleLoginClick()
                else if (roleId === 1) navigate('/admin')
                else if (roleId === 2) navigate('/pt/dashboard')
                else navigate('/dashboard')
              }}
            />

            {/* Mobile Hamburger */}
            <IconButton
              aria-label="Toggle mobile menu"
              icon={isMobileMenuOpen ? <FiX size="24" /> : <FiMenu size="24" />}
              display={{ base: 'flex', md: 'none' }}
              variant="ghost"
              color="#e2e1eb"
              _hover={{ bg: 'transparent', color: 'white' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <Flex
          position="fixed"
          inset="0"
          bg="#0c0e14"
          zIndex="45"
          direction="column"
          align="center"
          justify="center"
          gap="8"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Text
                key={link.label}
                fontSize="2xl"
                fontWeight="bold"
                color={isActive ? '#e03030' : '#8A8A93'}
                cursor="pointer"
                _hover={{ color: 'white' }}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </Text>
            )
          })}
          {isAuthenticated ? (
            <AppButton
              variant="ghost"
              label="Logout"
              fontSize="md"
              mt="4"
              onClick={() => {
                setIsMobileMenuOpen(false)
                logout()
                navigate('/')
              }}
            />
          ) : (
            <AppButton
              variant="ghost"
              label="Login"
              fontSize="md"
              mt="4"
              onClick={() => {
                setIsMobileMenuOpen(false)
                handleLoginClick()
              }}
            />
          )}
        </Flex>
      )}
    </>
  )
}

export default PublicNavbar