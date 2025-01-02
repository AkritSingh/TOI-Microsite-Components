/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import Image from './Image';

// import s from './Header.scss'

export default {
  title: 'atoms/Image',
  component: Image,
};

export const Default = {
  args: {
    type: 'image',
    data: {
      src: 'https://static.toiimg.com/thumb/imgsize-105510,msid-106101530,width-375,resizemode-4/106101530.jpg',
      msid: '',
      alt: 'Top annual salaries in American sports in 2023',
      altTitle: 'Top annual salaries in American sports in 2023',
    },
    layout: {
      id: '',
      class: '',
      layout: 'responsive', // 'responsive', 'cover', 'contain', 'original'
      width: '100%',
      height: 'auto',
      imgsize: '23456',
      resizemode: 4,
      placeHolderSrc: '',
    },
    config: {
      loadingStyle: 'lazy', // 'lazy', 'immediate', 'inview'
      threshold: 0.1, // if inview
    },
  },
  render: (args) => <Image {...args} />,
};

export const Test = {
  args: {
    type: 'image',
    data: {
      src: 'https://static.toiimg.com/thumb/imgsize-105510,msid-106101530,width-375,resizemode-4/106101530.jpg',
      msid: '',
      alt: 'Top annual salaries in American sports in 2024',
      altTitle: 'Top annual salaries in American sports in 2023',
    },
    layout: {
      id: '',
      class: '',
      layout: 'responsive',
      width: '100%',
      height: 'auto',
      imgsize: '23456',
      resizemode: 4,
      placeHolderSrc: '',
    },
    config: {
      loadingStyle: 'lazy',
      threshold: 0.1,
    },
  },
  render: (args) => <Image {...args} />,
};
