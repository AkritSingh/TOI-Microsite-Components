// #todo need to sort the two constants files
export const JAVA_CLIENT_SIDE_FEED_DOMAIN = __PROD__
  ? 'https://global-feed.indiatimes.com'
  : 'https://nprelease.indiatimes.com';

export const JAVA_SERVER_SIDE_FEED_DOMAIN = __PROD__
  ? 'https://int-global-feed.indiatimes.com'
  : 'https://nprelease.indiatimes.com';

export const JARVIS_CLIENT_SIDE_FEED_DOMAIN = 'https://jarvis.indiatimes.com';
export const JARVIS_SERVER_SIDE_FEED_DOMAIN =
  'https://vsp1jarvispvt.indiatimes.com';
export const JARVIS_FEED_URI = '/v1/feeds';
export const JARVIS_DB_ENV_PARAM = __PROD__
  ? 'db_env=published'
  : 'db_env=drafts';
export const TOI_LIVE_DOMAIN = 'https://timesofindia.indiatimes.com';
export const TOI_S2S_LIVE_DOMAIN =
  'https://s2sorigintimesofindia.timesofindia.co.in';
export const TOI_S2S_LIVE_MOBILE_DOMAIN =
  'https://s2soriginspm.timesofindia.co.in';
export const TOI_LIVE_MOBILE_DOMAIN = 'https://m.timesofindia.com';
export const TOIPLUS_LIVE_MOBILE_DOMAIN = 'https://m.timesofindia.com/toi-plus';
export const GEOAPI_URL = 'https://geoapi.indiatimes.com/?cb=1';
export const JAVA_FEED_AS_URI =
  '/wufs/show/article?source=toi&dm=t&frmApp=false&client=toi';
export const TOI_EPAPER_URL_WEB = __PROD__
  ? 'https://epaper.indiatimes.com/timesepaper/publication-the-times-of-india,city-delhi.cms?redirectionSource=TOIWeb'
  : 'https://etdev8243.indiatimes.com/timesepaper/publication-the-times-of-india,city-delhi.cms?redirectionSource=TOIWeb';
export const CLMB_WEB_CID = '2658:3';
export const CLMB_MWEB_CID = '2658:39';
export const E_CLMB_WEB_CID = '65615:2608';
export const E_CLMB_MWEB_CID = '65615:2609';
export const dimensionMapping = {
  dimension1: 'journalistName',
  dimension2: 'optimizelyTOICheck',
  dimension3: 'articleId',
  dimension4: 'authorName',
  dimension5: 'agency',
  dimension6: 'contentType',
  dimension7: 'clientId',
  dimension8: 'section',
  dimension9: 'template',
  dimension10: 'primeStatus',
  dimension11: 'paytmWidget',
  dimension12: 'evergreenStory',
  dimension13: 'network',
  dimension14: 'hpv2WAP',
  dimension15: 'perpetualArticle',
  dimension16: 'city',
  dimension17: 'language',
  dimension18: 'toiPlusPlug',
  dimension19: 'loginSource',
  dimension20: 'featurePhone',
  dimension21: 'loginstatus',
  dimension22: 'userId',
  dimension23: 'covid19',
  dimension25: '__gaabtest',
  dimension33: 'planeName',
  dimension34: 'nudgeType',
  dimension35: 'subjectLine',
  dimension38: 'currencyCode',
  dimension50: 'orderId',
  dimension31: 'msid',
  dimension51: 'expiryTime',
  dimension52: 'graceExpiryTime',
  dimension53: 'purchaseType',
  dimension82: 'userCityFromGeo',
  dimension55: 'userState',
  dimension56: 'userCountryCode',
  dimension58: 'primeStory',
  dimension59: 'subsection',
  dimension60: 'storyNatureOfContent',
  dimension61: 'storyTopicTree',
  dimension62: 'platform',
  dimension63: 'deviceManufacturer',
  dimension64: 'deviceModel',
  dimension65: 'deviceCategory',
  dimension66: 'storyPublishedAt',
  dimension67: 'storyLastUpdatedAt',
  dimension68: 'storyAgency',
  dimension69: 'liveBlogProductName',
  dimension70: 'contentType',
  dimension71: 'onPlatformSource',
  dimension72: 'source',
  dimension73: 'signalEventType',
  dimension74: 'denmarkFolderId',
  dimension75: 'title',
  dimension76: 'storySection',
  dimension77: 'storySubSection',
  dimension78: 'storyTemplate',
  dimension79: 'osVersion',
  dimension80: 'osFamily',
  dimension81: 'userLoginStatus',
  dimension83: 'user_ptns_score',
  dimension84: 'user_ptns_algorithm_name',
  dimension85: 'cookie_ttl_second',
  dimension54: 'signals_category',
  dimension43: 'signals_destination',
};

export const TOI_ONE_LINK_JS =
  'https://onelinksmartscript.appsflyer.com/onelink-smart-script-latest.js';
// #todo check if onelink js is required or not
export const TOI_PROMISE_CALLBACK_SCRIPTS = [];
export const ACTIVITY_MAXCAP_MAP = 'allActivityConfig';
export const ACTIVITY_ACCRUE_MAP = 'achievedActConfig';
export const CD_TYPE_GA_AND_GRX = 'gaAndGrx';
export const PRC_FOR_FTU = 1; // 1 = Free Trial Active
export const DEAULT_PAID_POINTS_SUBSCRIPTION = 200;
export const LOGIN_MAPPED_ON_LIVE = false;
export const TIMES_PRIME_SAVING_API = __PROD__
  ? 'https://api.timesprime.com/prime/external/updateTOISavings'
  : 'https://test-ext.timesprime.com/prime/external/updateTOISavings';
export const TOI_SUBS_FETCH_PLANS_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/plan-manager/subscription/web/fetch?fv=1100'
    : 'https://stgsubs.timesofindia.com/plan-manager/subscription/web/fetch?fv=1100';
export const TOI_SUBS_FETCH_PLANS_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/plan-manager/subscription/mweb/fetch?fv=1100'
    : 'https://stgsubs.timesofindia.com/plan-manager/subscription/mweb/fetch?fv=1100';

export const YEAR_IN_DAYS = 365;
export const PAID = 'PAID';
export const TOI_PLUS = 'TOI_PLUS';
export const SLIKE_ADVIDEO_SECTIONS = [
  'ASTROLOGY',
  'BUSINESS',
  'SIDEBAR_LISTING',
  'MINITV',
  'ARTICLESHOW',
  'TOP-TENNIS-VIDEOS',
  'MINITV_STICKY',
];
export const ARTICLESHOW_VARS = {
  JARVIS_CLIENT: 'toi',
  JARVIS_TYPE: 'page_articleshow',
};

export function getSiteDomain(isMobile) {
  const isDev = !__PROD__;
  if (isMobile) {
    return isDev ? TOI_DEV_MOBILE_DOMAIN : TOI_LIVE_MOBILE_DOMAIN;
  }

  return isDev ? TOI_DEV_DOMAIN : TOI_LIVE_DOMAIN;
}

export function videoIframeTemplate() {
  return 'vod_player_react.cms';
}

export function miniTVIframeTemplate() {
  return 'minitv_v2.cms';
}

export const GOOGLE_WEBCACHE_DOMAIN = 'webcache.googleusercontent.com';
