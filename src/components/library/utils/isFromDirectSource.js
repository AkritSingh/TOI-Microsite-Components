const isFromDirectSource = (query) => {
  if (typeof document === 'object') {
    const { domain, referrer } = document;
    if (
      (referrer === '' && !query.utm_source) ||
      (referrer.length > 0 && referrer.indexOf(domain) !== -1)
    ) {
      return true;
    }
  }
  return false;
};

export default isFromDirectSource;
