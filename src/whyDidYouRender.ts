import React from 'react';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    // include: [/[/A-za-z/]/],
    include: [/SuburbHistory/],
    //exclude: [/SuburbListEntry/],
  });
}
