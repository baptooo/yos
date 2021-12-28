import { AddIcon, CloseIcon, DeleteIcon, MinusIcon } from '@chakra-ui/icons';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Collapse, Divider, Heading, HStack, IconButton, Link, List, ListIcon, ListItem, useDisclosure, UseDisclosureProps, UseDisclosureReturn, VStack } from '@chakra-ui/react';
import React from 'react';
import { usePlayerContext } from '../contexts/player.context';
import { useHighlighted, useTrackName } from '../helpers/use-display-path';
import { EqualizerIcon } from '../icons/equalizer';

interface Props {
  disclosure: UseDisclosureReturn;
};

export const PlayList: React.FC<Props> = (props) => {
  const { isOpen, onToggle } = props.disclosure;
  const playerContext = usePlayerContext();
  const trackName = useTrackName();
  const isHighlighted = useHighlighted()

  React.useEffect(() => {
    function onShortCut(evt: KeyboardEvent) {
      if (playerContext.playlist.length === 0) { return; }

      if (evt.code === 'KeyP') {
        evt.preventDefault();
        onToggle();
      }

      if (evt.code === 'KeyE') {
        evt.preventDefault()
        playerContext.emptyPlaylist()
      }
    }

    window.addEventListener('keydown', onShortCut)

    return () => window.removeEventListener('keydown', onShortCut)
  }, [onToggle, playerContext]);

  return (
    <Collapse in={isOpen} animateOpacity={false}>
      <VStack
        paddingX="16"
        paddingTop="4"
        paddingBottom="8"
        spacing="4"
        background="white"
        alignItems="flex-start"
        maxHeight="calc(100vh - 200px)"
        overflowY="scroll"
      >
        <Heading size="md" color="teal.400">IN QUEUE</Heading>
        {playerContext.playlist.length > 0 ? (
          <VStack
            spacing="2"
            divider={<Divider />}
            width="100%"
            align="flex-start"
          >
            {playerContext.playlist.map((path) => {
              const highlighted = isHighlighted(path);

              return (
                <HStack
                  key={`playlist-${path}`}
                  aria-selected={highlighted ? "true" : "false"}
                  _selected={{ color: 'teal.400' }}
                >
                  {highlighted ? (
                    <EqualizerIcon />
                  ) : (
                    <IconButton
                      colorScheme="teal"
                      variant="ghost"
                      size="xs"
                      aria-label='Remove from playlist'
                      onClick={() => playerContext.removeFromPlaylist(path)}
                      icon={<MinusIcon />}
                    />
                  )}
                  <Link onClick={() => playerContext.play(path)}>{trackName(path)}</Link>
                </HStack>
              )
            })}
          </VStack>
        ) : (
          <Alert>
            <AlertIcon />
            <AlertTitle>Playlist is empty</AlertTitle>
            <AlertDescription>Click on <AddIcon/> next to the tracks to add</AlertDescription>
          </Alert>
        )}
      </VStack>
    </Collapse>
  );
};
