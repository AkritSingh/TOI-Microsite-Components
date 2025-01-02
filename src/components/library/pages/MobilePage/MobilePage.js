/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { useGlobalContext } from 'components/library/contexts/GlobalContext';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import ServerComponentLoader from 'components/library/uiHelpers/ComponentLoaders/ServerComponentLoader';
import Login from 'components/library/organisms/Login';
import LoginContextProvider from 'components/library/contexts/LoginContext';
import AdsContextProvider from 'components/library/contexts/AdsContext';
import AdCaller from 'components/library/atoms/AdCaller/AdCaller';
// import ComponentListRenderer from 'components/library/uiHelpers/ComponentListRenderer/ComponentListRenderer';
// import Link from 'components/library/atoms/Link/Link';
// import getOpenInAppLink from 'utils/getOpenInAppLink';
import PageHeader from 'components/library/organisms/PageHeader/PageHeader';

// #todo check layout css
// eslint-disable-next-line css-modules/no-unused-class
import GAHandler from 'components/library/uiHelpers/GAHandler/GAHandler';
import s from './MobilePage.scss';

function MobilePage(props) {
  useStyles(s);
  const { appInitialState } = useGlobalContext();
  const { isFrmapp } = appInitialState;
  const { children, data } = props;
  const {
    header,
    footer = { title: 'This is a footer' },
    revenue,
    // beforeheader,
    // outOfPageComponents,
    // msid,
    // pageType,
    // isEtimes,
    articleData,
  } = data;

  // console.log('=============> Layout');
  // #TODO : generate One link URL for all templates - need to handle for other pages.
  // const { config } = outOfPageComponents;
  // const { openInApp } = config;
  // let appDeepLinkUrl = '';
  const { id } = articleData;

  if (footer.data) {
    footer.data.breadcrumb = { data: articleData.bc };
  }

  // if (!appDeepLinkUrl) {
  //   appDeepLinkUrl = getOpenInAppLink(pageType, navsubsecs, isEtimes, msid);
  // }

  // const openInAppProps = {
  //   ...openInApp,
  //   className: s.openInApp,
  //   to: appDeepLinkUrl,
  //   ga: openInApp.ga,
  // };

  return (
    <AdsContextProvider value={{ ads: revenue.ads, pageId: id, pagePosID: 1 }}>
      <GAHandler />
      <div>
        <AdCaller config={{ name: 'topBand' }} />
        {!isFrmapp && (
          <LoginContextProvider>
            <Login />
            <PageHeader {...header} />
          </LoginContextProvider>
        )}
        <AdCaller
          config={{ name: 'atf' }}
          adProps={{
            'data-resizer-target': 'cw',
          }}
        />

        {/* // POPup should not be a part of this div */}
        <div data-translate-id="cw" data-translate-page="1">
          {children}
          {/* hydrtion ko inview load karenge */}
          {/*#todo will move this to Articleshow  */}
          {!isFrmapp && (
            <ServerComponentLoader
              hydration={[
                {
                  on: 'visible',
                },
              ]}
              componentName="PageFooter"
              {...footer}
              wrapperProps={{ style: { minHeight: '400px' } }}
            />
          )}
        </div>

        {/* // POPup should declare her  */}

        <AdCaller config={{ name: 'bottomOverlay' }} />

        <div id="portal-root" />
      </div>
    </AdsContextProvider>
  );
}

MobilePage.propTypes = {
  children: PropTypes.element.isRequired,
  // initialState: PropTypes.shape({}),
  data: PropTypes.shape({
    header: PropTypes.shape({}),
    footer: PropTypes.shape({}),
    revenue: PropTypes.shape({
      ads: PropTypes.shape({
        layout: PropTypes.shape({}),
      }),
    }),
    // beforeheader: PropTypes.shape({
    //   components: PropTypes.arrayOf(PropTypes.shape()),
    //   spacing: PropTypes.shape({}),
    // }),
    afterHeader: PropTypes.shape({
      components: PropTypes.arrayOf(PropTypes.shape()),
      spacing: PropTypes.shape({}),
    }),
    outOfPageComponents: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.shape()),
      config: PropTypes.shape({}),
    }),
  }),
};

MobilePage.defaultProps = {
  data: null,

  // initialState: {},
};

export default MobilePage;
