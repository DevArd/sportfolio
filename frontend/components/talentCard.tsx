import { ITalent } from '@/utils/talentsDatas'
import { Card, Image, CardBody, Stack, Text, Heading, Stat, StatNumber, StatHelpText, StatArrow, Divider, CardFooter, Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sports } from '@/utils/sportsDatas'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import BuyModal from './buyModal'
import { colors } from '@/utils/sportfolioTheme'

export default function TalentCard(
    {
        talent,
    }: {
        talent: ITalent
    }
) {
    const icon = sports.find(x => x.label === talent.sport)?.selectedIcon;
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Card maxW='sm' bg={'rgba(176, 25, 38, 0.05)'}>
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
                        <Heading size='md'>{talent.name} <FontAwesomeIcon icon={icon as IconProp} size="xs" /></Heading>
                        <Text>{talent.description}</Text>
                        <Stat>
                            <StatNumber>${talent.price.toFixed(2)}</StatNumber>
                            <StatHelpText>
                                <StatArrow type='increase' />
                                23.36%
                            </StatHelpText>
                        </Stat>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Stat>
                        <StatNumber>{talent.apy.toFixed(2)}% APY</StatNumber>
                    </Stat>
                    <Button variant='solid' onClick={onOpen}>
                        Buy now
                    </Button>
                </CardFooter>
            </Card>
            <BuyModal talent={talent} isOpen={isOpen} onClose={onClose} />
        </>

    )
}
