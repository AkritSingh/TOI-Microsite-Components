/* eslint-disable no-undef */
import { PubSub } from './PubSub';

const AudioPlayerUtils = (mainConfig) => {
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
    _fireVideoRequestGA() {
      const pubSub = PubSub();
      //fire VideoRequest GA
      const { playerName } = TimesApps.audioPlayer;
      const eventData = {};
      eventData.source = mainConfig.source;
      eventData.stream = 'CONTENT';
      eventData.userInitiated = mainConfig.userInitiated || '';
      eventData.id = mainConfig.msid || '';
      pubSub.publish(`${playerName}_EVENTS`, [
        eventData,
        mainConfig.isPodcast ? 'AUDIOREQUEST' : 'VIDEOREQUEST',
      ]);
      //console.log('PLAYER_EVENT....'+"VIDEOREQUEST isUserInitiated-"+eventData.userInitiated.toString());
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
    _updateVolume(volume, isMute) {
      //TimesApps.Vod_Player.updateVolume
      const volumeData = {
        value: volume,
        isMute: !!isMute,
        updateTime: new Date().getTime(),
      };
      // console.log('storing volume', volumeData);
      this.storeData('volume', volumeData);
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
        this.storeData('volume', {});
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
    // getAdsTargetParams() {
    //   return fn._getAdsTargetParams();
    // },
    fireVideoRequestGA() {
      return fn._fireVideoRequestGA();
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
      return fn._checkGdprAndCall(callback, callbackForEu, checkForUserConsent);
    },
    getCookie(name) {
      return fn._getCookie(name);
    },
    getVolume() {
      return fn._getVolume();
    },
    updateVolume(volume, isMute) {
      return fn._updateVolume(volume, isMute);
    },
  };

  return api;
};

export default AudioPlayerUtils;
