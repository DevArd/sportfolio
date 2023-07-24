import { ITalent } from '@/utils/talentsDatas'
import { Button } from '@chakra-ui/react'
import React from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function UnstakeButton(
    {
        talent,
        amount
    }: {
        talent: ITalent,
        amount: bigint
    }
) {
    const { config: configUnstake } = usePrepareContractWrite({
        address: talent.onChainDatas.stakingContractAddress,
        abi: talent.onChainDatas.stakingContractAbi,
        functionName: 'unstake',
        args: [amount]
    })

    const { write: writeUnstake } = useContractWrite(configUnstake)

    return (
        <Button mr={'2'} variant='outline' colorScheme='transparent' disabled={!writeUnstake} onClick={() => writeUnstake?.()}>
            Unstake
        </Button>
    )
}
