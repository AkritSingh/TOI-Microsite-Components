export default function getSkipAdsFlagForVideo(meta) {
  if (meta && meta.AdServingRules === 'Turnoff Video Ads') {
    return true;
  }
  return false;
}
