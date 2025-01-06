// TOIPR-64420 - follow in case of cryptocurency folder and
// after article publish after 24 jan 2022
const zebpayPubDateConfig = {
  LINK_REL_NOOPEN_NOREF: 'noopener noreferrer',
  FIXED_PUB_DATE: new Date(2022, 0, 24, 23, 59).getTime(),
  FOLLOW_ZEBPAY_SECTION: ['82453999'],
};

const linkRelInCrypto = (subsecmsid2, dl) => {
  try {
    const { LINK_REL_NOOPEN_NOREF, FIXED_PUB_DATE, FOLLOW_ZEBPAY_SECTION } =
      zebpayPubDateConfig;
    if (dl && FOLLOW_ZEBPAY_SECTION.includes(subsecmsid2)) {
      const publishdata = new Date(+dl).getTime();
      // Article should be post after 24 Jan 2022
      return publishdata > FIXED_PUB_DATE ? LINK_REL_NOOPEN_NOREF : null;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export default linkRelInCrypto;
