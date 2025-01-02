import React, { useState } from 'react'
import propTypes from 'prop-types'
import Link from '../../atoms/Link/Link'
import s from './NavBar.scss'
import useStyles from 'isomorphic-style-loader-react18/useStyles';

export default function NavBar(props) {
  useStyles(s);
  const { data, config } = props;
  // const { navItems = [], activeNav = '' } = data;
  const [activeItem, setActiveItem] = useState('Home');
  const navItems = [
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
  ]
  const { onClick = undefined } = config || {};

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
    <ul className={s.navBar}>
      {navItems.map((item, index) =>

        <li className={activeItem === item.text ? s.active : ''}>
          <Link
            {...item}
            {...linkProps}
          />
        </li>
      )}

    </ul>
  )
}

NavBar.propTypes = {
  data: propTypes.shape({
    navItems: propTypes.array,
    activeNav: propTypes.string,
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

}