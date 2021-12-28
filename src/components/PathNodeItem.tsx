import React from 'react';
import { AddIcon, TriangleDownIcon } from '@chakra-ui/icons';
import {
  Button,
  ComponentWithAs,
  Divider,
  HStack,
  IconButton,
  Link,
  useDisclosure,
  UseDisclosureProps
  } from '@chakra-ui/react';
import { EqualizerIcon } from '../icons/equalizer';
import { PathNode } from '../queries/path.queries';
import { useDisplayPath, useHighlighted, useTrackName } from '../helpers/use-display-path';
import { usePlayerContext } from '../contexts/player.context';

interface Props {
  pathNode: PathNode;
  parentPath: string;
  children?: (disclosure: UseDisclosureProps) => React.ReactNode;
};

export const PathNodeItem: ComponentWithAs<'div', Props> = ({ pathNode, parentPath, children }) => {
  const disclosure = useDisclosure()
  const displayPath = useDisplayPath()
  const playerContext = usePlayerContext()
  const isHighlighted = useHighlighted();
  const getTrackName = useTrackName()

  const pathNodeString = React.useMemo(() => displayPath(pathNode.path), [displayPath, pathNode.path])

  const fullPath = React.useMemo(() => {
    return `${parentPath}/${pathNode.path}`;
  }, [parentPath, pathNode])

  const highlighted = React.useMemo(() => {
    return isHighlighted(pathNodeString);
  }, [pathNodeString, isHighlighted])

  if (pathNode.type === 'directory') {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={(
            <TriangleDownIcon
              transition="transform 0.2s ease-in-out"
              transform={disclosure.isOpen ? '' : 'rotate(-90deg)'}
              aria-selected={highlighted ? "true" : "false"}
              _selected={{ color: 'teal.400' }}
            /> 
          )}
          onClick={disclosure.onToggle}
          aria-selected={highlighted ? "true" : "false"}
          _selected={{ color: 'teal.400' }}
        >
          {pathNodeString}
        </Button>
        {children ? children(disclosure) : null}
      </>
    )
  }

  return (
    <HStack
      divider={<Divider orientation='vertical' />}
      spacing="0"
      aria-selected={highlighted ? "true" : "false"}
      _selected={{ color: 'teal.400' }}
      >
      {highlighted ? <EqualizerIcon w="8" /> : (
        <IconButton
          variant="ghost"
          size="sm"
          aria-label='Add to playlist'
          onClick={(evt) => {
            evt.preventDefault()
            evt.stopPropagation()
            playerContext.addToPlaylist(fullPath)
          }}
          icon={<AddIcon />}
        />
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => playerContext.play(fullPath)}
      >{getTrackName(pathNode.path)}</Button>
    </HStack>
  )
};
