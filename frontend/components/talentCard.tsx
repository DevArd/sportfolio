import { ITalent } from '@/utils/talentsDatas'
import { Card, Image, CardBody, Stack, Text, Heading, Stat, StatNumber, StatHelpText, StatArrow, Divider, CardFooter, ButtonGroup, Button } from '@chakra-ui/react'
import React from 'react'

export default function TalentCard(talent: ITalent) {
    return (
        <Card maxW='sm'>
            <CardBody>
                <Image
                    src={talent.img}
                    alt={talent.name}
                    objectFit='cover'
                    width={'100%'}
                    maxHeight={'300px'}
                    borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>{talent.name}</Heading>
                    <Text>{talent.description}</Text>
                    <Stat>
                        <StatNumber>$345.67</StatNumber>
                        <StatHelpText>
                            <StatArrow type='increase' />
                            23.36%
                        </StatHelpText>
                    </Stat>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <ButtonGroup spacing='2'>
                    <Button variant='solid' colorScheme='blue'>
                        Buy now
                    </Button>
                    <Button variant='ghost' colorScheme='blue'>
                        Add to cart
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}
