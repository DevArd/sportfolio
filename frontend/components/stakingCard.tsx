import { USDCTokenAddress, UniswapV2Router02Abi, UniswapV2Router02Address } from '@/Constants'
import { ITalent } from '@/utils/talentsDatas'
import { Box, Image, Card, Stack, CardBody, Heading, CardFooter, Button, Text } from '@chakra-ui/react'
import React from 'react'
import { formatUnits, parseEther } from 'viem'
import { useAccount, useBalance, useContractReads, useContractWrite, usePrepareContractWrite } from 'wagmi'
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
                functionName: 'rewardPerToken',
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
        stakedBalance: number = 0,
        price: bigint = BigInt(0),
        earned: bigint = BigInt(0),
        totalPrice: number = 0,
        isOwner: boolean = false
    const decimals = balance?.data?.decimals || 1;

    const { config: configClaims } = usePrepareContractWrite({
        address: talent.onChainDatas.stakingContractAddress,
        abi: talent.onChainDatas.stakingContractAbi,
        functionName: 'claimReward',
    })

    const { write: writeClaims } = useContractWrite(configClaims)

    if (isSuccess) {
        balanceValue = BigInt(balance.data!.value.toString());
        rewardPerToken = BigInt(data![0].result!.toString());
        stakedBalance = Number(data![1].result!);
        earned = BigInt(data![3].result!.toString());
        price = BigInt((data![2].result! as any)[1].toString());
        totalPrice = Number(formatUnits(price, decimals)) * Number(formatUnits(balanceValue, decimals))
        isOwner = address === data![4].result!.toString()
    }

    const formatedBalance: number = Number(formatUnits(balanceValue, decimals));

    if (!isSuccess || (stakedBalance <= 0 && Number(balanceValue) <= 0)) {
        return (
            <></>
        )
    }
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
                            Staked : {stakedBalance.toFixed(2)}
                        </Text>
                        <Text>
                            Available to stake : {formatedBalance.toFixed(2)}
                        </Text>
                        <Text>
                            Available to claim : {Number(formatUnits(earned, decimals)).toFixed(2)}
                        </Text>
                        <Text>
                            Current reward per token : {Number(formatUnits(rewardPerToken, decimals)).toFixed(2)}
                        </Text>
                        <Text>
                            Price per token : ${Number(formatUnits(price, decimals)).toFixed(2)}
                        </Text>
                        <Text>
                            Value : ${totalPrice.toFixed(2)}
                        </Text>
                    </CardBody>
                    <CardFooter>
                        {earned > 0 ? <>
                            <Button mr={'2'} variant='solid' colorScheme='transparent' disabled={!writeClaims} onClick={() => writeClaims?.()}>
                                Claims
                            </Button>
                        </> : <></>}
                        {balanceValue > 0 ? <>
                            <StakeButton talent={talent} amount={formatedBalance} />
                        </> : <></>}
                        {stakedBalance > 0 ? <>
                            <Button variant='outline'>
                                Unstake
                            </Button>
                        </> : <></>}
                    </CardFooter>
                </Stack>
            </Card>
            {isOwner ? <>
                <AddReward talent={talent} />
            </> : <></>}
        </Box>
    )
}
