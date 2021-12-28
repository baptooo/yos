import { usePlayerContext } from './../contexts/player.context';
import React from 'react';
import { Info } from './../queries/info.queries';
import { useQueryClient } from "react-query";

export const useDisplayPath = () => {
  const queryClient = useQueryClient()
  const infoData = queryClient.getQueryData<Info>('info');

  return (path: string | undefined) => path ? path.replace(infoData?.absolutePath + '/' ?? '', '') : path;
}

export const useTrackName = () => {
  return React.useCallback((trackName: string) => {
    if (trackName == null) { return ''; }
    const [extractedName] = trackName.split('/').slice(-1)

    // This is dirty but no rules here ! 🦩
    return extractedName
      .replace('.flac', '')
      .replace(/^(\d+) ?-? ?/, '')
  }, [])
}

export const useHighlighted = () => {
  const playerContext = usePlayerContext();

  return React.useCallback((path: string | undefined) => {
    if (playerContext.currentTrack == null || path == null) { return false; }

    return playerContext.currentTrack.indexOf(path ?? '') !== -1;
  }, [playerContext]);
}
