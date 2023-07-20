import { USDCTokenAddress, UniswapV2Router02Abi, UniswapV2Router02Address } from '@/Constants'
import { ITalent } from '@/utils/talentsDatas'
import { Box, Image, Card, Stack, CardBody, Heading, CardFooter, Button, Text, Center } from '@chakra-ui/react'
import React from 'react'
import { formatUnits, parseEther } from 'viem'
import { useAccount, useBalance, useContractReads } from 'wagmi'
import AddReward from './addReward'
import StakeButton from './stakeButton'

export default function StakingCard(
    {
        talent
    }: {
        talent: ITalent
    }

) {
    const stakingContract = {
        address: talent.onChainDatas.stakingContractAddress,
        abi: talent.onChainDatas.stakingContractAbi,
    }
    const { address } = useAccount()

    const balance = useBalance({
        address: address,
        token: talent.onChainDatas.tokenAddress,
    })

    const { data, isSuccess } = useContractReads({
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
            {
                address: UniswapV2Router02Address,
                abi: UniswapV2Router02Abi,
                functionName: 'getAmountsOut',
                args: [parseEther('1'), [talent.onChainDatas.tokenAddress, USDCTokenAddress]],
            },
            {
                ...stakingContract,
                functionName: 'earned',
                args: [`${address}`],
            },
            {
                ...stakingContract,
                functionName: 'owner',
            },
        ],
    })

    let balanceValue: bigint = BigInt(0),
        rewardPerToken: bigint = BigInt(0),
        stakedBalance: bigint = BigInt(0),
        price: bigint = BigInt(0),
        earned: bigint = BigInt(0),
        totalPrice: number = 0,
        isOwner: boolean = false
    const decimals = balance!.data!.decimals;

    if (isSuccess) {
        balanceValue = BigInt(balance.data!.value.toString());
        rewardPerToken = BigInt(data![0].result!.toString());
        stakedBalance = BigInt(data![1].result!.toString());
        earned = BigInt(data![3].result!.toString());
        price = BigInt((data![2].result! as any)[1].toString());
        totalPrice = Number(formatUnits(price, decimals)) * Number(formatUnits(balanceValue, decimals))
        isOwner = address === data![4].result!.toString()
    }

    if (!isSuccess || (Number(stakedBalance) <= 0 && Number(balanceValue) <= 0)) {
        return (
            <></>
        )
    }
    console.log('refresh')
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
                            Staked : {formatUnits(stakedBalance, decimals)}
                        </Text>
                        <Text>
                            Available to stake : {formatUnits(balanceValue, decimals)}
                        </Text>
                        <Text>
                            Available to claim : {formatUnits(earned, decimals)}
                        </Text>
                        <Text>
                            Current reward per token : {formatUnits(rewardPerToken, decimals)}
                        </Text>
                        <Text>
                            Price per token : ${Number(formatUnits(price, decimals)).toFixed(2)}
                        </Text>
                        <Text>
                            Value : ${totalPrice.toFixed(2)}
                        </Text>
                    </CardBody>
                    <CardFooter>
                        <Button mr={'2'} variant='solid' colorScheme='transparent'>
                            Claims
                        </Button>
                        <StakeButton talent={talent} amount={balanceValue} />
                        <Button variant='outline'>
                            Sell
                        </Button>
                    </CardFooter>
                </Stack>
            </Card>
            {isOwner ? <>
                <AddReward talent={talent} />
            </> : <></>}
        </Box>
    )
}
