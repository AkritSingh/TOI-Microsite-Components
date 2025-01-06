const connectedDomains = ['zigwheels.com', 'mediawire.in'];
export default function isConnectedDomain(url) {
  if (typeof url !== 'string') {
    return false;
  }
  let isConnectedDomainValue = false;
  connectedDomains.forEach((domainName) => {
    if (url.indexOf(domainName) >= 0) {
      isConnectedDomainValue = true;
    }
  });
  return isConnectedDomainValue;
}
