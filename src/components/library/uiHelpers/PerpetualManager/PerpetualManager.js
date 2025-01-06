/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import PerpetualNext from '../../uiHelpers/PerpetualNext/PerpetualNext';
import PerpetualContainer from '../../uiHelpers/PerpetualContainer/PerpetualContainer';
import s from './PerpetualManager.scss';

function PerpetualManager(props) {
  const {
    ComponentToRender,
    initalData,
    perpetualLoadingStrategy,
    isPerpetualPersonalize,
    componentProps,
    perpetualPagesObj,
    loadPerpetualDataClientSideFn,
  } = props;

  useStyles(s);

  return (
    <div className={s.perpetualContainer}>
      {initalData && (
        <PerpetualContainer
          ComponentToRender={ComponentToRender}
          initalData={initalData}
          componentProps={{ ...componentProps, isLast: false }}
          perpetualLoadingStrategy={perpetualLoadingStrategy}
          posID={1}
        />
      )}
      <div data-translate-id="cw">
        <PerpetualNext
          perpetualPagesObj={perpetualPagesObj}
          perpetualLoadingStrategy={perpetualLoadingStrategy}
          ComponentToRender={ComponentToRender}
          personalization={isPerpetualPersonalize}
          componentProps={componentProps}
          loadPerpetualDataClientSideFn={loadPerpetualDataClientSideFn}
        />
      </div>
    </div>
  );
}

PerpetualManager.propTypes = {
  ComponentToRender: PropTypes.elementType,
  initalData: PropTypes.shape({}),
  perpetualPagesObj: PropTypes.arrayOf(PropTypes.shape({})),
  perpetualLoadingStrategy: PropTypes.shape({
    strategy: PropTypes.string,
    config: PropTypes.shape({}),
  }),
  isPerpetualPersonalize: PropTypes.bool,
  componentProps: PropTypes.shape({}),
  loadPerpetualDataClientSideFn: PropTypes.func,
};

PerpetualManager.defaultProps = {
  ComponentToRender: null,
  initalData: {},
  perpetualPagesObj: [],
  perpetualLoadingStrategy: {},
  isPerpetualPersonalize: false,
  componentProps: {},
  loadPerpetualDataClientSideFn: undefined,
};

export default PerpetualManager;
