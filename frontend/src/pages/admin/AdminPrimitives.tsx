import React from 'react'
import {
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  type BoxProps,
} from '@chakra-ui/react'
import type { IconType } from 'react-icons'
import {
  FiBell,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiSettings,
  FiTrendingUp,
} from 'react-icons/fi'

export const adminColors = {
  bg: '#0A0A0A',
  page: '#12131A',
  surface: '#141414',
  surfaceLow: '#0C0E14',
  surfaceMid: '#1A1B22',
  surfaceHigh: '#282A31',
  surfaceVariant: '#262626',
  text: '#E2E1EB',
  muted: '#E5BDB9',
  dim: '#8A8A93',
  primary: '#E03030',
  primarySoft: '#FFB4AC',
  success: '#4ADE80',
  warning: '#F59E0B',
  error: '#FFB4AB',
}

export const adminAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAZA6qkFM9CU8Huii-SsEMcbLHw2jLuTC5YmZA3XyO5-poeNpehT64IDvXwD3R_NJUT4E9VuVhv6duHzDsepYjFHcIEqOADkYbBKqgZSxAKoZWZ0slqYWk1veG_LROVahxjyl-154mIAwGfFN7oWDBrLSgVEQit9cOrwzhSB9RyFfEyeBQ06OwKfND6-oRA1iabInDgslAtaidYqcYdNix3Pn_34F-KBRM4NALcZto81HMvFO_odaeUo-7Veu_azZVBT_h7spo5yTFN'

export const userImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAkyWvgI7OqTBOBC1ufT5wHgtRQu0t4rHe8nW4KkQI3QgB9R4Dd1VBdmqeZYDgaNVM-PKSfZDS-_ijU7-3AhvtI2YoFO6zi4GRXHRDOjqnxcXRzfBD4DrC-0t5Jg1KOl7K5JABp9qIi8hL0hY6V_txoRdVDuWmtKor_9iQ9yPbFLU23O8cMdO9r2TmpqPLnLdsCcokh7DH4B-Cj873qDWWe6qBMFazGNZUdlcgMAwCKbDRXY9sKN8-LuILxl-saOEFyNSH7_hpbqD',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCCK212FWJbU0AP-71dfZfmceVzts139A1dTaF3HolNlCWaqQyVGx5zgQsMcdl58P7syoOJc_nNtergef-Q9HiyOaKIH4fiyBffVEJLM7CczMlJiYOOXO9FkmmpRWjThyefoXhf2568nsVbcmoMWdvvV6aa3DrsRvcIq4eBdQVcaNG_0Mi0HLBqjO-_MhPqV0ePU8T9Uv3KFPWqSH8-jxvGqKZ26uo8u53ifCq5kjPXCCVvVGJ1gXkRegmboUhUEPvpMjdYr8xoNAah',
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDIIKAZ3_lxiTEYncRs4fGdF2-bh6ZlOff9Yo2_mDxFFvZxlJPU-vNNiBMwhUIaQXqtAd6b-DT30m4AJfwtpJkSHwDGIWgtAUmRKOoei_ruyEAzTFNGWMyUZMWHJ0z7j-xhH-LYUM1BYPPS2VaZLRuHEyE85aF89DugESj9Vi3ZGzz0D7XpvyZVKokDTz19C8lwos5uNu4LWvm4bp0csSkj2yBhBjKGY27sE0-PiDXLRkaF-ky6z9km7HOTvK09w_WUPlc5xhx4ABjf',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4wJzPlwg-zQBLtTC6wMsyoVyT_562qRCj7V5XJBdpJ6NcAg6geMjfKFcIvYkkmlSg_CK2_byPkukCzAqcJSjYjDdS2EEFSwScU_iGRCkaCiTEizyjIfQdDUG6rY_1VrAAr9M5xlrgB7pFesO7gynq-laNIU5YaMizEJoIGbfoISPVRZnaViNVWHhGAXbqP5NZo8aR6uVHVS6Wkyw0z24yXh80tVeuzWx4fkZbRhdebDu5RZNDCGs1y025fl2oOt4qx_8nUcLdeSNE',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDVgrzp_bmgmWHGgfIEdwDv4Nue9NxiTdPtnReQQ_HH5mpfhrmiU3y51YsUZE8ZVo8pgKATyrpj3TYUGQBGDuWTeXK2Xn_ddMUdCzfGXMt_pFKZ9JOFPxK0Mb6rZ49cbm4X6cLS55cw0u4PwETSScUAlWvh9ExkZNwgm2oZv-nIwStbp1QM_QZOPPmduYYvGYBLs36d9Fi_SK2jArA8V6hESPz8Hmt-9t7NxwDLefTtYv_Zf94KdfjaurNH_MEkss1moPfEgRbiXQVl',
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA2xNg2xP-h_cW_N3PoQbk1oF6vWkenURBoDagn933bZvmd8d9tfhd9UDKBfk7JaFPMVHHIzVmO7QaNwJVP3ngsAw1QLYPyLgEOInGWOzhDRNO-d7envyvJyzYeJ_nR0eo0iplRVqXuYsRguRMbktynH4hfZRlH2kQEZHlGCA4nD6ro_GTHhXsKK6rElXPV0C3GsPjemO0HG8wv9Z_vmwJsK_5qr9ezu7Fp9nCXtVVAL6RDK28FvfoS8Mp0Yivry3OBnGu9mhXM9Feq',
]

export const trainerImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAqvMPzPZ-0inrNVp0D9UaNHU9FFq8gSKPaL6B_5GZHF6Y9RgupyKnPSjYKz7NU0UwwcbhrwG_05CNHfTuz84UbQ8L9LN81-OlDZ73Hc2w7PGCpLgBfRp1r4oj2YzN3Floa-HSBeubhcr6d-a3stUYM7NxpDsULXZ-ZUalnrp0SExA7Nf3TBkyeFOA7G6WzSz-nIDHTFNpxNVA5e_YPmX9FGermYSA3vX8XzwpjqixknAoVb3NSofximpS8CtUzOyo3vxbqAMGy7IIj',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBoug9mZzu3AGV3Hw4UyS2jpA6jSwhIjYar4rx93uw2JDmC0Mdopx819mn-Z7bTTCnEi8um7YElsNFPyuwcTDJjYzCObnOGjMSjnGEVd4JuQJApmezypbK1vkjSLIntLay79x4L4OBjRkiA3uGWrnvOfaRmEXm5KsvwUcycK91UuCY-PH0_zAN6t3GOhM1O8bpU6j34aVLEGMrFqp0VZmILzPF9ZWrB2LE7Efo4EFxA1dK7cTvIPgi5yu7GOqcM0sogdwY1ZL_EnFl_',
  '',
]

export const workoutImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4NWz0wHnRvlLfeDqb6hHOOZcwaBYI4N-qG4u0a8Iwm8cxFRUbZj4gyN9_OD-RpWURQ8KCU6dIPz15gU53ZOBCZAcwWsAR1K2DNKWhit7GcM2_R1bWshrS5a9LUWKxk1tjxJDjyO8e9kKn6Kz4LKB-wOL9wMQIWW0pJ0-V35P3CvuQFbGd_UAIQj9Vs7fqFXd_emrkk9WaQIJZWOhDyTa5T6_TF90gqCQdOV7bdepgh-tefr-2pxFeToXsraHhC3nfCQD4Eijmghd9',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDyFtv1tupvyCpKx_73H3YPoqhXjUWD6RUw28eLDu2uHbiAI5BAwVYQtXaDwbK9wCtZ9jy7Uj2pj1ZitqjTpIv9Jn9-jb4d6JLiCMKVcWierl9c6vHgtr6P_1CVhpImgnKX-KpTeFbJxCt1N-A3TKulzb3NLwX8JaqXiSnkbNE35Hko0u2s8CjhyW1-0CQBfHCwMEO7c1KVO8xblPCiQ3-dDBl6LSsxm2MLP8n1HCcjmFnWVZ-EgmdXD2IbwwRj1snqRSWbV8j_eE1X',
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAEFecgnPgTSjWu9j1XCKsQJ05eHmmQB5mByHkW87RVV8-y38qb1q36ijoeIB7LreqNkelD44jzMi1ubbrGSe2IWSfp9tHIiDSG9gFNcRyFDtnce-t7-sWeCGlClMNv_E9vhd5ipEFtyAJPLDj0OEQYpxMNKerZJuMb2G1ST4b6nKzebDeLatXksPbK8qC2qVW39bWfqrVZm804zc1Zvkzx3ittpscnHpRR9ionKvlCpfynfHWe3fnqcG_MIRU5FpF5-wPSLf1lxPQA',
  '',
]

export const payoutImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBZA_A4MQ8bHw8ZANAiyenh92HSJ3ebSfxYfswbY5vC3LrrDsDQY-ngxy9SN3qDLF2ItmCRQFLvYMsvhQ2EsttPQtaVDdVuMUgVfODbXkxrZw-safL8qm2M_n1YJ91zkNgryJHrMSxVMepaWdy5Ml5iIP5uWpQ4idytZXZB8QnbyUGqcznSjVuxjbkpDCanTRfVKYyyEsWjmmwFrYGHiVnMpcbbVz8eB7itUsIWgosQqElXSBwDmEupFpHKzXNEY26_AFuQvDWiwUNZ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAt7eZK52yXqcVRf0TL2BRpzHwHGy-GCZRuEoBzQCxhNiHHSKVEeVoLHcj-PyCWPz_cqljkllH55uknA8MRsuL3b7n0REWQWgvS76D0Afg1pT0e3bxXeWb6bTD0oZM3HYUmRj44NvlEbbryedYvnzozYoQiP_-BIDivfTAotdEFXUItSLm9eJljS0oXBFypya4WOoo64baEApQc3C8kEHboEBLI4X2zxy6uX7QDV52CEQ_ktgthStbOObQ3RljsyZoejN0_vF2jdt-3',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB78artfm3mSIsDIikjE8dqlbQiASNIkwfuUVCqkRDUWcQiVExvpY7f8HRBRbAcTT48UQbz_UJ_QZGeW-7N0eKha6UQVkS_3TkWsP1_w3dTzNqffIDM2qoEbmw3fdCtKHnu0C7dVqFBClTdqyKpWro2YWIXGA7k2pgCOUv0X9RXki3tfYCkX7VHzikuAjtZbcFhm460Mqs4XB7sZQYTELEB80UkSR1wd2xA-GVkz_u4Tq0ziRUiZrtROdCJW3PhNrklU6LJhxoxBB2N',
]

export const formatCurrency = (value: number, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)

export const AdminCard: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    bg={adminColors.surface}
    border="1px solid"
    borderColor={adminColors.surfaceVariant}
    borderRadius="32px"
    boxShadow="0 12px 24px rgba(0, 0, 0, 0.15)"
    {...props}
  >
    {children}
  </Box>
)

interface PageHeadingProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const PageHeading: React.FC<PageHeadingProps> = ({ title, subtitle, action }) => (
  <Flex
    align={{ base: 'flex-start', md: 'flex-end' }}
    justify="space-between"
    gap="24px"
    direction={{ base: 'column', md: 'row' }}
  >
    <Box>
      <Text color={adminColors.text} fontSize="22px" lineHeight="28px" fontWeight="700">
        {title}
      </Text>
      {subtitle ? (
        <Text color={adminColors.muted} fontSize="12px" lineHeight="18px" mt="4px">
          {subtitle}
        </Text>
      ) : null}
    </Box>
    {action}
  </Flex>
)

interface PrimaryActionProps {
  children: React.ReactNode
  icon?: IconType
}

export const PrimaryAction: React.FC<PrimaryActionProps> = ({ children, icon = FiPlus }) => (
  <Button
    bg={adminColors.primary}
    color="white"
    borderRadius="9999px"
    h="40px"
    px="24px"
    fontSize="14px"
    fontWeight="600"
    leftIcon={<Icon as={icon} boxSize="16px" />}
    _hover={{ bg: '#C92424' }}
    _active={{ transform: 'scale(0.98)' }}
  >
    {children}
  </Button>
)

interface AdminIconButtonProps {
  icon: IconType
  label: string
}

export const AdminIconButton: React.FC<AdminIconButtonProps> = ({ icon, label }) => (
  <Button
    aria-label={label}
    title={label}
    minW="40px"
    w="40px"
    h="40px"
    p="0"
    bg="transparent"
    color={adminColors.dim}
    borderRadius="full"
    _hover={{ bg: adminColors.surfaceHigh, color: adminColors.primary }}
    _active={{ transform: 'scale(0.98)' }}
  >
    <Icon as={icon} boxSize="18px" />
  </Button>
)

import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export const TopbarActions: React.FC = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <HStack spacing="8px">
      <AdminIconButton icon={FiBell} label="Notifications" />
      <AdminIconButton icon={FiSettings} label="Settings" />
      <Menu>
        <MenuButton as={Box} cursor="pointer" borderRadius="full">
          <Avatar name="Admin Profile" src={adminAvatar} size="32px" />
        </MenuButton>
        <MenuList bg={adminColors.surfaceHigh} borderColor={adminColors.surfaceVariant} minW="150px">
          <MenuItem 
            bg="transparent" 
            _hover={{ bg: adminColors.surfaceVariant }}
            onClick={handleLogout}
            color={adminColors.error}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  )
}

interface SearchFieldProps {
  placeholder?: string
  maxW?: string
}

export const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = 'Search...',
  maxW = '320px',
}) => (
  <InputGroup maxW={maxW} display={{ base: 'none', md: 'block' }}>
    <InputLeftElement pointerEvents="none" h="36px">
      <Icon as={FiSearch} color={adminColors.dim} boxSize="15px" />
    </InputLeftElement>
    <Input
      h="36px"
      bg={adminColors.surfaceMid}
      borderColor={adminColors.surfaceVariant}
      borderRadius="full"
      color={adminColors.text}
      fontSize="12px"
      pl="40px"
      placeholder={placeholder}
      _placeholder={{ color: adminColors.dim }}
      _focus={{ borderColor: adminColors.primary, boxShadow: 'none' }}
    />
  </InputGroup>
)

interface AvatarProps {
  name: string
  src?: string
  size?: string
  radius?: string
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = '40px', radius = '9999px' }) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Circle
      size={size}
      border="1px solid"
      borderColor={adminColors.surfaceVariant}
      bg={adminColors.surfaceHigh}
      overflow="hidden"
      borderRadius={radius}
      flexShrink={0}
    >
      {src ? (
        <Box as="img" src={src} alt={name} w="100%" h="100%" objectFit="cover" />
      ) : (
        <Text color={adminColors.primarySoft} fontSize="12px" fontWeight="700">
          {initials}
        </Text>
      )}
    </Circle>
  )
}

interface FilterPillProps {
  children: React.ReactNode
  active?: boolean
}

export const FilterPill: React.FC<FilterPillProps> = ({ children, active }) => (
  <Button
    h="32px"
    px="16px"
    bg={active ? adminColors.surfaceHigh : 'transparent'}
    color={active ? adminColors.text : adminColors.dim}
    border="1px solid"
    borderColor={adminColors.surfaceVariant}
    borderRadius="full"
    fontSize="14px"
    fontWeight="600"
    _hover={{ bg: adminColors.surfaceHigh, color: adminColors.text, borderColor: adminColors.primarySoft }}
  >
    {children}
  </Button>
)

interface TinyTagProps {
  children: React.ReactNode
  tone?: 'primary' | 'neutral' | 'success' | 'warning' | 'error'
  radius?: string
}

export const TinyTag: React.FC<TinyTagProps> = ({ children, tone = 'neutral', radius = '9999px' }) => {
  const toneStyles = {
    primary: {
      bg: 'rgba(224, 48, 48, 0.18)',
      color: adminColors.primarySoft,
      borderColor: 'rgba(224, 48, 48, 0.35)',
    },
    neutral: {
      bg: adminColors.surfaceVariant,
      color: adminColors.text,
      borderColor: adminColors.surfaceVariant,
    },
    success: {
      bg: 'rgba(74, 222, 128, 0.12)',
      color: adminColors.success,
      borderColor: 'rgba(74, 222, 128, 0.2)',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.12)',
      color: '#FBBF24',
      borderColor: 'rgba(245, 158, 11, 0.25)',
    },
    error: {
      bg: 'rgba(255, 180, 171, 0.12)',
      color: adminColors.error,
      borderColor: 'rgba(255, 180, 171, 0.25)',
    },
  }[tone]

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      px="8px"
      py="3px"
      border="1px solid"
      borderRadius={radius}
      fontSize="10px"
      fontWeight="700"
      lineHeight="14px"
      textTransform="uppercase"
      letterSpacing="0.03em"
      {...toneStyles}
    >
      {children}
    </Box>
  )
}

interface StatusTextProps {
  status: string
  tone?: 'active' | 'pending' | 'inactive'
}

export const StatusText: React.FC<StatusTextProps> = ({ status, tone = 'active' }) => {
  const color =
    tone === 'active' ? adminColors.primary : tone === 'pending' ? adminColors.warning : adminColors.dim

  return (
    <HStack spacing="8px" color={tone === 'inactive' ? adminColors.dim : adminColors.text}>
      <Box w="8px" h="8px" borderRadius="full" bg={color} boxShadow={tone === 'active' ? `0 0 8px ${color}` : 'none'} />
      <Text as="span" color={tone === 'active' ? adminColors.primary : color} fontSize="12px" fontWeight="600">
        {status}
      </Text>
    </HStack>
  )
}

interface MetricCardProps {
  label: string
  value: string
  icon?: IconType
  helper?: React.ReactNode
  spark?: number[]
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, helper, spark }) => (
  <AdminCard p="24px">
    <Flex justify="space-between" align="flex-start">
      <Text color={adminColors.muted} fontSize="12px" lineHeight="18px">
        {label}
      </Text>
      {icon ? <Icon as={icon} color={adminColors.dim} boxSize="16px" /> : null}
    </Flex>
    <Flex align="flex-end" justify="space-between" gap="16px" mt="16px">
      <Text color={adminColors.text} fontSize="22px" lineHeight="28px" fontWeight="700">
        {value}
      </Text>
      {spark ? <MiniBars values={spark} /> : helper}
    </Flex>
  </AdminCard>
)

interface MiniBarsProps {
  values: number[]
  h?: string
}

export const MiniBars: React.FC<MiniBarsProps> = ({ values, h = '24px' }) => (
  <HStack spacing="4px" align="flex-end" h={h}>
    {values.map((value, index) => (
      <Box
        key={`${value}-${index}`}
        w="8px"
        h={`${value}%`}
        bg={index === values.length - 1 ? adminColors.primary : `rgba(224, 48, 48, ${0.25 + index * 0.18})`}
      />
    ))}
  </HStack>
)

interface ProgressLineProps {
  value: number
  color?: string
}

export const ProgressLine: React.FC<ProgressLineProps> = ({ value, color = adminColors.primary }) => (
  <Box h="4px" bg={adminColors.surfaceVariant} w="100%">
    <Box h="100%" w={`${value}%`} bg={color} />
  </Box>
)

export const MoreButton: React.FC = () => (
  <Button
    aria-label="More actions"
    title="More actions"
    minW="32px"
    w="32px"
    h="32px"
    p="0"
    bg="transparent"
    color={adminColors.dim}
    borderRadius="full"
    _hover={{ bg: adminColors.surfaceVariant, color: adminColors.text }}
  >
    <Icon as={FiMoreVertical} boxSize="18px" />
  </Button>
)

export const TableWrap: React.FC<BoxProps> = ({ children, ...props }) => (
  <AdminCard p="0" overflow="hidden" {...props}>
    <Box overflowX="auto">{children}</Box>
  </AdminCard>
)

export const chartGridSx = {
  backgroundImage:
    'linear-gradient(rgba(92,64,61,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(92,64,61,0.35) 1px, transparent 1px)',
  backgroundSize: '64px 60px',
}

export const LineAreaChart: React.FC = () => (
  <Box position="relative" h="300px" border="1px solid" borderColor="rgba(92,64,61,0.45)" borderRadius="12px" overflow="hidden" sx={chartGridSx}>
    <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id="adminLineGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={adminColors.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={adminColors.primary} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,250 Q100,220 200,240 T400,180 T600,150 T800,100 T1000,80 L1000,300 L0,300 Z"
        fill="url(#adminLineGradient)"
      />
      <path
        d="M0,250 Q100,220 200,240 T400,180 T600,150 T800,100 T1000,80"
        fill="none"
        stroke={adminColors.primary}
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
    <Box
      position="absolute"
      top="25%"
      left="50%"
      transform="translateX(-50%)"
      bg={adminColors.surfaceHigh}
      border="1px solid"
      borderColor={adminColors.primarySoft}
      px="12px"
      py="6px"
      borderRadius="8px"
      boxShadow="0 16px 32px rgba(0,0,0,0.35)"
    >
      <Text fontSize="10px" fontWeight="700" color={adminColors.muted} textTransform="uppercase">
        MAR 24
      </Text>
      <Text fontSize="14px" fontWeight="700" color={adminColors.primarySoft}>
        12,105 Users
      </Text>
    </Box>
  </Box>
)

interface BarChartProps {
  values: number[]
  labels: string[]
  height?: string
  activeIndex?: number
}

export const BarChart: React.FC<BarChartProps> = ({ values, labels, height = '180px', activeIndex }) => (
  <Box>
    <HStack align="flex-end" spacing="8px" h={height} px="4px">
      {values.map((value, index) => (
        <Box key={`${labels[index]}-${value}`} flex="1" h="100%" display="flex" alignItems="flex-end">
          <Box
            w="100%"
            h={`${value}%`}
            bg={activeIndex === index ? adminColors.primary : adminColors.surfaceVariant}
            borderTopRadius="3px"
            opacity={activeIndex === undefined || activeIndex === index ? 1 : 0.75}
            position="relative"
          >
            {activeIndex === index ? (
              <Box
                position="absolute"
                top="-30px"
                left="50%"
                transform="translateX(-50%)"
                bg={adminColors.text}
                color={adminColors.surface}
                px="6px"
                py="2px"
                borderRadius="4px"
                fontSize="10px"
                whiteSpace="nowrap"
              >
                Current
              </Box>
            ) : null}
          </Box>
        </Box>
      ))}
    </HStack>
    <Flex justify="space-between" mt="8px" px="4px">
      {labels.map((label) => (
        <Text key={label} color={adminColors.dim} fontSize="10px" fontWeight="700" textTransform="uppercase">
          {label}
        </Text>
      ))}
    </Flex>
  </Box>
)

interface AdminStatsGridProps {
  children: React.ReactNode
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ children }) => (
  <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing="24px">
    {children}
  </SimpleGrid>
)

export const TrendLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = adminColors.primarySoft,
}) => (
  <HStack spacing="4px" color={color} fontSize="14px" fontWeight="600">
    <Icon as={FiTrendingUp} boxSize="16px" />
    <Text>{children}</Text>
  </HStack>
)
