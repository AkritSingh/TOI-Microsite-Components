import _get from 'lodash.get';

const newNav = (name) => ({
  hl: name.toUpperCase(),
  wu: '',
});

const getUpdatedNavs = (navs, secname) => {
  let isExisting = false;
  let ind = 0;
  for (let index = 0; index < navs.length; index += 1) {
    const element = navs[index];
    if (element?.hl) {
      const sec = element.hl.toLowerCase();
      element.active = false;
      if (sec === secname) {
        isExisting = true;
        ind = index;
        break;
      }
    }
  }
  const insertPos = 1;
  if (isExisting) {
    const existingElem = navs[ind];
    // shift logic
    for (let index = ind; index > insertPos - 1; index -= 1) {
      navs[index] = navs[index - 1];
    }
    navs[insertPos] = existingElem;
  } else {
    navs.splice(insertPos, 0, newNav(secname));
  }
  navs[insertPos].active = true;
  return navs.filter((ls) => ls?.hl);
};

const getUpdatedSectionData = (sectionData, secname) => {
  // add modify main nav data to show active item
  const navs = _get(sectionData, 'header.data.mainnav.data', []);
  if (navs.length) {
    const navArr = [...navs];
    sectionData.header.data.mainnav.data = getUpdatedNavs(navArr, secname);
  }
};
export default getUpdatedSectionData;
// myArray.splice(insertPosition, 0, 1);
