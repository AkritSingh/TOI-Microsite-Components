import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import getComponent from './getComponent';
import withHydrationOnDemand from './withHydrationOnDemand';

function ServerComponentLoader({
  hydration,
  componentName,
  disableHydration,
  ...rest
}) {
  // #todo Ask webpack to load this component instead of loading script
  const loadJSBeforeHydration = useCallback(
    async () =>
      new Promise((resolve) => {
        const cmp = `${componentName}_PERF_LBH`;
        let script = document.getElementById(cmp);
        if (script) {
          resolve();
        }
        const src = window?.assets[cmp];
        if (!script) {
          script = document.createElement('script');
          script.src = src;
          script.id = cmp;
          document.body.appendChild(script);
        }
        script.addEventListener('load', () => {
          resolve();
        });
        script.addEventListener('error', (e) => {
          // This is done because if component JS is already loaded by webpack , Then we don't have its chunk
          // So we direclty call hydration
          resolve(e);
        });
      }),
    [componentName],
  );

  const Component = getComponent(componentName);

  if (!Component) {
    return null;
  }

  const hydrationOptions = hydration?.map((item = {}) => {
    if (item.on === 'delay') {
      return [item.on, item.config?.duration || 1000];
    }
    if (item.on === 'scroll') {
      return [item.on, () => document];
    }
    return item.on || '';
  });
  const LazyComponent = withHydrationOnDemand({
    on: hydrationOptions,
    onBefore: () => loadJSBeforeHydration(),
    disableHydration,
  })(Component);
  return <LazyComponent componentName={componentName} {...rest} />;
}

ServerComponentLoader.propTypes = {
  hydration: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.any)]),
  ).isRequired,
  componentName: PropTypes.string.isRequired,
  wrapperProps: PropTypes.shape({}),
  disableHydration: PropTypes.bool,
};
ServerComponentLoader.defaultProps = {
  wrapperProps: {},
  disableHydration: false,
};

export default ServerComponentLoader;
