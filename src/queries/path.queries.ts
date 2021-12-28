import { useQuery } from "react-query";

export interface PathNode {
  type: 'flac' | 'directory',
  path: string;
  metadata: {
    artist: string;
    title: string;
    album: string;
    date: string;
  }
}

function jsonPathToNodes(json: any[]): PathNode[] {
  if (json == null) { return [] }

  return json.map((pathNode: any): PathNode => ({
    type: pathNode?.type ?? 'directory',
    path: pathNode?.path ?? '',
    metadata: {
      artist: pathNode?.metadata?.artist ?? '',
      title: pathNode?.metadata?.title ?? '',
      album: pathNode?.metadata?.album ?? '',
      date: pathNode?.metadata?.date ?? '',
    }
  }))
}

async function fetchPath(path: string) {
  const res = await fetch(`/api/path/${path}`)
  const json = await res.json();

  return jsonPathToNodes(json);
}

export const useQueryPath = (path: string) => {
  return useQuery(['path', path], () => fetchPath(path), {
    staleTime: 5 * 60 * 1000,
    enabled: path != null,
    retry: false,
  })
}
