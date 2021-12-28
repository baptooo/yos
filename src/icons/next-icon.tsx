import { createIcon } from "@chakra-ui/icons";

export const NextIcon = createIcon({
  displayName: 'NextIcon',
  viewBox: '0 0 24 24',
  path: (
    <g fill="currentColor" transform="scale(1.5) translate(-5 -5)">
      <path d="M0 0h24v24H0z" fill="none" />,
      <path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </g>
  )
})
