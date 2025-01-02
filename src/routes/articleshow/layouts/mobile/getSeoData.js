import _get from 'lodash.get';

const getSeoData = (articleData) => {
  const seoObj = articleData ? _get(articleData, 'seo', {}) : {};

  const schemaObj = articleData ? _get(articleData, 'schema', []) : [];

  if (schemaObj && schemaObj.length > 0) {
    seoObj.schema = schemaObj;
  }

  seoObj.ogType = 'article';
  seoObj.article = true;
  // This is only for MSP articles and for rest []
  // seoObj.hreflang = getHrefLang();
  seoObj.hreflang = [];
  const agencyName = articleData && articleData.ag;
  seoObj.agencyName = agencyName;
  return seoObj;
};

export default getSeoData;
