"use client"
import { deadAddress } from '@/Constants'
import StakingCard from '@/components/stakingCard'
import { talents } from '@/utils/talentsDatas'
import { Center, Wrap } from '@chakra-ui/react'
import React from 'react'

export default function Page() {

    return (
        <>
            <Center>
                <Wrap spacing='5' justify='center'>
                    {talents.filter(x => x.onChainDatas.tokenAddress != deadAddress).sort((a, b) => a.name.localeCompare(b.name)).map((sport, index) => (
                        <StakingCard key={index} talent={sport} />
                    ))}
                </Wrap>
            </Center>
        </>
    )
}
