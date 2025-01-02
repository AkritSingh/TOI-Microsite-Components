/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import Link from './Link';

// import s from './Header.scss'

export default {
  title: 'atoms/Link',
  component: Link,
};


export const Default = {
  args: {},
  render: (args) => <Link {...args} />,
};
