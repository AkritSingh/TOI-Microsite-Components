import {
  JARVIS_CLIENT_SIDE_FEED_DOMAIN,
  JARVIS_SERVER_SIDE_FEED_DOMAIN,
  JARVIS_FEED_URI,
  JARVIS_DB_ENV_PARAM,
} from 'constants/index';

const getJarvisASFeedURL = (props) => {
  const {
    jarvisClient,
    jarvisType,
    isMobile,
    isPrimeUser,
    isUpcache,
    sectionL1,
    sectionL2,
    sectionL3,
  } = props;
  let isServerSide = false;
  if (typeof window === 'undefined') {
    isServerSide = true;
  }
  return `${
    isServerSide
      ? JARVIS_SERVER_SIDE_FEED_DOMAIN
      : JARVIS_CLIENT_SIDE_FEED_DOMAIN
  }${JARVIS_FEED_URI}/${jarvisClient}/${jarvisType}?${JARVIS_DB_ENV_PARAM}${
    isMobile ? '&platform=mweb' : '&platform=web'
  }${isPrimeUser ? '&prime=yes' : '&prime=no'}${
    sectionL1 ? `&sectionl1=${sectionL1}` : ''
  }${sectionL2 ? `&sectionl2=${sectionL2}` : ''}${
    sectionL3 ? `&sectionl3=${sectionL3}` : ''
  }${isServerSide && isUpcache ? '&cache_policy=cache_by_pass' : ''}`;
};
export default getJarvisASFeedURL;
