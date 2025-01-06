import analyticsWrapper from '../utils/analyticsWrapper';
import getGa4PageViewEventObj from '../utils/getGa4PageViewEventObj';

const fireEventsOnPerpetualPageLoad = (url, pageData, params) => {
  try {
    // analyticsWrapper('ga', 'set', 'dimension150', 'perpetual');
    // analyticsWrapper('ga', 'send', 'pageview', url);
    const ga4PageViewObj = getGa4PageViewEventObj(pageData, params);
    analyticsWrapper('ga4', ga4PageViewObj);
    if (
      typeof window !== 'undefined' &&
      typeof window.perpetualAdRefresh === 'function'
    ) {
      window.perpetualAdRefresh();
    }
    if (window.persObj && typeof window.persObj.setObserver === 'function') {
      window.persObj.setObserver();
    }
  } catch (err) {
    console.log(err);
  }
};

export default fireEventsOnPerpetualPageLoad;
