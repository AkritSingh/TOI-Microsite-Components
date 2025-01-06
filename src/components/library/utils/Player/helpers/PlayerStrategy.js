/* eslint-disable no-unused-vars */
import PubSub from './PubSub';

const ContentType = {
  AD: 'ad',
  CONTENT: 'ct',
};

const VideoState = {
  UNPLAYED: 's1',
  PLAYED: 's2',
  STOPPED: 's3',
  COMPLETED: 's4',
};

class PlayerStrategy {
  constructor(player, mainConfig) {
    this.player_ = player;
    this.ready_ = false;
    this.adData = {
      isPlaying: false,
      adType: '',
    };
    this.mainConfig = mainConfig;
    this.subscribeEvents_();
  }

  // /**
  //  * Enum for the ad position. One of these values should be returned from
  //  * the "getAdPosition" function.
  //  * @enum {string}
  //  */
  // AudioStratgey.AdPosition = {
  //   PREROLL: 'a1',
  //   MIDROLL: 'a2',
  //   POSTROLL: 'a3',
  //   OVERLAY: 'a4',
  //   SPECIAL: 'a5',
  // };

  // /**
  //  * Enum for the video state. One of these values should be returned from
  //  * the "getState" function.
  //  * @enum {string}
  //  */

  subscribeEvents_() {
    const pubSub = PubSub();
    pubSub.subscribe('VOD_EVENTS', (data) => {
      if (!(data instanceof Array) && data.length > 0) {
        return;
      }
      const eventData = data[0] || {};
      const eventType = data[1] ? data[1].toUpperCase() : '';
      this.adData.adType = (eventData.adtype || '').toUpperCase();

      if (this.adData.isAdPlaying) {
        return;
      }

      switch (eventType) {
        case 'VIDEOREADY':
          this.onPlaybackReady_();
          break;
        case 'VIDEOVIEW':
          this.onVideoPlay_();
          break;
        case 'AUDIOREADY':
          this.onPlaybackReady_();
          break;
        case 'AUDIOVIEW':
          this.onVideoPlay_();
          break;
        default:
      }
    });
  }

  // /**
  //  * Handle when the video is ready for playback
  //  * @private
  //  */
  onPlaybackReady_ = function onPlaybackReady_() {
    //console.log('**********************************AudioStratgey::onPlaybackReady_');
    this.ready_ = true;
  };

  // /**
  //  * Handle when the video is played
  //  * @private
  //  */
  onVideoPlay_ = function onVideoPlay_() {
    //console.log('**********************************AudioStratgey::onVideoPlay_');
    this.videoStartTime_ = Date.now();
    this.videoPlayed_ = true;
  };

  // /**
  //  * Indicates if the video strategy is ready for pinging.
  //  * Typically this is called when all path and title metadata
  //  * is available
  //  * Note: Pings should only be sent after this reads true.
  //  * @return {boolean} The ready state of the strategy.
  //  */
  isReady = function isReady() {
    // As an example, this could just be a call to a similar
    // method in your _player object
    // this._player.isready();
    //console.log("***************  isReady called *****************************");
    return this.ready_;
  };

  /*AudioStratgey.verify = function verify(player) {
    // console.log(player, TimesApps.getPlayerConfig());
    try {
      return player.playerVars.id === TimesApps.getPlayerConfig().playerVars.id;
    } catch (e) {
      // console.log(e);
      // console.log(player, TimesApps.getPlayerConfig());
      return false;
    }
  };*/

  // /**
  //  * Gets the video path.
  //  * This is returned in the p key of the ping.
  //  * Note: this should be the playable video path if available.
  //  * @return {string} The video path.
  //  */
  /* getVideoPath = function getVideoPath() {
    //console.log("***************  getVideoPath called *****************************");
    return TimesApps.getPlayerConfig().player.id;
  };*/

  // /**
  //  * Gets the type of video playing. Returns value from the ContentType enum.
  //  * This is returned in the _vt key of the ping.
  //  * @return {YourStrategy.ContentType} The type of content (ad or ct).
  //  */
  getContentType = function getContentType() {
    if (this.adData.isAdPlaying) {
      return ContentType.AD;
      //console.log("***************  getContentType called -" + AudioStratgey.ContentType.AD +"*****************************");
    }
    //console.log("***************  getContentType called " + AudioStratgey.ContentType.CONTENT +"*****************************");
    return ContentType.CONTENT;
  };

  // AudioStratgey.prototype.getAdPosition = function getAdPosition() {
  //   let adPosition;
  //   switch (this.adData.adType) {
  //     case 'MID':
  //       adPosition = AudioStratgey.AdPosition.PREROLL;
  //       break;
  //     default:
  //   }
  //   //console.log("***************  getAdPosition called,"+ adPosition +"*****************************");
  //   return adPosition;
  // };

  /* getState = function getState() {
    // const FLAGS = TimesApps.FLAGS;
    const playerState = TimesApps.VideoPlayerAudio.getPlayerState() || '';
    let state;
    if (this.adData.isAdPlaying) {
      //in case of ads
      //paused is to be sent
      state = VideoState.STOPPED;
    } else {
      switch (playerState) {
        case TimesApps.FLAGS.READY:
          state = VideoState.UNPLAYED;
          break;
        case TimesApps.FLAGS.PLAYING:
          state = VideoState.PLAYED;
          break;
        case TimesApps.FLAGS.PAUSED:
          state = VideoState.STOPPED;
          break;
        case TimesApps.FLAGS.COMPLETED:
          state = VideoState.COMPLETED;
          break;
        default:
          state = VideoState.STOPPED;
      }
    }

    //console.log("***************  getState called," + state + "*****************************");
    return state;
  };*/

  getStrategyName = function getStrategyName() {
    return 'VS';
  };

  getTitle = function getTitle() {
    //console.log("***************  getTitle called *****************************");
    return this.mainConfig.title || '';
  };

  // AudioStratgey.prototype.getThumbnailPath = function getThumbnailPath() {
  //   //console.log("***************  getThumbnailPath *****************************");
  //   return TimesApps.AudioUtils.getVideoImg(mainConfig.akamaiCacheBlockingImg) || '';
  // };

  //   getTotalDuration = function getTotalDuration() {
  //     return TimesApps.Vod_Player.getDurationinMs();
  //   };

  //   getCurrentPlayTime = function getCurrentPlayTime() {
  //     const playerName =
  //       (TimesApps.audioPlayer && TimesApps.audioPlayer.playerName) || '';
  //     const player = TimesApps.VideoPlayerAudio.getPlayer(playerName);
  //     const currentPlayTimeInS =
  //       player && player.getCurrentPosition && player.getCurrentPosition();
  //     return Math.round(currentPlayTimeInS * 1000);
  //   };

  getViewStartTime = function getViewStartTime() {
    return 0;
  };
}

export default PlayerStrategy;
