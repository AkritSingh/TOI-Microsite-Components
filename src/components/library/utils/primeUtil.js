// import format from 'date-fns/format';
// import { fetchAllActivitiesMapping } from 'modules/WithTimesPoint/config';
import { loadJssoCrossWalk } from '../organisms/Login/LoadJssoCrossWalk';
import prcNames from '../constants/prcNames.json';
import { primeConfig } from '../organisms/Login/utils';
import {
  // DEAULT_PAID_POINTS_SUBSCRIPTION,
  TIMES_PRIME_SAVING_API,
  TOI_SUBS_FETCH_PLANS_MWEB,
  TOI_SUBS_FETCH_PLANS_WEB,
  YEAR_IN_DAYS,
  PAID,
  TOI_PLUS,
} from '../constants/index';
import { getCookie } from './cookies';
import makeRequest from './makeRequest';
import {
  // isFTU,
  // isPrimeUser,
  fireCustomDimension,
  getMsidFromPath,
} from './common';

export function getPrcCookieValue() {
  const cookie_prc = getCookie('prc');
  if (cookie_prc) {
    return parseInt(cookie_prc.split('#')[0], 10);
  }
  return 0;
}
export function getPayPerArticlesMsids(otpsArr, type) {
  let msids;
  if (Array.isArray(otpsArr) && otpsArr.length > 0) {
    otpsArr.forEach((obj) => {
      if (type === obj.source) {
        msids = obj.msids;
      }
    });
  }
  return msids;
}

export function getUserAccessPayload() {
  const userAccessPayload = {};
  if (typeof window !== 'undefined') {
    const primeDataKey = `prime_${getCookie('prc')}`;
    userAccessPayload.accessType =
      sessionStorage.getItem(primeDataKey) &&
      JSON.parse(sessionStorage.getItem(primeDataKey))?.accessType;
    userAccessPayload.source =
      sessionStorage.getItem(primeDataKey) &&
      JSON.parse(sessionStorage.getItem(primeDataKey))?.userType;
    userAccessPayload.planStatus =
      sessionStorage.getItem(primeDataKey) &&
      JSON.parse(sessionStorage.getItem(primeDataKey))?.planStatus;
  }
  return userAccessPayload;
}

export const isStoryPageNewVariant = () => {
  if (typeof window !== 'undefined') {
    // const view = getQueryParams('view', { href: window.location.href });
    if (window.newStoryPageExp === '1') {
      return false;
    }
    return true;
  }
  return true;
};

export function isPrcNotSet(prc) {
  /* Handling for undefined and Zero prc value - if prc is not set - return true*/
  return !prc;
}

export function isSubscriptionExpired(prc) {
  return !!primeConfig.subscriptionExpiredStatus[prc];
}

export function getSubscriptionStatus(prc) {
  return (
    primeConfig.subscriptionExpiredStatus[prc] &&
    primeConfig.subscriptionExpiredStatus[prc].status
  );
}

export function getPrimeBlockerConfig(prc) {
  return (
    primeConfig.subscriptionExpiredStatus[prc] ||
    primeConfig.notPrimeStatus[prc] ||
    {}
  );
}

export function getCtaFormType(prc) {
  const status =
    primeConfig.subscriptionExpiredStatus[prc] ||
    primeConfig.notPrimeStatus[prc] ||
    {};

  return status.ctaFormType || '';
}
export function isPrimeNotActive(prc) {
  if (
    typeof window === 'object' &&
    window.localStorage &&
    localStorage.getItem('testPrime') === '1'
  ) {
    return true;
  }
  return primeConfig.notPrimeStatus[prc] || isSubscriptionExpired(prc);
}
export function shouldShowVideoBlocker(prc) {
  if (
    typeof window !== 'undefined' &&
    window.localStorage &&
    localStorage.getItem('testPrime') === '1'
  ) {
    return true;
  }
  return primeConfig.notPrimeStatus[prc] || isSubscriptionExpired(prc);
}
const checkForSSOInSavingUserObjAndUpdate = (
  obj,
  forceExhaustCount = false,
) => {
  const { ssoId, ticketId } = obj;
  const usersSavingData =
    localStorage.getItem('usersSavingData') &&
    localStorage.getItem('usersSavingData') !== null &&
    JSON.parse(localStorage.getItem('usersSavingData'));

  if (
    usersSavingData &&
    Object.keys(usersSavingData).length > 0 &&
    usersSavingData[ssoId] &&
    !forceExhaustCount
  ) {
    usersSavingData[ssoId].ticketId = ticketId;
    usersSavingData[ssoId].ssoId = ssoId;

    if (obj.articleCount) {
      usersSavingData[ssoId].articleCount = obj.articleCount;
    }
    if (obj.plusArticleCount) {
      usersSavingData[ssoId].plusArticleCount = obj.plusArticleCount;
    }
    usersSavingData[ssoId].ticketId = ticketId;
    localStorage.setItem('usersSavingData', JSON.stringify(usersSavingData));
    return usersSavingData[ssoId];
  }
  const singleUserSavingData = usersSavingData || {};

  singleUserSavingData[ssoId] = {
    ssoId,
    ticketId,
    articleCount: 0,
    plusArticleCount: 0,
    stored_at: new Date(),
  };
  localStorage.setItem('usersSavingData', JSON.stringify(singleUserSavingData));
  return null;
};
export const checkTimesPrimeAndSaveData = (primeData) => {
  const ssoId = getCookie('ssoid');
  const ticketId =
    getCookie('TicketId') || getCookie('Ticketid') || getCookie('ticketId');
  if (window.localStorage && primeData?.accessType === 'TIMESPRIME') {
    // create saving users object key value pair  [ssoid] : {};
    checkForSSOInSavingUserObjAndUpdate({ ssoId, ticketId });
  }
};

export function fetchUserSubscriptionStatusFromApi(prcData = null) {
  return new Promise((resolve) => {
    const prc = getCookie('prc');
    const primeFromCookie = JSON.parse(sessionStorage.getItem(`prime_${prc}`));
    let planName = '';
    const ssoId = getCookie('ssoid');
    const ticketId =
      getCookie('TicketId') || getCookie('Ticketid') || getCookie('ticketId');
    if (ssoId && ticketId) {
      if (prcData) {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          if (!primeFromCookie) {
            sessionStorage.setItem(
              `prime_${prc}`,
              JSON.stringify({
                endDate: prcData.endDate,
                endDatems: prcData.endDatems,
                mobile: prcData.mobile,
                cancelledDate: prcData.cancelledDate,
                cancelledDatems: prcData.cancelledDatems,
                inGracePeriod: prcData.inGracePeriod,
                inPreExpiredPeriod: prcData.displayRenewNudge,
                paidstories: getPayPerArticlesMsids(prcData.otps, 'others'),
                userType: prcData.source,
                planStatus: prcData.planStatus,
                paidCredstories: getPayPerArticlesMsids(prcData.otps, 'cred'), // to do cred
                credData: {
                  credBalance: prcData.credBalance,
                  credLimit: prcData.credLimit,
                  credUnlockDate: prcData.credUnlockDate,
                  credUnlockDatems: prcData.credUnlockDatems,
                },
                accessType: prcData.accessType,
              }),
            );
          }
          if (
            prc &&
            prcNames[prcData.accessType] &&
            prcNames[prcData.accessType][prc[0]]
          ) {
            planName = prcNames[prcData.accessType][prc[0]];
            sessionStorage.setItem(
              `planName`,
              prcNames[prcData.accessType][prc[0]],
            );
            localStorage.setItem(
              `planName`,
              prcNames[prcData.accessType][prc[0]],
            );
          }
          if (prcData.otps?.length > 0) {
            sessionStorage.setItem('paidstories', [
              getPayPerArticlesMsids(prcData.otps, 'others'),
            ]);
          }
          sessionStorage.setItem('paidCredstories', [
            getPayPerArticlesMsids(prcData.otps, 'cred'),
          ]); // to do cred

          if (prcData.inGracePeriod || prcData.displayRenewNudge) {
            fireCustomDimension(planName, 'dimension33');
          }
          if (prcData.source) {
            fireCustomDimension(prcData.source, 'dimension58');
          }
          if (prcData.inGracePeriod) {
            fireCustomDimension('5_grace', 'dimension10');
          }
          sessionStorage.setItem('inGracePeriod', prcData.inGracePeriod);
          sessionStorage.setItem(
            'displayRenewNudge',
            prcData.displayRenewNudge,
          );

          if (prcData.mobile) {
            sessionStorage.setItem('userPhone', prcData.mobile);
          }
        }
        checkTimesPrimeAndSaveData(prcData); // we will use this for posting data to saving api

        resolve({
          data: {
            endDate: prcData.endDate,
            timestamp: prcData.endDatems,
            mobile: prcData.mobile,
            cancelDate: prcData.cancelledDate,
            cancelTimeStamp: prcData.cancelledDatems,
            inGracePeriod: prcData.inGracePeriod,
            inPreExpiredPeriod: prcData.displayRenewNudge,
            planStatus: prcData.planStatus,
            otps: getPayPerArticlesMsids(prcData.otps, 'others'),
            credOtps: getPayPerArticlesMsids(prcData.otps, 'cred'),
            userType: prcData.source,
            credData: {
              credBalance: prcData.credBalance,
              credLimit: prcData.credLimit,
              credUnlockDate: prcData.credUnlockDate,
              credUnlockDatems: prcData.credUnlockDatems,
            },
            accessType: prcData.accessType,
          },
        });
      } else if (
        typeof window !== 'undefined' &&
        window.sessionStorage &&
        primeFromCookie
      ) {
        if (
          (sessionStorage.getItem('inGracePeriod') === 'true' ||
            sessionStorage.getItem('displayRenewNudge') === 'true') &&
          sessionStorage.getItem('planName')
        ) {
          fireCustomDimension(
            sessionStorage.getItem('planName'),
            'dimension33',
          );
        }
        if (sessionStorage.getItem('inGracePeriod') === 'true') {
          fireCustomDimension('5_grace', 'dimension10');
        }
        if (primeFromCookie && primeFromCookie.userType) {
          fireCustomDimension(primeFromCookie.userType, 'dimension58');
        }
        const msid = sessionStorage.getItem('paidstories');
        checkTimesPrimeAndSaveData(primeFromCookie);
        resolve({
          data: {
            endDate: primeFromCookie?.endDate,
            mobile: primeFromCookie?.mobile,
            timestamp: primeFromCookie?.endDatems,
            cancelDate: primeFromCookie?.cancelledDate,
            cancelTimeStamp: primeFromCookie?.cancelledDatems,
            inGracePeriod: primeFromCookie?.inGracePeriod,
            inPreExpiredPeriod: primeFromCookie?.inPreExpiredPeriod,
            userType: primeFromCookie?.userType,
            planStatus: primeFromCookie?.planStatus,
            otps: msid,
            credOtps: primeFromCookie?.credOtps,
            credData: primeFromCookie?.credData,
            accessType: primeFromCookie?.accessType,
          },
        });
      } else {
        resolve({
          data: {},
        });
      }
    } else {
      resolve({
        data: {},
      });
    }
  });
}

export function getUserTimesPointByCode(allActivity, code) {
  let points = 0;
  if (allActivity.length > 0) {
    const ActivityArr = allActivity.filter((obj) => obj.code === code);
    if (ActivityArr && ActivityArr.length > 0) {
      points = ActivityArr[0].assign_points;
    }
  }
  return points;
}

// export function getTimesPointActivityCode(prcValue, isMobile) {
//   let code;
//   const AllActivitiesMapping = fetchAllActivitiesMapping(isMobile);
//   if (isPrcNotSet(prcValue)) {
//     code = AllActivitiesMapping.prime_free_trial;
//   } else if (isFTU(prcValue) || !isPrimeUser()) {
//     code = AllActivitiesMapping.prime_paid_subscription;
//   }
//   return code;
// }

// export function getUserTimesPointByPRC(isMobile, allActivity, prc) {
//   const code = getTimesPointActivityCode(prc, isMobile);
//   let points = 0;
//   if (code) {
//     points = getUserTimesPointByCode(allActivity, code);
//   }
//   return points;
// }
// export function getUserTimesPaidPoints(
//   isMobile,
//   allActivity,
//   defaultTimesPointsFromFeed,
// ) {
//   const AllActivitiesMapping = fetchAllActivitiesMapping(isMobile);
//   const code = AllActivitiesMapping.prime_paid_subscription;
//   let points = 0;
//   if (code) {
//     points = getUserTimesPointByCode(allActivity, code);
//   }
//   const defaultTimesPoints =
//     defaultTimesPointsFromFeed || DEAULT_PAID_POINTS_SUBSCRIPTION;
//   return points || defaultTimesPoints;
// }

export function getGeoCountry() {
  let geoCountry = '';
  if (typeof window !== 'undefined') {
    const geoCountryCookie = getCookie('geo_country');
    geoCountry =
      (window.geoinfo && window.geoinfo.CountryCode) || geoCountryCookie;
  }
  return geoCountry;
}

export function getGeoRegion() {
  let geoCountry = '';
  if (typeof window !== 'undefined') {
    const geoRegionCookie = getCookie('geo_region');
    geoCountry =
      (window.geoinfo && window.geoinfo.region_code) || geoRegionCookie;
  }
  return geoCountry;
}

export const checkGracePeriod = async (prcData) => {
  const data = await fetchUserSubscriptionStatusFromApi(prcData);
  return data?.data?.inGracePeriod;
};

export const getEndDate = async (prcData) => {
  const data = await fetchUserSubscriptionStatusFromApi(prcData);
  return data?.data?.timestamp;
};

export const checkNewUser = async (prcData) => {
  const data = await fetchUserSubscriptionStatusFromApi(prcData);
  return data?.data?.userType;
};

// export const getGraceFormattedTime = async (prcData) => {
//   const data = await fetchUserSubscriptionStatusFromApi(prcData);
//   const endDate = data?.data?.timestamp;
//   return format(new Date(endDate), 'Do MMM');
// };

export const getPreExpiryFormattedTime = async (prcData) => {
  const data = await fetchUserSubscriptionStatusFromApi(prcData);
  const endDate = data?.data?.timestamp;
  const date1 = new Date(endDate);
  const date2 = new Date();
  let differenceInDays = 0;
  if (endDate) {
    const differenceInTime = date1.getTime() - date2.getTime();
    differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }
  return differenceInDays;
};
export const checkPreExpireDate = async (prcData) => {
  const data = await fetchUserSubscriptionStatusFromApi(prcData);
  return data?.data?.inPreExpiredPeriod;
};

export const checkIfOneDayRemaining = (remainingDays) => {
  const differenceInHours = remainingDays * 24;
  return differenceInHours <= 24;
};

export const getAmpRedirectionParams = () => {
  const options = {};
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.href;
    const currUrlObj = new URL(currentUrl);
    options.Params = {
      isampuser: !!(currUrlObj.searchParams.get('isampuser') || null),
      toLogin: !!(currUrlObj.searchParams.get('toLogin') || null),
      ispayperstory: !!(currUrlObj.searchParams.get('ispayperstory') || null),
      isCredUser: !!(currUrlObj.searchParams.get('isCreduser') || null),
      msid: currUrlObj.searchParams.get('msid') || null,
      storyTitle: currUrlObj.searchParams.get('storyTitle') || null,
      justpayredirect: !!(
        currUrlObj.searchParams.get('justpayredirect') || null
      ),
      showOffer: !!(currUrlObj.searchParams.get('showOffer') || null),
      nudgeName: currUrlObj.searchParams.get('nudgeName') || null,
      isYearlyPlanJustPay: !!(
        currUrlObj.searchParams.get('isYearlyPlanJustPay') || null
      ),
    };
  }
  return options;
};

export const isAmpParams = () => {
  const options = getAmpRedirectionParams();
  return (
    options.Params?.isampuser ||
    options.Params?.ispayperstory ||
    options.Params?.toLogin ||
    options.Params?.isYearlyPlanJustPay
  );
};

export const clearAmpParams = () => {
  if (isAmpParams() && typeof window !== 'undefined') {
    window.history.replaceState(null, null, window.location.pathname);
  }
};

const experiment = (value, name) => {
  if (name === 'AAhc2QloTxGa4vY6mfBqBg') {
    window.abJustPayExperiment = value;
    window.abJustPayExperimentId = name;
  } else if (name === 'JFuDFHQsQxe3Ul8ShB_OpQ') {
    window.abBlockerExperiment = value;
    window.abBlockerExperimentId = name;
  } else if (name === 'G2sD7sUqRZm06q9xRKrcRQ') {
    window.abBundleExperiment = value;
    window.abBundleExperimentID = name;
  } else if (name === 'abF4ZejISKOEHQnYdQVn4g') {
    window.abPerpetualExperiment = value;
    window.abPerpetualExperimentID = name;
  } else if (name === 'BvRNoRczRAeGYuagLCglsg') {
    window.persuasionExperiment = value;
    window.persuasionExperimentId = name;
    //all are just for the test
  } else if (
    typeof window !== 'undefined' &&
    window.localStorage &&
    localStorage.getItem('ABExperimentKeys')
  ) {
    const arr = JSON.parse(localStorage.getItem('ABExperimentKeys'));
    if (Array.isArray(arr) && arr.length > 0) {
      for (let i = 0; i < arr.length; i += 1) {
        if (name === arr[i]) {
          const key = `abExperiment_test_${i}`;
          const keyID = `abExperiment_test_${i}_ID`;
          window[key] = value;
          window[keyID] = name;
          console.log(
            'ExpValue == ',
            window[key],
            'ExpName == ',
            window[keyID],
          );
        }
      }
    }

    // } else if (name === 'jPZaOUJOQw-zbHQ1b_-rJw') {
    //   window.abExperiment_test_1 = value;
    //   window.abExperiment_test_1_ID = name;
    // } else if (name === 'qpFPQHzLRi2hPFA8wXNBNg') {
    //   window.abExperiment_test_2 = value;
    //   window.abExperiment_test_2_ID = name;
    // } else if (name === 'PiSDRyddRmeXYuM6pXMt2Q') {
    //   window.abExperiment_test_3 = value;
    //   window.abExperiment_test_3_ID = name;
    // } else if (name === 'QuJGihuVRC-vqNCYoLLt-w') {
    //   window.abExperiment_test_4 = value;
    //   window.abExperiment_test_4_ID = name;
    // } else if (name === 'vIb6uardTxGA8LM5itDNlw') {
    //   window.abExperiment_test_5 = value;
    //   window.abExperiment_test_5_ID = name;
    // } else if (name === 'xhePlmK1SwqbDBbZzsaEUA') {
    //   window.abExperiment_test_6 = value;
    //   window.abExperiment_test_6_ID = name;
    //   //all are just for the test
  } else if (
    name === 'rscwKd7MSCOaOLlGTjzzWQ' ||
    name === 'GVBw0k1zQWSyZP8K7fygkA'
  ) {
    window.newStoryBlockerExp = value;
  } else if (
    name === 'OlWPcwsgQ--OHpAf1Eu7vg' ||
    name === '-Esg-U7EQoCLaMvVgFTAlQ'
  ) {
    window.newStoryPageExp = value;
  } else {
    window.abExperiment = value;
    window.abExperimentId = name;
  }
};

const multivariant = (value, name) => {
  const sections = value.split('-');
  window.abExperimentId = name;

  if (sections[0] === '0') {
    // Provide code for first section for visitors in the original.
    window.abBlockerExperiment = '0';
  } else if (sections[0] === '1') {
    // Provide code for first section for visitors in first variant.
    window.abBlockerExperiment = '1';
  } else if (sections[0] === '2') {
    // Provide code for first section for visitors in first variant.
    window.abBlockerExperiment = '2';
  } else if (sections[0] === '3') {
    // Provide code for first section for visitors in first variant.
    window.abBlockerExperiment = '3';
  }
  if (sections[1] === '0') {
    // Provide code for second section for visitors in the original.
    window.abOfferExperiment = '0';
  } else if (sections[1] === '1') {
    // Provide code for second section for visitors in first variant.
    window.abOfferExperiment = '1';
  } else if (sections[1] === '2') {
    // Provide code for second section for visitors in first variant.
    window.abOfferExperiment = '2';
  }
  if (sections[0] === '0') {
    // Provide code for first section for visitors in the original.
    window.abPriceExperiment = '0';
  } else if (sections[0] === '1') {
    // Provide code for first section for visitors in first variant.
    window.abPriceExperiment = '1';
  } else if (sections[0] === '2') {
    // Provide code for first section for visitors in first variant.
    window.abPriceExperiment = '2';
  } else if (sections[0] === '3') {
    // Provide code for first section for visitors in first variant.
    window.abPriceExperiment = '3';
  }
};

export const implementExperiment = (isMvt = false) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'optimize.callback', {
      callback: isMvt ? multivariant : experiment,
      // callback: (value, name) =>
      //   console.log(`Experiment with ID: ${name} is on variant: ${value}`),
    });
  }
};

export const timeDifference = (dt1, dt2) => {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff)) > 24;
};

export const timesPrimeSavingApi = (isPrime, msid) => {
  const date = new Date();
  const ssoId = getCookie('ssoid');
  const ticketId =
    getCookie('TicketId') || getCookie('Ticketid') || getCookie('ticketId');
  const getUserSavingObject = checkForSSOInSavingUserObjAndUpdate({
    ssoId,
    ticketId,
  });
  if (getUserSavingObject) {
    if (msid && msid.length > 0) {
      if (isPrime) {
        getUserSavingObject.plusArticleCount += 1;
      } else {
        getUserSavingObject.articleCount += 1;
      }
    }
    const dateComp = timeDifference(
      new Date(getUserSavingObject.stored_at),
      date,
    );
    checkForSSOInSavingUserObjAndUpdate(getUserSavingObject);
    if (
      dateComp ||
      (window !== 'undefined' &&
        window.sessionStorage.getItem('checkSavingFlow'))
    ) {
      // comparing two dates if greater than 24 hours
      const object = {
        user: {
          ticketId,
          ssoId,
        },
        otherDetails: {
          plusArticleCount: getUserSavingObject.plusArticleCount,
          articleCount: getUserSavingObject.articleCount,
        },
      };
      makeRequest
        .post(TIMES_PRIME_SAVING_API, object, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res && res.data && res.data.success === true) {
            checkForSSOInSavingUserObjAndUpdate({ ssoId, ticketId }, true);
          }
        });
    }
  }
};

export const savingCallIfTimesPrime = (
  isArticleshowV2,
  isPrimeArticle,
  msid,
  prcData,
) => {
  if (!window.callSavingApiOnce) {
    window.callSavingApiOnce = true;
    fetchUserSubscriptionStatusFromApi(prcData).then((data) => {
      if (data?.data?.accessType === 'TIMESPRIME') {
        if (!isArticleshowV2) {
          timesPrimeSavingApi(false, msid);
        } else if (isArticleshowV2 && isPrimeArticle) {
          timesPrimeSavingApi(true, msid);
        } else if (isArticleshowV2) {
          timesPrimeSavingApi(false, msid);
        }
      }
    });
  }
};
export const setPayloadInfo = (
  nudgeName,
  initiationPage,
  storyTitle = '',
  msid = '',
) => {
  const infoObj = {};
  infoObj.nudgeName = nudgeName;
  infoObj.initiationPage = initiationPage;
  if (storyTitle && msid) {
    infoObj.storyTitle = storyTitle;
    infoObj.msid = msid;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('nudgeClickInfo', JSON.stringify(infoObj));
  }
};

export const getClientIdCookieValue = () => {
  const _gaCookie = getCookie('_ga');
  if (_gaCookie && _gaCookie.length > 0) {
    if (_gaCookie.indexOf('amp-') > -1) {
      return _gaCookie.substring(_gaCookie.indexOf('amp-'), _gaCookie.length);
    }

    const _gaArray = _gaCookie?.split('.');
    if (Array.isArray(_gaArray) && _gaArray.length === 4) {
      return `${_gaArray[2]}.${_gaArray[3]}`;
    }
  }

  return null;
};

export const checkIsSaleLive = () => {
  const endDate = new Date('Dec 02, 2022 20:00:00').getTime();
  const startDate = new Date('Nov 28, 2022 00:00:00').getTime();
  const todayDate = Date.now();
  const passedTime = todayDate - startDate;
  const remainingTime = endDate - todayDate;
  if (passedTime >= 0 && remainingTime >= 0) {
    return true;
  }
  return false;
};
export const getPromiseClientIdCookieValue = () =>
  new Promise((resolve) => {
    const intervalTime = 100;

    const releasePromiseTimer = Date.now() + 500;
    const getCookieCounter = setInterval(() => {
      const _gaCookie = getCookie('_ga');
      const waitTimer = Date.now();
      if (
        (_gaCookie && _gaCookie.length > 0) ||
        waitTimer > releasePromiseTimer
      ) {
        const clientIdCookieValue = getClientIdCookieValue();
        clearInterval(getCookieCounter);
        resolve(clientIdCookieValue);
      }
    }, intervalTime);
  });

export const showTOIPLogo = (primeCategory) =>
  !!primeCategory && [100, 200, 300, 400, 500].includes(primeCategory);

const propensityTemplates = [
  'Home',
  'toiplusauthorpage',
  'toiplushomepage',
  'toiplusmostanalytics',
  'toiplusnocpage',
  'toiplusplanpage',
  'toiplussectionpage',
  'toiplustaxonomypage',
  'toiplusarticleshow',
];

export const switchOnPropensityApi = (pageType, isPrime) =>
  propensityTemplates.includes(pageType) && !isPrime;

export const getSubscriptionPlan = async (geoCountry, isWapView) => {
  let planUrl;
  if (isWapView) {
    planUrl = `${TOI_SUBS_FETCH_PLANS_MWEB}&cc=${geoCountry}&listView=true`;
  } else {
    planUrl = `${TOI_SUBS_FETCH_PLANS_WEB}&cc=${geoCountry}&listView=true`;
  }
  const subscriptionData = await makeRequest.get(planUrl);
  let subscriptionRes;
  let selectedPlan;
  if (subscriptionData?.data?.data) {
    subscriptionRes = subscriptionData?.data?.data;
  }
  if (
    subscriptionRes &&
    Array.isArray(subscriptionRes.plans) &&
    subscriptionRes.plans.length > 0
  ) {
    for (let i = 0; i < subscriptionRes.plans.length; i += 1) {
      if (
        subscriptionRes.plans[i] &&
        subscriptionRes.plans[i].durationInDays &&
        subscriptionRes.plans[i].durationInDays === YEAR_IN_DAYS &&
        subscriptionRes.plans[i].planType &&
        subscriptionRes.plans[i].planType === PAID &&
        subscriptionRes.plans[i].subscription &&
        subscriptionRes.plans[i].subscription.accessType &&
        subscriptionRes.plans[i].subscription.accessType === TOI_PLUS
      ) {
        selectedPlan = subscriptionRes.plans[i].planId;
      }
    }
  }
  return selectedPlan;
};

export const generateOneLinkURL = (pageType) => {
  let msid = '';
  if (
    typeof window !== 'undefined' &&
    window.location &&
    window.location.href
  ) {
    msid = getMsidFromPath(window.location.href);
  }
  const grxId = getCookie('_grx');
  //const prc = getCookie('prc');
  //const prcValue = prc ? parseInt(prc.split('#')[0], 10) : 0;
  const afAndroidStoreCsl = false;
  const afIosStoreCpp = false;
  const afSub1 = window?.grxParams?.storySection
    ? window?.grxParams?.storySection
    : false;
  //const prcLabel = prcValue === 0 || prcValue === -1 ? 'Yes' : 'No';

  let defaultValue;
  if (pageType === 'ARTICLESHOW') {
    defaultValue = encodeURIComponent(
      `toiapp://open-$|$-id=${msid}-$|$-url=https://plus.timesofindia.com/toi-feed/feed/toii/article/show?id=${msid}&source=toi&fv=970-$|$-type=news-$|$-af_android_store_csl=${afAndroidStoreCsl}-$|$-af_ios_store_cpp=${afIosStoreCpp}-$|$-af_sub1=${afSub1}-$|$-af_sub2=${msid}-$|$-GRxID=${grxId}`,
    );
  } else if (pageType === 'Home') {
    defaultValue = encodeURIComponent(
      `toiapp://open-$|$-id=home-$|$-af_android_store_csl=${afAndroidStoreCsl}-$|$-af_ios_store_cpp=${afIosStoreCpp}-$|$-af_sub1=${afSub1}-$|$-af_sub2=${msid}-$|$-GRxID=${grxId}-$|$-type=BottomBarDeepLink`,
    );
  }

  const oneLinkURL = 'https://timesofindia.onelink.me/mjFd/';
  const mediaSource = {
    keys: ['inmedia'],
    defaultValue: 'TOI_Mweb_HP_Floating',
  };
  const afDp = {
    paramKey: 'af_dp',
    keys: ['partner'],
    defaultValue: encodeURIComponent('toiapp.appsflyer.deeplink://'),
  };

  const deepLinkValue = {
    keys: ['dp_dest'],
    defaultValue,
  };
  const afParameters = {
    mediaSource,
    deepLinkValue,
    afCustom: [afDp],
  };
  let result = '';
  if (typeof window !== 'undefined') {
    result = window?.AF_SMART_SCRIPT?.generateOneLinkURL({
      oneLinkURL,
      afParameters,
    });
  }

  if (result && msid && pageType === 'ARTICLESHOW') {
    return result.clickURL;
  }
  if (result && pageType === 'Home') {
    return result.clickURL;
  }
  return null;
};

export const getSeoName = (str = '') => {
  let seoName = '';
  seoName = str?.trim()?.replace(/[^a-zA-Z- ]/g, '');
  seoName = seoName?.replace(/\s+/g, '-')?.toLowerCase();
  return seoName;
};

const getJssoCrosswalkObj = (isMobile) => {
  let jssoCrosswalkObj = '';
  if (typeof window.jssoCrosswalkObj === 'object') {
    jssoCrosswalkObj = window.jssoCrosswalkObj;
  } else if (typeof window.JssoCrosswalk === 'function') {
    jssoCrosswalkObj = !isMobile
      ? new window.JssoCrosswalk('toi', 'web')
      : new window.JssoCrosswalk('toi', 'WAP');
  }
  return jssoCrosswalkObj;
};

const getCrsossWalkLogginUser = (isMobile, resolve) => {
  const jssoObj = getJssoCrosswalkObj(isMobile);
  if (typeof jssoObj.getValidLoggedInUser === 'function') {
    jssoObj.getValidLoggedInUser((response) => {
      if (parseInt(response.code, 10) === 200 && response.data) {
        const { encTicket } = response.data;
        const respObj = { tempTicket: encTicket };
        resolve(respObj);
      }
    });
  }
};

export const getEncTicket = (isMobile) =>
  new Promise((resolve) => {
    if (typeof window.JssoCrosswalk === 'undefined') {
      loadJssoCrossWalk(getCrsossWalkLogginUser.call({}, isMobile, resolve));
    } else {
      getCrsossWalkLogginUser(isMobile, resolve);
    }
  });
