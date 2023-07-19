import { ITalent } from '@/utils/talentsDatas'
import React from 'react'
import { formatUnits } from 'viem'
import { useAccount, useBalance } from 'wagmi'

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
        token: talent.tokenAddress,
    })

    const value = balance.data?.value;

    if (!value || value <= 0) {
        return (
            <></>
        )
    }

    return (
        <div>{talent.name} - {talent.tokenAddress} - {formatUnits(value, balance!.data!.decimals)}</div>
    )
}
