import { ITalent } from '@/utils/talentsDatas'
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button, useToast, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function AddReward(
    {
        talent
    }: {
        talent: ITalent
    }
) {
    const [value, setValue] = React.useState(500)
    const toast = useToast()
    const handleChange = (value: any) => setValue(value)

    const { config } = usePrepareContractWrite({
        address: talent.onChainDatas.stakingContractAddress,
        abi: talent.onChainDatas.stakingContractAbi,
        functionName: 'addRewardAmount',
        args: [value],
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
                description: 'Reward successfuly added.',
                isClosable: true,
                duration: 9000,
            })
        }
    }, [isSuccess]);

    return (
        <>
            <Flex direction={'row'} mt={'2'} >
                <NumberInput step={100} defaultValue={1000} min={100} max={100_000} width={'75%'} value={value} onChange={handleChange}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Button ml={'5'} variant='solid' colorScheme='transparent' disabled={!write} onClick={() => write?.()}>
                    Add rewards
                </Button>
            </Flex >
        </>
    )
}
