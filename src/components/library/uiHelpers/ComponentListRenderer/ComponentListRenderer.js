/* eslint-disable import/no-extraneous-dependencies */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import compObjModifier from '../../templates/Microsite/compObjModifier';

import { useGlobalContext } from '../../contexts/GlobalContext';
import {
  getSchemaStyles,
  getSpacingStyles,
  // getBorderStyles,
} from '../../utils/getStyleObject';
import _get from 'lodash.get';

import ServerComponentLoader from '../../uiHelpers/ComponentLoaders/ServerComponentLoader';
import ClientComponentLoader from '../../uiHelpers/ComponentLoaders/ClientComponentLoader';
import s from './ComponentListRenderer.scss';

// eslint-disable-next-line react/display-name
function ComponentListRenderer(props) {
  useStyles(s);
  const isMobile = false;
  const sectionName = '';
  const { appInitialState } = useGlobalContext() || { isMobile: false };
  // const { sectionName = '' } = appInitialState;
  const {
    data = [],
    inserts,
    insertKey,
    uniqueKey,
    className,
    config,
    componentsMap,
    showFlags = {},
    pageData,
  } = props;
  const { spacing } = config || {};

  let typeSchemaClassNames = '';
  let spacingClassNames = '';

  if (spacing) {
    typeSchemaClassNames = getSchemaStyles(spacing, isMobile);
    spacingClassNames = getSpacingStyles(
      spacing,
      isMobile,
      undefined,
      spacing.layout,
    );
  }

  const getRenderComponent = (compObj, index) => {
    compObj = compObjModifier(compObj);
    const componentType = compObj.type || compObj.tn;
    const { config: compConfig = {} } = compObj;
    const { rendering = {}, styles = {}, globalClass = '' } = compConfig;
    const { serverSide, clientSide, enabledSections, showFlag } = rendering;

    // if component has defined enabled section , then component will apply only to enabled sections otherwise enable on all sections
    if (
      enabledSections &&
      enabledSections.length > 0 &&
      !enabledSections.includes(sectionName)
    ) {
      return null;
    }

    // if component has asked for flag validation and the flag value in the flags props in not true, do not render
    if (showFlag && !showFlags[showFlag.trim()]) {
      return null;
    }

    if (serverSide) {
      return (
        <ServerComponentLoader
          key={`${uniqueKey}_server_${compObj.type}_${index}`}
          componentName={compObj.type}
          {...serverSide}
          {...compObj}
        />
      );
    }
    if (clientSide) {
      return (
        <ClientComponentLoader
          key={`${uniqueKey}_client${compObj.type}_${index}`}
          componentName={compObj.type}
          styles={styles}
          globalClass={globalClass}
          {...clientSide}
          {...compObj}
        />
      );
    }
    if (
      componentsMap[componentType] &&
      typeof componentsMap[componentType] === 'function'
    ) {

      if (compObj.dataPath && compObj.dataKey) {
        compObj[compObj.dataKey] = _get(pageData, compObj.dataPath);
      }

      return componentsMap[componentType]({
        ...compObj,
        key: `${uniqueKey}_compmap_${compObj.type}_${index}`,
      });
    }
    return null;
  };

  const getBodyJsx = () =>
    data.map((compObj, index) => {
      // const { config } = compObj;

      const componentType = compObj.type || compObj.tn;
      // const key = `${compObj.type}_${uniqueKey}_${index}`;
      if (componentType === insertKey && inserts && inserts.length > 0) {
        const { pos } = compObj || {};
        const insertsToRender = inserts.filter(
          (cinfo) => _get(cinfo, 'config.rendering.insert.position') === pos,
        );
        if (insertsToRender.length > 0) {
          return insertsToRender.map((insert, i) =>
            getRenderComponent(insert, i),
          );
        }
        // return (
        //   <RenderInserts
        //     key={key}
        //     slotObj={compObj}
        //     inserts={inserts}
        //     componentsMap={componentsMap}
        //     getRenderComponent={getRenderComponent}
        //   />
        // );
      }
      return getRenderComponent(compObj, index);
    });

  return (
    <div
      className={`${className} ${typeSchemaClassNames} ${spacingClassNames}`}
    >
      {getBodyJsx()}
    </div>
  );
}

ComponentListRenderer.propTypes = {
  uniqueKey: PropTypes.string.isRequired,
  config: PropTypes.shape({
    spacing: PropTypes.shape({
      positions: PropTypes.shape({
        bottom: PropTypes.bool,
      }),
      layout: PropTypes.string,
    }),
  }),
  inserts: PropTypes.arrayOf(PropTypes.shape({})),
  insertKey: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  showFlags: PropTypes.shape({}),
  componentsMap: PropTypes.shape({}),
  className: PropTypes.string,
  pageData: PropTypes.shape({}),
};

ComponentListRenderer.defaultProps = {
  data: [],
  inserts: null,
  insertKey: 'insert',
  className: '',
  config: {},
  showFlags: {},
  componentsMap: {},
  pageData: {},
};

export default memo(ComponentListRenderer);
