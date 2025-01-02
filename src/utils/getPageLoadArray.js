import findJarvisAdCode from 'components/library/atoms/AdCaller/utils';

const getPageLoadArray = (section, msid) => {
  const { revenue } = section;
  const { ads } = revenue;
  const layoutAds = ['topBand', 'bottomOverlay', 'atf']; //fixed layout ads
  const adsSection = ['bodyInserts', 'afterBody']; // section dynmaic
  const arr = [];
  const pageInfo = { articleIndex: 0 };

  adsSection.forEach((key) => {
    const adsInsert = section[key].components || section[key];
    if (adsInsert?.length) {
      adsInsert.forEach((element) => {
        if (element.type === 'components_atoms_ad') {
          const ad = findJarvisAdCode(element.config.name, msid, ads, pageInfo);
          if (ad && ad.adType === 'dfp') {
            arr.push(ad);
          }
        }
      });
    }
  });
  layoutAds.forEach((key) => {
    const ad = findJarvisAdCode(key, msid, ads, pageInfo);
    if (ad) {
      arr.push(ad);
    }
  });

  return arr;
};

export default getPageLoadArray;
