export default function getMainConfig(data = {}, isMobile) {
  const mainConfig = {
    source: data.sourceVal, //source is the videoshow for videoshow
    userInitiated: '1',
    mediaId: '', //slike id should be here
    msid: '',
    slikeApiKey: isMobile
      ? 'toimweb5t9tCpb7nb5q6jUb'
      : 'toiweba5ec9705eb7ac2c984033e061',
    // TODO: update above key with prod one once v3 keys are live
    // slikeApiKey: isMobileMode ? 'toi371mweb5awm99g9o6' : 'toi371web5awj999ou6',
    nextid: data.nextVideo,
    sectionId: '',
    title: data.title,
    agency: '',
    duration: data.duration || '',
    blacklistText: '',
    bgImage: '',
    //'https://static.toiimg.com/thumb/imgsize-199425,msid-#MSID#,width-800,resizemode-4/#MSID#.jpg',
    isVideoInsideBlacklistContent: '0',
    specialId__hyp1: '',
    skipAds: '0',
    volume: 80,
    site: 'TOID',
    playerid: data.slikeId, //24,
    section: isMobile ? 'videos' : 'video-show',
    nextVideoCounter: 5,
    allowDim: data.allowDimVal ? 1 : 0,
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
    pageType: data.isPodcast ? 'AUDIO' : 'VIDEO',
    audioMode: data.audioMode || '',
    autoPlayAudio: false,

    //showNextButton: false,
  };

  return mainConfig;
}
