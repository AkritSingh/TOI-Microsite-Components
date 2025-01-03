/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import Header from './Header';
import { data } from './storiesData';

export default {
  title: 'Organisms/Header',
  component: Header,
  parameters: {},
};

export const Default = {
  args: {
    ...data.default,
  },
  render: (args) => <Header {...args} />,
};
