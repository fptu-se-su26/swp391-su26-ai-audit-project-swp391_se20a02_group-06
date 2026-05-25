import React from 'react'
import { Button, type ButtonProps } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export interface AppButtonProps extends ButtonProps {
  label: React.ReactNode
  href?: string
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  href,
  onClick,
  variant = 'solid',
  ...props
}) => {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e)
    }
    if (href) {
      navigate(href)
    }
  }

  // Common styling enhancements for specific variants
  const defaultSolidProps: ButtonProps =
    variant === 'solid'
      ? {
          boxShadow: '0 4px 20px rgba(224, 48, 48, 0.2)',
          _hover: { brightness: '110%' },
        }
      : {}

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      {...defaultSolidProps}
      {...props}
    >
      {label}
    </Button>
  )
}

export default AppButton
