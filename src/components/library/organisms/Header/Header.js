/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable css-modules/no-unused-class */
/* eslint-disable import/no-relative-packages */
/* eslint-disable import/newline-after-import */
import React from 'react';

import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import s from './Header.scss';
import Link from '../../atoms/Link/Link';
import Image from '../../atoms/Image/Image';
import Background from '../../atoms/Background/Background';
import NavBar from '../../molecules/NavBar/NavBar';
export default function Header({
  data, config
}) {
  useStyles(s);
  const { layout } = config;
  const { id, class: classname, styleObj, components} = layout;
  const {background, navMenu, back_to_button, logo} = data;

  
  const component = ( 
  <Background {...background} className={`${s.header} ${classname}`} id={id} style={styleObj}>
      <div className={s.hleft}>
        {/* back to button */}
        {components?.back_to_button && 
        (<Link 
          {...back_to_button}
          id="back_to_channel"
          classname={s.backToTOI}
        >Back to <br/><span>{back_to_button?.channel || 'TOI'}</span>
        </Link>)
        }
        
        {/* Logo */}
        {components?.logo && (<Link {...logo} 
         id="main_logo"
         classname={s.logoContainer}
        > 
          <Image {...logo}
          classname={s.logo}/>
        </Link> )
        }   
      </div>
      <div className="hright">
        {/* #todoMicrosite: search bar */}
        {/* navigation */}
        {components?.logo && (<NavBar {...navMenu}/>)}  
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