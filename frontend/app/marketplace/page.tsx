"use client"
import TalentCard from '@/components/talentCard'
import { sports } from '@/utils/sportsDatas'
import { talents } from '@/utils/talentsDatas'
import { Tab, TabList, TabPanel, TabPanels, Tabs, Box, Wrap, Center, WrapItem } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export default function Page() {
    return (
        <Tabs variant='soft-rounded' colorScheme='brand' m={'2'}>
            <Center>
                <TabList>
                    {sports.sort((a, b) => a.label.localeCompare(b.label)).map((sport, index) => (
                        <Tab key={index}>
                            <Box mr={'2'}>
                                <FontAwesomeIcon icon={sport.selectedIcon as IconProp} />
                            </Box>
                            {sport.label}
                        </Tab>
                    ))}
                </TabList>
            </Center>

            <TabPanels>
                {sports.sort((a, b) => a.label.localeCompare(b.label)).map((sport, index) => (
                    <TabPanel key={index} >
                        <Wrap spacing='5' justify='center'>
                            {talents.filter(x => x.sport === sport.label || sport.label === 'All').sort((a, b) => a.name.localeCompare(b.name)).map((talent, index) => (
                                <TalentCard key={index} talent={talent} />
                            ))}
                        </Wrap>
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    )
}
