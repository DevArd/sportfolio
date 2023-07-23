import { ITalent } from '@/utils/talentsDatas'
import { Button, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Slider, SliderFilledTrack, SliderThumb, SliderTrack, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { formatEther, parseEther } from 'viem'
import { usePrepareContractWrite, useContractWrite, useContractRead, useAccount } from 'wagmi'

export default function StakeButton(
    {
        talent,
        amount
    }: {
        talent: ITalent,
        amount: number
    }
) {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { address } = useAccount()
    const [sliderDurationValue, setSliderDurationValue] = useState(365)
    const [sliderAmountValue, setSliderAmountValue] = useState(1)

    const { config: configStake } = usePrepareContractWrite({
        address: talent.onChainDatas.stakingContractAddress,
        abi: talent.onChainDatas.stakingContractAbi,
        functionName: 'stake',
        args: [parseEther(`${sliderAmountValue}`), parseEther(`${sliderDurationValue}`)],
    })

    const { write: writeStake, isSuccess: isSuccessStake, isError: isErrorStake, error } = useContractWrite(configStake)

    const { config: configApprove } = usePrepareContractWrite({
        address: talent.onChainDatas.tokenAddress,
        abi: talent.onChainDatas.tokenAbi,
        functionName: 'approve',
        args: [talent.onChainDatas.stakingContractAddress, parseEther(`${sliderAmountValue}`)],
    })

    const { write: writeApprove } = useContractWrite(configApprove)

    useEffect(() => {
        if (isErrorStake) {
            toast({
                title: 'KO',
                status: 'error',
                description: error!.message,
                isClosable: true,
                duration: 9000,
            })
        }
        if (isSuccessStake) {
            toast({
                title: 'Success',
                status: 'success',
                description: 'Staked successfuly.',
                isClosable: true,
                duration: 9000,
            })
        }
    }, [isSuccessStake, isErrorStake, error]);

    const { data } = useContractRead({
        address: talent.onChainDatas.tokenAddress,
        abi: talent.onChainDatas.tokenAbi,
        functionName: 'allowance',
        args: [address, talent.onChainDatas.stakingContractAddress]
    })

    const approvedAmount: number = Number(formatEther(data as bigint)) || 0;

    return (
        <>
            <Button mr={'2'} variant='solid' colorScheme='transparent' onClick={onOpen} >
                Stake
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Stake - {talent.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Amount : {sliderAmountValue}</Text>
                        <Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={1} min={1}
                            max={Number(amount)} onChange={(val) => setSliderAmountValue(val)}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Text>Duration : {sliderDurationValue}j</Text>
                        <Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={365} min={1}
                            max={365 * 4} onChange={(val) => setSliderDurationValue(val)}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </ModalBody>
                    <ModalFooter>
                        {(approvedAmount > sliderAmountValue) ? <>
                            <Button ml={'5'} variant='solid' colorScheme='transparent' disabled={!writeStake} onClick={() => writeStake?.()}>
                                Stake
                            </Button></> : <>
                            <Button ml={'5'} variant='solid' colorScheme='transparent' disabled={!writeApprove} onClick={() => writeApprove?.()}>
                                Approve
                            </Button>
                        </>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
