/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Link from '../../atoms/Link/Link'
import s from './NavBar.scss'
import useStyles from 'isomorphic-style-loader-react18/useStyles';

export default function NavBar({data, config}) {
  useStyles(s);
  const { navItems = [], activeNav = '' } = data;
  const [activeItem, setActiveItem] = useState(activeNav);
  
  const { onClick = undefined, activeClass='', id='', className='' } = config || {};

  function handleClick(event) {
    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }

    setActiveItem(event.target.innerText);
  }

  const linkProps = {
    onClick: handleClick,
  }

  return (
    <ul className={`${s.navBar} ${className}`} id = {id}>
      {navItems.map((item, index) =>
        <li key={`navitem_${index}_${id}`} className={activeItem === item.text ? `${s.active} ${activeClass}` : ''}>
          <Link
            data={item}
            config = {linkProps}
          />
        </li>
      )}

    </ul>
  )
}

NavBar.propTypes = {
  data: PropTypes.shape({
    navItems: PropTypes.arrayOf(PropTypes.shape()),
    activeNav: PropTypes.string,
  }),
  config: PropTypes.shape({
    onClick: PropTypes.func,
    activeClass: PropTypes.string,
    id: PropTypes.string,
    className: PropTypes.string,
  })


}

NavBar.defaultProps = {
  data: {
    navItems: [
      {
        "text": "Home",
        "link": "https://timesofindia.indiatimes.com/spotlight/UberAtTen"
      },
      {
        "text": "Blogs",
        "link": "#blogs"
      },
      {
        "text": "Videos",
        "link": "#videolist_player"
      },
      {
        "link": "#articles",
        "text": "Articles"
      },
      {
        "text": "About Uber at 10",
        "link": "#aboutUber"
      }
    ],
    activeNav: "Home"
  },
  config:{
    onClick: undefined,
    activeClass: 'activeNav',
    id: '',
    className: '',
  }

}