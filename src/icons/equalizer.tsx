import React from 'react';
import { createIcon } from '@chakra-ui/icons';
import './equalizer.css';

export const EqualizerIcon = createIcon({
  displayName: 'EqualizerIcon',
  viewBox: '0 0 16 16',
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: (
    <g fill="currentColor">
      <rect className="eq__bar" id="eq1" x="1" y="8" width="4" height="8"></rect>
      <rect className="eq__bar" id="eq2" x="6" y="1" width="4" height="15"></rect>
      <rect className="eq__bar" id="eq3" x="11" y="4" width="4" height="12"></rect>
    </g>
  ),
})
