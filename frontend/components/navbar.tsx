import { Flex, Spacer, Image, Button, Box, Stack, Center, Link } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import NextLink from 'next/link'
import { navMaxHeight } from '@/utils/sportfolioTheme'

export default function Navbar() {
    return (
        <Flex w='100%' position="fixed" bg={'gray'}>
            <Box w='200px' maxHeight={navMaxHeight} ml='4'>
                <Image src='logo.png' alt='Sportfolio' maxHeight={navMaxHeight} />
            </Box>
            <Spacer />
            <Stack direction={'row'}>
                <Center>
                    <Link as={NextLink} href='/marketplace'><Button variant='ghost'>Maketplace</Button></Link>
                    <Link as={NextLink} href='/portfolio'><Button variant='ghost'>Portfolio</Button></Link>
                    <Link as={NextLink} href='/stake'><Button variant='ghost'>Stake</Button></Link>
                    <Link as={NextLink} href='/introduction'><Button variant='ghost'>Introduction</Button></Link>
                </Center>
            </Stack>
            <Spacer />
            <Center mr='4'>
                <ConnectButton />
            </Center>
        </Flex>
    )
}
