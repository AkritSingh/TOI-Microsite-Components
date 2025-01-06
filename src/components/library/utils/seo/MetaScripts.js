import React from 'react';
import PropTypes from 'prop-types';

const getSeoFromData = (seoData) => {
  if (typeof seoData === 'object') {
    return {
      ...seoData,
      title: seoData.title,
      description: seoData.description,
      news_keywords: seoData.news_keywords,
    };
  }

  return {};
};

export default function MetaScripts(props) {
  const { data } = props;
  const seoObject = (data && getSeoFromData(data)) || {};
  //const defaultDate = format(Date.now(), 'YYYY-MM-DDTHH:mm:ss+05:30');

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {seoObject.schema &&
        seoObject.schema.length > 0 &&
        seoObject.schema
          .filter(
            (item) => item && (item.length || (item.data && item.data.length)),
          )
          .map((item, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: item.data || item,
              }}
            />
          ))}
    </>
  );
}

MetaScripts.propTypes = {
  data: PropTypes.shape({}).isRequired,
};
