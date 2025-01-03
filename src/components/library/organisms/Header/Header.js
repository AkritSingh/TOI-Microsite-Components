/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React from 'react';
import Link from '../../atoms/Link/Link';
import Image from '../../atoms/Image/Image';
import Background from '../../atoms/Background/Background';
import NavBar from '../../molecules/NavBar/NavBar';

import s from './Header.scss';
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader-react18/useStyles';


export default function Header({
  data, config
}) {
  useStyles(s);
  const { layout } = config;
  const { id, class: classname, styleObj, components} = layout;
  const {background, navMenu, back_to_button, logo} = data;


  const backToToiProps = {
    data: {
      url: back_to_button?.link || 'https://timesofindia.indiatimes.com',
      nofollow: '',
      
    },
    config: {
      layout: {
        id: `back_to_${back_to_button?.channel || 'TOI'}`,
        classname: `${s.backToTOI} ${components?.back_to_button?.class}`
      }
    }
  };

  const logoProps = {
    link: {
      data: {
        url:  logo?.link || 'https://timesofindia.indiatimes.com/',
        nofollow: '',
      },
      config: {
        layout: {
          id: 'logo',
          classname: s.logoContainer
        }
      }
    },
    img: {
      data: {
        src: logo?.image || 'https://static.toiimg.com/photo/103690269.cms',
        alt: logo?.alt ||'logo',
      },
      config: {
        layout: {
          id: 'logo',
          classname: `${s.logo} ${components?.logo?.class}`
        }
      } 
    }
  }

  const component = ( 
  <Background {...background} className={`${s.header} ${classname}`} id={id} style={styleObj}>
      <div className={s.hleft}>
        {/* back to button */}
        <Link 
          {...backToToiProps}
        >Back to <br/><span>{back_to_button?.channel || 'TOI'}</span>
        </Link>
        
         {/* Logo */}
        <Link {...logoProps.link}> 
          <Image {...logoProps.img}/>
        </Link>        
      </div>
      <div className="hright">
        {/* #todoMicrosite: search bar */}
        {/* navigation */}
        <NavBar {...navMenu}/>
      </div>
    </Background>
  );

  return component;
}


Header.propTypes = {
  data: PropTypes.shape({
  }),
  config: PropTypes.shape({
    layout: PropTypes.shape({
      id: PropTypes.string,
      class: PropTypes.string,
      styleObj: PropTypes.shape(),
      components: PropTypes.shape({}),
    })
  })
}
Header.defaultProps = {
  data: {
    background: {},
    navMenu: {},
    back_to_button: {},
    logo: {},
  },
  config: {
    layout: {
      id: '',
      class: '',
      styleObj: {},
      components:{
        background: {},
        navMenu: {},
        back_to_button: {},
        logo: {},
      }
    }
  }
}