import {
  Box, Code, Heading,
  HStack, Kbd,
  Skeleton,
  Text,
  theme,
  useColorMode
} from '@chakra-ui/react';
import React from 'react';
import { useQueryInfo } from '../queries/info.queries';

export const AppTitle: React.FC = () => {
  const queryInfo = useQueryInfo()
  const {colorMode} = useColorMode()

  const startedAt = React.useMemo(() => {
    if (queryInfo.data == null) { return '' }

    return new Date(queryInfo.data.startedAt).toLocaleString()
  }, [queryInfo.data])

  return (
    <Skeleton
      isLoaded={queryInfo.isFetched && queryInfo.data != null}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack spacing="2">
        <Heading
          fontFamily="Walter Turncoat"
          size="xl"
          color="teal.500"
          textShadow={`0 2px 0 ${theme.colors.pink[400]}`}
        >Your Own Stream</Heading>
        <Heading size="lg">🦩</Heading>
      </HStack>
      <Box textAlign="right" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
        <Code fontSize="lg" marginBottom="2">:{queryInfo.data?.absolutePath}</Code>
        <Text fontSize="md">Started at: {startedAt}</Text>
        <Text marginTop="4" fontSize="sm">(Press <Kbd>H</Kbd> for help)</Text>
      </Box>
    </Skeleton>
  );
};
