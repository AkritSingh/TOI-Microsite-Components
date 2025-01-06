// import getSiteDomain from 'components/utils/getSiteDomain';

// export const AFFILIATE_PAYTM = 'PAYTM';
// export const AFFILIATE_AMAZON = 'AMAZON';
// export const AFFILIATE_TATACLIQ = 'TATACLIQ';
// export const AFFILIATE_CROMA = 'CROMA';
// export const AFFILIATE_FNP = 'FNP';
// export const AFFILIATE_BAJAJMALL = 'BAJAJMALL';
// export const AFFILIATE_NORTON = 'NORTON';

// function getAffiliateTemplate(affiliatePartnerName) {
//   if (affiliatePartnerName === AFFILIATE_PAYTM) {
//     return 'affiliate_paytm';
//   }
//   if (affiliatePartnerName === AFFILIATE_AMAZON) {
//     return 'affiliate_amazon';
//   }
//   if (affiliatePartnerName === AFFILIATE_TATACLIQ) {
//     return 'affiliate_tatacliq';
//   }
//   return '';
// }

// export function isAffiliate(overridelink) {
//   return (
//     overridelink &&
//     (overridelink.includes('paytmmall.com') ||
//       overridelink.includes('paytm.com') ||
//       overridelink.includes('amazon.in') ||
//       overridelink.includes('amazon.com') ||
//       overridelink.includes('amazon.co.uk') ||
//       overridelink.includes('amazon.ca') ||
//       overridelink.includes('amazon.de') ||
//       overridelink.includes('amazon.fr') ||
//       overridelink.includes('amazon.es') ||
//       overridelink.includes('amazon.it') ||
//       overridelink.includes('amazon.ae') ||
//       overridelink.includes('tatacliq.com') ||
//       overridelink.includes('fnp.com') ||
//       overridelink.includes('bajajmall.in') ||
//       overridelink.includes('croma.com') ||
//       overridelink.includes('anrdoezrs.net') ||
//       overridelink.includes('dpbolvw.net') ||
//       overridelink.includes('kqzyfj.com') ||
//       overridelink.includes('jdoqocy.com') ||
//       overridelink.includes('kqzyfj.com') ||
//       overridelink.includes('dpbolvw.net'))
//   );
// }

// export function getAffiliatePartnerName(overridelink) {
//   if (typeof overridelink !== 'string') {
//     return '';
//   }
//   if (
//     overridelink.includes('paytmmall.com') ||
//     overridelink.includes('paytm.com')
//   ) {
//     return AFFILIATE_PAYTM;
//   }
//   if (
//     overridelink.includes('amazon.in') ||
//     overridelink.includes('amazon.co.uk') ||
//     overridelink.includes('amazon.ca') ||
//     overridelink.includes('amazon.de') ||
//     overridelink.includes('amazon.fr') ||
//     overridelink.includes('amazon.es') ||
//     overridelink.includes('amazon.it') ||
//     overridelink.includes('amazon.ae') ||
//     overridelink.includes('amazon.com')
//   ) {
//     return AFFILIATE_AMAZON;
//   }
//   if (overridelink.includes('tatacliq.com')) {
//     return AFFILIATE_TATACLIQ;
//   }
//   if (overridelink.includes('fnp.com')) {
//     return AFFILIATE_FNP;
//   }
//   if (overridelink.includes('bajajmall.in')) {
//     return AFFILIATE_BAJAJMALL;
//   }
//   if (overridelink.includes('croma.com')) {
//     return AFFILIATE_CROMA;
//   }
//   if (
//     overridelink.includes('anrdoezrs.net') ||
//     overridelink.includes('dpbolvw.net') ||
//     overridelink.includes('kqzyfj.com') ||
//     overridelink.includes('jdoqocy.com') ||
//     overridelink.includes('kqzyfj.com') ||
//     overridelink.includes('dpbolvw.net')
//   ) {
//     return AFFILIATE_NORTON;
//   }

//   return '';
// }

// function getWebAttributionParam(title = '', affiliatePartnerName) {
//   if (affiliatePartnerName === AFFILIATE_PAYTM) {
//     return 'putm=toiweb_articles&';
//   }
//   if (affiliatePartnerName === AFFILIATE_AMAZON) {
//     return '&utm_campaign=times_of_india_web-21';
//   }
//   if (affiliatePartnerName === AFFILIATE_TATACLIQ) {
//     return title.replace(' ', '_');
//   }
//   return '';
// }

// function getWAPAttributionParam(title = '', affiliatePartnerName) {
//   if (affiliatePartnerName === AFFILIATE_PAYTM) {
//     return 'putm=toiwap_articles&';
//   }
//   if (affiliatePartnerName === AFFILIATE_AMAZON) {
//     return '&utm_campaign=times_of_india_wap-21';
//   }
//   if (affiliatePartnerName === AFFILIATE_TATACLIQ) {
//     return title.replace(' ', '_');
//   }
//   return '';
// }

// export function getEncodedAffiliateLink(title, overridelink, isWAP = false) {
//   const affiliatePartnerName = getAffiliatePartnerName(overridelink);
//   const affiliateTemplateName = getAffiliateTemplate(affiliatePartnerName);
//   let tag = '';
//   try {
//     tag = overridelink && new URL(overridelink).searchParams.get('tag');
//   } catch (e) {
//     console.log(
//       `Error:unable to convert URL = ${overridelink}, wrong format of overridelink:`,
//       e,
//     );
//     return '';
//   }

//   if (overridelink && overridelink.includes(affiliateTemplateName)) {
//     return overridelink;
//   }
//   const encodedOverrideLink = encodeURIComponent(overridelink);
//   let attributionparam;
//   if (!tag) {
//     if (!isWAP) {
//       attributionparam = getWebAttributionParam(title, affiliatePartnerName);
//     } else {
//       attributionparam = getWAPAttributionParam(title, affiliatePartnerName);
//     }
//   }
//   // This comments is used for tracking amazon product as of now this in under dicussion
//   // return `${getSiteDomain(
//   //   isWAP,
//   // )}/${affiliateTemplateName}.cms?url=${encodedOverrideLink}&price=${
//   //   data.mrp
//   // }&title=${title}&${attributionparam}&pos=${data.position}&cat=${
//   //   data.cat
//   // }&brand=${data.brand}&loc=${data.loc}&ccd=${data.country}&clnt=${
//   //   data.client
//   // }&chnl=toi&uuid=${data.uuid}&callExt=${data.callExt}`;
//   return `${getSiteDomain(
//     isWAP,
//   )}/${affiliateTemplateName}.cms?url=${encodedOverrideLink}${
//     title ? `&title=${title}` : ''
//   }${!tag ? `&${attributionparam}` : ''}`;
// }
