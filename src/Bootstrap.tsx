import { Alert, AlertDescription, AlertIcon, AlertTitle, Code } from '@chakra-ui/react';
import React from 'react';
import { useQueryInfo } from './queries/info.queries';

interface Props {
};

export const Bootstrap: React.FC<Props> = (props) => {
  const queryInfo = useQueryInfo()

  if (queryInfo.isLoading) {
    return null;
  }

  if (queryInfo.isFetched && queryInfo.isError) {
    return (
      <Alert status='error' marginY="2" marginLeft="6">
        <AlertIcon />
        <AlertTitle>Could not reach server:</AlertTitle>
        <AlertDescription>did you run <Code>yarn server /path/to/music</Code> ?</AlertDescription>
      </Alert>
    )
  }

  return <>{props.children}</>;
};
