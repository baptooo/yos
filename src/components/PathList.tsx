import {
  PlusSquareIcon
} from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle, Divider, HStack, Link,
  List,
  ListIcon,
  ListItem,
  Skeleton,
  VStack
} from '@chakra-ui/react';
import React from 'react';
import { usePlayerContext } from '../contexts/player.context';
import { AddAlbumIcon } from '../icons/add-album-icon';
import { useQueryPath } from '../queries/path.queries';
import { PathNodeItem } from './PathNodeItem';

interface Props {
  path: string;
  depth: number;
};

export const PathList: React.FC<Props> = ({ path, depth }) => {
  const queryPath = useQueryPath(path)
  const isReady = !queryPath.isLoading && queryPath.isFetched;
  const playerContext = usePlayerContext()

  React.useEffect(() => {
    if (depth > 0) { return; }

    function onShortCut(evt: KeyboardEvent) {
      if (evt.metaKey === false && evt.shiftKey === false && evt.code === 'KeyR') {
        evt.preventDefault();
        queryPath.refetch();
      }
    }

    window.addEventListener('keydown', onShortCut);

    return () => window.removeEventListener('keydown', onShortCut);
  }, [queryPath, depth])

  const allTracks = React.useMemo(() => {
    const paths = queryPath.data ?? [];
    return paths.reduce<string[]>((result, pathNode)=> {
      if (pathNode.type === 'flac') { 
        result.push(`${path}/${pathNode.path}`);
      }

      return result;
    }, []);
  }, [queryPath, path])

  const handleAddAll = React.useCallback(() => {
    playerContext.addAlbumToPlaylist(allTracks.slice(1));
    playerContext.play(allTracks[0]);
  }, [allTracks, playerContext]);

  if (path == null) { return null; }

  if (queryPath.isError) {
    return (
      <Alert status='error' marginY="2">
        <AlertIcon />
        <AlertTitle>Could not load path:</AlertTitle>
        <AlertDescription>{path}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Skeleton isLoaded={isReady} paddingLeft={depth > 0 ? '6' : undefined} width="100%  ">
      {queryPath.data && queryPath.data?.length > 0 ? (
        <VStack marginY="2" divider={<Divider colorScheme="teal" />} alignItems="flex-start">
          {allTracks.length > 0 ? (
            <HStack color="teal.600">
              <AddAlbumIcon boxSize={6} />
              <Link fontWeight="bold" onClick={handleAddAll}>Play all tracks</Link>
            </HStack>
          ) : null}
          {queryPath.data?.map((pathNode) => (
            <PathNodeItem key={pathNode.path} pathNode={pathNode} parentPath={path}>
              {(disclosure) => (
                disclosure.isOpen ? <PathList path={`${path}/${pathNode.path}`} depth={depth + 1} /> : null
              )}
            </PathNodeItem>
          ))}
        </VStack>
      ) : (
        <Alert marginY="2">
          <AlertIcon />
          <AlertTitle>Nothing here... 🦩</AlertTitle>
        </Alert>
      )}
    </Skeleton>
  );
};
