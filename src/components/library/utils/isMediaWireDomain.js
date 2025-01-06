function isMediawireDomain(url) {
  if (typeof url !== 'string') {
    return false;
  }
  return url.indexOf('mediawire.in') >= 0;
}

export default isMediawireDomain;
