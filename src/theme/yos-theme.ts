import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'system',
}

const yosTheme = extendTheme({
  config,
})

export default yosTheme;
