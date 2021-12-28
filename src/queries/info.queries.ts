import { useQuery } from "react-query"

export interface Info {
  startedAt: number;
  absolutePath: string;
  originPath: string;
}

function jsonToInfo(json: any): Info {
  return {
    startedAt: json?.startedAt ?? 0,
    absolutePath: json?.absolutePath ?? '',
    originPath: json?.originPath ?? '',
  }
}

async function fetchInfo() {
  const res = await fetch('/api/info')
  const json = await res.json()

  return jsonToInfo(json)
}

export const useQueryInfo = () => {
  return useQuery('info', fetchInfo, {
    staleTime: Infinity,
    retry: false,
  })
}
