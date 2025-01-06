import React from 'react';
import PropTypes from 'prop-types';

function NavigationSchema(props) {
  const { navObject } = props;
  if (!navObject) return false;

  return (
    <>
      {Object.keys(navObject).map((navKey, index) => {
        const sectionObject = navObject[navKey];
        if (sectionObject && typeof sectionObject.link === 'string') {
          return (
            <React.Fragment key={index}>
              <meta itemProp="name" content={sectionObject.label} />
              <meta itemProp="url" content={sectionObject.link} />
            </React.Fragment>
          );
        }
        return null;
      })}
    </>
  );
}
NavigationSchema.propTypes = {
  navObject: PropTypes.shape({}).isRequired,
};
export default NavigationSchema;
