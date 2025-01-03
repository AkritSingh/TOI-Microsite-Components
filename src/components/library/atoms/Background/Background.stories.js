/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import Background from './Background';

// import s from './Header.scss'

export default {
  title: 'atoms/Background',
  component: Background,
};


export const Default = {
  args: {
    type: 'background',
    config: {
      layout: {
        angle: '0deg',
      }
    },
    data:{
      colors: ['white', 'red'],
      image: '',
    }
  },
  render: (args) => <Background {...args}>Background</Background>,
};
