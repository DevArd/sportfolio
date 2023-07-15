import { ITalent } from '@/utils/talentsDatas'
import { Center, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react'
import React from 'react'

export default function BuyModal(
    {
        talent,
        isOpen,
        onClose,
    }: {
        talent: ITalent
        isOpen: boolean,
        onClose: () => void
    }
) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Buy token - {talent.name}</ModalHeader>
                <ModalCloseButton />
                {/* <ModalBody>
                    <Lorem count={2} />
                </ModalBody> */}

                <ModalFooter>
                    <Button colorScheme='brand.200' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='ghost'>Secondary Action</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
