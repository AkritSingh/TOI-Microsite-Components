import { GOOGLE_WEBCACHE_DOMAIN } from 'constants';

export default function disableAppInit() {
  return (
    window.location.hostname === GOOGLE_WEBCACHE_DOMAIN ||
    window.document.domain === GOOGLE_WEBCACHE_DOMAIN
  );
}
