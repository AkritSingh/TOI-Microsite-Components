import React from 'react'
import s from './Banner.scss'
import useStyles from 'isomorphic-style-loader-react18/useStyles';

export default function Banner() {
  useStyles(s);
  return (
    <div>Banner</div>
  )
}
