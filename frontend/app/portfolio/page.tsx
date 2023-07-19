"use client"
import StakingCard from '@/components/stakingCard'
import { deadAddress, talents } from '@/utils/talentsDatas'
import { Center } from '@chakra-ui/react'
import React from 'react'

export default function Page() {

    return (
        <>
            <Center>
                {talents.filter(x => x.tokenAddress && x.tokenAddress != deadAddress).sort((a, b) => a.name.localeCompare(b.name)).map((sport, index) => (
                    <StakingCard key={index} talent={sport} />
                ))}
            </Center>
        </>
    )
}
