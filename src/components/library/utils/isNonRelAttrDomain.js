const nonRelAttrDomains = [
  'recipes.timesofindia.com',
  'photogallery.indiatimes.com',
  'beautypageants.indiatimes.com',
  'timesofindia.onelink.me',
];
export default function isNonRelAttrDomain(url) {
  if (typeof url !== 'string') {
    return false;
  }
  let isNonRelAttrDomainValue = false;
  nonRelAttrDomains.forEach((domainName) => {
    if (url.indexOf(domainName) >= 0) {
      isNonRelAttrDomainValue = true;
    }
  });
  return isNonRelAttrDomainValue;
}
