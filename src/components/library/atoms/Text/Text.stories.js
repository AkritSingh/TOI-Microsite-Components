/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import Text from './Text';

// import s from './Header.scss'

export default {
  title: 'atoms/Text',
  component: Text,
};


export const Default = {
  args: {
    type: 'text',
    data:{
        text: 'Link',
    },
    config: {
      layout:{
        id: '',
        styleObj: {},
        classname: '',
        type: 'h1'
      }
    }
  },
  render: (args) => <Text {...args} />,
};
