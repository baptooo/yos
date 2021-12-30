import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box, Flex,
  HStack,
  IconButton, Progress,
  Slide,
  Text,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react';
import React from 'react';
import { usePlayerContext } from '../contexts/player.context';
import { useTrackName } from '../helpers/use-display-path';
import { EqualizerIcon } from '../icons/equalizer';
import { NextIcon } from '../icons/next-icon';
import { PlayList } from './Playlist';

interface Props {
};

function timeInSecondsToPaddedMinutes(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  const minutesStr = `${minutes < 10 ? '0' : ''}${minutes}`;
  const secondsStr = `${seconds < 10 ? '0' : ''}${seconds}`;

  return `${minutesStr}:${secondsStr}`;
}

export const Player: React.FC<Props> = (props) => {
  const {colorMode} = useColorMode()
  const playerContext = usePlayerContext()
  const playerRef = React.createRef<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [seekBarProgress, setSeekBarProgress] = React.useState(0);
  const playlistDisclosure = useDisclosure();
  const getTrackName = useTrackName();
  
  React.useEffect(() => {
    if (playerRef.current == null) { return; } // No player activity
    const pl = playerRef.current!;
    
    function onLoadedMetaData() {
      setDuration(pl.duration);
    }
    
    function onTimeUpdate() {
      setCurrentTime(pl.currentTime);
    }

    function onPlaying() {
      setIsPlaying(true)
    }

    function onPause() {
      setIsPlaying(false)
    }

    function onEnded() {
      playerContext.next()
      pl.currentTime = 0;
    }

    function onShortCut(evt: KeyboardEvent) {
      if (playerRef.current == null) { return; }
      let handled = true;
      const pl = playerRef.current!
      const playing = !pl.paused;

      switch (true) {
        case evt.code === 'Space':
          playing ? pl.pause() : pl.play()
          break;
        case evt.code.match(/Digit[0-9]/i) != null:
          const digit = parseInt(evt.code.replace('Digit', ''), 10)
          const toSeek = pl.duration * (digit / 10) ?? 0
          
          pl.currentTime = toSeek
          pl.play()
          break;
        case evt.code === 'ArrowRight':
          pl.currentTime += 1;
          break;
        case evt.code === 'ArrowLeft':
          pl.currentTime -= 1;
          break;
        case evt.code === 'Backspace':
          playerContext.stop();
          break;
        case evt.code === 'KeyN':
          playerContext.next();
          break;
        default:
          handled = false;
          break;
      }

      if (handled) {
        evt.preventDefault()
      }
    }
    
    pl.addEventListener('loadedmetadata', onLoadedMetaData)
    pl.addEventListener('timeupdate', onTimeUpdate);
    pl.addEventListener('playing', onPlaying)
    pl.addEventListener('pause', onPause)
    pl.addEventListener('ended', onEnded)
    window.addEventListener('keydown', onShortCut)
    return () => {
      pl.removeEventListener('loadedmetadata', onLoadedMetaData);
      pl.removeEventListener('timeupdate', onTimeUpdate);
      pl.removeEventListener('playing', onPlaying)
      pl.removeEventListener('pause', onPause)
      pl.removeEventListener('ended', onEnded)
      window.removeEventListener('keydown', onShortCut)
    }
  }, [playerRef, playerContext]);

  React.useEffect(() => {
    if (playlistDisclosure.isOpen && playerContext.playlist.length === 0) {
      playlistDisclosure.onClose();
    }
  }, [playlistDisclosure, playerContext])

  const trackName = React.useMemo(() => {
    return getTrackName(playerContext.currentTrack ?? '')
  }, [playerContext.currentTrack, getTrackName])

  const nextTrackName = React.useMemo(() => {
    if (playerContext.playlist.length === 0) { return undefined }

    return getTrackName(playerContext.playlist[0]);
  }, [playerContext, getTrackName])

  const currentProgress = React.useMemo(() => {
    const progress = currentTime / duration;

    if (isNaN(progress)) { return 0; }

    return progress * 100;
  }, [duration, currentTime]);

  const timeDisplay = React.useMemo(() => {
    if (duration == null) { return '--:--' }

    const displayTime = ((seekBarProgress || currentProgress) / 100) * duration;

    return `${timeInSecondsToPaddedMinutes(displayTime)} / ${timeInSecondsToPaddedMinutes(duration)}`
  }, [duration, currentProgress, seekBarProgress]);

  const handlePlayPause = React.useCallback(() => {
    if (playerRef.current == null) { return; }

    if (playerRef.current.paused) {
      playerRef.current.play()
    } else {
      playerRef.current.pause()
    }
  }, [playerRef])

  const handleSeek = React.useCallback((evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (evt.currentTarget == null || playerRef.current == null) { return; }

    const seekingPercent = (evt.clientX - evt.currentTarget.getBoundingClientRect().left) / evt.currentTarget.offsetWidth;
    const seekingDuration = seekingPercent * duration;

    playerRef.current.currentTime = seekingDuration;

    if (!isPlaying) {
      handlePlayPause()
    }
  }, [playerRef, duration, isPlaying, handlePlayPause]);

  const handleSeekBarOut = React.useCallback(() => {
    setSeekBarProgress(0);
  }, [])

  const handleSeekBarMove = React.useCallback((evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (evt.currentTarget == null) { return; }

    const seekingPercent = (evt.clientX - evt.currentTarget.getBoundingClientRect().left) / evt.currentTarget.offsetWidth;

    setSeekBarProgress(seekingPercent * 100)
  }, [])

  return (
    <Slide
      direction='bottom'
      in={playerContext.currentTrack != null}
      style={{ zIndex: 100 }}
    >
      <Box
        background={colorMode === 'light' ? 'white' : 'gray.700'}
        paddingX="16"
        paddingBottom="4"
        paddingTop="2"
        color="teal.400"
        borderTop="1px solid"
        borderColor={colorMode === 'light' ? 'gray.100' : 'gray.600'}
        transition="box-shadow 0.3s ease-in-out"
        boxShadow={
          playerContext.currentTrack != null && playlistDisclosure.isOpen
            ? '0 0 0 999rem rgba(0, 0, 0, 0.2)' : undefined
        }
      >
        <Flex marginY="2" justifyContent="space-between" alignItems="center">
          <Badge fontSize="md" colorScheme="teal" variant="ghost">{trackName}</Badge>
          {nextTrackName ? (
            <>
              <IconButton
                aria-label='Open playing list'
                variant="ghost"
                size="sm"
                icon={<TriangleUpIcon />}
                transiiton="transform 0.5s ease-in-out"
                transform={playlistDisclosure.isOpen ? 'rotate(-180deg)' : undefined}
                onClick={() => playlistDisclosure.onToggle()}
              />
              <Badge
                colorScheme="teal"
                variant="ghost"
                cursor="pointer"
                onClick={() => playerContext.next()}
              ><NextIcon marginRight="2" /> {nextTrackName}</Badge>
            </>
          ) : null}
        </Flex>
        <HStack spacing="2" alignItems="center">
          <IconButton
            aria-label='PlayPause'
            colorScheme="teal"
            borderRadius="50%"
            size="sm"
            icon={isPlaying ? <EqualizerIcon /> : <TriangleDownIcon transform="rotate(-90deg)" />}
            onClick={handlePlayPause}
          />
          <IconButton
            aria-label='Next'
            colorScheme="teal"
            variant="ghost"
            size="sm"
            disabled={playerContext.playlist?.length === 0}
            icon={<NextIcon />}
            onClick={() => playerContext.next()}
          />
          <Text
            fontSize="sm"
            color="teal.400"
            minWidth="100px"
            textAlign="center"
          >{timeDisplay}</Text>
          {playerContext.currentTrack != null ? (
            <>
              <audio
                ref={playerRef}
                style={{ width: '100%' }}
                src={`/api/play${playerContext.currentTrack}`}
                autoPlay
              />
              <Box
                width="100%"
                paddingY="4"
                cursor="pointer"
                position="relative"
                onMouseMove={handleSeekBarMove}
                onMouseLeave={handleSeekBarOut}
                onClick={handleSeek}>
                <Progress
                  colorScheme="teal"
                  size="sm"
                  borderRadius="4"
                  value={currentProgress}
                />
                {seekBarProgress ? (
                  <Progress
                    position="absolute"
                    left={0} top="4" right={0} bottom={0}
                    opacity={0.4}
                    colorScheme="teal"
                    size="sm"
                    borderRadius="4"
                    value={seekBarProgress}
                  />
                ) : null}
              </Box>
            </>
          ) : null}
        </HStack>
      </Box>
      <PlayList disclosure={playlistDisclosure} />
    </Slide>
  );
};
