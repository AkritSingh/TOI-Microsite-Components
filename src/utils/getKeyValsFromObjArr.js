const getKeyValsFromObjArr = (arr, key, joinBy) => {
  if (arr && arr.length) {
    const modifiedArr = arr.map((item) => item[key]);
    return modifiedArr.join(joinBy);
  }
  return '';
};

const getLowerCaseString = (str = '', replaceSpaceWith = '_') =>
  str.toLowerCase().trim().replaceAll(' ', replaceSpaceWith);

export { getKeyValsFromObjArr, getLowerCaseString };
