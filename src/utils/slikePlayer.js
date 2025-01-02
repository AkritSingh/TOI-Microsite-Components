/* eslint-disable no-shadow */
/* eslint-disable no-console */

const slikePlayer = (playerConfig, playerId) => {
  // console.log('playerConfig');
  // console.log(playerConfig);
  const PLAYER_CONFIG = {
    apiKey: playerConfig.apiKey || 'test403web5a8sg6o9ug',
    contEl: playerConfig.contEl || 'playerContainer',
    version: '3.5.10',
    ...playerConfig,
  };

  const playerEvents = {
    onPlayerError: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onInit: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVideoStarted: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVideoResumed: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVideoPaused: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVolumeChange: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVideoMuted: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVideoCompleted: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVideoEnded: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVideoProgress: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
    onVideoFullscreenchange: (player, eventName, eventData) => {
      console.log('Player event ', eventName, eventData);
    },
  };
  const adEvents = {
    onAdComplete: (player, eventName, eventData) => {
      console.log('Ad Event ', eventName, eventData);
    },
    onAdSkip: (player, eventName, eventData) => {
      console.log('Ad Event ', eventName, eventData);
    },
    onAdLoaded: (player, eventName, eventData) => {
      console.log('Ad Event ', eventName, eventData);
    },
    onAdRequest: (player, eventName, eventData) => {
      console.log('Ad Event ', eventName, eventData);
    },
    onAdError: (player, eventName, eventData) => {
      console.log('Ad Event ', eventName, eventData);
    },
    onAdResume: (player, eventName, eventData) => {
      console.log('Ad Event ', eventName, eventData);
    },
    onAdStart: (player, eventName, eventData) => {
      console.log('Ad Event ', eventName, eventData);
    },
    onAdPause: (player, eventName, eventData) => {
      console.log('Ad Event ', eventName, eventData);
    },
  };
  function handlePlayerEvents(player) {
    function eventToFunction(player, eventName, data) {
      console.log(eventName);
      const funcName = eventName.replace('spl', 'on');
      data = { ...data, ...player.store.video };
      if (playerEvents && typeof playerEvents[funcName] === 'function') {
        playerEvents[funcName](player, funcName, data);
      }
    }
    Object.keys(window.SlikePlayer.Events).forEach((eventKey) => {
      const eventName = window.SlikePlayer.Events[eventKey];
      player.on(eventName, eventToFunction.bind(null, player));
    });
  }
  function handleAdEvents(player) {
    function eventToFunction(player, eventName, data) {
      console.log(eventName);
      const funcName = eventName.replace('spl', 'on');
      const eventData = data || {};
      if (adEvents && typeof adEvents[funcName] === 'function') {
        adEvents[funcName](player, funcName, eventData);
      }
    }
    Object.keys(window.SlikePlayer.AdEvents).forEach((eventKey) => {
      const eventName = window.SlikePlayer.AdEvents[eventKey];
      player.on(eventName, eventToFunction.bind(null, player));
    });
  }

  /**Initialize player**/
  if (window.spl && window.spl.load) {
    console.log('slike player loaded');
    window.spl.load(PLAYER_CONFIG, (status, config) => {
      if (status) {
        window.players = window.players || {};
        if (!window.players[playerId]) {
          window.players[playerId] = {
            config: PLAYER_CONFIG,
            player: new window.SlikePlayer(config),
          };
        }
        const { player } = window.players[playerId];
        handleAdEvents(player);
        handlePlayerEvents(player);
      }
    });
  }
};

export default slikePlayer;
