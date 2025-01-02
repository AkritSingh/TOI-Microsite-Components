import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getIntersectionObserver } from "../../utils/intersectionObserver";
import styles from './Image.module.scss';

function Image({ type, data, layout, config }) {
  // desturcture here

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(config?.loadingStyle !== 'inview');
  const imageRef = useRef(null);

  useEffect(() => {
    if (config?.loadingStyle !== 'inview' || !imageRef.current) return;

    const observer = getIntersectionObserver({
      threshold: config.threshold || 0.1,
      onIntersect: (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
    });

    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [config?.loadingStyle, config?.threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const getLayoutStyles = () => {
    const { layout: imageLayout, width, height } = layout;
    
    switch (imageLayout) {
      case 'cover':
        return {
          width: width || '100%',
          height: height || '100%',
          objectFit: 'cover',
        };
      case 'contain':
        return {
          width: width || '100%',
          height: height || '100%',
          objectFit: 'contain',
        };
      case 'original':
        return {
          width: data.width || 'auto',
          height: 'auto',
          objectFit: 'none',
        };
      case 'responsive':
      default:
        return {
          width: width || '100%',
          height: height || 'auto',
          objectFit: 'contain',
        };
    }
  };

  const imageStyles = {
    ...getLayoutStyles(),
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const shouldRender = config?.loadingStyle === 'immediate' || isInView;

  if (type !== 'image') return null;

  return (
    <div
      ref={imageRef}
      className={`${styles.imageWrapper} ${layout?.class || ''}`}
      id={layout?.id}
    >
      {shouldRender && (
        <>
          {layout?.placeHolderSrc && !isLoaded && (
            <div
              className={styles.placeholder}
              style={{
                backgroundImage: `url(${layout.placeHolderSrc})`,
                ...getLayoutStyles(),
              }}
            />
          )}
          <img
            src={data.src}
            alt={data.alt}
            title={data.altTitle}
            loading={config?.loadingStyle === 'lazy' ? 'lazy' : 'eager'}
            onLoad={handleLoad}
            style={imageStyles}
            width={data.width}
            height={layout.height}
          />
        </>
      )}
    </div>
  );
}

Image.propTypes = {
  type: PropTypes.oneOf(['image']).isRequired,
  data: PropTypes.shape({
    width: PropTypes.string,
    src: PropTypes.string.isRequired,
    msid: PropTypes.string,
    alt: PropTypes.string.isRequired,
    altTitle: PropTypes.string,
  }).isRequired,
  layout: PropTypes.shape({
    id: PropTypes.string,
    class: PropTypes.string,
    layout: PropTypes.oneOf(['responsive', 'cover', 'contain', 'original']),
    width: PropTypes.string,
    height: PropTypes.string,
    imgsize: PropTypes.string,
    resizemode: PropTypes.number,
    placeHolderSrc: PropTypes.string,
  }),
  config: PropTypes.shape({
    loadingStyle: PropTypes.oneOf(['lazy', 'immediate', 'inview']),
    threshold: PropTypes.number,
  }),
};

Image.defaultProps = {
  layout: {
    layout: 'responsive',
  },
  config: {
    loadingStyle: 'lazy',
    threshold: 0,
  },
};

export default Image;
