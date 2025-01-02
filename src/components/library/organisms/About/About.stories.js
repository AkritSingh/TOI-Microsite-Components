/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import About from './About';
import { data } from './storiesData';

export default {
  title: 'Organisms/About',
  component: About,
  parameters: {},
};

export const Default = {
  args: {
    ...data.default,
  },
  render: (args) => <About {...args} />,
};

export const Variant1 = {
  args: {
    ...data.variant1,
  },
  render: (args) => <About {...args} />,
};
