import { TOI_LIVE_DOMAIN, TOI_LIVE_MOBILE_DOMAIN } from './constants';

// eslint-disable-next-line import/prefer-default-export
export function isSingleDomainArticleshow(linkUrl) {
  let singleDomainArticleshow = false;
  singleDomainArticleshow =
    linkUrl &&
    linkUrl.includes('/articleshow/') &&
    (linkUrl.includes('/astrology/') ||
      linkUrl.includes('/education/') ||
      linkUrl.includes('/tv/') ||
      linkUrl.includes('/gadgets-news/') ||
      linkUrl.includes('/most-searched-products/') ||
      linkUrl.includes('/religion/'));

  const singleDomainVideohow =
    linkUrl &&
    (linkUrl.includes('/videoshow/') || linkUrl.includes('/videos/'));
  const singleDomainL2 =
    linkUrl &&
    (linkUrl.includes('/city/') ||
      linkUrl.includes('/education/') ||
      linkUrl.includes('/astrology/') ||
      linkUrl.includes('/religion/') ||
      linkUrl.includes('/gadgets-news/'));

  let singleDomainListing = false;
  singleDomainListing =
    linkUrl &&
    (linkUrl === '/' ||
      linkUrl === '/city' ||
      linkUrl === '/city?cs=t' ||
      linkUrl === `${TOI_LIVE_DOMAIN}/city` ||
      linkUrl === `${TOI_LIVE_MOBILE_DOMAIN}/city` ||
      linkUrl === `${TOI_LIVE_MOBILE_DOMAIN}/city?cs=t` ||
      linkUrl === '/sports' ||
      linkUrl === `${TOI_LIVE_MOBILE_DOMAIN}/sports` ||
      linkUrl === `${TOI_LIVE_DOMAIN}/sports` ||
      linkUrl === `/religion` ||
      linkUrl === `${TOI_LIVE_DOMAIN}/religion` ||
      linkUrl === `${TOI_LIVE_MOBILE_DOMAIN}/religion` ||
      linkUrl === `/education` ||
      linkUrl === `${TOI_LIVE_DOMAIN}/education` ||
      linkUrl === `${TOI_LIVE_MOBILE_DOMAIN}/education` ||
      linkUrl === `/astrology` ||
      linkUrl === `${TOI_LIVE_DOMAIN}/astrology` ||
      linkUrl === `${TOI_LIVE_MOBILE_DOMAIN}/astrology` ||
      linkUrl === `/gadgets-news` ||
      linkUrl === `${TOI_LIVE_DOMAIN}/gadgets-news` ||
      linkUrl === `${TOI_LIVE_MOBILE_DOMAIN}/gadgets-news` ||
      linkUrl === '/videos' ||
      linkUrl === `${TOI_LIVE_DOMAIN}/videos` ||
      linkUrl === `${TOI_LIVE_MOBILE_DOMAIN}/videos`);

  const singleDomainShorttakes = linkUrl && linkUrl.includes('/short-videos/');

  return (
    singleDomainArticleshow ||
    singleDomainListing ||
    singleDomainVideohow ||
    singleDomainL2 ||
    singleDomainShorttakes
  );
}
