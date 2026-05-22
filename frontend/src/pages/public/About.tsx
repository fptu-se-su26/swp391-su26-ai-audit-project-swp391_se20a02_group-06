import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Grid,
  HStack,
  Image,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import PublicNavbar from '../../components/shared/Navbar/PublicNavbar'
import PublicFooter from '../../components/shared/Footer/PublicFooter'
import AppButton from '../../components/shared/Button/AppButton'

const About: React.FC = () => {
  const navigate = useNavigate()
  const handleLoginClick = () => navigate('/login')


  const values = [
    {
      icon: 'insights',
      title: 'Precision over guesswork',
      desc: 'Every recommendation is backed by performance data, not assumptions.',
    },
    {
      icon: 'psychology',
      title: 'Human + AI, not either/or',
      desc: 'Technology handles the programming. Coaches handle the human connection.',
    },
    {
      icon: 'groups',
      title: 'Fitness for everyone',
      desc: 'From first-time gym-goers to competitive athletes — AISTHEA adapts.',
    },
  ]

  const stats = [
    { value: '50,000+', label: 'Members' },
    { value: '200+', label: 'Certified PTs' },
    { value: '1.2M', label: 'Workouts Logged' },
    { value: '4.9★', label: 'User Rating' },
  ]

  const team = [
    {
      name: 'Alex Rivers',
      role: 'CEO & Co-founder',
      desc: 'Ex-Olympian with a vision for data-driven human performance.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg-q29zNBzMZVYFwesLW5ZmJswUrEqLbYOeY_zkh3EEMIN3EQ-1tpXe3WT-9bfhgyz1vCrisksQ-0bn5ljlyOnZ5evF59LxYoCmvD0XWP4BP-_UxINwaeqcMAq3j93HQiur59jFIKkQ5u6aK2FFvvUdiyd0oQ40oyZix-kPLxnAVcGrqOOg7exx-lqn7sNOAL_AVsUbpU2frYZsx3RY8wlxsViy66SbrqSe2MoFld8b5lxOQ-Yoor7vrVX5p6_O-MqZmHrzkjuhbnQ',
    },
    {
      name: 'Dr. Sarah Chen',
      role: 'CTO & AI Lead',
      desc: 'PhD in Neural Networks applied to biomechanical optimization.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB99FHddAD0yfUXDKVmnum3q8vMuezz_OcgmIFRs8s7kY3wEPutMqNO81HjUBwsvxB4H-Xx9_qhTQ7I-vWVLMDo7SNJ40T41avdxYWcCcwWC9k5JSJIiDp8guKezMCdyejdmPP8cvZ51NjPSBg8wBfSshVKbkrbFr9MS426TcqS_5MSAJtt1Z1OuY4eG0Owh3cCAEeEAj7VoDisrlTYqd2l5Y6YovuzYaQYFYUnPL1fT3LkJwQaP5z3jHzFmJKvzzhRHOnwfvIUUf5Z',
    },
    {
      name: 'Marcus Thorne',
      role: 'Head of Fitness',
      desc: '15 years coaching elite athletes across NFL and CrossFit.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCepSJdafFHdZeMQAIBwn3DQoAfA8_JQzVDE9iBQ7Mwd5wBMhLQ6eEH8saDQMVFK-HFdmAZzuOJEMv3u32FPyxI130qC0NdNAQZROwDzTurE-4Wa3f8Xfj1P_ZZPlGvWH0SKSSFythMqL99kekJpav6qzV8D8VyE0jrDhZ2pSrGIYsjcPlE7JbZ8x7YDVrfd6hoqWVdjDVAbEggRGS_ej2FGf_5J384LlDQMbSXufQZEyoO5e-fBrMJXkpb6nHDsEeaRMnYHlN2nvLw',
    },
    {
      name: 'Elena Vance',
      role: 'Head of Design',
      desc: 'Creating intuitive interfaces for complex physiological data.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQE2-fwmVDqap_0Ttz7dashfEOd7McG1Q7rFUoNd1KKXOSjzjg1p6uKhAf0cGx5WTX2m1hyqNLgOobQzwO7zmD78Zhow2LCUs0UbPxnvsL98MREky4B1sL8CoTq3PKvG6wJEIUndg8XZx0q-CfzwXSGI62F3yitAM1MbZX49DVAz5mKtClEK-dHSU8uWGXJfNrpiKEnpS_JHiDVw4cFDKEXuRDFooDQFvLJykzMNZBlmXA1V9oetfl-ug1seEjmxRm9LBcFGXdAxPz',
    },
  ]

  const timeline = [
    { year: '2022', desc: 'Idea started in a garage gym with a custom data logger.' },
    { year: '2023', desc: 'Beta launched with 1,000 foundational users.' },
    { year: '2024', desc: 'Hit 50k members and deployed AI Engine v2.' },
    { year: '2025', desc: 'Global PT marketplace opens for certified partners.' },
  ]

  return (
    <Box minH="100vh" bg="#12131a" color="#e2e1eb" overflowX="hidden" display="flex" flexDirection="column" pt="72px">
      <PublicNavbar />

      {/* ===================== HERO SECTION ===================== */}
      <Box as="section" py="20" px="6" textAlign="center" maxW="900px" mx="auto" w="full">
        <Box
          display="inline-block"
          bg="#1e1f26"
          px="6"
          py="1.5"
          borderRadius="full"
          mb="6"
        >
          <Text fontSize="10px" fontWeight="700" color="#e03030" letterSpacing="widest" textTransform="uppercase">
            Our Story
          </Text>
        </Box>
        <Heading as="h1" fontSize={{ base: '32px', md: '44px' }} color="white" fontWeight="700" mb="6" lineHeight="1.2">
          We Built the Fitness Platform We Always Wanted.
        </Heading>
        <Text fontSize={{ base: 'sm', md: 'md' }} color="#e5bdb9" maxW="2xl" mx="auto" lineHeight="1.6">
          AISTHEA started with a simple belief: everyone deserves a personalized training system, not a generic PDF program.
        </Text>
      </Box>

      {/* ===================== MISSION & VALUES ===================== */}
      <Box as="section" py="8" px="6" maxW="1200px" mx="auto" w="full">
        <Heading as="h2" fontSize="lg" fontWeight="600" color="white" mb="8" textAlign="center">
          What We Stand For
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6">
          {values.map((val, idx) => (
            <Stack
              key={idx}
              bg="#141414"
              border="1px solid"
              borderColor="#262626"
              borderRadius="32px"
              p="6"
              spacing="4"
              boxShadow="0 4px 12px rgba(0,0,0,0.15)"
              transition="transform 0.2s"
              _active={{ transform: 'scale(0.98)' }}
              _hover={{ borderColor: '#e03030' }}
            >
              <Box
                as="span"
                className="material-symbols-outlined"
                style={{ color: '#e03030', fontSize: '32px' }}
              >
                {val.icon}
              </Box>
              <Heading as="h3" fontSize="sm" fontWeight="600" color="white">
                {val.title}
              </Heading>
              <Text fontSize="12px" color="#c8c6c5" lineHeight="1.5">
                {val.desc}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Box>

      {/* ===================== STATISTICS BANNER ===================== */}
      <Box as="section" py="10" bg="#0c0e14" borderY="1px solid" borderColor="#33343c" mt="12" px="6">
        <Flex
          maxW="1200px"
          mx="auto"
          w="full"
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap="8"
          textAlign="center"
        >
          {stats.map((stat, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <Box h="10" w="px" bg="#33343c" display={{ base: 'none', md: 'block' }} />
              )}
              <Stack spacing="1" flex="1" minW="200px">
                <Text fontSize="28px" fontWeight="bold" color="#e03030">
                  {stat.value}
                </Text>
                <Text fontSize="10px" fontWeight="600" color="#c8c6c5" textTransform="uppercase" letterSpacing="wider">
                  {stat.label}
                </Text>
              </Stack>
            </React.Fragment>
          ))}
        </Flex>
      </Box>

      {/* ===================== TEAM SECTION ===================== */}
      <Box as="section" py="16" px="6" maxW="1200px" mx="auto" w="full">
        <Heading as="h2" fontSize="lg" fontWeight="600" color="white" mb="12" textAlign="center">
          The Team Behind AISTHEA
        </Heading>
        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="6">
          {team.map((member, idx) => (
            <Flex
              key={idx}
              direction="column"
              align="center"
              bg="#141414"
              border="1px solid"
              borderColor="#262626"
              borderRadius="32px"
              p="6"
              textAlign="center"
              boxShadow="0 4px 12px rgba(0,0,0,0.15)"
              transition="transform 0.2s"
              _active={{ transform: 'scale(0.98)' }}
              _hover={{ borderColor: '#33343c' }}
            >
              {/* Profile Avatar */}
              <Box
                w="20"
                h="20"
                borderRadius="full"
                mb="4"
                overflow="hidden"
                border="2px solid"
                borderColor="#33343c"
                bgGradient="linear(to-br, #e03030, #33343c)"
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>

              <Text fontSize="14px" fontWeight="600" color="white" mb="0.5">
                {member.name}
              </Text>
              <Text fontSize="12px" fontWeight="600" color="#e03030" mb="3">
                {member.role}
              </Text>
              <Text fontSize="11px" color="#c8c6c5" lineHeight="1.4">
                {member.desc}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Box>

      {/* ===================== TIMELINE SECTION ===================== */}
      <Box as="section" py="12" px="6" maxW="700px" mx="auto" w="full">
        <Heading as="h2" fontSize="lg" fontWeight="600" color="white" mb="12" textAlign="center">
          How We Got Here
        </Heading>

        {/* Timeline container */}
        <Box position="relative" pl="8" display="flex" flexDirection="column" gap="8">
          {/* Vertical connecting line */}
          <Box
            position="absolute"
            left="19px"
            top="0"
            bottom="0"
            w="2px"
            bg="#33343c"
            zIndex="0"
          />

          {timeline.map((item, idx) => (
            <Box key={idx} position="relative">
              {/* Bullet circle dot */}
              <Box
                position="absolute"
                left="-19px"
                top="1.5"
                w="12px"
                h="12px"
                borderRadius="full"
                bg="#e03030"
                zIndex="10"
                border="2px solid"
                borderColor="#12131a"
              />

              <Box
                bg="#e03030"
                color="white"
                display="inline-block"
                px="4"
                py="0.5"
                borderRadius="full"
                mb="2"
              >
                <Text fontSize="10px" fontWeight="700">
                  {item.year}
                </Text>
              </Box>
              <Text fontSize="14px" color="white" lineHeight="1.5">
                {item.desc}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ===================== TRUSTED PARTNERS ===================== */}
      <Box as="section" py="10" px="6" textAlign="center" borderTop="1px solid" borderColor="#33343c" mt="12">
        <Text fontSize="10px" fontWeight="600" color="#c8c6c5" textTransform="uppercase" mb="6" letterSpacing="widest">
          Trusted & Certified
        </Text>
        <Flex justify="center" align="center" gap="10" flexWrap="wrap" opacity="0.5" _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
          <Text fontSize="sm" fontWeight="700" color="white">
            NSCA Certified
          </Text>
          <Text fontSize="sm" fontWeight="700" color="white">
            ISO 27001
          </Text>
          <Text fontSize="sm" fontWeight="700" color="white">
            GDPR Compliant
          </Text>
        </Flex>
      </Box>

      {/* ===================== CTA BANNER SECTION ===================== */}
      <Box as="section" py="16" px="6" maxW="900px" mx="auto" w="full">
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          gap="6"
          bg="#141414"
          border="1px solid"
          borderColor="#262626"
          borderRadius="32px"
          p="10"
          bgGradient="linear(to-b, #1e1f26, #12131a)"
        >
          <Heading as="h2" fontSize={{ base: '22px', md: '28px' }} color="white" fontWeight="700" letterSpacing="-0.02em">
            Join 50,000 athletes training smarter.
          </Heading>
          <HStack spacing="4" flexWrap="wrap" justify="center">
            <AppButton
              variant="solid"
              label="Start Free Trial"
              px="8"
              py="6"
              fontSize="14px"
              onClick={handleLoginClick}
            />
            <AppButton
              variant="outline"
              label="Talk to a PT"
              borderColor="#33343c"
              color="white"
              px="8"
              py="6"
              fontSize="14px"
              _hover={{ bg: '#33343c' }}
              onClick={handleLoginClick}
            />
          </HStack>
        </Flex>
      </Box>

      <PublicFooter />
    </Box>
  )
}

export default About
