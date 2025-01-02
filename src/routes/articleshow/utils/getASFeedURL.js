import {
  JAVA_FEED_AS_URI,
  JAVA_CLIENT_SIDE_FEED_DOMAIN,
  JAVA_SERVER_SIDE_FEED_DOMAIN,
} from 'constants/index';

const getASFeedURL = (props) => {
  const { isMobile, isUpcache, msid } = props;
  let isServerSide = false;
  if (typeof window === 'undefined') {
    isServerSide = true;
  }
  return `${
    isServerSide ? JAVA_SERVER_SIDE_FEED_DOMAIN : JAVA_CLIENT_SIDE_FEED_DOMAIN
  }${JAVA_FEED_AS_URI}&msid=${msid}${
    isMobile ? '&isMobile=true' : '&isMobile=false'
  }${isServerSide && isUpcache ? '&upcache=2' : ''}`;
};
export default getASFeedURL;
