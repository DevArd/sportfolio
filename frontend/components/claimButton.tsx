import { ITalent } from '@/utils/talentsDatas'
import { Button } from '@chakra-ui/react'
import React from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function ClaimButton(
    {
        talent
    }: {
        talent: ITalent
    }
) {
    const { config: configClaims } = usePrepareContractWrite({
        address: talent.onChainDatas.stakingContractAddress,
        abi: talent.onChainDatas.stakingContractAbi,
        functionName: 'claimReward',
    })

    const { write: writeClaims } = useContractWrite(configClaims)

    return (
        <Button mr={'2'} variant='solid' colorScheme='transparent' disabled={!writeClaims} onClick={() => writeClaims?.()}>
            Claims
        </Button>
    )
}
