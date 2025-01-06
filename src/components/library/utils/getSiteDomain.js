import {
  TOI_DEV_MOBILE_DOMAIN,
  TOI_LIVE_MOBILE_DOMAIN,
  TOI_LIVE_DOMAIN,
  TOI_DEV_DOMAIN,
} from '../constants/index';

export default function getSiteDomain(isMobile) {
  const isDev = !__PROD__;
  if (isMobile) {
    return isDev ? TOI_DEV_MOBILE_DOMAIN : TOI_LIVE_MOBILE_DOMAIN;
  }

  return isDev ? TOI_DEV_DOMAIN : TOI_LIVE_DOMAIN;
}
