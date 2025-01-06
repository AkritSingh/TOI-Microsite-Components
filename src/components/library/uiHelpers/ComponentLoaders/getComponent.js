/* eslint-disable import/no-extraneous-dependencies */
import { lazy } from 'react';

// getLazyComponentImport is the import when hydration and chunk loading both need to be delayed
// webpackChunkName should be consistent with `${componentName}_PERF_LBH`
const getLazyComponentImport = (componentName) => {
  if (!componentName) return null;
  switch (componentName) {
    case 'banner_v3':
      return import(
        /* webpackChunkName: 'banner_v3_PERF_LBH' */ '../../organisms/Banner/Banner'
      );
    case 'about_v3':
      return import(
        /* webpackChunkName: 'about_v3_PERF_LBH' */ '../../organisms/About/About'
      );
    default:
      return import(/* webpackChunkName: 'Error_PERF_LBH' */ './Error');
  }
};

const getComponent = (componentName) => {
  if (!componentName) return null;
  return lazy(() => getLazyComponentImport(componentName));
};

export default getComponent;
