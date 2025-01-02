/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// libary modules
import Articleshow from 'components/library/templates/ArticleShow/ArticleShow';
import PerpetualManager from 'components/library/uiHelpers/PerpetualManager/PerpetualManager';
import ComponentListRenderer from 'components/library/uiHelpers/ComponentListRenderer/ComponentListRenderer';
import { useGlobalContext } from 'components/library/contexts/GlobalContext';
import getASFeedURL from 'routes/articleshow/utils/getASFeedURL';
import OpenInApp from 'components/library/molecules/OpenInApp/OpenInApp';

import MobilePage from 'components/library/pages/MobilePage/MobilePage';
import ErrorBoundary from 'components/library/uiHelpers/ErrorBoundary';

function ArticleshowRoute(props) {
  const { data } = props;
  const { articleData, outOfPageComponents, pageType } = data; // afterBody, bodyInserts, afterheader, ads
  const { nextLinks } = articleData;
  const { appInitialState = {} } = useGlobalContext();
  const { isMobile } = appInitialState;

  const getDefaultPerpetualArticles = (links) =>
    links.map((link) => ({
      dataUrl: getASFeedURL({
        msid: link.msid,
        isMobile,
      }),
      msid: link.msid,
    }));

  const componentsMap = useMemo(
    () => ({
      components_molecules_open_in_app: ({ config }) => (
        <OpenInApp config={config} data={articleData} pageType={pageType} />
      ),
    }),
    [articleData, pageType],
  );

  //  ** get isPersonalizationEnabled from appInitialState
  // const getDataForPerpetualArticles = () =>
  //   new Promise((resolve) => {
  //     if (isPersonalizationEnabled) {
  //       if (typeof window !== 'undefined') {
  //         resolve(getDefaultPerpetualArticles(nextLinks)); // will fetch api
  //       }
  //       resolve([]); // server side returning nothing
  //     }
  //     resolve([]);
  //   });

  return (
    <ErrorBoundary fallback={<div>error......</div>}>
      <MobilePage data={data}>
        <PerpetualManager
          ComponentToRender={Articleshow}
          initalData={data} // here data contains java feed data +  section data
          componentProps={{ pageTemplate: 'articleshow' }}
          perpetualLoadingStrategy={{
            strategy: 'inview',
            config: {
              rootMargin: '80% 0px 200% 0px', // 2 viewport
            },
          }}
          perpetualPagesObj={getDefaultPerpetualArticles(nextLinks)}
          // perpetualArticlesObj={
          //   !isPersonalizationEnabled
          //     ? getDefaultPerpetualArticles(nextLinks)
          //     : undefined
          // }
          // loadPerpetualDataClientSideFn={
          //   isPersonalizationEnabled ? getDataForPerpetualArticles : undefined
          // }
        />
      </MobilePage>
      <ComponentListRenderer
        componentsMap={componentsMap}
        uniqueKey="outOfPageComponents"
        {...outOfPageComponents}
      />
    </ErrorBoundary>
  );
}

ArticleshowRoute.propTypes = {
  data: PropTypes.shape({
    header: PropTypes.shape({}),
    articleData: PropTypes.shape({
      nextLinks: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    pageType: PropTypes.string,
    outOfPageComponents: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.shape()),
      config: PropTypes.shape({}),
    }),
  }),
};

ArticleshowRoute.defaultProps = {
  data: null,
};

export default ArticleshowRoute;
