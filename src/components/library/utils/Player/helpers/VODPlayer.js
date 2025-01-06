/* eslint-disable no-param-reassign */
import makeRequest from '../../makeRequest';
import AudioPlayerUtils from './AudioPlayerUtils';

export default function VodPlayer(
  VideoPlayerAudio,
  playerConfig,
  mainConfig,
  playerName,
  TimesApps,
  videoDataReceivedCallback,
  videoDataReceivedCallbackWrapper,
  triggerEvent,
  divId,
  settings,
  duration,
) {
  // "use strict";

  // var api, fn, util, config, data, constants;
  const AudioUtils = AudioPlayerUtils();
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
          AudioUtils.getDataFromWebStorage(config.dataStorageKey) || '{}',
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

      AudioUtils.setIntoWebStorage(config.dataStorageKey, dataJson);
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
      const isSlikeLoaded = VideoPlayerAudio.isSlikeLoaded();
      // const country = TimesApps.userLocation.getCountryFromSessionStorage();
      if (!isSlikeLoaded /*|| !country*/) {
        return;
      }
      // if (
      //   !(TimesApps.googleImaJsLoaded && TimesApps.slikeImaWrapperJsLoaded)
      // ) {
      //   return;
      // }
      VideoPlayerAudio.addPlayer(divId, playerConfig, playerName);
    },
    _getNextVideoData(nextVideoMsid) {
      if (!nextVideoMsid || !nextVideoMsid.trim().length) {
        return;
      }

      //http://toidev.indiatimes.com
      // const url = '';
      makeRequest
        .get(
          `/feeds/videomediainfo_v1/msid-${nextVideoMsid},feedtype-json.cms`,
          {},
          'skipfeedengine',
        )
        .then((response) => {
          videoDataReceivedCallback(response.data.item);
          const eventData = response.data.item || {};
          eventData.source =
            TimesApps.audioPlayer.playerNameConstant + playerName;
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
      mainConfig.msid = data.msid;
      mainConfig.mediaId = data.embedId;
      mainConfig.playerid = data.playerid;
      mainConfig.title = data.title;
      //document.getElementById("bgImage").value = ;
      mainConfig.seoLocation = data.seopath;
      mainConfig.breadCrumb = `${data.seopath.split('/')[0]}.${
        data.seopath.split('/')[1]
      }`;
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
    },
    _updateData(data) {
      TimesApps.playingSubsequentVideo = true;
      TimesApps.Vod_Player.updateMainConfigWithAjaxData(data);
      const pubSub = TimesApps.PubSub;
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
        playerid: data.item.playerid,
        title: {
          vdtitle: data.item.title,
        },
        agency: data.item.agency || '',
        msid: `/videos${data.item.seopath}/videoshow/${data.item.msid}.cms`,
        description: data.item.description,
      };

      return nextVideoData;
    },
    _getNextVideo(nextVideoMsid) {
      if (!nextVideoMsid || !nextVideoMsid.trim().length) {
        return;
      }

      makeRequest
        .get(
          `/feeds/videomediainfo_v1/msid-${nextVideoMsid},feedtype-json.cms`,
          {},
          'skipfeedengine',
        )
        .then((response) => {
          videoDataReceivedCallbackWrapper(response.data.item);
          const nextVideoData = fn._formatDataIntoSlikeObj(response);
          mainConfig.nextVideoURL = nextVideoData.msid;
          TimesApps.VideoPlayerAudio.setNextVideo(
            [nextVideoData],
            TimesApps.audioPlayer.playerName,
          );
          mainConfig.nextid = '';
        });
    },
    _addNextVideoToList(msid) {
      defaultData.nextVideoList.push(msid);
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
          conf = settings(duration, 'PRIME_TOPVOD');
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
          if (eventType === 'VIDEOVIEW' || eventType === 'AUDIOVIEW') {
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
    addNextVideoToList(msid) {
      return fn._addNextVideoToList(msid);
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
}
