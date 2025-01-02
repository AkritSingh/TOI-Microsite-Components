import { TOI_LIVE_DOMAIN } from '../../../constants';

const getRedirectURL = (data, pathName = '', queryString = '') => {
  if (data) {
    const canonicalUrl = data?.seo?.canonical || '';
    let canonicalPathName = canonicalUrl.split('/').slice(3).join('/');
    if (!canonicalPathName.startsWith('/')) {
      canonicalPathName = `/${canonicalPathName}`;
    }
    if (!pathName.startsWith('/')) {
      pathName = `/${pathName}`;
    }
    if (
      canonicalPathName.toLowerCase() !== pathName.toLowerCase() &&
      !data.multipublish
    ) {
      return `${TOI_LIVE_DOMAIN}${pathName}${queryString}`;
    }
  }
  return undefined;
};

export default getRedirectURL;
