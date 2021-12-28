import React from 'react';
import {
  Fade,
  Image,
  useDisclosure
} from '@chakra-ui/react';
import bouncingCat from '../assets/bouncing-cat.gif';

interface Props {
};

export const BouncingCat: React.FC<Props> = (props) => {
  const { isOpen, onToggle } = useDisclosure();

  React.useEffect(() => {
    function onShortCut(evt: KeyboardEvent) {
      if (evt.code === 'KeyC') {
        onToggle();
      }
    }

    window.addEventListener('keydown', onShortCut)

    return () => window.removeEventListener('keydown', onShortCut)
  }, [onToggle])

  return (
    <Fade in={isOpen}>
      <Image
        position="fixed"
        top="2"
        left="2"
        borderBottom="2px solid"
        borderColor="teal.400"
        borderRadius="50%"
        src={bouncingCat}
      />
    </Fade>
  );
};
