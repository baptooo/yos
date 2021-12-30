import {
  ChakraProvider,
  Flex, Stack
} from '@chakra-ui/react';
import '@fontsource/walter-turncoat';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Bootstrap } from './Bootstrap';
import { AppTitle } from './components/AppTitle';
import { BouncingCat } from './components/BouncingCat';
import { Help } from './components/Help';
import { PathList } from './components/PathList';
import { Player } from './components/Player';
import { PlayerContextProvider } from './contexts/player.context';
import yosTheme from './theme/yos-theme';

const queryClient = new QueryClient()

function App() {
  return (
    <ChakraProvider theme={yosTheme}>
      <QueryClientProvider client={queryClient}>
        <PlayerContextProvider>
          <Bootstrap>
            <BouncingCat />
            <Help />
            <Flex
              my="2"
              mx="16"
              flexDirection="column"
              justifyContent="space-between"
            >
              <AppTitle />

              <Stack spacing={6} flex={1} paddingBottom="24">
                <PathList path="" depth={0} />
              </Stack>

              <Player />
            </Flex>
          </Bootstrap>
        </PlayerContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
