import Navbar from '@/components/navbar'
import { navMaxHeight } from '@/utils/sportfolioTheme'
import { Flex, Spacer, Heading, Box, Center } from '@chakra-ui/react'
import React from 'react'
import { useAccount } from 'wagmi';

export default function App({
    children,
}: {
    children: React.ReactNode
}) {
    const { address, isConnected } = useAccount()

    return (
        <>
            <Box as="header" position="fixed" zIndex={2}>
                <Navbar />
            </Box>
            <Flex as="main" w={'100%'} zIndex={1} bgGradient='linear(#edf2f7 10%, white 50%)' minHeight={'100vh'}>
                {isConnected ? <>
                    <Spacer minW={'5%'} />
                    <Box mt={navMaxHeight} >
                        {children}
                    </Box>
                    <Spacer minW={'5%'} />
                </>
                    :
                    <>
                        <Box w={'100%'}>
                            <Center minHeight={'100vh'}>
                                <Heading >
                                    Please connect your wallet
                                </Heading>
                            </Center>
                        </Box>
                    </>
                }

            </Flex>
        </>
    )
}