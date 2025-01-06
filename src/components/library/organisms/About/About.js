import React from 'react';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import s from './About.scss';
import DenmarkArticle from '../../molecules/DenmarkArticle/DenmarkArticle';
import MediaComponent from '../../molecules/MediaComponent/MediaComponent';

function About({ data, config }) {
  useStyles(s);
  const { layout } = config;
  const { id, class: classname, styleObj, components } = layout;

  const { background, denmark, media } = data;

  const DenProps = {
    extConfig: {
      textContent: !!components?.textContent,
      mediaContent: !!components?.mediaContent,
      mediaType: media?.type,
      mediaNode: <MediaComponent {...media} />,
    },
  };

  return (
    <div className={s.about}>
      <div className="wrapper">
        <DenmarkArticle {...DenProps} {...denmark} />
        {/* {!!components?.mediaContent && media?.type && 
            <div className={s.mediaContainer}>
                
            </div>
        } */}
      </div>
    </div>
  );
}

export default About;
