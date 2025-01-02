import React from 'react';
import Button from '../../atoms/Button/Button';
import Link from '../../atoms/Link/Link';
import NavBar from '../../molecules/NavBar/NavBar';
import s from './Header.scss';
import useStyles from 'isomorphic-style-loader-react18/useStyles';


export default function Header() {
  useStyles(s);
  return (
    <>
      <Button>test</Button>
      <Link>test</Link>
      <div>
        <div className={s.topSectionWrapper}
        >
          <div className="hleft">
            {/* back to button */}
            <a
              className="back-to"
              target="_blank"
              href="https://timesofindia.indiatimes.com"
            ><p>Back to <span>TOI</span></p></a
            >

            {/* Logo */}
            <div className="logo-container">
              <div className="main-logo">
                <a
                  href="https://timesofindia.indiatimes.com/"
                  data-href="https://timesofindia.indiatimes.com/"
                ><img
                    src="https://static.toiimg.com/photo/103690269.cms"
                    alt="logo"
                  /></a>
              </div>
              <div className=" "><span></span></div>
            </div>
          </div>
          <div className="hright">
            {/* #todoMicrosite: search bar */}
            {/* navigation */}
            <NavBar />
          </div>
        </div>
      </div>
    </>
  )
}
