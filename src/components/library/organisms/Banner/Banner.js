import React from 'react';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import s from './Banner.scss';

export default function Banner() {
  useStyles(s);
  return <div>Banner</div>;
}
