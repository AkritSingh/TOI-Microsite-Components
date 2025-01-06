/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PerpetualContainer from '../../uiHelpers/PerpetualContainer/PerpetualContainer';

function PerpetualNext(props) {
  const {
    ComponentToRender,
    perpetualPagesObj = [],
    perpetualLoadingStrategy,
    // allowForcedFetching,
    componentProps,
    loadPerpetualDataClientSideFn,
    // perpetualDataFn,
    // dataUrl ,dataPromiseFn
  } = props;

  const [
    clientSideFetchedPerpetualPagesData,
    setClientSideFetchedPerpetualPagesData,
  ] = useState(undefined);
  const perpetualData =
    clientSideFetchedPerpetualPagesData || perpetualPagesObj || [];

  const perpArticlesCount = perpetualData.length;

  useEffect(() => {
    if (loadPerpetualDataClientSideFn) {
      loadPerpetualDataClientSideFn().then((data) =>
        setClientSideFetchedPerpetualPagesData(data),
      );
    }
  }, [loadPerpetualDataClientSideFn]);

  // console.log('=============> PerpetualNext');

  const perpetualjsx = perpetualData.map((info, index) => (
    <PerpetualContainer
      ComponentToRender={ComponentToRender}
      perpetualLoadingStrategy={perpetualLoadingStrategy}
      dataFetchingInfo={info}
      componentProps={{
        ...componentProps,
        isLast: perpArticlesCount === index + 1,
      }}
      posID={index + 2}
      key={`${info.msid}_${index}`}

      // allowForcedFetching={allowForcedFetching}
    />
  ));
  return <> {perpetualjsx} </>;
}

PerpetualNext.propTypes = {
  ComponentToRender: PropTypes.elementType,
  perpetualPagesObj: PropTypes.arrayOf(PropTypes.shape({})),
  perpetualLoadingStrategy: PropTypes.shape({
    strategy: PropTypes.string,
    config: PropTypes.shape({}),
  }),
  componentProps: PropTypes.shape({}),
  loadPerpetualDataClientSideFn: PropTypes.func,
};

PerpetualNext.defaultProps = {
  ComponentToRender: '',
  perpetualPagesObj: [],
  perpetualLoadingStrategy: {},
  // allowForcedFetching: false,
  componentProps: {},
  loadPerpetualDataClientSideFn: undefined,
};

export default PerpetualNext;
