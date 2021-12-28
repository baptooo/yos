import React from 'react';
import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Kbd,
  Text,
  useDisclosure,
  VStack
  } from '@chakra-ui/react';

interface Props {
};

const ShortCut: React.FC<{ code: string }> = ({ code, children }) => (
  <HStack spacing="2">
    <Kbd>{code}</Kbd> <Text fontSize="sm">{children}</Text>
  </HStack>
)

export const Help: React.FC<Props> = (props) => {
  const { isOpen, onToggle, onClose } = useDisclosure()

  React.useEffect(() => {
    function onShortCut(evt: KeyboardEvent) {
      if (evt.code === 'KeyH') {
        evt.preventDefault()
        onToggle()
      }
    }

    window.addEventListener('keydown', onShortCut)

    return () => window.removeEventListener('keydown', onShortCut)
  }, [onToggle])

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement='right' size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerHeader>Help</DrawerHeader>

        <DrawerBody>
          <VStack divider={<Divider />} spacing="4" alignItems="flex-start" paddingBottom="4">
            <Text fontWeight="bold">Player shortcuts</Text>
            <ShortCut code='Space'>Play / Pause the track</ShortCut>
            <ShortCut code='BackSpace'>Stop the current track</ShortCut>
            <ShortCut code='0 - 9'>Seek in the track: zero to restart, three for 30% of total time</ShortCut>
            <ShortCut code='Right / Left'>Seek by one second in the track</ShortCut>
            <ShortCut code='P'>Open playing list</ShortCut>
            <ShortCut code='N'>Play next track</ShortCut>
            <ShortCut code='E'>Empty playing list</ShortCut>
            <Text marginTop="8" fontWeight="bold">General shortcuts</Text>
            <ShortCut code='H'>Open help menu</ShortCut>
            <ShortCut code='R'>Force refresh main tree</ShortCut>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
};
