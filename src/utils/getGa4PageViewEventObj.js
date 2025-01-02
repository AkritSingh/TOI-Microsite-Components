import getDateDiffFromNow from 'utils/getDateDiffFromNow';
import {
  getKeyValsFromObjArr,
  getLowerCaseString,
} from 'utils/getKeyValsFromObjArr';
import getSection from 'utils/getSection';

const getGa4PageViewEventObj = (pageData = {}, params = {}) => {
  const { ag, id, metaInfo, dl, authors, navsubsecs } = pageData;
  const { pageTemplate, isMobile, perpetual, pagination } = params;
  const { subsecname1 = '', subsecnameseo2 = '' } = getSection(navsubsecs);
  const sectionName = subsecname1.toLowerCase();
  const subSectionName = subsecnameseo2.toLowerCase();
  const notAvailable = 'N/A';

  const ga4PageViewParams = {
    event: 'page_view',
    page_template: pageTemplate,
    agency: getLowerCaseString(ag) || notAvailable,
    section: getLowerCaseString(sectionName) || notAvailable,
    subsection: getLowerCaseString(subSectionName) || notAvailable,
    msid: id,
    keywords: metaInfo.kws,
    browsing_client: 'web',
    browsing_platform: isMobile ? 'mweb' : 'web',
    business_property: 'toi',
    page_stack: 'react',
    prime_content: 'false',
    perpetual,
    pagination,
    days_since_created: getDateDiffFromNow(dl),
    authors:
      getLowerCaseString(getKeyValsFromObjArr(authors, 'name', ',')) ||
      notAvailable,
    page_version: 'v1',
  };
  return ga4PageViewParams;
};

export default getGa4PageViewEventObj;
