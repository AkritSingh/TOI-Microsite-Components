/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prefer-regex-literals */
import { getSiteDomain } from '../../constants/index';
import { SLIKE_ADVIDEO_SECTIONS } from '../../constants/index';
import Cookie from '../../utils/cookies';
import loadPlayerJSFiles, { loadJS } from '../../utils/loadPlayerJSFiles';
import analyticsWrapper from '../analyticsWrapper';
import makeRequest from '../makeRequest';
// import VIDEO_SUCCESS_EVENT from './constants';
import { pauseOtherPlayers, dockVideoPlayer } from './utils';

export default function startPlayer({
  videoMsid,
  divId,
  outsideEventListener,
  nextVideoMsidArray = [],
  store,
  callbackOutside,
  isPrime,
  isUserPrime,
  slikeId,
  livetv,
  isVideoSkipAds,
  isDockingEnabled,
  addToWatched,
  sourceVal,
  allowDimVal,
  showInDimMode,
  // shouldShowVideoBlocker,
  // prcValue,
  videoDataReceivedCallback,
  asyncLoadSdkjs,
  videoChapterId,
  iphonefs,
  sectionName,
  autoPlayLeadVideo,
  muteOnLoad,
  eventsCallbackMap,
  intantiateNewPlayer,
  isPodcast,
  hideControls,
  playlistData,
  videoInloop = false,
  titleStr = '',
  shareUrl,
  headless,
  videoProgressCallback,
  updateplayerConfig = {},
  tmplSource = '',
  isWapView,
  scrollAutoPlay,
  scrollAutoPause,
  isVideoshow,
  isEtimes,
  metakeywords,
  bl,
}) {
  // console.log('##video playerv3 called');
  //  window.parent.$(window.parent.document).trigger has been replaced by a dummy function for now(later to be done in redux)
  //  need to call onVideoUnmount on in componentdidunmount
  const triggerEvent = function triggerEvent(...args) {
    if (typeof outsideEventListener === 'function') {
      outsideEventListener(...args);
    }
  };
  const videoDataReceivedCallbackWrapper =
    function videoDataReceivedCallbackWrapper(data) {
      if (typeof videoDataReceivedCallback === 'function') {
        videoDataReceivedCallback(data);
      }
    };
  const isMobileMode = isWapView;
  // const activitySuccesCb = function activitySuccesCb(data) {
  //   if (isMobileMode) {
  //     const VideoEvent = new Event(VIDEO_SUCCESS_EVENT);
  //     if (data && data.data && data.data.success) {
  //       window.dispatchEvent(VideoEvent);
  //     }
  //   }
  // };
  const fireTPActivity = function fireTPActivity() {
    // params activity, msid
    // #todo - will support timespoint activity later
    // fireActivity(isWapView, activity, msid, activitySuccesCb);
  };
  const sliketesting = window.location.href.indexOf('sliketesting') >= 0;
  const testAds = window.location.href.indexOf('testads') >= 0;
  // Function to get mainConfig SectionName;
  function getSectionName() {
    let secName;
    if (
      typeof sectionName === 'string' &&
      SLIKE_ADVIDEO_SECTIONS.indexOf(sectionName.toUpperCase()) > -1
    ) {
      secName = sectionName;
    } else {
      secName = isMobileMode ? 'videos' : 'video-show';
    }
    return secName;
  }

  function getPageSectionName() {
    const urlPathArray =
      typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
    let pageSectionName = '';
    if (
      urlPathArray.length >= 4 &&
      urlPathArray[1] &&
      urlPathArray[2] &&
      urlPathArray[3].length <= 10
    ) {
      pageSectionName = `${urlPathArray[1]}.${urlPathArray[2]}.${urlPathArray[3]}`;
    } else if (urlPathArray.length >= 3 && urlPathArray[1] && urlPathArray[2]) {
      pageSectionName = `${urlPathArray[1]}.${urlPathArray[2]}`;
    } else if (urlPathArray.length === 2 && urlPathArray[1]) {
      pageSectionName = `${urlPathArray[1]}`;
    } else if (window.location.pathname === '/') {
      pageSectionName = 'Home';
    }
    return pageSectionName;
  }
  window.reason = {};
  const TimesApps = {};
  TimesApps.VOD_CONF = {
    _default: {
      showAutoplayButton: false,
      nextVideoCounter: 5,
      playlistUrl: '/videpostroll_v8/',
    },
    USNHP_MAINVIDEOWIDGET: {
      showAutoplayButton: false,
      nextVideoCounter: 5,
    },
    MG_0: {
      showAutoplayButton: isMobileMode,
      nextVideoCounter: 5,
      showVolumeSeekBar: true,
      showNextPrevButton: false,
    },
    ARTICLE_BOTTOM_VIDEOS: {
      showAutoplayButton: isMobileMode,
      nextVideoCounter: 5,
      playlistUrl: '/videpostroll_v8/',
    },
    ELECTION_VIDEOS: {
      showAutoplayButton: isMobileMode,
      nextVideoCounter: 5,
      playlistUrl: '/videpostroll_v8/',
    },
    HP_RHS: {
      showAutoplayButton: isMobileMode,
      nextVideoCounter: 5,
      playlistUrl: '/videpostroll_v8/',
    },
    PRIME_VIDEOSHOW: {
      showAutoplayButton: isMobileMode,
      nextVideoCounter: 5,
      showVolumeSeekBar: true,
    },
    PRIME_TOPVOD: {
      showVolumeSeekBar: isMobileMode,
      showLastFrame: true,
      hideCenterIcon: true,
    },
    VIDEOSHOW: {
      showAutoplayButton: false,
      nextVideoCounter: 5,
    },
    ARTICLESHOW_RHS: {
      showAutoplayButton: isMobileMode,
      nextVideoCounter: 5,
      playlistUrl: '/videpostroll_v8/',
    },
    ABOVEARTICLE: {
      showAutoplayButton: isMobileMode,
      nextVideoCounter: 5,
      playlistUrl: '', //'/videpostroll_v8/',
    },
    ARTICLEEMBED: {
      showAutoplayButton: isMobileMode,
      nextVideoCounter: 5,
      playlistUrl: '//timesofindia.indiatimes.com/articleshow_vidpostroll/',
    },
  };
  let slikeApiKey;
  if (isEtimes) {
    slikeApiKey = isMobileMode ? 'toi371mweb5awm99g9o6' : 'toi371web5awj999ou6';
  } else {
    slikeApiKey = isMobileMode
      ? 'toimweb5t9tCpb7nb5q6jUb'
      : 'toiweba5ec9705eb7ac2c984033e061';
  }
  // document.domain = 'indiatimes.com';
  const mainConfig = {
    source: sourceVal, //source is the videoshow for videoshow
    userInitiated: '1',
    mediaId: '', //slike id should be here
    chapterId: videoChapterId, //from where video should started, as video is divided into mutiple chapters
    msid: '',
    slikeApiKey,
    nextid: nextVideoMsidArray[1],
    sectionId: '',
    title: '',
    agency: '',
    duration: '',
    blacklistText: '',
    bgImage:
      'https://static.toiimg.com/thumb/imgsize-199425,msid-#MSID#,width-800,resizemode-4/#MSID#.jpg',
    isVideoInsideBlacklistContent: '0',
    specialId__hyp1: '',
    skipAds: '0',
    volume: 80,
    site: 'TOID',
    playerType: 'url',
    section: getSectionName(),
    nextVideoCounter: 5,
    allowDim: allowDimVal ? 1 : 0,
    seoLocation: '',
    mediaDate: '',
    articleId: '',
    cat: '',
    subcat: '',
    metaKeywords: '',
    akamaiCacheBlockingImg:
      'https://static.toiimg.com/photo/msid-#MSID#/#MSID#.jpg',
    articledt: '',
    breadCrumb: 'News.Videos.News',
    pageType: 'VIDEO',
    hideControls,
    playlistData,
    shareUrl,
    headless,
  };
  // if (!__PROD__) {
  //   mainConfig.slikeApiKey = 'test403web5a8sg6o9ug';
  // }
  if (sliketesting) {
    mainConfig.section = 'hlsads';
    //mainConfig.section = 'test';
  }
  if (testAds) {
    mainConfig.section = 'test';
  }
  /*

    *remvoe fn post Slike migration
    * check point, CMS INSERTED LIVE TV
    */
  TimesApps.convertMinutesToMs = function convertMinutesToMs(timeInMinutes) {
    let timeInMs = 0;
    if (typeof timeInMinutes !== 'undefined') {
      const timeSplit = timeInMinutes.toString().split(':');
      const SECONDS_IN_A_MINUTE = 60;
      const MS_IN_A_SECOND = 1000;

      if (timeSplit.length === 2) {
        timeInMs = timeSplit[0] * SECONDS_IN_A_MINUTE * MS_IN_A_SECOND;
        timeInMs += timeSplit[1] * MS_IN_A_SECOND;
      } else if (timeSplit.length === 1) {
        timeInMs = timeSplit[0] * SECONDS_IN_A_MINUTE * MS_IN_A_SECOND;
      }
    }

    return timeInMs;
  };

  TimesApps.PlayerUtils = (function playerUtilClosure() {
    const config = {
      dataStorageKey: 'vodPLayer',
    };

    const constants = {
      seondsInOneMinute: 60,
      msInOneSecond: 1000,
    };

    const fn = {
      _getCookie(name) {
        const re = new RegExp(`${name}=([^;]+)`);
        const value = re.exec(document.cookie);
        return value !== null ? unescape(value[1]) : null;
      },
      _getData() {
        let data;
        try {
          data = JSON.parse(
            fn._getDataFromSessionStorage(config.dataStorageKey) || '{}',
          );
        } catch (e) {
          data = {};
        }
        return data;
      },
      _storeData(prop, value) {
        if (typeof prop === 'undefined' || prop.trim().length === 0) {
          return undefined;
        }

        const data = fn._getData();
        data[prop] = value;

        let dataJson;

        try {
          dataJson = JSON.stringify(data);
        } catch (e) {
          return false;
        }

        fn._setIntoSessionStorage(config.dataStorageKey, dataJson);
        return data;
      },
      _getDataFromSessionStorage(key) {
        let data;

        try {
          data = sessionStorage.getItem(key);
        } catch (e) {
          console.log('sessionStorage error', e);
        }

        return data;
      },
      _setIntoSessionStorage(key, value) {
        if (typeof key === 'undefined' || key.trim().length === 0) {
          return undefined;
        }

        try {
          sessionStorage.setItem(key, value);
        } catch (e) {
          console.log('sessionStorage error', e);
        }
        return undefined;
      },
      isTablet() {
        return (function returnAgent(agent) {
          return /(?:ipad|tab)/i.test(agent);
        })(navigator.userAgent || navigator.vendor || window.opera);
      },
      _getUserAgent() {
        return navigator.userAgent || navigator.vendor || window.opera;
      },
      _getVideoUrl() {
        let url = `${window.location.protocol}//${window.location.hostname}`;
        url += `/${mainConfig.seoLocation}`;
        url += '/videoshow/';
        url += `${mainConfig.msid}.cms`;
        return url;
      },
      _getVideoImg(bgImageString) {
        let bgImage = bgImageString || mainConfig.bgImage || '';
        const msid = mainConfig.msid || '';
        const imgReplaceMsidRegex = new RegExp('#MSID#', 'g');

        bgImage = bgImage.replace(imgReplaceMsidRegex, msid);

        return bgImage;
      },
      _shouldMarkVideoBLackListedForAds() {
        const blacklistText = mainConfig.blacklistText
          ? mainConfig.blacklistText.trim()
          : '';
        const isVideoInsideBlacklistContent =
          mainConfig.isVideoInsideBlacklistContent || '';

        const markVideoBL =
          isVideoInsideBlacklistContent === '1' || !!blacklistText.length;
        return markVideoBL;
      },
      _getAdsTargetParams() {
        let audienceParamsOutput;
        let _audienceData = '';
        // let BL_pg;
        const _hyp1 = mainConfig.specialId__hyp1;

        if (fn._isParentWindowAccessAllowed()) {
          const { colaud } = window.parent;
          if (typeof colaud !== 'undefined') {
            _audienceData = colaud.aud;
          }
        }

        audienceParamsOutput = _audienceData;

        if (fn._shouldMarkVideoBLackListedForAds()) {
          audienceParamsOutput += ',&BL=1';
        }

        if (typeof _hyp1 === 'string' && _hyp1.length > 0) {
          audienceParamsOutput += `,&hyp1=${_hyp1}`;
        }

        audienceParamsOutput = decodeURIComponent(audienceParamsOutput);

        return audienceParamsOutput;
      },
      _fireVideoRequestGA() {
        const pubSub = TimesApps.PubSub;
        //fire VideoRequest GA
        const { playerName } = TimesApps.player;
        const eventData = {};
        eventData.source = mainConfig.source;
        eventData.stream = 'CONTENT';
        eventData.userInitiated = mainConfig.userInitiated || '';
        eventData.id = mainConfig.msid || '';
        pubSub.publish(`${playerName}_EVENTS`, [eventData, 'VIDEOREQUEST']);
        //console.log('PLAYER_EVENT....'+"VIDEOREQUEST isUserInitiated-"+eventData.userInitiated.toString());
      },
      _shouldSkipAds() {
        let skipAds;
        let ifreamParent;
        let winLoyalusers;
        let pageType = mainConfig.pageType || '';
        pageType = pageType.toUpperCase();

        try {
          ifreamParent = window.parent;
          winLoyalusers = window.winLoyalusers;
        } catch (e) {
          //console.log("getPageLocation, cors error");
        }

        if (isUserPrime) {
          skipAds = true;
        } else if (
          ifreamParent.toiprops &&
          ifreamParent.toiprops.toipr &&
          parseInt(ifreamParent.toiprops.toipr, 10) === 1
        ) {
          skipAds = true;
        } else if (isVideoSkipAds || winLoyalusers) {
          skipAds = true;
        } else {
          skipAds = mainConfig.skipAds === '1';
          //Audio page
          if (!skipAds && pageType !== 'VIDEO') {
            skipAds = true;
          }
        }
        return skipAds;
      },
      _isParentWindowAccessAllowed() {
        const accessAllowed = true;
        try {
          //   const ifreamParent = window.parent.location.href;
        } catch (e) {
          console.log('cors error');
          //   accessAllowed = false;
        }

        return accessAllowed;
      },
      _sendDataToParentWindow(msgName, data) {
        if (!fn._isParentWindowAccessAllowed()) {
          return;
        }

        triggerEvent(msgName, data);
      },
      _isMute() {
        // let isMute = false;
        // /*
        // * moving to always mute first
        // * Deprecating..
        // */
        // //if( !isUserInitiated ){
        // isMute = true;
        // //}

        return false;
      },
      _checkGdprAndCall(callback, callbackForEu /*, checkForUserConsent*/) {
        try {
          window.TimesGDPR = window.parent.TimesGDPR;
        } catch (e) {
          console.log(e);
        }

        if (
          window.TimesGDPR &&
          window.TimesGDPR.common.consentModule.gdprCallback
        ) {
          window.TimesGDPR.common.consentModule.gdprCallback((data) => {
            if (data && data.isEUuser && typeof callbackForEu === 'function') {
              callbackForEu();
            } else if (!data.isEUuser && typeof callback === 'function') {
              callback();
            }
          });
        } else if (typeof callbackForEu === 'function') {
          callbackForEu();
        }
      },
      _loadImaSdkForAds() {
        TimesApps.googleImaJsLoaded = false;
        TimesApps.slikeImaWrapperJsLoaded = false;

        fn._checkGdprAndCall(
          () => {
            const googleImaJsLoaded = function googleImaJsLoaded(event) {
              TimesApps.googleImaJsLoaded = true;
              const eventName = 'googleImaJsLoaded';
              /*if(typeof window.require !="undefined"){
                var pubSub = require("tiljs/event");
            }else{*/
              const pubSub = TimesApps.PubSub;
              //}
              pubSub.publish('googleImaJsLoaded');
              //for GA
              (function sendEvent() {
                const { playerName } = TimesApps.player;
                const eventData = {};
                eventData.loadStatus = (event && event.type) || '';
                eventData.source = mainConfig.source;
                eventData.stream = 'CONTENT';
                eventData.userInitiated = mainConfig.userInitiated || '';
                eventData.id = mainConfig.msid || '';
                pubSub.publish(`${playerName}_EVENTS`, [
                  eventData,
                  eventName.toUpperCase(),
                ]);
              })();
            };

            // eslint-disable-next-line no-unused-vars
            const slikeImaWrapperJsLoaded = function slikeImaWrapperJsLoaded(
              event,
            ) {
              const eventName = 'slikeImaWrapperJsLoaded';
              TimesApps.slikeImaWrapperJsLoaded = true;
              /*if(typeof require !="undefined"){
                    var pubSub = require("tiljs/event");
                }else{*/
              const pubSub = TimesApps.PubSub;
              //}
              pubSub.publish(eventName);

              //for GA
              (function publishPlayerEvent() {
                const { playerName } = TimesApps.player;
                const eventData = {};
                eventData.loadStatus = (event && event.type) || '';
                eventData.source = mainConfig.source;
                eventData.stream = 'CONTENT';
                eventData.userInitiated = mainConfig.userInitiated || '';
                eventData.id = mainConfig.msid || '';
                pubSub.publish(`${playerName}_EVENTS`, [
                  eventData,
                  eventName.toUpperCase(),
                ]);
              })();
            };
            loadJS(
              '//imasdk.googleapis.com/js/sdkloader/ima3.js',
              'ima3_sdk_js',
            ).then(googleImaJsLoaded);
          },
          () => {
            /*
             * EU, ima sdk's
             * should not be loaded
             * bypassing loading
             */
            TimesApps.googleImaJsLoaded = true;
            TimesApps.slikeImaWrapperJsLoaded = true;
          },
        );
      },
      _updateVolume(volume, isMute) {
        //TimesApps.Vod_Player.updateVolume
        const volumeData = {
          value: volume,
          isMute: !!isMute,
          updateTime: new Date().getTime(),
        };
        // console.log('storing volume', volumeData);
        TimesApps.PlayerUtils.storeData('volume', volumeData);
      },
      _getVolume() {
        let volumeData = {
          volume: null,
          isMute: null,
        };
        const savedVolume = fn._getData().volume || {};
        const msIn30Mins =
          30 * constants.seondsInOneMinute * constants.msInOneSecond;
        if (
          typeof savedVolume === 'undefined' ||
          typeof savedVolume.value === 'undefined'
        ) {
          volumeData.volume = mainConfig.volume;
        } else if (new Date().getTime() + msIn30Mins < savedVolume.updateTime) {
          //volume was saved 30 back
          //expire volume
          //   volume = mainConfig.volume;
          TimesApps.PlayerUtils.storeData('volume', {});
        } else {
          volumeData = {
            volumeLevel: savedVolume.value,
            isMute: savedVolume.isMute,
          };
        }
        return volumeData;
      },
    };

    const api = {
      isTablet() {
        return fn._isTablet();
      },
      getUserAgent() {
        return fn._getUserAgent();
      },
      getVideoUrl() {
        return fn._getVideoUrl();
      },
      getVideoImg(bgImageString) {
        return fn._getVideoImg(bgImageString);
      },
      getAdsTargetParams() {
        return fn._getAdsTargetParams();
      },
      fireVideoRequestGA() {
        return fn._fireVideoRequestGA();
      },
      shouldSkipAds() {
        return fn._shouldSkipAds();
      },
      isParentWindowAccessAllowed() {
        return fn._isParentWindowAccessAllowed();
      },
      sendDataToParentWindow(msgName, data) {
        return fn._sendDataToParentWindow(msgName, data);
      },
      getDataFromWebStorage(key) {
        return fn._getDataFromSessionStorage(key);
      },
      setIntoWebStorage(prop, value) {
        return fn._setIntoSessionStorage(prop, value);
      },
      getData() {
        return fn._getData();
      },
      storeData(prop, value) {
        return fn._storeData(prop, value);
      },
      isMute() {
        return fn._isMute();
      },
      checkGdprAndCall(callback, callbackForEu, checkForUserConsent) {
        return fn._checkGdprAndCall(
          callback,
          callbackForEu,
          checkForUserConsent,
        );
      },
      getCookie(name) {
        return fn._getCookie(name);
      },
      loadImaSdkForAds() {
        return fn._loadImaSdkForAds();
      },
      getVolume() {
        return fn._getVolume();
      },
      updateVolume(volume, isMute) {
        return fn._updateVolume(volume, isMute);
      },
    };

    return api;
  })();
  // /*
  //  * adding additional reference
  //  * deprecating TimesApps.Utils
  //  * bcoz TimesApps.Utils is also used by Video pages
  //  * & also inside player
  //  * & on live tv page player ( does not use iframe )
  //  */
  TimesApps.Utils = TimesApps.Utils || TimesApps.PlayerUtils;
  //TimesApps.VideoPlayerUtils = TimesApps.Utils;

  // var TimesApps = window.TimesApps || {};
  /**
   * 'PubSub' module.
   *
   * @module PubSub
   */
  TimesApps.PubSub = (function createPubSub() {
    const mod_event = {};
    const pubsub = {};
    const onsubscribe_prefix = '__on_';
    const generateUid = (function generateUid() {
      let id = 0;
      return function incID() {
        id += 1;
        return id - 1;
      };
    })();
    /**
     * Publish subscribed events
     *
     * @param name Method name for the event to be published
     * @param data data to be passed to the subscribed event
     * @returns null
     */
    mod_event.publish = function publish(name, data) {
      if (!name) {
        return null;
      }
      if (pubsub[name]) {
        Object.keys(pubsub[name]).forEach((e) => {
          const eventCallback = pubsub[name][e];
          try {
            //try catch done to keep publisher running in case of error in event callback
            eventCallback(data);
          } catch (err) {
            mod_event.publish('logger.error', err.stack);
          }
        });
      }
      return null;
    };
    mod_event.subscribeAll = function subscribeAll(
      name,
      eventCallback,
      options,
    ) {
      if (name instanceof Array) {
        const eventIds = [];
        let responses = [];
        const bindREsponse = (response) => {
          responses.push(response);
          if (eventIds.length === responses.length) {
            // todo fix, call even when first event is called twice
            if (eventCallback) {
              eventCallback(responses);
            }
            responses = [];
          }
        };
        for (let i = 0; i < name.length; i += 1) {
          eventIds.push(mod_event.subscribe(name[i], bindREsponse, options));
        }
        return eventIds;
      }
      return mod_event.subscribe(name, eventCallback, options);
    };
    //   /**
    //    * Subscribe custom events
    //    *
    //    * @param name Method name for the event to be subscribed
    //    * @param eventCallback(data) Function to be called when the event is published with the data
    //    * @options options
    //    * @returns eventId unique id generated for every subscription
    //    */
    mod_event.subscribe = function subscribe(name, eventCallback, options) {
      if (name instanceof Array) {
        const eventIds = [];
        for (let i = 0; i < name.length; i += 1) {
          eventIds.push(mod_event.subscribe(name[i], eventCallback, options));
        }
        return eventIds;
      }
      if (!name || !eventCallback) {
        return null;
      }
      if (!pubsub[name]) {
        pubsub[name] = {};
      }
      const eventId = `${name}:${generateUid()}`;
      pubsub[name][eventId] = eventCallback;
      //TODO find better way
      //Setting callback in options so that it can be used in onsubscribe event.
      const newOptions = options;
      if (options) {
        newOptions.__callback = eventCallback;
      }
      //Calling onsubscribe events
      mod_event.publish(onsubscribe_prefix + name, newOptions);
      return eventId;
    };
    //   /**
    //    * Unsubscribe an event
    //    *
    //    * @param eventId id of the event to be unsubscribed
    //    * @returns boolean true if event is successfully unsubscribed,else false
    //    */
    mod_event.unsubscribe = function unsubscribe(eventId) {
      if (!eventId) {
        return null;
      }
      const eventArr = eventId.split(':');
      if (eventArr.length === 2) {
        const eventName = eventArr[0];
        //            var eventNum = eventArr[1];
        if (pubsub[eventName][eventId]) {
          delete pubsub[eventName][eventId];
          return true;
        }
      }
      return false;
    };
    //   /**
    //    * Get all the subscribed events in an object
    //    *
    //    *
    //    * @param name Event name for which all events are required
    //    * @returns Event object for the provided event name
    //    */
    mod_event.getSubscriptions = function getSubscriptions(name) {
      if (!name) {
        return pubsub; //todo return cloned object istead of original
      }
      return pubsub[name];
    };
    //   /**
    //    * Used to subscribe to subscribe events, onsubscribe('method1') is called when subscribe('method1') is called
    //    * This can be used to setup data / setup publish events
    //    *
    //    * @param name
    //    * @param eventCallback
    //    * @returns {string}
    //    */
    mod_event.onsubscribe = function onsubscribe(name, eventCallback) {
      let newName = name;
      if (!newName || !eventCallback) {
        return null;
      }
      newName = onsubscribe_prefix + newName;
      if (!pubsub[newName]) {
        pubsub[newName] = {};
      }
      const eventId = `${newName}:${generateUid()}`;
      pubsub[newName][eventId] = eventCallback;
      return eventId;
    };
    return mod_event;
  })();

  // TimesApps.loadJs = function loadJs(url, cb, nodeid) {
  //   const head = document.getElementsByTagName('head')[0];
  //   const s = document.createElement('script');
  //   s.type = 'text/javascript';
  //   s.src = url;
  //   s.async = true;
  //   s.id = nodeid || s.id;
  //   const ieCallback = function ieCallback(el, callback) {
  //     if (el.readyState === 'loaded' || el.readyState === 'complete') {
  //       callback();
  //     } else {
  //       setTimeout(() => {
  //         ieCallback(el, callback);
  //       }, 20);
  //     }
  //   };
  //   if (typeof cb === 'function') {
  //     if (typeof s.addEventListener !== 'undefined') {
  //       s.addEventListener('load', cb, false);
  //       s.addEventListener('error', cb, false);
  //     } else {
  //       s.onreadystatechange = function onreadystatechange() {
  //         s.onreadystatechange = null;
  //         ieCallback(s, cb);
  //       };
  //     }
  //   }
  //   head.appendChild(s);
  // };

  TimesApps.FLAGS = {
    READY: 'READY',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    COMPLETED: 'COMPLETED',
    AD_COMPLETED: 'AD_COMPLETED',
    REPLAY: 'REPLAY',
    NEXT_VIDEO: 'NEXT_VIDEO',
  };

  TimesApps.VideoPlayer2 = (function createVideoPlayer2() {
    const defaultConfig = {};

    const data = {
      playerLoaded: false,
      playerState: undefined,
      videoMap: {},
    };
    const _setPlayerFlags = function _setPlayerFlags(dataObj) {
      if (!(dataObj instanceof Array) && !dataObj.length) {
        return;
      }
      // const eventData = dataObj[0] || {};
      const eventType = dataObj[1] ? dataObj[1].toUpperCase() : '';

      const { FLAGS } = TimesApps;

      switch (eventType) {
        case 'VIDEOREADY':
          data.playerState = FLAGS.READY;
          pauseOtherPlayers();
          break;
        case 'VIDEOVIEW':
          data.playerState = FLAGS.PLAYING;
          break;
        case 'PAUSED':
          data.playerState = FLAGS.PAUSED;
          break;
        case 'VIDEOCOMPLETE':
          data.playerState = FLAGS.COMPLETED;
          break;
        case 'START':
          data.playerState = FLAGS.PLAYING;
          pauseOtherPlayers();
          break;
        case 'RESUME':
          data.playerState = FLAGS.PLAYING;
          pauseOtherPlayers();
          break;
        case 'ADCOMPLETE':
          data.playerState = FLAGS.AD_COMPLETED;
          break;
        case 'REPLAY':
          data.playerState = FLAGS.REPLAY;
          break;
        case 'ONNEXTVIDEOPLAY':
          data.playerState = FLAGS.NEXT_VIDEO;
          break;
        default:
        //case 'ADSKIP':
      }
    };
    const bindPlayerEvents = function bindPlayerEvents() {
      const pubSub = TimesApps.PubSub;
      pubSub.subscribe('VOD_EVENTS', _setPlayerFlags);
    };
    const fn = {
      _init() {
        fn._loadAssets();
        bindPlayerEvents();
      },
      _loadAssets() {
        const playerJs = document.createElement('script');
        /*changing slike sdk for slike testing, please compare version with toi HP*/

        playerJs.src = `//tvid.in/sdk/slikeloader.js`;

        if (asyncLoadSdkjs) {
          playerJs.async = true;
          playerJs.defer = true;
        }
        // const scriptTag = document.getElementsByTagName('script')[0];

        const slikeJsOnloadCB = function slikeJsOnloadCB(event) {
          // console.log('##video slike initiated');
          data.playerLoaded = true;
          /*if(typeof require !="undefined"){
                      var pubSub = require("tiljs/event");
                  }else{
                      var pubSub = TimesApps.PubSub;
                  }*/
          const pubSub = TimesApps.PubSub;
          pubSub.publish('slikeLoaded');

          //for GA
          const { playerName } = TimesApps.player;
          const eventData = {};
          eventData.source = mainConfig.source;
          eventData.loadStatus = (event && event.type) || '';
          eventData.stream = 'CONTENT';
          eventData.userInitiated = mainConfig.userInitiated || '';
          eventData.id = mainConfig.msid || '';
          pubSub.publish(`${playerName}_EVENTS`, [
            eventData,
            'slikeLoaded'.toUpperCase(),
          ]);
        };

        // const slikePlayerJSLoad = () => {
        //   TimesApps.loadJs(playerJs.src, slikeJsOnloadCB, '');
        // };
        if (
          (typeof window.player === 'object' &&
            (typeof window.player.load === 'function' ||
              (window.player.length > 0 &&
                window.player[window.player.length - 1].load ===
                  'function'))) ||
          isVideoshow
        ) {
          slikeJsOnloadCB();
        } else {
          loadPlayerJSFiles(slikeJsOnloadCB);
          // TimesApps.loadJs(
          //   '//imasdk.googleapis.com/js/sdkloader/ima3.js',
          //   slikePlayerJSLoad,
          //   'ima3_sdk_js',
          // );
        }
      },
      _addVideo(domSelector, config, playerId) {
        if (!data.playerLoaded) {
          return;
        }

        (function publishVideoLoadRequest() {
          const pubSub = TimesApps.PubSub;
          const { playerName } = TimesApps.player;
          const eventData = {};
          eventData.source = mainConfig.source;
          eventData.stream = 'CONTENT';
          eventData.userInitiated = mainConfig.userInitiated || '';
          eventData.id = mainConfig.msid || '';
          pubSub.publish(`${playerName}_EVENTS`, [
            eventData,
            'VIDEOLOADREQUEST',
          ]);
        })();

        // TimesApps.SlikeTrackerPixels('BEFORE_S_LOAD');
        const handlePlayerEvents = (player) => {
          function eventToFunction(playerData, eventName, eventData) {
            const funcName = eventName.replace('spl', 'on');
            const updatedEventData = {
              ...eventData,
              ...playerData.store.video,
            };
            const playerEvents = TimesApps.playerCallbacks;
            if (playerEvents && typeof playerEvents[funcName] === 'function') {
              let eventCallback = () => {};
              if (
                typeof eventsCallbackMap === 'object' &&
                typeof eventsCallbackMap[funcName] === 'function'
              ) {
                eventCallback = eventsCallbackMap[funcName];
              }
              playerEvents[funcName](
                updatedEventData,
                playerData,
                funcName,
                eventCallback,
                config,
              );
            }
          }
          Object.keys(window.SlikePlayer.Events).forEach((eventKey) => {
            const eventName = window.SlikePlayer.Events[eventKey];
            player
              // .off(eventName)
              .on(eventName, eventToFunction.bind(null, player));
          });
        };

        const handleAdEvents = (player) => {
          function eventToFunction(playerData, eventName, eventData) {
            const funcName = eventName.replace('spl', 'on');
            const adEvents = TimesApps.adsEventCallbacks;
            const adEventData = eventData || {};
            if (adEvents && typeof adEvents[funcName] === 'function') {
              let eventCallback = () => {};
              if (
                typeof eventsCallbackMap === 'object' &&
                typeof eventsCallbackMap[funcName] === 'function'
              ) {
                eventCallback = eventsCallbackMap[funcName];
              }
              adEvents[funcName](player, funcName, adEventData, eventCallback);
            }

            // if (adEvents && typeof adEvents[funcName] === 'function') {
            //   let eventCallback = () => {};
            //   if (
            //     typeof eventsCallbackMap === 'object' &&
            //     typeof eventsCallbackMap[funcName] === 'function'
            //   ) {
            //     eventCallback = eventsCallbackMap[funcName];
            //   }
            //   adEvents[funcName](
            //     adEventData,
            //     playerData,
            //     funcName,
            //     eventCallback,
            //   );
            // }
          }
          Object.keys(window.SlikePlayer.AdEvents).forEach((eventKey) => {
            const eventName = window.SlikePlayer.AdEvents[eventKey];
            player
              // .off(eventName)
              .on(eventName, eventToFunction.bind(null, player));
          });
        };
        const slikePlayerCallback = (status, inst, msid) => {
          //player is lnitialized now...
          if (status && intantiateNewPlayer) {
            if (window.location.href.indexOf('/articleshow/') > -1) {
              if (window.player?.length) {
                window.player[window.player.length] = new window.SlikePlayer(
                  inst,
                );
              } else {
                window.player = [];
                window.player[0] = new window.SlikePlayer(inst);
              }
            } else {
              window.player = new window.SlikePlayer(inst);
            }
            // handleAdEvents(window.player);
          }

          // eslint-disable-next-line no-param-reassign
          config.player.msid = msid || config.player.msid;

          const playerInst =
            window.player?.length > 0
              ? window.player[window?.player?.length - 1]
              : window.player;

          handlePlayerEvents(playerInst);
          handleAdEvents(playerInst);
          //const { player } = window;
          data.videoMap[playerId] = playerInst;

          //trigger video loaded
          const pubSub = TimesApps.PubSub;
          const eventData = {};
          //eventData.source = TimesApps.player.playerName;
          eventData.domSelector = domSelector;
          eventData.source = mainConfig.source;
          eventData.userInitiated = mainConfig.userInitiated || '';
          eventData.stream = 'CONTENT';
          eventData.id = mainConfig.msid || '';
          pubSub.publish('slikeVideoLoaded', [eventData]);
          if (callbackOutside) {
            callbackOutside(inst);
          }
          (function publishVideoPlayerCreated() {
            // const pubSub = TimesApps.PubSub;
            const { playerName } = TimesApps.player;
            pubSub.publish(`${playerName}_EVENTS`, [
              eventData,
              'VIDEOPLAYERCREATED',
            ]);
          })();
          // TimesApps.SlikeTrackerPixels('AFTER_S_LOAD');
        };
        function callWindowSLoad() {
          // eslint-disable-next-line func-names
          const callsloadfn = function () {
            // if (!window.slikesdkloadedcompletely) {
            //   setTimeout(callsloadfn, 30);
            // } else {
            //   try {
            //     window.S.load(domSelector, config, slikePlayerCallback);
            //   } catch (err) {
            //     //console.llog(err)
            //   }
            // }
            config.player = {
              ...config?.player,
              contWidth: document.getElementById(domSelector)?.offsetWidth || 0,
              contHeight:
                document.getElementById(domSelector)?.offsetHeight || 0,
            };
            const PLAYER_CONFIG = {
              ...config,
              contEl: domSelector,
            };
            if (
              (intantiateNewPlayer || !typeof window.player === 'object') &&
              window.spl &&
              window.spl.load
            ) {
              window.spl.load(PLAYER_CONFIG, slikePlayerCallback);
            } else {
              // window.TimesApps.slikePlayerCallback();
              // window.player.load(PLAYER_CONFIG);
              const plyInst =
                typeof window.player === 'object' && window.player.length > 0
                  ? window.player[window.player.length - 1]
                  : window.player;
              plyInst.load({
                id: config.player.id,
                playerType: config.player.playerType || '',
                msid: config.player.msid,
              });
            }
          };
          callsloadfn();
        }
        try {
          callWindowSLoad();
          //window.S.load(domSelector, config, slikePlayerCallback);
        } catch (err) {
          // window.S.load(domSelector, config, slikePlayerCallback);
        }
      },
      _getVideo(playerId) {
        let videoPlayer;
        if (window.player === 'object') {
          //videoPlayer = window.player;
          videoPlayer =
            window.player.length > 0
              ? window.player[window.player.length - 1]
              : window.player;
        } else {
          videoPlayer = data.videoMap[playerId];
        }

        return videoPlayer;
      },
      _pause(playerId) {
        /*
         *temporary hack
         *issue with slike
         *reference is broken
         *points to old instance
         */
        let player;
        const playerName = playerId
          ? this.playerName
          : TimesApps.player.playerName;
        if (typeof window.player === 'object') {
          //player = window.player;
          player =
            window.player.length > 0
              ? window.player[window.player.length - 1]
              : window.player;
        } else {
          player = fn._getVideo(playerName);
        }

        if (TimesApps.isDevMode) {
          console.log(`${'VOD_status_pausing__'}${playerId}`);
        }
        player.pause();
      },
      _play(playerId) {
        const player = fn._getVideo(playerId);
        player.play();
      },
      _setNextVideo(nextVideoObject, playerId) {
        //const player = fn._getVideo(playerId) || window.player;
        const player =
          fn._getVideo(playerId) ||
          (window.player.length > 0
            ? window.player[window.player.length - 1]
            : window.player);
        player.setNextData(nextVideoObject);
      },
      _setCurrentVideoInPlaylist(nextVideoObject, playerId) {
        //const player = fn._getVideo(playerId) || window.player;
        const player =
          fn._getVideo(playerId) ||
          (window.player.length > 0
            ? window.player[window.player.length - 1]
            : window.player);
        player.setPlaylistData(nextVideoObject);
      },
      _getPlayerState() {
        return data.playerState;
      },
    };

    const api = {
      init() {
        fn._init();
      },
      addPlayer(domSelector, config, playerId) {
        fn._addVideo(domSelector, config, playerId);
      },
      getPlayer(playerId) {
        return fn._getVideo(playerId);
      },
      getConfig() {
        return defaultConfig;
      },
      isSlikeLoaded() {
        return data.playerLoaded;
      },
      pause(playerId) {
        fn._pause(playerId);
      },
      play(playerId) {
        fn._play(playerId);
      },
      setNextVideo(nextVideoObject, playerId) {
        fn._setNextVideo(nextVideoObject, playerId);
      },
      setCurrentVideoInPlaylist(nextVideoObject, playerId) {
        fn._setCurrentVideoInPlaylist(nextVideoObject, playerId);
      },
      getPlayerState() {
        return fn._getPlayerState();
      },
    };

    return api;
  })();

  TimesApps.adsEventCallbacks = {
    handleAdsEvent(playerData, event, eventName, eventCallback) {
      const adData = event || {};
      // const playerData =
      //   data && data instanceof Array && data[1] ? data[1] : {};
      const eventTypeMap = {
        onAdComplete: 'ADCOMPLETE',
        onAdSkip: 'ADSKIP',
        onAdView: 'ADVIEW',
        onAdLoaded: 'AdLoaded',
        onAdRequest: 'ADREQUEST',
        onAdResume: 'ADRESUME',
        onAdStart: 'ADSTART',
        onAdPause: 'ADPAUSED',
      };
      const eventData = event || {};
      eventData.stream = 'AD';
      eventData.adtype = adData.type;
      const { playerName } = TimesApps.player;
      eventData.source = mainConfig.source;
      eventData.userInitiated = mainConfig.userInitiated || '';
      eventData.adErrorcode = adData.errorCode || '';
      eventData.campaignId = adData.campaignId || '';
      eventData.isHls = adData.isHls || false;
      let eventType = adData.state ? adData.state.toUpperCase() : '';
      const pubSub = TimesApps.PubSub;
      eventType = eventTypeMap[eventName];
      pubSub.publish(`${playerName}_EVENTS`, [eventData, eventType]);
      if (TimesApps.isDevMode) {
        console.log(`VOD_status_ADS_${eventData.source}__${eventType}`);
      }
      // console.log('The type is ', eventType);
      triggerEvent(`${playerName}_EVENTS`, [eventData, eventType]);
      // const VIDEO_AD_SKIP_Event = new CustomEvent('VIDEO_EVENTS', {
      //   detail: eventType,
      // });
      // window.dispatchEvent(VIDEO_AD_SKIP_Event);
      if (typeof eventCallback === 'function') {
        eventCallback();
      }
    },
    onAdView(playerData, eventName, event, eventCallback) {
      TimesApps.adsEventCallbacks.handleAdsEvent(
        playerData,
        event,
        eventName,
        eventCallback,
      );
    },

    onAdComplete(playerData, eventName, event, eventCallback) {
      TimesApps.adsEventCallbacks.handleAdsEvent(
        playerData,
        event,
        eventName,
        eventCallback,
      );
    },

    onAdSkip(playerData, eventName, event, eventCallback) {
      TimesApps.adsEventCallbacks.handleAdsEvent(
        playerData,
        event,
        eventName,
        eventCallback,
      );
    },

    onAdLoaded(playerData, eventName, event, eventCallback) {
      TimesApps.adsEventCallbacks.handleAdsEvent(
        playerData,
        event,
        eventName,
        eventCallback,
      );
    },

    onAdRequest(playerData, eventName, event, eventCallback) {
      TimesApps.adsEventCallbacks.handleAdsEvent(
        playerData,
        event,
        eventName,
        eventCallback,
      );
    },

    onAdStart(playerData, eventName, event, eventCallback) {
      TimesApps.adsEventCallbacks.handleAdsEvent(
        playerData,
        event,
        eventName,
        eventCallback,
      );
    },

    onAdPause(playerData, eventName, event, eventCallback) {
      TimesApps.adsEventCallbacks.handleAdsEvent(
        playerData,
        event,
        eventName,
        eventCallback,
      );
    },

    onAdResume(playerData, eventName, event, eventCallback) {
      TimesApps.adsEventCallbacks.handleAdsEvent(
        playerData,
        event,
        eventName,
        eventCallback,
      );
    },
  };

  // /*callbacks for video events*/
  TimesApps.playerCallbacks = {
    onInit(playerData, event, eventName, eventCallback) {
      const { playerName } = TimesApps.player;
      const newEventData = playerData || {} || event;
      newEventData.source = mainConfig.source;
      newEventData.stream = 'CONTENT';
      newEventData.userInitiated = mainConfig.userInitiated || '';
      newEventData.id = mainConfig.msid || '';
      const eventType = 'VIDEOINIT';
      //console.log('PLAYER_EVENT....'+eventType);
      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [newEventData, eventType]);
      triggerEvent(`${playerName}_EVENTS`, [
        newEventData,
        eventType,
        event.id || '',
      ]);

      if (typeof eventCallback === 'function') {
        const eventData = playerData || {};
        eventCallback(eventType, eventData);
      }

      //triggerEvent(playerName+'_EVENTS', [eventData, eventType]);
    },
    onReady(playerData, event, eventName, eventCallback) {
      const { playerName } = TimesApps.player;
      let newEventData = playerData || event || {};
      if (typeof newEventData !== 'object') {
        newEventData = {};
      }
      newEventData.source = mainConfig.source;
      newEventData.stream = 'CONTENT';
      newEventData.userInitiated = mainConfig.userInitiated || '';
      newEventData.id = mainConfig.msid || '';
      const eventType = 'VIDEOREADY';
      //console.log('PLAYER_EVENT....'+eventType);
      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [newEventData, eventType]);
      triggerEvent(`${playerName}_EVENTS`, [
        newEventData,
        eventType,
        event.id || '',
      ]);

      if (typeof eventCallback === 'function') {
        const eventData = playerData || {};
        eventCallback(eventType, eventData);
      }
    },
    onVideoStarted(playerData, event, eventName, eventCallback) {
      const pubSub = TimesApps.PubSub;
      const { playerName } = TimesApps.player;
      const eventData = playerData || {};
      eventData.source = mainConfig.source;
      eventData.stream = 'CONTENT';
      eventData.userInitiated = mainConfig.userInitiated || '';
      let eventType = 'START';
      // pubSub.publish(`${playerName}_EVENTS`, [eventData, eventType]);
      // const pageType = TimesApps.pagetype || '';
      if (isPodcast) {
        eventType = 'AUDIOVIEW';
      } else {
        eventType = 'VIDEOVIEW';
      }
      if (typeof addToWatched === 'function') {
        addToWatched(mainConfig.msid);
      }
      // const msid = playerConfig.player.msid;
      const plyInst =
        typeof window.player === 'object' && window.player.length > 0
          ? window.player[window.player.length - 1]
          : window.player;
      pubSub.publish(`${playerName}_EVENTS`, [
        eventData,
        eventType,
        plyInst.store.mediaConfig.id,
      ]);
      // triggerEvent(`${playerName}_EVENTS`, [eventData, eventType, msid]);
      if (typeof eventCallback === 'function') {
        eventCallback(eventType, eventData);
      }
    },
    onVideoResumed(playerData, event, eventName, eventCallback) {
      //trigger event for pause
      const eventData = playerData || {};
      const { playerName } = TimesApps.player;
      eventData.userInitiated = mainConfig.userInitiated || '';
      eventData.source = mainConfig.source;
      const newEventType = 'PLAYING';

      if (TimesApps.isDevMode) {
        console.log(`VOD_status_${eventData.source}__${newEventType}`);
      }
      triggerEvent(`${playerName}_EVENTS`, [eventData, newEventType]);

      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [eventData, newEventType]);
      if (typeof eventCallback === 'function') {
        eventCallback(newEventType, eventData);
      }
    },
    onVideoPaused(playerData, event, eventName, eventCallback) {
      //trigger event for pause
      const eventData = playerData || {};
      const { playerName } = TimesApps.player;
      eventData.userInitiated = mainConfig.userInitiated || '';
      eventData.source = mainConfig.source;
      const newEventType = 'PAUSED';

      if (TimesApps.isDevMode) {
        console.log(`VOD_status_${eventData.source}__${newEventType}`);
      }
      triggerEvent(`${playerName}_EVENTS`, [eventData, newEventType]);

      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [eventData, newEventType]);
      if (typeof eventCallback === 'function') {
        eventCallback(newEventType, eventData);
      }
    },
    onVideoFullscreenchange(playerData, event, eventName, eventCallback) {
      const eventData = playerData || {};
      const { playerName } = TimesApps.player;
      eventData.source = mainConfig.source;
      eventData.userInitiated = mainConfig.userInitiated || '';
      let newEventType = event.eventType;
      newEventType = newEventType === true ? 'FULLSCREEN_ON' : 'FULLSCREEN_OFF';
      const pubSub = TimesApps.PubSub;
      if (newEventType === 'FULLSCREEN_ON') {
        pubSub.publish(`${playerName}_EVENTS`, [eventData, newEventType]);
      }

      if (typeof eventCallback === 'function') {
        eventCallback(newEventType, eventData);
      }
    },

    onVideoEnded(playerData, event, eventName, eventCallback, playerConfig) {
      //called when video ends...
      const { playerName } = TimesApps.player;
      const eventData = playerData || {};
      eventData.source = mainConfig.source;
      eventData.stream = 'CONTENT';
      eventData.userInitiated = mainConfig.userInitiated || '';
      const eventType = 'VIDEOEND';

      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [
        eventData,
        eventType,
        playerConfig.player.msid || '',
      ]);
      const plyInst =
        typeof window.player === 'object' && window.player.length > 0
          ? window.player[window.player.length - 1]
          : window.player;
      triggerEvent(`${playerName}_EVENTS`, [
        eventData,
        eventType,
        plyInst.store.mediaConfig.id,
      ]);
      // if (
      //   TimesApps.PlayerUtils &&
      //   TimesApps.PlayerUtils.sendDataToParentWindow
      // ) {
      //   TimesApps.Utils.sendDataToParentWindow(`${playerName}_EVENTS`, [
      //     eventData,
      //     eventType,
      //     playerConfig.player.msid || '',
      //   ]);
      // }
      if (typeof eventCallback === 'function') {
        eventCallback(eventType, eventData);
      }
    },

    onVideoCompleted(
      playerData,
      event,
      eventName,
      eventCallback,
      playerConfig,
    ) {
      //called when video ends...
      const { playerName } = TimesApps.player;
      const eventData = playerData || {};
      eventData.source = mainConfig.source;
      eventData.stream = 'CONTENT';
      eventData.userInitiated = mainConfig.userInitiated || '';
      const eventType = 'VIDEOCOMPLETE';

      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [
        eventData,
        eventType,
        playerConfig.player.msid || '',
      ]);
      const plyInst =
        typeof window.player === 'object' && window.player.length > 0
          ? window.player[window.player.length - 1]
          : window.player;
      triggerEvent(`${playerName}_EVENTS`, [
        eventData,
        eventType,
        plyInst.store.mediaConfig.id,
      ]);
      // if (
      //   TimesApps.PlayerUtils &&
      //   TimesApps.PlayerUtils.sendDataToParentWindow
      // ) {
      //   TimesApps.Utils.sendDataToParentWindow(`${playerName}_EVENTS`, [
      //     eventData,
      //     eventType,
      //     playerConfig.player.msid || '',
      //   ]);
      // }
      dockVideoPlayer();
      if (typeof eventCallback === 'function') {
        eventCallback(eventType, eventData);
      }
    },
    /*onEndScreenAutoPlay(nextVideoData) {
      //called when next video is autoplayed
      const { playerName } = TimesApps.player;
      const eventData = nextVideoData || {};
      eventData.source = mainConfig.source;
      eventData.stream = 'CONTENT';
      //empty string resolves to false
      mainConfig.userInitiated = '';
      eventData.userInitiated = mainConfig.userInitiated || '';

      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [eventData, 'onNextVideoPlay']);

      triggerEvent(`${playerName}_EVENTS`, [eventData, 'onNextVideoPlay']);
    },*/
    onVideoNext(layerData, event, eventName, eventCallback) {
      //called when user clicks to play next video
      const pubSub = TimesApps.PubSub;
      const { playerName } = TimesApps.player;
      const eventData = {};
      // const eventData = nextVideoData || {};
      eventData.source = mainConfig.source;
      eventData.stream = 'CONTENT';
      eventData.userInitiated = true;

      pubSub.publish(`${playerName}_EVENTS`, [
        eventData,
        'onNextVideoPlay',
        layerData,
      ]);

      triggerEvent(`${playerName}_EVENTS`, [
        eventData,
        'onNextVideoPlay',
        layerData,
      ]);
      if (typeof eventCallback === 'function') {
        eventCallback(eventName, eventData);
      }
    },
    /*onEndScreenReplay(adData, playerData) {
      //called, when replay is clicked
      const pubSub = TimesApps.PubSub;
      const { playerName } = TimesApps.player;
      const eventData = playerData || {};
      eventData.source = mainConfig.source;
      eventData.stream = 'CONTENT';
      eventData.userInitiated = true;

      pubSub.publish(`${playerName}_EVENTS`, [eventData, 'REPLAY']);
      pubSub.publish(`${playerName}_EVENTS`, [eventData, 'VIDEOREQUEST']);
      //console.log('PLAYER_EVENT....'+eventType);
      if (TimesApps.isDevMode) {
        console.log(':::::onEndScreenReplay::::', adData, playerData);
      }
    },*/
    /*onEndScreenPlay(nextVideoData) {
      //called when user clicks
      //bottom right ribbon to play next video
      if (TimesApps.isDevMode) {
        console.log(':::::onEndScreenPlay::::', nextVideoData);
      }
      const pubSub = TimesApps.PubSub;
      const { playerName } = TimesApps.player;
      const eventData = nextVideoData || {};
      eventData.source = mainConfig.source;
      eventData.stream = 'CONTENT';
      eventData.userInitiated = true;

      pubSub.publish(`${playerName}_EVENTS`, [eventData, 'onNextVideoPlay']);

      triggerEvent(`${playerName}_EVENTS`, [eventData, 'onNextVideoPlay']);
    },*/
    // onDimClick(isAlreadyDim, playerData) {
    //   const { playerName } = TimesApps.player;
    //   const eventData = playerData || {};
    //   eventData.source = mainConfig.source;
    //   eventData.userInitiated = mainConfig.userInitiated || '';
    //   eventData.isAlreadyDim = isAlreadyDim;
    //   const eventType = 'DIM_TOGGLE';
    //   const pubSub = TimesApps.PubSub;
    //   pubSub.publish(`${playerName}_EVENTS`, [eventData, eventType]);

    //   if (
    //     TimesApps.PlayerUtils &&
    //     TimesApps.PlayerUtils.sendDataToParentWindow
    //   ) {
    //     TimesApps.PlayerUtils.sendDataToParentWindow(`${playerName}_EVENTS`, [
    //       eventData,
    //       eventType,
    //     ]);
    //   }
    // },
    onAutoPlayClick(adData, playerData) {
      const { playerName } = TimesApps.player;
      const eventData = playerData || {};
      eventData.source = mainConfig.source;
      eventData.userInitiated = mainConfig.userInitiated || '';
      const eventType = 'VIDEOAUTOPLAY_TOGGLE';
      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [eventData, eventType]);
    },
    onVolumeChange(playerData, event, eventName, eventCallback) {
      const { playerName } = TimesApps.player;
      const eventData = playerData || {};
      eventData.source = mainConfig.source;
      eventData.userInitiated = mainConfig.userInitiated || '';

      const eventType = 'OnVolumeChange';
      const pubSub = TimesApps.PubSub;
      pubSub.publish(`${playerName}_EVENTS`, [eventData, eventType]);
      if (typeof eventCallback === 'function') {
        eventCallback(eventType, eventData);
      }
    },
    onHeaderReady(eventData) {
      const { playerName } = TimesApps.player;
      const newEventData = eventData || {};
      newEventData.source = mainConfig.source;
      newEventData.userInitiated = mainConfig.userInitiated || '';

      const eventType = 'onHeaderReady';
      // var pubSub = TimesApps.PubSub;
      // pubSub.publish(playerName+'_EVENTS', [newEventData, eventType]);

      if (
        TimesApps.PlayerUtils &&
        TimesApps.PlayerUtils.sendDataToParentWindow
      ) {
        TimesApps.PlayerUtils.sendDataToParentWindow(`${playerName}_EVENTS`, [
          newEventData,
          eventType,
        ]);
      }
    },
    onVideoTimeUpdate(eventData) {
      if (typeof videoProgressCallback === 'function') {
        videoProgressCallback(eventData);
      }
    },
    // onVideoProgress(eventData) {
    //   //console.log('onVideoProgress', eventData);
    //   videoProgressCallback(eventData);
    // },
  };

  // TimesApps.SlikeTrackerPixelsData = {
  //   css: null,
  // };
  // TimesApps.SlikeTrackerPixels = function SlikeTrackerPixels(type) {
  //   // const config = {};
  //   const id = mainConfig.mediaId;
  //   const pn = mainConfig.site; //Your Property short name here in 3 characters
  //   const apikey = mainConfig.slikeApiKey; //YOUR_APIKEY_HERE
  //   let OSName = 'Unknown OS';
  //   let css;
  //   let param;
  //   let rn;
  //   if (navigator.appVersion.indexOf('Win') !== -1) OSName = 'Windows';
  //   if (navigator.appVersion.indexOf('Mac') !== -1) OSName = 'MacOS';
  //   if (navigator.appVersion.indexOf('X11') !== -1) OSName = 'UNIX';
  //   if (navigator.appVersion.indexOf('Linux') !== -1) OSName = 'Linux';
  //   const osn = OSName; //OS NAME HERE
  //   const uan = navigator.userAgent; //UA NAME HERE
  //   const templateName = mainConfig.source; //TEMPLATE NAME HERE
  //   const ets = new Date().getTime();
  //   if (type === 'BEFORE_S_LOAD') {
  //     rn = 0 + Math.floor(Math.random() * 899999) + 1e5;
  //     css = `${id}.${pn}.${ets}.${rn}`;
  //     TimesApps.SlikeTrackerPixelsData.css = css;
  //     param = `res=pix&type=sdk&at=-4&apikey=${apikey}&ven=${pn}&k=${id}&css=${css}&osn=${osn}&uan=${uan}tpl${templateName}&ets=${ets}`;
  //   } else {
  //     css = TimesApps.SlikeTrackerPixelsData.css;
  //     param = `res=pix&type=sdk&at=-1&apikey=${apikey}&ven=${pn}&k=${id}&css=${css}&osn=${osn}&uan=${uan}tpl${templateName}&ets=${ets}`;
  //   }

  //   const prodUrl = 'https://slike.indiatimes.com/savelogs?';
  //   const baseurl = prodUrl;
  //   new Image().src = baseurl + param;
  // };

  TimesApps.ComscoreConfig = TimesApps.ComscoreConfig || {};

  if (TimesApps.Utils.checkGdprAndCall) {
    TimesApps.Utils.checkGdprAndCall(
      null,
      () => {
        TimesApps.ComscoreConfig.cs_ucfr = 0;
      },
      false,
    );
  }

  // //flag to check if next video has been played by the player
  // //used in case of videoshow and videolist
  TimesApps.playingSubsequentVideo = false;

  TimesApps.videoEventsMap = {
    START: 'START',
    //"PLAYING"        : "PLAYING",
    STOP: 'STOP',
    VIDEOCOMPLETE: 'VIDEOCOMPLETE',
    PAUSED: 'PAUSED',
    //"ADVIEW"         : "ADVIEW",
    ADCOMPLETE: 'ADCOMPLETE',
  };

  // /*
  //  *remvoe fn post Slike migration
  //  * check point, CMS INSERTED LIVE TV
  //  */
  const convertMinutesToMs = function convertMinutesToMs(timeInMinutes) {
    let timeInMs = 0;
    if (typeof timeInMinutes !== 'undefined') {
      const timeSplit = timeInMinutes.toString().split(':');
      const SECONDS_IN_A_MINUTE = 60;
      const MS_IN_A_SECOND = 1000;

      if (timeSplit.length === 2) {
        timeInMs = timeSplit[0] * SECONDS_IN_A_MINUTE * MS_IN_A_SECOND;
        timeInMs += timeSplit[1] * MS_IN_A_SECOND;
      } else if (timeSplit.length === 1) {
        timeInMs = timeSplit[0] * SECONDS_IN_A_MINUTE * MS_IN_A_SECOND;
      }
    }

    return timeInMs;
  };

  // /*
  //     currently moved to vod_player_js
  //     remove after moving to Utils for vod, live, minitv
  // */
  TimesApps.convertMinutesToMs =
    TimesApps.convertMinutesToMs || convertMinutesToMs;

  TimesApps.setAdStatus = function setAdStatus(
    contentType,
    eventType,
    adDuration,
  ) {
    if (contentType === 'AD') {
      if (eventType === 'PAUSED') {
        TimesApps.adStatus = 'PAUSED';
      } else if (eventType === 'START') {
        TimesApps.adStatus = 'PLAYING';
      } else if (eventType === 'ADCOMPLETE') {
        TimesApps.adStatus = 'ADCOMPLETE';
        TimesApps.isServingAdInFlashPlayer = false;
      } else if (eventType === 'ADSKIP') {
        TimesApps.adStatus = 'ADSKIP';
        TimesApps.isServingAdInFlashPlayer = false;
      } else if (eventType === 'ADDURATION') {
        //hack for flash players ( livetv, mini )
        //as insufficient data
        //is available with events in such cases
        TimesApps.isServingAdInFlashPlayer = true;
        TimesApps.adDuration = adDuration;
      }
    } else {
      //request was for content video
      //implies that ad has been skipped
      TimesApps.adStatus = 'ADCOMPLETE';
      TimesApps.isServingAdInFlashPlayer = false;
    }
  };

  const fireComscoreTrackingRequest = function fireComscoreTrackingRequest(
    comscoreCustomerId,
    eventType,
    contentType,
    stationTitle,
    publisherName,
    trackingDetails,
    videoObj,
  ) {
    const { ns_ } = window;
    if (
      typeof window.myStreamingTag === 'undefined' ||
      eventType === 'REPLAY'
    ) {
      window.myStreamingTag = new ns_.StreamingTag({
        customerC2: comscoreCustomerId,
      });
    }

    if (typeof TimesApps.videoEventsMap[eventType] === 'undefined') {
      //event is not in list of events to track
      return;
    }

    if (
      typeof comscoreCustomerId === 'undefined' ||
      comscoreCustomerId === ''
    ) {
      return;
    }
    let newContentType = contentType;
    if (TimesApps.isServingAdInFlashPlayer) {
      newContentType = 'AD';
    }

    try {
      if (
        eventType === 'START' ||
        eventType === 'PLAYING' ||
        eventType === 'ADVIEW'
      ) {
        if (newContentType === 'AD') {
          if (TimesApps.adStatus === 'PAUSED') {
            //ad was paused and has just switched to playing status
            //tracking not required
            return;
          }
          let adStr = '';
          if (typeof videoObj.pdata === 'undefined') {
            return;
          }
          const adposition = videoObj.pdata.adposition || '';
          if (adposition.toUpperCase() === 'PRE') {
            adStr = ns_.StreamingTag.AdType.LinearOnDemandPreRoll;
          } else {
            adStr = ns_.StreamingTag.AdType.LinearOnDemandPostRoll;
          }
          window.adDurationInMinutesFormat = `00:${
            videoObj.duration || videoObj.pdata.tottime || 0
          }`;
          const adDuration = TimesApps.convertMinutesToMs(
            window.adDurationInMinutesFormat,
          );
          window.myStreamingTag.playVideoAdvertisement(
            {
              ns_st_cl: adDuration,
            },
            adStr,
          );
        } else {
          let seoLocation = trackingDetails.seoLocation.split('/');
          if (seoLocation.length >= 2) {
            const seoLocationWithoutTitle = seoLocation.length - 1;
            seoLocation = seoLocation
              .slice(0, seoLocationWithoutTitle)
              .join('/');
          } else {
            seoLocation = trackingDetails.seoLocation;
          }
          const videoDuration = TimesApps.convertMinutesToMs(videoObj.duration);
          const metd = {
            ns_st_ci: videoObj.id || videoObj.videoid || 0,
            ns_st_cl: videoDuration || 0,
            ns_st_st: stationTitle,
            ns_st_pu: publisherName,
            ns_st_pr: seoLocation,
            ns_st_ep: videoObj.title,
            ns_st_sn: '*null',
            ns_st_en: '*null',
            ns_st_ge: trackingDetails.contentGenre,
            ns_st_ti: '*null',
            ns_st_ia: '0',
            ns_st_ce: '0',
            ns_st_ddt: trackingDetails.airDate,
            ns_st_tdt: trackingDetails.airDate,
            c3: trackingDetails.c3 || '*null',
            c4: '*null',
            c6: '*null',
          };
          if (TimesApps.ComscoreConfig.cs_ucfr === 0) {
            metd.cs_ucfr = TimesApps.ComscoreConfig.cs_ucfr;
          }
          window.myStreamingTag.playVideoContentPart(
            metd,
            ns_.StreamingTag.ContentType.ShortFormOnDemand,
          );
        }
      } else if (!(newContentType === 'AD' && eventType !== 'ADCOMPLETE')) {
        //STOP, VIDEOCOMPLETE, PAUSED
        window.myStreamingTag.stop();
      }
      TimesApps.setAdStatus(newContentType, eventType);
    } catch (e) {
      console.log(e);
    }
  };

  try {
    window.ga = window.ga || window.parent.ga;
  } catch (e) {
    console.log(e);
  }

  if (TimesApps.Utils && TimesApps.Utils.checkGdprAndCall) {
    TimesApps.Utils.checkGdprAndCall(null, () => {
      analyticsWrapper('gaAndGrx', 'set', 'anonymizeIp', true);
    });
  }

  TimesApps.sourceToLocationMapping = {
    MG_0: 'Homepage/topvideoswidget',
    MG: 'Homepage/trendingvideoswidget',
    ABOVEARTICLE: 'articleshow/lead',
    ARTICLEEMBED: 'articleshow/inline',
    'ARTICLESHOW/NIC': 'articleshow/nic',
    'ARTICLESHOW/RELATED': 'articleshow/related',
    VIDEOSHOW: 'videoshow',
    DAILYBRIEF: 'dailybrief',
    VIDEOSHOME: 'videoshome',
    MINI_TV: 'minitv',
    MG_LIVE_TV: 'livetvplugbottomright',
    LIVEHOME_LIVE_TV: 'livetvhome',
    'HOMEPAGE/LIVETVWIDGET': 'Homepage/livetvwidget',
    LIVEBLOG: 'liveblog',
    CMS_INSERTED_LIVE_TV: 'liveblog',
    CITYLANDINGPAGE: 'articlelist/city',
    CITYSPECIFIC: 'articlelist/city',
    SPORTS: 'articlelist/sports',
  };

  TimesApps.VideosGa = (function VideosGa() {
    // var fn, api, config;

    const config = {
      adErrorCodes: {
        101: 'VAST_SCHEMA_VALIDATION_ERROR',
        102: 'VAST_UNSUPPORTED_VERSION',
        200: 'VAST_TRAFFICKING_ERROR',
        201: 'VAST_UNEXPECTED_LINEARITY',
        202: 'VAST_UNEXPECTED_DURATION_ERROR',
        300: 'VAST_WRAPPER_ERROR',
        301: 'VAST_LOAD_TIMEOUT',
        302: 'VAST_TOO_MANY_REDIRECTS',
        303: 'VAST_NO_ADS_AFTER_WRAPPER',
        400: 'VIDEO_PLAY_ERROR',
        402: 'VAST_MEDIA_LOAD_TIMEOUT',
        403: 'VAST_LINEAR_ASSET_MISMATCH',
        500: 'OVERLAY_AD_PLAYING_FAILED',
        501: 'NONLINEAR_DIMENSIONS_ERROR',
        503: 'VAST_NONLINEAR_ASSET_MISMATCH',
        602: 'COMPANION_REQUIRED_ERROR',
        900: 'UNKNOWN_ERROR',
        1005: 'FAILED_TO_REQUEST_ADS',
        1007: 'VAST_ASSET_NOT_FOUND',
        1009: 'VAST_EMPTY_RESPONSE',
        1010: 'UNKNOWN_AD_RESPONSE',
        1011: 'UNSUPPORTED_LOCALE',
        1101: 'INVALID_ARGUMENTS',
        1105: 'INVALID_ADX_EXTENSION',
      },
    };

    const fn = {
      _getErrorLabelFromCode(errorCode) {
        return config.adErrorCodes[errorCode] || '';
      },
    };

    const api = {
      getErrorLabelFromCode(errorCode) {
        return fn._getErrorLabelFromCode(errorCode);
      },
    };

    return api;
  })();

  TimesApps.prepareDataForGA = function prepareDataForGA(
    event,
    eventData,
    eventType,
  ) {
    const videoId = eventData.source ? eventData.source.toUpperCase() : '';
    const articleshowIdList = {
      ABOVEARTICLE: 'ABOVEARTICLE',
      ARTICLEEMBED: 'ARTICLEEMBED',
      'ARTICLESHOW/NIC': 'ARTICLESHOW/NIC',
    };

    const newEventType = eventType ? eventType.toUpperCase() : '';
    let timeTakenToVideoReady;
    if (newEventType === 'VIDEOREQUEST') {
      TimesApps.videoRequestTime = Date.now();
    } else if (newEventType === 'VIDEOREADY') {
      timeTakenToVideoReady = Date.now() - TimesApps.videoRequestTime;
    }

    let isAutoplayOn = false;
    const pageName = mainConfig.pageName || '';

    if (
      pageName === 'HP' &&
      typeof window.parentparent.TimesApps !== 'undefined' &&
      typeof window.parent.TimesApps.VideoGalleryApp !== 'undefined' &&
      videoId === 'MG_0'
    ) {
      //taking status from VideoGalleryApp
      const videoList = window.parent.TimesApps.VideoGalleryApp.getVideoList();
      const video = videoList[videoId];

      if (typeof video !== 'undefined') {
        // const domEle = video.domEle;
        isAutoplayOn = video.config.autoplay;
      }
    } else if (
      TimesApps.playingSubsequentVideo &&
      eventData.userInitiated !== '' &&
      !eventData.userInitiated
    ) {
      isAutoplayOn = true;
    } else if (
      eventData.userInitiated === '0' ||
      eventData.userInitiated === ''
    ) {
      isAutoplayOn = true;
    } else if (typeof articleshowIdList[videoId] !== 'undefined') {
      /*var Get_Ckie_str = window.parent.Get_Ckie_str;
          if( videoId == "ABOVEARTICLE" && typeof Get_Ckie_str == "function" ){
              var autoplayCookie = Get_Ckie_str("auto_off");
              if( autoplayCookie != 'true' ){
                  isAutoplayOn = true;
              }
          }*/
      isAutoplayOn = false;
    } else if (
      videoId === 'CMS_INSERTED_LIVE_TV' ||
      (videoId === 'MINI_TV' && !eventData.userInitiated)
    ) {
      isAutoplayOn = true;
    } else if (
      videoId !== 'VIDEOSHOW' &&
      videoId !== 'LIVEHOME_LIVE_TV' &&
      !eventData.userInitiated
    ) {
      try {
        if (localStorage.getItem('autoplay_userInitiated') !== 'on') {
          isAutoplayOn = true;
        }
      } catch (e) {
        console.log('local storage not available');
      }
    }
    let seoLocation = '';
    const videoLocationOnPage =
      TimesApps.sourceToLocationMapping[videoId] || eventData.source;
    if (!TimesApps.Vod_Player && TimesApps.playingSubsequentVideo) {
      //next video is triggerd from withing player
      // nextVideoObj = TimesApps.nextVideoObj;
      // var seoLocation = nextVideoObj.seopath;
    } else {
      // var seoLocation = '' || '';
      seoLocation = seoLocation.trim();
      seoLocation =
        seoLocation.length > 0 ? seoLocation : mainConfig.seoLocation;
    }

    //when no agency, passing blank to help
    //debug in GA
    const agency = mainConfig.agency || 'blank';

    TimesApps.fireGAevents(
      eventData,
      newEventType,
      isAutoplayOn,
      seoLocation,
      videoLocationOnPage,
      agency,
      timeTakenToVideoReady,
    );
  };

  TimesApps.fireGAevents = function fireGAevents(
    eventData,
    eventType,
    isAutoplayOn,
    seoLocation,
    videoLocationOnPage,
    agency,
    timeTakenToVideoReady,
  ) {
    const videoEventsMap = [
      'VIDEOREQUEST',
      'VIDEOREADY',
      'VIDEOVIEW',
      'VIDEOCOMPLETE',
      'VIDEOAUTOPLAY_TOGGLE',
      'ADREQUEST',
      'ADLOADED',
      'ADCOMPLETE',
      'ADSKIP',
      'ADVIEW',
      'AUDIOPLAY',
      'FULLSCREEN_ON',
      'DIM_TOGGLE',
      'ERROR',
    ];

    // const ga = window.ga || window.parent.ga;

    // if (typeof ga === 'undefined') {
    //   return;
    // }

    if (videoEventsMap.indexOf(eventType) === -1) {
      //event is not in list of events to track
      return;
    }

    let eventAction = '';
    let eventCat = eventType;

    if (timeTakenToVideoReady) {
      eventAction += `${timeTakenToVideoReady}ms_`;
    }
    const stxt = eventData.stxt ? eventData.stxt.toUpperCase() : '';
    let currentVideoURL = '';
    if (mainConfig.nextVideoURL && eventType !== 'VIDEOCOMPLETE') {
      currentVideoURL = mainConfig.nextVideoURL.includes('videosvideos')
        ? mainConfig.nextVideoURL.replace('/videosvideos', 'videos')
        : mainConfig.nextVideoURL;
    } else {
      currentVideoURL = `${seoLocation}/videoshow/${mainConfig.msid}.cms`;
    }
    switch (eventType) {
      case 'VIDEOAUTOPLAY_TOGGLE':
        //autoplay setting toggle event
        eventAction += stxt === 'OFF' ? 'Enable' : 'Disable';
        break;
      case 'FULLSCREEN_ON':
        eventCat = 'FULLSCREEN_ON';
        eventAction += `/${seoLocation}`;
        break;
      case 'DIM_TOGGLE':
        eventCat = 'VideoPlayer';
        eventAction += `${'Dim/'}${seoLocation}`;
        break;
      case 'ERROR':
        eventCat = 'AdError';
        eventAction = TimesApps.VideosGa.getErrorLabelFromCode(
          eventData.adErrorcode,
        );
        eventAction += `/${eventData.campaignId}`;
        break;
      case 'ADREQUEST':
        eventAction += eventData.type;
        break;
      case 'ADLOADED':
        eventAction += eventData.type;
        break;
      default:
        eventAction += isAutoplayOn ? 'autoplay' : 'user-initiated';
        eventAction += `/${currentVideoURL}`;
    }

    eventAction += `${'/_'}${agency}`;

    const playerState =
      (TimesApps.VideoPlayer2 && TimesApps.VideoPlayer2.getPlayerState()) || '';
    if (playerState === (TimesApps.FLAGS && TimesApps.FLAGS.REPLAY)) {
      eventAction += '/_replay';
    } else if (playerState === TimesApps.FLAGS.NEXT_VIDEO) {
      eventAction += '/_next_video';
    }

    //flash players don't provide streamType data, adaptive will be used in such cases
    let streamingtype = eventData.videoStream || eventData.kalstream || '';
    const plyInst =
      typeof window.player === 'object' && window.player.length > 0
        ? window.player[window.player.length - 1]
        : window.player;
    if (plyInst && plyInst.store && plyInst.store.streamType) {
      streamingtype = plyInst.store.streamType;
    }
    let playertype;
    if (
      eventData.contentid ||
      eventData.videoStream ||
      (eventData.type ? eventData.type : false)
    ) {
      //these properties are only
      //available in case of html5 player
      playertype = 'html';
    }

    if (eventCat === 'ADVIEW') {
      // console.log('**** is Ad type HLS -', eventData.isHls);
    }
    const eventLabelData = [];
    if (
      eventData.source === 'articleshow' &&
      (eventData.userInitiated === '0' || eventData.userInitiated === '')
    ) {
      eventLabelData.push('AS_AUTOPLAY');
    } else {
      eventLabelData.push(videoLocationOnPage);
    }

    if (eventType !== 'FULLSCREEN_ON') {
      if (playertype) {
        eventLabelData.push(playertype);
      }
      if (streamingtype) {
        eventLabelData.push(streamingtype);
      }
    }
    const blockVideoReqGa = eventType === 'VIDEOREQUEST';

    if (autoPlayLeadVideo || blockVideoReqGa) {
      return;
    }

    const viewEventsArr = [
      'VIDEOREQUEST',
      'VIDEOREADY',
      'VIDEOVIEW',
      'VIDEOCOMPLETE',
      'ADREQUEST',
      'ADLOADED',
      'ADCOMPLETE',
      'ADVIEW',
      'ERROR',
    ];

    //console.log("Video_GA_Fired.... "+eventCat);
    if (viewEventsArr.indexOf(eventType) !== -1) {
      analyticsWrapper(
        'gaAndGrx',
        'send',
        'event',
        eventCat,
        eventAction,
        eventLabelData.join('/'),
        { nonInteraction: 1 },
      );
    } else {
      analyticsWrapper(
        'gaAndGrx',
        'send',
        'event',
        eventCat,
        eventAction,
        eventLabelData.join('/'),
      );
    }
  };

  TimesApps.getPlayerConfig = function getPlayerConfig() {
    // let pageType = mainConfig.pageType || '';
    // pageType = pageType.toUpperCase();
    const section = mainConfig.section || TimesApps.getPageLocation() || '';
    const volume = TimesApps.Vod_Player.getVolume();
    const skipAds = TimesApps.Utils.shouldSkipAds();
    // eslint-disable-next-line no-shadow
    const { slikeApiKey } = mainConfig;
    let playlistUrl;

    let agency = mainConfig.agency || '';
    const regex = new RegExp(' ', 'g');

    agency = agency.replace(regex, '');
    const { msid, chapterId } = mainConfig;
    let { mediaId } = mainConfig;
    if (chapterId) {
      mediaId = `${mediaId}.${chapterId}`;
    }
    let playerId = mainConfig.playerType;
    playerId = parseInt(playerId, 10) === 10 ? playerId : 0;
    let playList = false;
    let playlistObj = [];
    if (
      Array.isArray(mainConfig.playlistData) &&
      mainConfig.playlistData.length > 0
    ) {
      playList = true;
      playlistObj = mainConfig.playlistData;
    }
    // const nextVideoCounter = mainConfig.nextVideoCounter || 5;
    //var allowDim = document.getElementById("allowDim").value || false;
    // const allowDim = parseInt(mainConfig.allowDim, 10) === 1;
    const source = mainConfig.source ? mainConfig.source.toUpperCase() : '';
    let conf;
    if (source.indexOf('ABOVEARTICLE') > -1) {
      //above article video, has values like ABOVEARTICLE_0, ABOVEARTICLE_1..
      conf = TimesApps.VOD_CONF.ABOVEARTICLE;
    } else if (source.indexOf('PRIME_TOPVOD') > -1) {
      conf = TimesApps.VOD_CONF.PRIME_TOPVOD;
    } else {
      conf = TimesApps.VOD_CONF[source] || TimesApps.VOD_CONF._default;
    }

    const showNextPrevButton =
      typeof conf.showNextPrevButton === 'undefined' || conf.showNextPrevButton;
    const showPrevButton =
      typeof conf.showPrevButton === 'undefined' || conf.showPrevButton;

    let bgImage = TimesApps.Utils.getVideoImg();

    // const { sectionId } = mainConfig;

    if (conf && conf.playlistUrl && typeof conf.playlistUrl === 'string') {
      if (conf.playlistUrl.indexOf('videpostroll_v8') > -1) {
        playlistUrl = `${getSiteDomain()}${
          conf.playlistUrl + msid
        }.cms?feedtype=json&dontshow=${msid}&callback=cached`;
      } else if (source.indexOf('ARTICLE') >= 0) {
        let articleMsid = window.parent.msid;
        if (
          typeof articleMsid === 'object' &&
          articleMsid.getAttribute('value')
        ) {
          articleMsid = articleMsid.getAttribute('value') || '';
        }
        playlistUrl = `${
          conf.playlistUrl + articleMsid
        }.cms?feedtype=json&dontshow=${msid}&callback=cached`;
      } else {
        playlistUrl = `${
          conf.playlistUrl + msid
        }.cms?feedtype=json&dontshow=${msid}&callback=cached`;
      }
      bgImage = undefined;
    }
    const dmpCookieValue = Cookie.get('_col_uuid');
    const configObj = {
      cookieId: dmpCookieValue,
      apiKey: slikeApiKey,
      height: '100%',
      width: '100%',
      origin: `${window.location.protocol}//${window.location.host}`,
      referrer: document.referrer,
      //css: "position:absolute;width:100%;height:100%",
      video: {
        image: bgImage,
        id: mediaId,
        title: mainConfig.title,
        playerType: playerId,
      },
      controls: {
        dock: false,
        showPipIcon: false,
        offlineVolume: false,
        offlineMute: false,
        hideCenterIcon: conf.hideCenterIcon,
        dimDefault: showInDimMode,
        showNextButton: isMobileMode ? false : showNextPrevButton,
        showPrevButton: isMobileMode
          ? false
          : showPrevButton && showNextPrevButton,
      },
      player: {
        // tryHlsAds: true,
        // portOut: 'pause',
        // portIn: 'play',
        mediaSession: isDockingEnabled || livetv,
        // copyConfig: true,
        // startFromSec: 0,
        skipYT: true,
        isGAPlugin: false,
        iphonefs: !!iphonefs,
        showTitle: false, // Made false. Implement shareUrl to enable it
        showLastVideoFrame: conf.showLastFrame,
        //custom start point
        nextVideoList:
          nextVideoMsidArray instanceof Array
            ? nextVideoMsidArray.splice(1, nextVideoMsidArray.length - 1)
            : [],
        fallbackMute: true,
        unmuteOnTap: false,

        /****** Ported from playerVar ******/
        image: bgImage,
        playerType: playerId,
        sg: TimesApps.Utils.getAdsTargetParams(),
        cc: TimesApps.userLocation.getCountryFromSessionStorage(),
        time: new Date(),
        skipAd: skipAds || isPrime,
        apikey: slikeApiKey,
        /****************************Test value for QC*************************************************/
        section,
        adSection: section,
        /****************************Test value for QC*************************************************/
        pid: agency || 'TNN',
        pagesection: TimesApps.getPageSection(),
        pagetpl: TimesApps.getPageTemplate(),
        // autoStart: true,
        id: mediaId,
        title: mainConfig.title,
        nextVideoCounter: conf.nextVideoCounter,
        playlistUrl,
        playlist: playList,
        playlistData: playlistObj,
        msid,
        autoPlay: true,
        volume,
        mute: muteOnLoad || TimesApps.PlayerUtils.isMute(),
        // settings: {
        //   //for showing next video on autoplay
        //   autoplay: true,
        //   volume,
        //   mute: muteOnLoad || TimesApps.PlayerUtils.isMute(),
        // },
        controls: {
          // dim: allowDim,
          // fullscreen: true,
          // adplaypause: true,
          // autoplay: conf.showAutoplayButton,
          hideCenterIcon: true,
        },
        scrollBehaviour: {
          inViewPercent: 50,
          dock: isDockingEnabled,
          autoPlay: scrollAutoPlay,
          autoPause: scrollAutoPause,
        },
        videoLoop: videoInloop,
        // if component want to update player object let it be on last
        ...updateplayerConfig,
        preRollAdFiller: {
          enable: true,
          time: 7,
        },
        amazonbidding: false,
      },

      // playerVars: {
      //   image: bgImage,
      //   playerType: playerId,
      //   sg: TimesApps.Utils.getAdsTargetParams(),
      //   cc: TimesApps.userLocation.getCountryFromSessionStorage(),
      //   time: new Date(),
      //   apikey: slikeApiKey,
      //   /****************************Test value for QC*************************************************/
      //   section,
      //   /****************************Test value for QC*************************************************/
      //   pid: agency || 'TNN',
      //   pagesection: TimesApps.getPageLocation(),
      //   // autoStart: true,
      //   id: mediaId,
      //   title: mainConfig.title,
      //   nextVideoCounter: conf.nextVideoCounter,
      //   playlistUrl,
      //   msid,
      //   // shareurl: '',
      // },
    };

    if (
      window &&
      window.TimesGDPR &&
      window.TimesGDPR.common &&
      window.TimesGDPR.common.consentModule &&
      window.TimesGDPR.common.consentModule.isEUuser()
    ) {
      configObj.GDPR_MODE = window.TimesGDPR.common.consentModule.isEUuser();
    }

    if (isPodcast) {
      configObj.controls.ui = 'podcast';
    } else if (mainConfig.hideControls) {
      configObj.controls.ui = 'headless';
    } else if (mainConfig.headless) {
      configObj.controls.headless = true;
    }

    if (navigator.userAgent.indexOf('UCBrowser') !== -1) {
      configObj.player.autoplay = false;
    }

    if (
      TimesApps.VOD_CONF[source] &&
      TimesApps.VOD_CONF[source].showVolumeSeekBar
    ) {
      configObj.controls.showVolumeSeekBar = true;
    }

    //document.domain = 'indiatimes.com';
    configObj.video.shareUrl = mainConfig.shareUrl
      ? mainConfig.shareUrl
      : TimesApps.Utils.getVideoUrl();

    configObj.player.description_url = mainConfig.shareUrl
      ? mainConfig.shareUrl
      : TimesApps.Utils.getVideoUrl();

    if (metakeywords && metakeywords !== '') {
      configObj.video.Meta_Keywords = metakeywords;
    }
    if (bl && bl !== '') {
      configObj.video.BL = bl;
    }
    return configObj;
  };

  TimesApps.iBeatVideoCall = (function iBeat() {
    const fn = {
      _getParentUrl() {
        let url = '';
        try {
          url = window.parent.location.href;
        } catch (e) {
          url = window.location.href;
        }

        return url;
      },
      _loadiBeat() {
        const pageConfig = {
          channel: mainConfig.agency || 'timesofindia.indiatimes.com',
          action: 1,
          articleId: mainConfig.articleId || '',
          contentType: 2,
          location: 1,
          url: fn._getParentUrl(),
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
      },
    };

    const api = {
      loadiBeat() {
        return fn._loadiBeat();
      },
    };
    return api;
  })();

  // document.domain = 'indiatimes.com';
  TimesApps.player = {
    playerName: 'VOD',
    playerNameConstant: '',
  };

  TimesApps.Utils.loadImaSdkForAds();

  TimesApps.userLocation = (function userLocation() {
    /*also in toi_js */
    // let fn, api, config, dataState;

    const dataState = {
      countryCode: '',
    };

    const config = {
      COUNTRY_CODE_LOCALSTORAGE_KEY: 'countryCode',
    };

    const fn = {
      _getCountryFromSessionStorage() {
        if (dataState.countryCode) {
          return dataState.countryCode;
        }
        let countryCode = false;
        let data =
          TimesApps.Utils.getDataFromWebStorage(
            config.COUNTRY_CODE_LOCALSTORAGE_KEY,
          ) || {};

        try {
          data = JSON.parse(data);
        } catch (e) {
          //console.log("json error");
          return countryCode;
        }

        if (typeof data !== 'undefined' && data != null && data.countryCode) {
          countryCode = data.countryCode;
        }

        dataState.countryCode = countryCode;

        return dataState.countryCode;
      },

      _setCountryInLocalStorage(countryCode) {
        let data = {
          countryCode,
          timestamp: new Date().getTime(),
        };
        data = JSON.stringify(data);
        dataState.countryCode = countryCode;
        TimesApps.Utils.setIntoWebStorage(
          config.COUNTRY_CODE_LOCALSTORAGE_KEY,
          data,
        );
      },
      _geoUserGA(eventType) {
        //GA
        (function publishFoundUsercountry() {
          const { playerName } = TimesApps.player;
          const pubSub = TimesApps.PubSub;
          const eventData = {};
          eventData.loadStatus = eventType || '';
          eventData.source = mainConfig.source;
          eventData.stream = 'CONTENT';
          eventData.userInitiated = mainConfig.userInitiated || '';
          eventData.id = mainConfig.msid || '';
          pubSub.publish(`${playerName}_EVENTS`, [
            eventData,
            'foundUsercountry'.toUpperCase(),
          ]);
        })();
      },
      _getUserCountry() {
        const pubSub = TimesApps.PubSub;
        let countryCode = fn._getCountryFromSessionStorage();
        if (countryCode !== '' && countryCode) {
          fn._geoUserGA('load_browserStorage');
          pubSub.publish('foundUsercountry', countryCode);
        } else {
          const geoApiOnLoad = function geoApiOnLoad(event) {
            const { geoinfo } = window;
            countryCode = geoinfo?.CountryCode;
            if (countryCode) {
              fn._setCountryInLocalStorage(countryCode);
            }
            fn._geoUserGA((event && event.type) || '');
            pubSub.publish('foundUsercountry', countryCode);
          };
          loadJS('//geoapi.indiatimes.com/?cb=1', 'geo_api_js').then(
            geoApiOnLoad,
          );
        }

        return countryCode;
      },
    };

    const api = {
      getUserCountry() {
        return fn._getUserCountry();
      },
      getCountryFromSessionStorage() {
        return fn._getCountryFromSessionStorage();
      },
    };

    return api;
  })();

  TimesApps.Vod_Player = (function Vod_Player() {
    // "use strict";

    // var api, fn, util, config, data, constants;

    const config = {
      dataStorageKey: 'vodPLayer',
    };

    const constants = {
      seondsInOneMinute: 60,
      msInOneSecond: 1000,
    };

    const defaultData = {
      isMute: false,
      nextVideoList: [],
    };

    const util = {
      _getData() {
        let data;
        try {
          data = JSON.parse(
            TimesApps.Utils.getDataFromWebStorage(config.dataStorageKey) ||
              '{}',
          );
        } catch (e) {
          data = {};
        }
        return data;
      },
      _storeData(prop, value) {
        if (typeof prop === 'undefined' || prop.trim().length === 0) {
          return undefined;
        }

        const data = util._getData();
        data[prop] = value;

        let dataJson;

        try {
          dataJson = JSON.stringify(data);
        } catch (e) {
          return false;
        }

        TimesApps.Utils.setIntoWebStorage(config.dataStorageKey, dataJson);
        return data;
      },
      isImaLoaded() {
        if (typeof window.ima === 'object' && window.ima.common) {
          return true;
        }
        return false;
      },
    };

    const fn = {
      _checkGeoAndAddPlayer() {
        const isSlikeLoaded = TimesApps.VideoPlayer2.isSlikeLoaded();
        // const country = TimesApps.userLocation.getCountryFromSessionStorage();
        if (!isSlikeLoaded /*|| !country*/) {
          return;
        }
        // if (
        //   !(TimesApps.googleImaJsLoaded && TimesApps.slikeImaWrapperJsLoaded)
        // ) {
        //   return;
        // }
        const playerConfig = TimesApps.getPlayerConfig();
        const { playerName } = TimesApps.player;
        TimesApps.VideoPlayer2.addPlayer(divId, playerConfig, playerName);
      },
      _getNextVideoData(nextVideoMsid) {
        if (!nextVideoMsid || !nextVideoMsid.trim().length) {
          return;
        }

        //http://toidev.indiatimes.com
        // const url = '';
        makeRequest
          .get(
            `https://toidev.indiatimes.com/feeds/videomediainfo_v1/msid-${nextVideoMsid},feedtype-json.cms`,
            {},
          )
          .then((response) => {
            response.data = response.data || {};
            response.data.item = response.data.item || response?.response?.item;
            const { playerName } = TimesApps.player;
            videoDataReceivedCallback(response?.data?.item);
            const eventData = response.data.item || {};
            eventData.source = TimesApps.player.playerNameConstant + playerName;
            eventData.stream = 'CONTENT';
            eventData.userInitiated = mainConfig.userInitiated;

            const eventType = 'onNextVideoDataFetch';
            const pubSub = TimesApps.PubSub;
            pubSub.publish(`${playerName}_EVENTS`, [eventData, eventType]);
            triggerEvent(`${playerName}_EVENTS`, [eventData, eventType]);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      _updateMainConfigWithAjaxData(data) {
        mainConfig.msid = data.msid || 106870389;
        mainConfig.mediaId = data.embedId;
        mainConfig.playerType = data.playerid;
        // mainConfig.video.playerType = data.playerid;
        // mainConfig.video.id = data.embedId;
        mainConfig.title = data.title;
        //document.getElementById("bgImage").value = ;
        mainConfig.seoLocation = data.seopath;
        mainConfig.breadCrumb = getPageSectionName();
        mainConfig.agency = data.agency || '';
        let date;
        if (data.videodatetime && data.videodatetime.indexOf(':')) {
          let splitDate = data.videodatetime.split(':')[0].split(' ');
          if (splitDate.length > 1) {
            splitDate.pop();
          }
          if (typeof splitDate === 'string') {
            splitDate = splitDate.split(',')[0];
          }
          date = splitDate.join(' ');
        } else {
          date = data.videodatetime;
        }
        mainConfig.mediaDate = date;

        mainConfig.articleId = data.msid || '';
        mainConfig.subcat = data.section || '';
        mainConfig.metaKeywords = data.keyword || '';
        mainConfig.articledt = data.videodatetime || '';
        mainConfig.blacklistText = data.blacklistText || '';
        mainConfig.navSecName = data.navsectionname || '';
        mainConfig.navSubSecName = data.navsubsectionname || '';
        mainConfig.navCatIds = data.navcatids || '';
        mainConfig.specialId__hyp1 = data.specialId || '';
        // TOIPR-64564 : Ads visible on Crypto video section
        if (typeof data.skipAds !== 'undefined') {
          mainConfig.skipAds = data.skipAds;
        }
      },
      _updateData(data) {
        TimesApps.playingSubsequentVideo = true;
        TimesApps.Vod_Player.updateMainConfigWithAjaxData(data);
        const pubSub = TimesApps.PubSub;
        const { playerName } = TimesApps.player;
        pubSub.publish(`${playerName}_EVENTS`, [{}, 'onNextVideoDataUpdate']);
      },
      _updateVolume(volume) {
        //TimesApps.Vod_Player.updateVolume
        const volumeData = {
          value: volume,
          updateTime: new Date().getTime(),
        };
        util._storeData('volume', volumeData);
      },
      _getVolume() {
        let volume;
        const volumeObj = util._getData().volume || {};
        const msIn30Mins =
          30 * constants.seondsInOneMinute * constants.msInOneSecond;
        if (
          typeof volumeObj === 'undefined' ||
          typeof volumeObj.value === 'undefined'
        ) {
          volume = mainConfig.volume;
        } else if (new Date().getTime() + msIn30Mins < volumeObj.updateTime) {
          //volume was saved 30 back
          //expire volume
          volume = mainConfig.volume;
          util._storeData('volume', {});
        } else {
          volume = volumeObj.value;
        }
        return volume;
      },
      _mutePlayer(shouldMute) {
        defaultData.isMute = shouldMute;
      },
      _isMute() {
        return defaultData.isMute;
      },
      _formatDataIntoSlikeObj(response) {
        let data;
        let nextVideoData;
        try {
          if (typeof response.data === 'object') {
            data = response.data;
          } else {
            data = JSON.parse(response.data);
          }
        } catch (e) {
          return nextVideoData;
        }
        nextVideoData = {
          embedId: data.item.embedId,
          kalturaid: data.item.embed,
          imagepath: data.item.thumburl,
          id: data.item.msid,
          playerType: data.item.playerid,
          title: {
            vdtitle: data.item.title,
          },
          agency: data.item.agency || '',
          msid: `/videos${data.item.seopath}/videoshow/${data.item.msid}.cms`,
          description: data.item.description,
          skipAds: data.item.skipAds,
        };

        return nextVideoData;
      },
      _getNextVideo(nextVideoMsid) {
        if (!nextVideoMsid || !nextVideoMsid.trim().length) {
          return;
        }

        makeRequest
          .get(
            `https://toidev.indiatimes.com/feeds/videomediainfo_v1/msid-${nextVideoMsid},feedtype-json.cms`,
            {},
          )
          .then((response) => {
            response.data = response.data || {};
            response.data.item = response.data.item || response?.response?.item;
            videoDataReceivedCallbackWrapper(response.data.item);
            const nextVideoData = fn._formatDataIntoSlikeObj(response);
            mainConfig.nextVideoURL = nextVideoData.msid;
            TimesApps.VideoPlayer2.setNextVideo(
              [nextVideoData],
              TimesApps.player.playerName,
            );
            mainConfig.nextid = '';
          });
      },
      _addNextVideoToList(msid, slikePlayerId, nextPlayerId, description_url) {
        const plyInst =
          typeof window.player === 'object' && window.player.length > 0
            ? window.player[window.player.length - 1]
            : window.player;

        if (slikePlayerId) {
          plyInst.load({
            id: slikePlayerId,
            playerType: nextPlayerId || '',
            description_url,
            msid,
          });
        }
        defaultData.nextVideoList.push(msid);
      },
      _fetchDataAndLoadVideo(msid) {
        if (!msid || !msid.trim().length) {
          return;
        }

        makeRequest
          .get(
            `https://toidev.indiatimes.com/feeds/videomediainfo_v1/msid-${msid},feedtype-json.cms`,
            {},
          )
          .then((response) => {
            response.data = response.data || {};
            response.data.item = response.data.item || response?.response?.item;
            if (
              response &&
              response.data &&
              response.data.item &&
              response.data.item.embedId
            ) {
              const plyInst =
                typeof window.player === 'object' && window.player.length > 0
                  ? window.player[window.player.length - 1]
                  : window.player;
              plyInst.load({
                id: response.data.item.embedId,
                msid: config.player.msid,
              });
            }
          });
      },
      _getNextVideoId() {
        return defaultData.nextVideoList.shift();
      },
      _getDurationinMs() {
        return TimesApps.convertMinutesToMs(mainConfig.duration);
      },
      _addLastFrameStyle(sourcevalue) {
        try {
          let conf = {};
          // const sourceElem = document.getElementById('source');
          const pubSub = TimesApps.PubSub;
          // const sourceVal =
          //   sourceElem && sourceElem.value
          //     ? sourceElem.value.toUpperCase()
          //     : '';
          if (sourcevalue.indexOf('PRIME_TOPVOD') > -1) {
            conf = TimesApps.VOD_CONF.PRIME_TOPVOD;
          }
          if (!conf.showLastFrame) {
            return;
          }

          const vodEventsListener = pubSub.subscribe('VOD_EVENTS', (data) => {
            if (!(data instanceof Array) && data.length > 0) {
              return;
            }
            const eventType = data[1] ? data[1].toUpperCase() : '';
            const videoListElem = document.getElementById(divId);
            if (eventType === 'VIDEOVIEW') {
              // eslint-disable-next-line no-unused-expressions
              videoListElem &&
                videoListElem.classList.add('lastFramePrimeOpacity');
              pubSub.unsubscribe(vodEventsListener);
            }
          });
        } catch (e) {
          // console.log(e);
        }
      },
    };

    const api = {
      checkGeoAndAddPlayer() {
        fn._checkGeoAndAddPlayer();
      },
      formatDataIntoSlikeObj(data) {
        return fn._formatDataIntoSlikeObj(data);
      },
      getNextVideoData(nextVideoMsid) {
        return fn._getNextVideoData(nextVideoMsid);
      },
      getVolume() {
        return fn._getVolume();
      },
      updateVolume(volume) {
        return fn._updateVolume(volume);
      },
      mutePlayer(shouldMute) {
        return fn._mutePlayer(shouldMute);
      },
      isMute() {
        return fn._isMute();
      },
      updateMainConfigWithAjaxData(data) {
        return fn._updateMainConfigWithAjaxData(data);
      },
      updateData(data) {
        return fn._updateData(data);
      },
      getNextVideo(nextVideoMsid) {
        return fn._getNextVideo(nextVideoMsid);
      },
      addNextVideoToList(msid, nextSlikeId, playerId, description_url) {
        return fn._addNextVideoToList(
          msid,
          nextSlikeId,
          playerId,
          description_url,
        );
      },
      fetchDataAndLoadVideo(msid) {
        return fn._fetchDataAndLoadVideo(msid);
      },
      getNextVideoId() {
        return fn._getNextVideoId();
      },
      getDurationinMs() {
        return fn._getDurationinMs();
      },
      addLastFrameStyle(sourceval) {
        return fn._addLastFrameStyle(sourceval);
      },
    };
    // api.addLastFrameStyle();
    return api;
  })();

  if (window.location.href.indexOf('toidev') >= 0) {
    TimesApps.isDevMode = 1;
  }
  const pubSub = TimesApps.PubSub;
  TimesApps.Vod_Player.addLastFrameStyle(sourceVal);
  pubSub.subscribe('VOD_EVENTS', (data) => {
    if (!(data instanceof Array) && data.length > 0) {
      return;
    }

    const eventData = data[0] || {};
    const eventType = data[1] ? data[1].toUpperCase() : '';
    const eventMsid = data[2] || '';
    const { playerName } = TimesApps.player;
    if (eventType === 'VIDEOVIEW') {
      triggerEvent(`${playerName}_EVENTS`, [eventData, eventType, eventMsid]);
      const nextVideoMsid = TimesApps.Vod_Player.getNextVideoId();
      TimesApps.Vod_Player.getNextVideo(nextVideoMsid);
      TimesApps.iBeatVideoCall.loadiBeat();
      try {
        fireTPActivity('watch_video', mainConfig.msid);
      } catch (err) {
        console.log(err);
      }
    } else if (eventType === 'ONNEXTVIDEOPLAY' && eventData.source !== 'MG') {
      /*setTimeout(
        function getNextVideoData() {
          TimesApps.Vod_Player.getNextVideoData(this.nextVideoData.msid);
          mainConfig.msid = this.nextVideoData.msid;
          const isUserInitiated =
            eventData.userInitiated && eventData.userInitiated !== 'false'
              ? true
              : '';
          mainConfig.userInitiated = isUserInitiated;

          if (
            typeof window.parent.TimesApps !== 'undefined' &&
            typeof window.parent.TimesApps.VideoGalleryApp !== 'undefined'
          ) {
            //taking status from VideoGalleryApp
            const videoList = window.parent.sTimesApps.VideoGalleryApp.getVideoList();
            const videoId = this.nextVideoData.source
              ? this.nextVideoData.source.toUpperCase()
              : '';
            const video = videoList[videoId];

            if (typeof video !== 'undefined' && video.setAutoPlay) {
              video.setAutoPlay(!isUserInitiated);
            }
          }

          if (eventData.source === 'MG_0') {
            //MG_0 is top video on HP
            //different section value is
            //neeeded for video other than 1st
            mainConfig.section = 'homepage.top-rest-videos';
          }
        }.bind({
          nextVideoData: {
            msid: eventData.msid,
            source: eventData.source,
          },
        }),
        0,
      );*/
    } else if (eventType === 'ONNEXTVIDEODATAFETCH') {
      TimesApps.Vod_Player.updateData(eventData);
    } else if (eventType === 'START') {
      TimesApps.VideoStarted = true;
    } else if (
      eventType === 'ONVOLUMECHANGE' &&
      TimesApps.VideoPlayer2.getPlayer('VOD').getCurrentPosition() > 0
    ) {
      //temporary hack, until Slike team
      //fixes onVolume change event
      // --> should not fire, during video start
      //as user did not change volume
      if (eventData.muted) {
        TimesApps.Vod_Player.mutePlayer(true);
      } else {
        TimesApps.Vod_Player.updateVolume(eventData.volume);
        TimesApps.Vod_Player.mutePlayer(false);
      }
    } else if (eventType === 'VIDEOCOMPLETE') {
      //temporary hack, until Slike team
      //fixes onVolume change event
      TimesApps.VideoStarted = false;
    } else if (eventType === 'ONNEXTVIDEODATAUPDATE') {
      TimesApps.Utils.fireVideoRequestGA();
    }

    TimesApps.prepareComscoreDataAndFireReq({}, eventData, eventType);
    TimesApps.prepareDataForGA({}, eventData, eventType);
  });

  window._poc = window._poc || {};
  // const checkIfVideoCanAutoplayWithVolume = function checkIfVideoCanAutoplayWithVolume(
  //   cid,
  //   ms,
  //   _poc,
  // ) {
  //   const _pocNew = _poc || window._poc;
  //   // _poc = _poc || window._poc;
  //   const videoTag = document.createElement('video');
  //   const c = document.getElementById(cid);
  //   if (c != null) {
  //     c.appendChild(videoTag);
  //   }
  //   videoTag.id = 'dummyV';
  //   /*if(SPL&&SPL.UA&&(SPL.UA.getBrowser().name=="Safari"||SPL.UA.getOS().name=='iOS'))
  //     videoTag.src="#";
  //     else*/
  //   const plyInst =
  //     typeof window.player === 'object' && window.player.length > 0
  //       ? window.player[window.player.length - 1]
  //       : window.player;
  //   videoTag.src = plyInst.dummyMp4;
  //   videoTag.style.height = '1px';
  //   videoTag.style.width = '1px';
  //   videoTag.volume = 0.02;
  //   videoTag.muted = false;
  //   videoTag.style.opacity = 0;
  //   videoTag.setAttribute('playsinline', '');
  //   videoTag.setAttribute('webkit-playsinline', '');

  //   if (ms === true) {
  //     videoTag.muted = true;
  //   }
  //   const sampleVideo = videoTag.play();
  //   if (sampleVideo !== undefined) {
  //     sampleVideo.then(
  //       () => {
  //         const volume = TimesApps.Vod_Player.getVolume();
  //         //if(TimesApps.isDevMode){
  //         // console.log('promise success, adding vol', volume);
  //         //}
  //         // Automatic playback started!
  //         const { playerName } = TimesApps.player;
  //         if (isUserPrime && !shouldShowVideoBlocker(prcValue)) {
  //           TimesApps.VideoPlayer2.getPlayer(playerName).mute(false);
  //         }
  //         TimesApps.VideoPlayer2.getPlayer(playerName).setVolume(volume);
  //       },
  //       e => {
  //         // Automatic playback failed.
  //         console.log('Video play failed', e);
  //       },
  //     );
  //   } else if (videoTag.paused) {
  //     //Safari < 10
  //     _pocNew.userClick = false;
  //   } else {
  //     //IE < 11
  //     _pocNew.userClick = true;
  //   }
  //   return videoTag;
  // };

  // const checkIfVideoCanAutoplayWithVolumeEvent = pubSub.subscribe(
  //   'VOD_EVENTS',
  //   data => {
  //     if (!(data instanceof Array) && data.length > 0) {
  //       return;
  //     }

  //     const eventType = data[1] ? data[1].toUpperCase() : '';
  //     const videoInitEvents = ['VIDEOINIT', 'VIDEOREADY', 'ADVIEW'];
  //     if (videoInitEvents.indexOf(eventType) === -1) {
  //       return;
  //     }
  //     pubSub.unsubscribe(checkIfVideoCanAutoplayWithVolumeEvent);

  //     // Initially muted for carousel videos
  //     if (muteOnLoad === true) {
  //       return;
  //     }

  //     try {
  //       setTimeout(checkIfVideoCanAutoplayWithVolume, 50);
  //     } catch (e) {
  //       console.log('promise failed');
  //     }
  //   },
  // );

  function triggerPlayerLoaded() {
    //trigger mini tv player loaded event
    const eventData = {};
    const { playerName } = TimesApps.player;
    eventData.source = mainConfig.source;
    eventData.msid = mainConfig.msid;
    eventData.domSelector = window.frameElement
      ? window.frameElement.getAttribute('id')
      : '#streaming_box #player';
    eventData.userInitiated = mainConfig.userInitiated || false;
    const eventType = `${playerName}_LOADED`;
    //var pauseVideoCallBack = TimesApps.VideoPlayer2.getPlayer(playerName).pause;
    const pauseVideoCallBack = TimesApps.VideoPlayer2.pause;
    pauseVideoCallBack.bind({
      playerName,
    });
    triggerEvent(`${playerName}_LOADED`, [
      eventData,
      eventType,
      pauseVideoCallBack,
    ]);
  }

  // const pubSub = TimesApps.PubSub;
  pubSub.subscribe('slikeVideoLoaded', () => {
    console.log('##video slikeVideoLoaded initiated');
    triggerPlayerLoaded();
    pubSub.unsubscribe('slikeVideoLoaded');
  });

  function onVideoUnmount() {
    //pause video if iframe is about to exit
    const { playerName } = TimesApps.player;
    const pauseVideoCallBack = TimesApps.VideoPlayer2.getPlayer(playerName)
      ? TimesApps.VideoPlayer2.getPlayer(playerName).pause
      : false;
    if (pauseVideoCallBack) {
      pauseVideoCallBack();
    }

    const eventData = {};
    eventData.source = mainConfig.source;
    eventData.stream = 'CONTENT';
    eventData.userInitiated = mainConfig.userInitiated;
    const eventType = 'videoIframeRemoved';
    triggerEvent(`${playerName}_EVENTS`, [eventData, eventType]);
  }
  onVideoUnmount.abc = '';

  TimesApps.getPageLocation = function getPageLocation() {
    //used for Slike analytics
    // var location = "";
    // var data = [];
    // var ifreamParentBody;
    // try {
    //     ifreamParentBody = window.parent.document.body;
    // } catch (e) {
    //     //console.log("getPageLocation, cors error");
    // }

    // if (ifreamParentBody) {
    //     ifreamParentBody = $(ifreamParentBody);
    //     var breadcrumb = ifreamParentBody.find(".navbdcrumb").length ? ifreamParentBody.find(".navbdcrumb") : ifreamParentBody.find("#breadcrumb");
    //     var breadcrumbText = breadcrumb.find("span[itemprop='name']");
    //     for (var i = 0; i < breadcrumbText.length; i++) {
    //         var text = breadcrumbText.eq(i).text();
    //         if (text.split(" ").length > 1) {
    //             text = text.split(" ").join("_");
    //         }
    //         data.push(text);
    //     }
    // }

    // if (data.length) {
    //     location = data.join(".")
    // } else {
    //     var videoId = mainConfig.source ? mainConfig.source.toUpperCase() : "";
    //     if (videoId &&
    //         typeof TimesApps.sourceToLocationMapping == "object" &&
    //         TimesApps.sourceToLocationMapping[videoId]
    //     ) {
    //         location = TimesApps.sourceToLocationMapping[videoId] || "";
    //         location = location.replace("/", ".");
    //         location = location.toLowerCase();
    //     } else if (ifreamParentBody && ifreamParentBody.data('page-name')) {
    //         location = ifreamParentBody.data('page-name');
    //     }
    // }

    // return location;
    return mainConfig.breadCrumb;
    // const pathList = window.location.pathname.split('/');
    // return `${pathList[pathList.length - 2]}.${pathList[1]}`;
  };

  TimesApps.prepareComscoreDataAndFireReq =
    function prepareComscoreDataAndFireReq(event, eventData, eventType) {
      const parentWindow = window.parent;
      if (typeof parentWindow === 'undefined') {
        return;
      }
      // const parentHostname = parentWindow.location.hostname;
      // if (parentHostname.indexOf('.indiatimes.com') === -1) {
      //   return;
      // }

      // if (typeof parentWindow.TimesApps === 'undefined') {
      //   return;
      // }

      const config = {
        comscoreCustomerId: '6036484',
        stationTitle: 'TOI-Desktop',
        publisherName: 'The Times of India',
        contentGenre: 'News',
        c3: '10',
      };
      // if (typeof config === 'undefined') {
      //   return;
      // }
      let contentType = eventData.stream || '';
      contentType = contentType.toUpperCase();
      const trackingDetails = {};
      trackingDetails.contentGenre = config.contentGenre;

      trackingDetails.seoLocation = mainConfig.seoLocation;
      const date = mainConfig.mediaDate;
      trackingDetails.airDate = date;
      const videoObj = eventData || {};
      videoObj.pdata = {};
      videoObj.id = TimesApps.getPlayerConfig().player.msid;
      //converting to mins
      //remove once all videos are migrated to Slike
      videoObj.duration = (videoObj.duration || 0) / 60;
      videoObj.title = mainConfig.title;
      videoObj.pdata.adposition = eventData.adtype;

      trackingDetails.c3 = config.c3;
      const eventTypeUppercase = eventType.toUpperCase();
      fireComscoreTrackingRequest(
        config.comscoreCustomerId,
        eventType,
        contentType,
        config.stationTitle,
        config.publisherName,
        trackingDetails,
        videoObj,
      );
      if (eventTypeUppercase === 'ADSKIP') {
        TimesApps.setAdStatus(contentType, eventTypeUppercase);
      }
    };

  TimesApps.getPageSection = function getPageSection() {
    const l1 = window.Times?.adsKeys?.SCN;
    if (l1 && l1 !== '') {
      const l2 = window.Times?.adsKeys?.SubSCN;
      if (l2 && l2 !== '') {
        let lLast = window.Times?.adsKeys?.LastSubSCN;
        if (lLast && lLast !== '') {
          for (let i = 1; i < 10; i += 1) {
            const v = `LastSubSCN_Child_${i}`;
            if (window.Times?.adsKeys[v] && window.Times?.adsKeys[v] !== '') {
              lLast = `${lLast}/${window.Times?.adsKeys[v]}`;
            } else {
              break;
            }
          }
          return `${l1}/${l2}/${lLast}`;
        }
        return `${l1}/${l2}`;
      }
      return l1;
    }
    return window.Times?.adsKeys?.Tmpl_SCN === 'home' ? 'Home Page' : '';
  };

  TimesApps.getPageTemplate = function getPageTemplate() {
    const pageTpl =
      window.Times?.adsKeys?.Tmpl_SCN === 'home'
        ? 'Home Page'
        : window.Times?.adsKeys?.Tmpl_SCN;
    return pageTpl + tmplSource;
  };

  function VideoSubscribe(videoData) {
    TimesApps.Vod_Player.updateMainConfigWithAjaxData(videoData);
    TimesApps.Utils.fireVideoRequestGA();
    pubSub.subscribe('slikeLoaded', TimesApps.Vod_Player.checkGeoAndAddPlayer);
    // pubSub.subscribe(
    //   'googleImaJsLoaded',
    //   TimesApps.Vod_Player.checkGeoAndAddPlayer,
    // );
    // pubSub.subscribe(
    //   'slikeImaWrapperJsLoaded',
    //   TimesApps.Vod_Player.checkGeoAndAddPlayer,
    // );
    pubSub.subscribe('foundUsercountry', () => {
      /*if( country && country != '' ){*/
      //pubSub.unsubscribe("foundUsercountry");
      /*}*/
      const country = TimesApps.userLocation.getCountryFromSessionStorage();
      if (country && country !== '') {
        // TimesApps.Vod_Player.checkGeoAndAddPlayer();
        return;
      }
      pubSub.unsubscribe('foundUsercountry');
    });

    TimesApps.userLocation.getUserCountry();
    TimesApps.VideoPlayer2.init();

    const nextVideoMsid = mainConfig.nextid;
    if (nextVideoMsid) {
      //TimesApps.Vod_Player.addNextVideoToList(nextVideoMsid);
    }
  }

  if (livetv) {
    VideoSubscribe({
      embedId: slikeId,
      seopath: '',
      msid: videoMsid,
      title: titleStr,
    });
    return;
  }

  makeRequest
    .get(
      `https://toidev.indiatimes.com/feeds/videomediainfo_v1/msid-${videoMsid},feedtype-json.cms`,
      {},
    )
    .then((response) => {
      response.data = response.data || {};
      response.data.item = response.data.item || response?.response?.item;
      VideoSubscribe(response.data.item);
      videoDataReceivedCallbackWrapper(response.data.item);
      const nextVideoData =
        TimesApps.Vod_Player.formatDataIntoSlikeObj(response);
      const vodEventsListener = pubSub.subscribe('VOD_EVENTS', (data) => {
        if (!(data instanceof Array) && data.length > 0) {
          return;
        }
        const eventType = data[1] ? data[1].toUpperCase() : '';
        if (eventType === 'VIDEOREADY') {
          TimesApps.VideoPlayer2.setCurrentVideoInPlaylist(
            [nextVideoData],
            TimesApps.player.playerName,
          );
          pubSub.unsubscribe(vodEventsListener);
        }
      });
    })
    .catch((err) => {
      console.log('video error0', err);
      // if(slikeId) {
      //   VideoSubscribe({embedId: slikeId,seopath: ''})
      // }
    });

  // VideoSubscribe();
  let previousVideoMsid = videoMsid;
  function subscribeToStore() {
    const getNextVideoMsidFromState = (state) => {
      let data = {};
      // if (state.videoshow && state.videoshow.msidForNextVideo) {
      //   data = {
      //     msid: state.videoshow.msidForNextVideo,
      //     slikeId: state.videoshow.slikeId,
      //     playerId: state.videoshow.playerId,
      //   };
      // }
      if (state.articleshow && state.articleshow.msidForNextVideo) {
        data = {
          msid: state.articleshow.msidForNextVideo,
          slikeId: state.articleshow.slikeId,
          playerId: state.articleshow.playerId,
        };
      }
      if (state.articleshow_v2 && state.articleshow_v2.msidForNextVideo) {
        data = {
          msid: state.articleshow_v2.msidForNextVideo,
          slikeId: state.articleshow_v2.slikeId,
          playerId: state.articleshow_v2.playerId,
        };
      }
      if (state.homepage && state.homepage.msidForNextVideo) {
        data = {
          msid: state.homepage.msidForNextVideo,
          slikeId: state.homepage.slikeId,
          playerId: state.homepage.playerId,
        };
      }

      if (state.homepage_us && state.homepage_us.msidForNextVideo) {
        data = {
          msid: state.homepage_us.msidForNextVideo,
          slikeId: state.homepage_us.slikeId,
          playerId: state.homepage_us.playerId,
        };
      }
      return data;
    };

    if (typeof store === 'object' && typeof store.subscribe === 'function') {
      store.subscribe(() => {
        const data = getNextVideoMsidFromState(store.getState());
        const nextMsid = data.msid;
        const nextSlikeId = data.slikeId;
        const nextPlayerId = data.playerId;
        if (
          parseInt(nextMsid, 10) !== parseInt(previousVideoMsid, 10) &&
          nextMsid
        ) {
          previousVideoMsid = nextMsid;
          TimesApps.Vod_Player.addNextVideoToList(
            nextMsid,
            nextSlikeId,
            nextPlayerId,
          );
          // TimesApps.Vod_Player.getNextVideo
          //TimesApps.Vod_Player.getNextVideo(nextMsid);
        }
      });
    }
  }
  subscribeToStore();

  // eslint-disable-next-line consistent-return
  return TimesApps.Vod_Player.addNextVideoToList;
}
