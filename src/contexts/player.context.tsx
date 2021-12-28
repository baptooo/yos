import { useToast } from '@chakra-ui/react';
import React from 'react';
import { useTrackName } from '../helpers/use-display-path';

interface IPlayerContext {
  currentTrack?: string;
  playlist: string[];

  play: (path: string) => void;
  stop: () => void;
  next: () => void;
  addToPlaylist: (path: string) => void;
  removeFromPlaylist: (path: string) => void;
  emptyPlaylist: () => void;
  addAlbumToPlaylist: (tracks: string[]) => void;
}

const PlayerContext = React.createContext<IPlayerContext | null>(null);

export const PlayerContextProvider: React.FC = ({children}) => {
  const [currentTrack, setCurrentTrack] = React.useState<string | undefined>();
  const [playlist, setPlaylist] = React.useState<string[]>([]);
  const toast = useToast();
  const trackName = useTrackName()

  const contextValue: IPlayerContext = {
    currentTrack,
    playlist,
    play(path) {
      setCurrentTrack(path);
    },
    next() {
      const [nextTrack, ...newPlaylist] = playlist;

      if (nextTrack != null) {
        setCurrentTrack(nextTrack)
        setPlaylist(newPlaylist)
      }
    },
    addToPlaylist(path) {
      const name = trackName(path);

      if (!playlist.includes(path)) {
        setPlaylist([...playlist, path])
        toast({
          title: `${name} added to playlist`,
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'top-right',
        })
      }
    },
    addAlbumToPlaylist(tracks) {
      const filtered = tracks.filter((trackPath) => !playlist.includes(trackPath));

      if (filtered.length > 0) {
        setPlaylist(filtered);
        toast({
          title: `${filtered.length} tracks added to the playlist`,
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'top-right',
        })
      }
    },
    removeFromPlaylist(path) {
      const filteredPlaylist = playlist.filter((p) => p !== path)

      if (filteredPlaylist.length !== playlist.length) {
        setPlaylist(filteredPlaylist);
      }
    },
    emptyPlaylist() {
      setPlaylist([])
    },
    stop() {
      setCurrentTrack(undefined)
    }
  }

  return <PlayerContext.Provider value={contextValue} children={children} />
}

export const usePlayerContext = () => {
  const playerContext = React.useContext(PlayerContext)

  if (playerContext == null) {
    throw new Error('usePlayerContext hook must be used withing a PlayerContext');
  }

  return playerContext;
}
