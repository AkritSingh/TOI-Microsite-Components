/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import MediaComponent from './MediaComponent';

// import s from './Header.scss'

export default {
  title: 'molecules/Media Component',
  component: MediaComponent,
};

export const Default = {
  args: {
    type: 'image',
    data: {
      src: 'https://static.toiimg.com/thumb/imgsize-105510,msid-106101530,width-375,resizemode-4/106101530.jpg',
      alt: 'image',
    },
    config: {
      layout: {
        id: '',
        classname: '',
        styleObj: {},
      },
      onClick: undefined,
    },
  },

  render: (args) => <MediaComponent {...args} />,
};
