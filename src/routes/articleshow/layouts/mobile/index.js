/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/no-danger */
import React from 'react';
import getSection from 'utils/getSection';
import getGa4PageViewEventObj from 'utils/getGa4PageViewEventObj';
import GlobalContextProvider from 'components/library/contexts/GlobalContext';
import getLeadImageSrc from 'routes/articleshow/utils/getLeadImageSrc';
import getPageLoadArray from 'utils/getPageLoadArray';
import getUpdatedSectionData from 'utils/getUpdatedSectionData';
import getASFeedURL from 'routes/articleshow/utils/getASFeedURL';
import getJarvisASFeedURL from 'routes/articleshow/utils/getJarvisASFeedURL';
import getRedirectURL from 'routes/articleshow/utils/getRedirectURL';
import ArticleshowRoute from './ArticleshowRoute';
import getSeoData from './getSeoData';

const pageName = 'articleshow_mobile';

async function action(context, params, initialState) {
  const dataPromiseArray = [];
  const isServer = typeof window === 'undefined';
  let leadImageSrc;
  let status = 200;
  const { pathname, query = {} } = context;

  const { msid } = params;
  let sectionName;
  let ga4PageViewParams;
  const routeData = {
    sections: {},
    articles: {},
  };
  let sectionData;
  let articleData;
  let pageLoadAdsArr = [];
  const imageInfo = [];
  const pageType = 'ARTICLESHOW';
  let redirectURL;

  try {
    if (isServer) {
      const JavaFeedURL = getASFeedURL({
        msid,
        isMobile: initialState.isMobile,
        isUpcache: initialState.isUpcache,
      });

      dataPromiseArray.push(fetch(JavaFeedURL).then((res) => res.json()));

      const JarvisFeedURL = getJarvisASFeedURL({
        jarvisClient: 'toi',
        jarvisType: 'page_articleshow',
        isMobile: initialState.isMobile,
        isPrimeUser: false,
        isUpcache: initialState.isUpcache,
        sectionL1: 'astrology',
        // sectionL2,
        // sectionL3,
      });
      // console.log('JarvisFeedURL', JarvisFeedURL);
      dataPromiseArray.push(fetch(JarvisFeedURL).then((res) => res.json()));
      const promiseData = await Promise.all(dataPromiseArray);
      articleData = promiseData[0];
      sectionData = promiseData[1];
      if (
        articleData &&
        sectionData &&
        typeof articleData === 'object' &&
        typeof sectionData === 'object'
      ) {
        delete articleData.fgt;
        const { navsubsecs } = articleData;
        const { subsecname1 = '' } = getSection(navsubsecs);
        sectionName = subsecname1.toLowerCase();
        getUpdatedSectionData(sectionData, sectionName);
        routeData.sections[`${sectionName}`] = sectionData;
        routeData.articles[`${msid}`] = articleData;
        initialState.seoTitle = articleData?.seo?.title;
        initialState.sectionName = sectionName;
        initialState.pageType = pageType;
        initialState.isPersonalizationEnabled =
          sectionData.isPersonalizationEnabled;
        pageLoadAdsArr = getPageLoadArray(sectionData, msid); // only for setting in HTml

        ga4PageViewParams = getGa4PageViewEventObj(articleData, {
          pageTemplate: 'articleshow',
          isMobile: initialState.isMobile,
          perpetual: 'true',
          pagination: 'p0',
        });

        let finalQueryString = '';
        if (Object.keys(query).length > 0) {
          const queryString = new URLSearchParams();
          Object.keys(query).forEach((k) =>
            queryString.append(k, context.query[k]),
          );
          finalQueryString = queryString.toString();
          finalQueryString = `?${finalQueryString}`;
        }
        redirectURL = getRedirectURL(articleData, pathname, finalQueryString);
      } else {
        status = 404;
      }
    } else {
      // client side
      const { sections = {}, articles = {} } = window.App.routeData;
      articleData = articles[`${msid}`];
      const { navsubsecs } = articleData;
      const { subsecname1 = '' } = getSection(navsubsecs);
      sectionName = subsecname1.toLowerCase();
      sectionData = sections[`${sectionName}`];

      if (articleData && articleData.seo) {
        redirectURL = getRedirectURL(
          articleData,
          window.location.pathname,
          window.location.search,
        );
        if (redirectURL) {
          window.location.href = redirectURL;
        }
      }
    }

    if (redirectURL) {
      status = 301;
    }
    // common logic
    const { images = [], videos = [] } = articleData;
    leadImageSrc = getLeadImageSrc(
      images[0],
      videos[0],
      articleData.ag === 'Mediawire',
    );
    if (leadImageSrc) {
      imageInfo.push(leadImageSrc);
    }
  } catch (err) {
    console.log('index mobile AS ', err);
  }
  // component List server side lazy load
  // #todo Need to refactor
  const getComponent = () => (
    <GlobalContextProvider
      value={{
        appInitialState: initialState,
      }}
    >
      <ArticleshowRoute
        data={{
          ...sectionData,
          articleData,
          pageType,
        }}
      />
    </GlobalContextProvider>
  );

  const isMultipublish = () => {
    if (articleData && articleData.multipublish) {
      return true;
    }
    return false;
  };

  return {
    criticalChunks: [`${pageName}`],
    title: '',
    maxAge: sectionData?.pageMaxAge,
    status,
    imageInfo, // for preload lead image
    criticalCSSComponents: sectionData?.criticalCSSComponents || [],
    component: getComponent(),
    seoData: getSeoData(articleData),
    redirectURL,
    isMaxImagePreview: true,
    isMaxVideoPreview: false,
    multipublish: isMultipublish(),
    baseScriptTimeout: 6000,
    routeData,
    pageLoadAdsArr,
    coreWebVitalPage: 'v1',
    enableWebVitalsTracking: sectionName === 'astrology',
    edgeCacheTag: msid,
    // isNoThirdPartyArticle: msid === '107426082', //#todo for testing purpose , will remove this once done
    ga4PageViewParams,
    isPersonalizationEnabled: initialState.isPersonalizationEnabled,
  };
}

export default action;
