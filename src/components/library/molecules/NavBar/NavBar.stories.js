/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import NavBar from './NavBar';

// import s from './Header.scss'

export default {
  title: 'molecules/NavBar',
  component: NavBar,
};


export const Default = {
  args: {},
  render: (args) => <NavBar {...args} />,
};
