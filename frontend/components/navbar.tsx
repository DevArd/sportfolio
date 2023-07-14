import { Flex, Heading, Spacer, Image, Button, Box, Stack, Center, Link } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import NextLink from 'next/link'

export default function Navbar() {
    const maxHeight = '75px'

    return (
        <Flex w='100%'>
            <Box w='200px' maxHeight={maxHeight} ml='4'>
                <Image src='logo.png' alt='Sportfolio' maxHeight={maxHeight} />
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
