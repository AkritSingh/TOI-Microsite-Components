export function Chartbeat(playerUtils, playerStrategy, playerConfig) {
  // let fn, api, bindEvents;
  const _addPlayerToConfig = function _addPlayerToConfig() {
    setTimeout(() => {
      const config = playerConfig;
      const _cbv = window._cbv || (window._cbv = []);
      _cbv.push(config);
    }, 0);
  };
  const bindEvents = function bindEvents() {
    if (playerUtils.checkGdprAndCall) {
      playerUtils.checkGdprAndCall(_addPlayerToConfig, null);
    }
  };
  const fn = {
    _init() {
      /****************************************************************************************************/

      /****************************************************************************************************/
      window._sf_async_config = window._sf_async_config || {};
      window._sf_async_config.uid = '10538';
      window._sf_async_config.domain = 'timesofindia.indiatimes.com';
      window._sf_async_config.autoDetect = false;
      fn._prepareData();
      bindEvents();
    },
    _prepareData() {
      window._cbv_strategies = window._cbv_strategies || [];
      window._cbv_strategies.push(playerStrategy);
    },
  };
  const api = {};
  fn._init();
  return api;
}

function getParentUrl() {
  let url = '';
  try {
    url = window.parent.location.href;
  } catch (e) {
    url = window.location.href;
  }

  return url;
}

export function loadiBeat(mainConfig) {
  const pageConfig = {
    channel: mainConfig.agency || 'timesofindia.indiatimes.com',
    action: 1,
    articleId: mainConfig.articleId || '',
    contentType: 2,
    location: 1,
    url: getParentUrl(),
    cat: mainConfig.navSecName,
    subcat: mainConfig.navSubSecName,
    contenttag: mainConfig.metaKeywords || '',
    catIds: mainConfig.navCatIds || '',
    articledt: mainConfig.articledt || '',
    author: '',
  };

  if (window.TimesApps.iBeat && window.TimesApps.iBeat.sendIBeatCall) {
    window.TimesApps.iBeat.sendIBeatCall(pageConfig);
  }
}

export default { loadiBeat, Chartbeat };
