// const VideosGa = (function VideosGa() {
//   // var fn, api, config;

//   const config = {
//     adErrorCodes: {
//       101: 'VAST_SCHEMA_VALIDATION_ERROR',
//       102: 'VAST_UNSUPPORTED_VERSION',
//       200: 'VAST_TRAFFICKING_ERROR',
//       201: 'VAST_UNEXPECTED_LINEARITY',
//       202: 'VAST_UNEXPECTED_DURATION_ERROR',
//       300: 'VAST_WRAPPER_ERROR',
//       301: 'VAST_LOAD_TIMEOUT',
//       302: 'VAST_TOO_MANY_REDIRECTS',
//       303: 'VAST_NO_ADS_AFTER_WRAPPER',
//       400: 'VIDEO_PLAY_ERROR',
//       402: 'VAST_MEDIA_LOAD_TIMEOUT',
//       403: 'VAST_LINEAR_ASSET_MISMATCH',
//       500: 'OVERLAY_AD_PLAYING_FAILED',
//       501: 'NONLINEAR_DIMENSIONS_ERROR',
//       503: 'VAST_NONLINEAR_ASSET_MISMATCH',
//       602: 'COMPANION_REQUIRED_ERROR',
//       900: 'UNKNOWN_ERROR',
//       1005: 'FAILED_TO_REQUEST_ADS',
//       1007: 'VAST_ASSET_NOT_FOUND',
//       1009: 'VAST_EMPTY_RESPONSE',
//       1010: 'UNKNOWN_AD_RESPONSE',
//       1011: 'UNSUPPORTED_LOCALE',
//       1101: 'INVALID_ARGUMENTS',
//       1105: 'INVALID_ADX_EXTENSION',
//     },
//   };

//   const fn = {
//     _getErrorLabelFromCode(errorCode) {
//       return config.adErrorCodes[errorCode] || '';
//     },
//   };

//   const api = {
//     getErrorLabelFromCode(errorCode) {
//       return fn._getErrorLabelFromCode(errorCode);
//     },
//   };

//   return api;
// })();

function fireGAevents() {
  // eventData,
  // eventType,
  // isAutoplayOn,
  // seoLocation,
  // videoLocationOnPage,
  // agency,
  // timeTakenToVideoReady,
  // mainConfig,
  // playerState,
  // FLAGS,
  // const videoEventsMap = [
  //   'VIDEOREQUEST',
  //   'VIDEOREADY',
  //   'VIDEOVIEW',
  //   'VIDEOCOMPLETE',
  //   'VIDEOAUTOPLAY_TOGGLE',
  //   'AUDIOREQUEST',
  //   'AUDIOREADY',
  //   'AUDIOVIEW',
  //   'AUDIOCOMPLETE',
  //   'AUDIOAUTOPLAY_TOGGLE',
  //   'PLAYING',
  //   'PAUSED',
  //   // 'ADREQUEST',
  //   // 'ADLOADED',
  //   // 'ADCOMPLETE',
  //   // 'ADSKIP',
  //   // 'ADVIEW',
  //   'AUDIOPLAY',
  //   'FULLSCREEN_ON',
  //   'DIM_TOGGLE',
  //   'ERROR',
  // ];
  // const ga = window.ga || window.parent.ga;
  // if (typeof ga === 'undefined') {
  //   return;
  // }
  // if (videoEventsMap.indexOf(eventType) === -1) {
  //   //event is not in list of events to track
  //   return;
  // }
  // let eventAction = '';
  // let eventCat = eventType;
  // if (timeTakenToVideoReady) {
  //   eventAction += `${timeTakenToVideoReady}ms_`;
  // }
  // const stxt = eventData.stxt ? eventData.stxt.toUpperCase() : '';
  // let currentVideoURL = '';
  // if (
  //   mainConfig.nextVideoURL &&
  //   !(eventType === 'VIDEOCOMPLETE' || eventType === 'AUDIOCOMPLETE')
  // ) {
  //   currentVideoURL = mainConfig.nextVideoURL.includes('videosvideos')
  //     ? mainConfig.nextVideoURL.replace('/videosvideos', 'videos')
  //     : mainConfig.nextVideoURL;
  // } else {
  //   currentVideoURL = `${seoLocation}/videoshow/${mainConfig.msid}.cms`;
  // }
  // switch (eventType) {
  //   case 'VIDEOAUTOPLAY_TOGGLE':
  //     //autoplay setting toggle event
  //     eventAction += stxt === 'OFF' ? 'Enable' : 'Disable';
  //     break;
  //   case 'AUDIOAUTOPLAY_TOGGLE':
  //     //autoplay setting toggle event
  //     eventAction += stxt === 'OFF' ? 'Enable' : 'Disable';
  //     break;
  //   case 'FULLSCREEN_ON':
  //     eventCat = 'FULLSCREEN_ON';
  //     eventAction += `/${seoLocation}`;
  //     break;
  //   case 'DIM_TOGGLE':
  //     eventCat = 'VideoPlayer';
  //     eventAction += `${'Dim/'}${seoLocation}`;
  //     break;
  //   case 'ERROR':
  //     eventCat = 'AdError';
  //     eventAction = VideosGa.getErrorLabelFromCode(eventData.adErrorcode);
  //     eventAction += `/${eventData.campaignId}`;
  //     break;
  //   // case 'ADREQUEST':
  //   //   eventAction += eventData.adtype;
  //   //   break;
  //   case 'ADLOADED':
  //     eventAction += eventData.adtype;
  //     break;
  //   default:
  //     eventAction += isAutoplayOn ? 'autoplay' : 'user-initiated';
  //     eventAction += `/${currentVideoURL}`;
  // }
  // eventAction += `${'/_'}${agency}`;
  // //   const playerState =
  // //     (TimesApps.VideoPlayerAudio &&
  // //       TimesApps.VideoPlayerAudio.getPlayerState()) ||
  // //     '';
  // if (playerState === (FLAGS && FLAGS.REPLAY)) {
  //   eventAction += '/_replay';
  // } else if (playerState === FLAGS.NEXT_VIDEO) {
  //   eventAction += '/_next_video';
  // }
  // //flash players don't provide streamType data, adaptive will be used in such cases
  // const streamingtype =
  //   eventData.videoStream ||
  //   eventData.kalstream ||
  //   (eventData.type ? eventData.type[2] : false) ||
  //   '';
  // let playertype;
  // if (
  //   eventData.contentid ||
  //   eventData.videoStream ||
  //   (eventData.type ? eventData.type[1] : false)
  // ) {
  //   //these properties are only
  //   //available in case of html5 player
  //   playertype = 'html';
  // }
  // if (eventCat === 'ADVIEW') {
  //   // console.log('**** is Ad type HLS -', eventData.isHls);
  // }
  // const eventLabelData = [];
  // if (
  //   eventData.source === 'articleshow' &&
  //   (eventData.userInitiated === '0' || eventData.userInitiated === '')
  // ) {
  //   eventLabelData.push('AS_AUTOPLAY');
  // } else {
  //   eventLabelData.push(videoLocationOnPage);
  // }
  // if (eventType !== 'FULLSCREEN_ON') {
  //   if (playertype) {
  //     eventLabelData.push(playertype);
  //   }
  //   if (streamingtype) {
  //     eventLabelData.push(streamingtype);
  //   }
  // }
  //console.log("Video_GA_Fired.... "+eventCat);
  // ga('send', {
  //   hitType: 'event',
  //   eventCategory: eventCat,
  //   eventAction,
  //   eventLabel: eventLabelData.join('/'),
  // });
}

export default fireGAevents;
