export default function getOpenInAppLink(
  pageType,
  navsubsecsData,
  isEtimes,
  msid,
  grxId,
) {
  // #TODO : handle isEtimes - set the variable basis on section details
  const subSecSeoLocation =
    navsubsecsData &&
    navsubsecsData.subsec1 &&
    navsubsecsData.subsec1.seolocation1;
  const afAndroidStoreCsl = isEtimes ? '01etimes' : false;
  const afIosStoreCpp = isEtimes ? '01etimes' : false;
  let buttonType = '';
  let afSub1 =
    typeof window === 'object' && window?.grxParams?.storySection
      ? window?.grxParams?.storySection
      : false;
  if (!afSub1 && subSecSeoLocation && pageType === 'ARTICLESHOW') {
    afSub1 = subSecSeoLocation;
  }
  let defaultValue;
  if (pageType === 'ARTICLESHOW') {
    buttonType = isEtimes ? 'Etimes_Mweb_AS_Floating' : 'TOI_Mweb_AS_Floating';
    defaultValue = encodeURIComponent(
      `toiapp://open-$|$-id=${msid}-$|$-url=https://plus.timesofindia.com/toi-feed/feed/toia/article/show?id=${msid}&source=toi&fv=<fv>-$|$-type=news-$|$-pid=${buttonType}-$|$-af_android_store_csl=${afAndroidStoreCsl}-$|$-af_ios_store_cpp=${afIosStoreCpp}-$|$-af_sub1=${afSub1}-$|$-af_sub2=${msid}-$|$-GRxID=${grxId}`,
    );
  }
  const oneLinkURL = 'https://timesofindia.onelink.me/mjFd/';
  let extraparams = '';
  if (pageType === 'ARTICLESHOW') {
    extraparams = `&af_android_store_csl=${afAndroidStoreCsl}&af_ios_store_cpp=${afIosStoreCpp}&af_sub1=${afSub1}&af_sub2=${msid}`;
  }
  const staticDeeplinkUrl = `${oneLinkURL}?af_js_web=true&af_ss_ver=2_7_2&pid=${buttonType}&deep_link_value=${defaultValue}&af_dp=toiapp.appsflyer.deeplink://${extraparams}`;
  return staticDeeplinkUrl;
}
