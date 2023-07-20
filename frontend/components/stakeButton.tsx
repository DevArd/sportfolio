import { ITalent } from '@/utils/talentsDatas'
import { Button, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Slider, SliderFilledTrack, SliderThumb, SliderTrack, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { parseEther } from 'viem'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'

export default function StakeButton(
    {
        talent,
        amount
    }: {
        talent: ITalent,
        amount: BigInt
    }
) {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { config } = usePrepareContractWrite({
        address: talent.onChainDatas.stakingContractAddress,
        abi: talent.onChainDatas.stakingContractAbi,
        functionName: 'stake',
        args: [parseEther(`100`), parseEther(`100`)],
    })

    const { write, isSuccess, isError, error } = useContractWrite(config)

    useEffect(() => {
        if (isError) {
            toast({
                title: 'KO',
                status: 'error',
                description: error!.message,
                isClosable: true,
                duration: 9000,
            })
        }
    }, [isError, error]);

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: 'Success',
                status: 'success',
                description: 'Staked successfuly.',
                isClosable: true,
                duration: 9000,
            })
        }
    }, [isSuccess]);

    // TODO ALLOWANCE

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
                        <Text>Amount</Text>
                        <Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={30}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Text>Duration</Text>
                        <Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={365}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </ModalBody>
                    <ModalFooter>
                        <Button ml={'5'} variant='solid' colorScheme='transparent' disabled={!write} onClick={() => write?.()}>
                            Stake
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
