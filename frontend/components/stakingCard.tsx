import { ITalent } from '@/utils/talentsDatas'
import { Box, Image, Card, Stack, CardBody, Heading, CardFooter, Button, Text } from '@chakra-ui/react'
import React from 'react'
import { formatUnits } from 'viem'
import { useAccount, useBalance, useContractReads } from 'wagmi'

export default function StakingCard(
    {
        talent
    }: {
        talent: ITalent
    }

) {
    const { address } = useAccount()

    const balance = useBalance({
        address: address,
        token: talent.onChainDatas.tokenAddress,
    })

    const value = balance.data?.value;

    if (!value || value <= 0) {
        return (
            <></>
        )
    }

    const stakingContract = {
        address: talent.onChainDatas.stakingContractAddress,
        abi: talent.onChainDatas.stakingContractAbi,
    }

    console.log('address', address)

    const { data, isError, isLoading } = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'rewardsPerTokenStaked',
            },
            {
                ...stakingContract,
                functionName: 'balanceOf',
                args: [`${address}`],
            },
        ],
    })

    const rewardPerToken = data?.[0].result?.toString();
    const stakedBalance = data?.[1]?.result?.toString();

    console.log('data', data)

    return (
        <Box>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src={talent.img}
                    alt={`${talent.name} - ${talent.onChainDatas.tokenAddress}`}
                />

                <Stack>
                    <CardBody>
                        <Heading size='md' mb={'2'}>{talent.name}</Heading>
                        <Text>
                            Staked : {stakedBalance}
                        </Text>
                        <Text>
                            Available to stake : {formatUnits(value, balance!.data!.decimals)}
                        </Text>
                        <Text>
                            Available to claim : {formatUnits(value, balance!.data!.decimals)}
                        </Text>
                        <Text>
                            Current reward per token : {rewardPerToken}
                        </Text>
                    </CardBody>
                    <CardFooter>
                        <Button mr={'2'} variant='solid' colorScheme='transparent'>
                            Claims
                        </Button>
                        <Button mr={'2'} variant='solid' colorScheme='transparent'>
                            Stake
                        </Button>
                        <Button variant='outline'>
                            Sell
                        </Button>
                    </CardFooter>
                </Stack>
            </Card>
        </Box>
    )
}
