/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import Text from '../../atoms/Text/Text';
import Image from '../../atoms/Image/Image';
import s from './DenmarkArticle.scss';

export default function DenmarkArticle({ data, config, extConfig }) {
  useStyles(s);

  // const dataURL = "";
  const { layout } = config;
  const { components } = layout;
  const { api } = data;
  const { title, description, content, image } = api;
  const {
    textContent = true,
    mediaContent = true,
    mediaType = '',
    mediaNode = undefined,
  } = extConfig || {};

  const imgProps = {
    data: {
      src: image || 'https://static.toiimg.com/photo/83033472.cms',
      alt: 'image',
    },
    consfig: {
      layout: {},
    },
  };

  return (
    <div>
      {components?.title?.isVisible && title && textContent && (
        <Text config={{ ...components?.title?.text }}>{title}</Text>
      )}

      <div>
        <div>
          {components?.description?.isVisible && textContent && description && (
            <Text config={{ ...components?.description?.text }}>
              {description}
            </Text>
          )}
          <br />
          {components?.content?.isVisible && content && (
            <Text config={{ ...components?.content?.text }}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </Text>
          )}
        </div>
        <div>
          {mediaContent &&
            mediaType &&
            React.isValidElement(mediaNode) &&
            mediaNode}
          {mediaContent && !mediaType && <Image {...imgProps} />}
        </div>
      </div>
    </div>
  );
}

DenmarkArticle.propTypes = {
  data: PropTypes.shape({
    api: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      content: PropTypes.string,
    }),
  }),
  config: PropTypes.shape({
    layout: PropTypes.shape({
      id: PropTypes.string,
      classname: PropTypes.string,
      styleObj: PropTypes.shape(),
      components: PropTypes.shape({
        title: PropTypes.shape({
          isVisible: PropTypes.bool,
        }),
        description: PropTypes.shape({
          isVisible: PropTypes.bool,
        }),
        content: PropTypes.shape({
          isVisible: PropTypes.bool,
        }),
      }),
    }),
  }),
};

DenmarkArticle.defaultProps = {
  data: {
    api: {
      title: '',
      description: '',
      content: '',
    },
  },
  config: {
    layout: {
      id: '',
      classname: '',
      styleObj: {},
      components: {
        title: {
          isVisible: true,
          text: {
            layout: {
              type: 'h1',
            },
          },
        },
        description: {
          isVisible: true,
          text: {
            layout: {
              type: 'h3',
            },
          },
        },
        content: {
          isVisible: true,
          text: {
            layout: {
              type: 'normal',
            },
          },
        },
        onClick: undefined,
      },
    },
  },
};
