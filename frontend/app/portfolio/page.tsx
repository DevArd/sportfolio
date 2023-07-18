"use client"
import { MessiTokenAddress, MbappeTokenAddress } from '@/Constants'
import React from 'react'
import { useBalance, useAccount } from 'wagmi'

export default function Page() {
    const { address } = useAccount()
    const balanceMessi = useBalance({
        address: address,
        token: MessiTokenAddress,
    })
    const balanceMBappe = useBalance({
        address: address,
        token: MbappeTokenAddress,
    })

    console.log('balanceMessi', balanceMessi)
    console.log('balanceMBappe', balanceMBappe)

    return (
        <div>portfolio</div>
    )
}
