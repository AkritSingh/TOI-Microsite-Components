import Cookie from '../../utils/cookies';

export default function getPlayerConfig(
  mainConfig,
  Vod_Player,
  settings,
  duration,
  slikeId,
  pageLocation,
) {
  // let pageType = mainConfig.pageType || '';
  // pageType = pageType.toUpperCase();
  // const section = mainConfig.section || TimesApps.getPageLocation() || '';
  const volume = Vod_Player.getVolume();
  const { slikeApiKey } = mainConfig;
  // let nextVideoUrl;

  // let agency = mainConfig.agency || '';
  // const regex = new RegExp(' ', 'g');

  // agency = agency.replace(regex, '');
  const { msid } = mainConfig;
  const { mediaId } = mainConfig;
  // let playerId = mainConfig.playerid;
  // playerId = parseInt(playerId, 10) === 10 ? playerId : 0;
  // const nextVideoCounter = mainConfig.nextVideoCounter || 5;
  //var allowDim = document.getElementById("allowDim").value || false;
  // const allowDim = parseInt(mainConfig.allowDim, 10) === 1;
  const source = mainConfig.source ? mainConfig.source.toUpperCase() : '';
  let conf;
  if (source.indexOf('ABOVEARTICLE') > -1) {
    //above article video, has values like ABOVEARTICLE_0, ABOVEARTICLE_1..
    conf = settings(duration, 'ABOVEARTICLE');
  } else if (source.indexOf('PRIME_TOPVOD') > -1) {
    conf = settings(duration, 'PRIME_TOPVOD');
  } else {
    conf = settings(duration, source);
  }

  // const showNextPrevButton =
  //   typeof conf.showNextPrevButton === 'undefined' || conf.showNextPrevButton;
  // const showPrevButton =
  //   typeof conf.showPrevButton === 'undefined' || conf.showPrevButton;

  // let bgImage = TimesApps.AudioUtils.getVideoImg();

  // const { sectionId } = mainConfig;

  // if (conf && conf.nextVideoUrl && typeof conf.nextVideoUrl === 'string') {
  //   if (conf.nextVideoUrl.indexOf('videpostroll_v8') > -1) {
  //     nextVideoUrl = `${getSiteDomain()}${conf.nextVideoUrl +
  //       msid}.cms?feedtype=json&dontshow=${msid}&callback=cached`;
  //   } else if (source.indexOf('ARTICLE') >= 0) {
  //     let articleMsid = window.parent.msid;
  //     if (
  //       typeof articleMsid === 'object' &&
  //       articleMsid.getAttribute('value')
  //     ) {
  //       articleMsid = articleMsid.getAttribute('value') || '';
  //     }
  //     nextVideoUrl = `${conf.nextVideoUrl +
  //       articleMsid}.cms?feedtype=json&dontshow=${msid}&callback=cached`;
  //   } else {
  //     nextVideoUrl = `${conf.nextVideoUrl +
  //       msid}.cms?feedtype=json&dontshow=${msid}&callback=cached`;
  //   }
  //   bgImage = undefined;
  // }
  const dmpCookieValue = Cookie.get('_col_uuid');
  const playerConfigObj = {
    cookieId: dmpCookieValue,
    apiKey: slikeApiKey,
    // height: '100%',
    // width: '100%',
    origin: `${window.location.protocol}//${window.location.host}`,
    referrer: document.referrer,
    msid,
    //css: "position:absolute;width:100%;height:100%",
    video: {
      //image: bgImage,
      id: slikeId,
    },
    controls: {
      ui: 'podcast',
      // showPipIcon: false,
      // offlineVolume: false,
      // offlineMute: false,
      // hideCenterIcon: conf.hideCenterIcon,
      // showNextButton: isMobileMode ? false : showNextPrevButton,
      // showPrevButton: isMobileMode
      //   ? false
      //   : showPrevButton && showNextPrevButton,
      // showAutoPlayNext: conf.showAutoPlayNext,
      // showFwdSeek: conf.showFwdSeek,
      // showBackSeek: conf.showBackSeek,
      // mute: conf.mute,
      // autoPlayNext: conf.autoPlayNext,
      // showWave: false, //conf.showWave,
      // duration: conf.duration,
      // showShare: conf.showShare,
    },
    player: {
      // tryHlsAds: true,
      // portOut: 'pause',
      // portIn: 'play',
      // copyConfig: true,
      // startFromSec: 0,
      // iphoneinline: true,
      // isGAPlugin: false,
      // iphonefs: false,
      // showLastFrame: conf.showLastFrame,
      //custom start point
      // nextVideoList:
      //   nextVideoMsidArray instanceof Array
      //     ? nextVideoMsidArray.splice(1, nextVideoMsidArray.length - 1)
      //     : [],
      // audioMode: true,
      // audioPrime: true,
      // autoPlay: conf.autoPlay,
      // autoPlayAudio: conf.autoPlayAudio,
      // forceWA: conf.forceWA,
      // fallbackMute: false,
      // volume,
      id: mediaId,
      autoPlay: conf.autoPlay,
      fallbackMute: false,
      mute: conf.mute,
      skipAd: true,
      // adSection: j,
      volume,
      // tpAds: ['dm'],
      // pagetpl: k,
      pageSection: pageLocation,
      // scrollBehaviour: {
      //   inViewPercent: 50,
      //   dock: false,
      //   autoPlay: false,
      //   autoPause: true,
      // },
    },
    /* playerVars: {
        image: bgImage,
        playerid: playerId,
        // sg: TimesApps.AudioUtils.getAdsTargetParams(),
        cc: TimesApps.userLocation.getCountryFromSessionStorage(),
        time: new Date(),
        apikey: slikeApiKey,
        section,
        pid: agency || 'TNN',
        pagesection: TimesApps.getPageLocation(),
        autoStart: true,
        id: mediaId,
        title: mainConfig.title,
        nextVideoCounter: conf.nextVideoCounter,
        nextVideoUrl,
        msid,
        // shareurl: '',
        settings: {
          //for showing next video on autoplay
          autoplay: true,
          volume,
          //mute: TimesApps.Vod_Player.isMute()
          mute: TimesApps.AudioPlayerUtils.isMute(),
        },
        controls: {
          dim: allowDim,
          fullscreen: true,
          adplaypause: true,
          // share: !isMobileMode,
          autoplay: conf.showAutoplayButton,
          hideCenterIcon: true,
          //'controlsHide': ['dim','autoplay','fullscreen','bitrate','volumebar','keyshortcut','share']
        },
      },*/
    // events: TimesApps.audioPlayerCallbacks,
  };
  // if (navigator.userAgent.indexOf('UCBrowser') !== -1) {
  //   configObj.playerVars.settings.autoplay = false;
  // }

  // if (
  //   TimesApps.VOD_CONF[source] &&
  //   TimesApps.VOD_CONF[source].showVolumeSeekBar
  // ) {
  //   configObj.playerVars.controls.showVolumeSeekBar = true;
  // }

  //document.domain = 'indiatimes.com';
  // configObj.playerVars.shareurl = TimesApps.AudioUtils.getVideoUrl();
  return playerConfigObj;
}
