/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import Button from './Button';

// import s from './Header.scss'

export default {
  title: 'atoms/Button',
  component: Button,
};


export const Default = {
  args: {},
  render: (args) => <Button {...args} />,
};