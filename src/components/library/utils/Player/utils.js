/* eslint-disable linebreak-style */
// import { pauseGaanaPlayer } from 'modules/WithGaanaWidget/utils';
import { videoIframeTemplate, miniTVIframeTemplate } from '../../constants/index';
import { getSiteDomain } from '../../constants/index';

export const generateIframeUrl = function generateIframeUrl(msid) {
  return `${getSiteDomain()}/${videoIframeTemplate()}?msid=${msid}`;
};
export function getVideoItemFromMediaInfoFeed({
  title,
  description,
  totalcount,
  // duration,
  timestamp,
  agency,
  seopath,
  msid,
}) {
  return {
    hl: title,
    des: description,
    views: totalcount,
    lpt: timestamp,
    agency,
    wu: `https://timesofindia.indiatimes.com/${seopath}/videoshow/${msid}.cms`,
    id: msid,
  };
}

export const generateMiniTvIframeUrl = function generateMiniTvIframeUrl(
  slikeid,
) {
  return `${getSiteDomain()}/${miniTVIframeTemplate()}?stream_id=${slikeid}&source=mini_tv`;
};

export function getVideoImg(msid, imgsize) {
  return `https://static.toiimg.com/thumb/imgsize-${imgsize},msid-${msid},width-1200,resizemode-4/${msid}.jpg`;
}

/* @todo
    create a list of players in redux,
    each player would have name and pause function,
    when one player plays it should dispatch an action which has its name
    and we write code to pause other players with name !== current player
    also actions to add delete player should be there
*/
export function resumePlayer() {
  setTimeout(() => {
    if (
      window.S &&
      window.S.activePlayer &&
      typeof window.S.activePlayer.play === 'function'
    ) {
      window.S.activePlayer.play();
    }
  }, 100);
}
export function pausePlayer() {
  setTimeout(() => {
    if (
      window.S &&
      window.S.activePlayer &&
      typeof window.S.activePlayer.pause === 'function'
    ) {
      window.S.activePlayer.pause();
    }
  }, 100);
}
export function destroyPlayer() {
  setTimeout(() => {
    if (
      window.S &&
      window.S.activePlayer &&
      typeof window.S.activePlayer.destroy === 'function'
    ) {
      window.S.activePlayer.destroy();
    }
  }, 100);
}
export function pauseOtherPlayers() {
  // pauseGaanaPlayer();
}

export function dockVideoPlayer() {
  // Todo - dock player should be run only wheere it is required | getting error on videocomplete so adding try catch
  if (typeof document !== 'undefined' && typeof window.player !== 'undefined') {
    try {
      const element = document.querySelector('.videoAction');
      element.classList.add('nextVideo');
      window.player.pause();
      setTimeout(() => {
        element.classList.remove('nextVideo');
        const playPauseButton = document.querySelector('.closeDoc');
        playPauseButton.classList.add('pause');
        window.player.play();
      }, 2000);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
}
export default { generateIframeUrl };
