/* eslint-disable import/prefer-default-export */
import * as LOGIN_CONST from '../organisms/Login/Constants';
import { PRC_FOR_FTU, CD_TYPE_GA_AND_GRX } from '../constants/index';
import { getCookie } from './cookies';
import analyticsWrapper from './analyticsWrapper';

export function isPrimeUser() {
  const activePrimeUserPrcArr = LOGIN_CONST.ACTIVE_PRIME_USER_PRC_ARR;
  const prc = getCookie('prc');
  let prcVal = -1;
  if (prc && prc.length > 0) {
    prcVal = parseInt(prc.split('#')[0], 10);
  }
  if (
    typeof prcVal !== 'undefined' &&
    activePrimeUserPrcArr.indexOf(prcVal) > -1
  ) {
    return true;
  }
  return false;
}
export function reloadWrtPrimeUnlock() {
  if (__PROD__) {
    window.location.reload();
  } else {
    let url = window.location.href;
    if (!(url.indexOf('frmprime=yes') > -1)) {
      if (url.indexOf('?') > -1) {
        url += '&frmprime=yes';
      } else {
        url += '?frmprime=yes';
      }

      window.location.href = url;
    }
  }
}
export function isFTU() {
  const prc = getCookie('prc');
  let _isFTU = false;
  if (prc && prc.length > 0) {
    const prcVal = parseInt(prc.split('#')[0], 10);
    _isFTU = prcVal === PRC_FOR_FTU;
  }
  return _isFTU;
}

export function fireCustomDimension(
  value,
  dimension = 'dimension34',
  type = CD_TYPE_GA_AND_GRX, // by default 'gaAndGrx' will be fired
) {
  analyticsWrapper(type, 'set', dimension, value);
}

export function getMsidFromPath(path) {
  let msid = '';
  if (typeof path === 'string' && path.length > 0) {
    const articlePathSplit = path.split('/');
    if (
      articlePathSplit &&
      articlePathSplit.length > 0 &&
      articlePathSplit[articlePathSplit.length - 1].includes('.cms')
    ) {
      msid = articlePathSplit[articlePathSplit.length - 1].split('.')[0];
    }
  }

  return msid;
}

export function getCustomClassesForPayload(classes, styleObj) {
  //Claases is string and checking length before processing
  if (classes.length) {
    const newClass = classes.replace(/  +/g, ' ');
    const classArr = newClass.split(' ');
    for (let i = 0; i < classArr.length; i += 1) {
      classArr[i] = styleObj[classArr[i]];
    }
    return classArr.join(' ');
  }
  return '';
}

export function isTablet() {
  return (function returnAgent(agent) {
    return /(?:ipad|tab)/i.test(agent);
  })(navigator.userAgent || navigator.vendor || window.opera);
}