export default function settings(duration = 0, configName) {
  const config = {
    _default: {
      // showAutoplayButton: false,
      // nextVideoCounter: 5,
      // nextVideoUrl: '/videpostroll_v8/',
      showNextPrevButton: false,
      controlsType: 'custom',
      showAutoPlayNext: true,
      showFwdSeek: true,
      showBackSeek: true,
      autoPlayNext: false,
      showWave: true,
      showShare: false,
      autoPlay: true,
      autoPlayAudio: true,
      forceWA: true,
      mute: false,
      duration,
    },
    PODCAST: {
      showNextPrevButton: false,
      controlsType: 'custom',
      showAutoPlayNext: true,
      showFwdSeek: true,
      showBackSeek: true,
      autoPlayNext: false,
      showWave: true,
      showShare: false,
      autoPlay: true,
      autoPlayAudio: true,
      forceWA: true,
      mute: false,
      duration,
    },
  };

  return config[configName] || config._default;
}
