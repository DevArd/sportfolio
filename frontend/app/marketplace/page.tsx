"use client"
import TalentCard from '@/components/talentCard'
import { sports } from '@/utils/sportsDatas'
import { talents } from '@/utils/talentsDatas'
import { Tab, TabList, TabPanel, TabPanels, Tabs, Box, Wrap } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export default function Page() {
    return (
        <Tabs variant='soft-rounded' colorScheme='green' m={'2'}>
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
            <TabPanels >
                {sports.sort((a, b) => a.label.localeCompare(b.label)).map((sport, index) => (
                    <TabPanel key={index}>
                        <Wrap spacing='5'>
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
