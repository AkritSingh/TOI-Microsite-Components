export function getCustomClassesForPayload(classes, styleObj) {
  //Claases is string and checking length before processing
  if (classes.length) {
    const newClass = classes.replace(/  +/g, ' ');
    const classArr = newClass.split(' ');
    for (let i = 0; i < classArr.length; i += 1) {
      classArr[i] = styleObj[classArr[i]];
    }
    return classArr.join(' ');
  }
  return '';
}

export function getClassesFromArray(styleArr, styleObj) {
  //classArr is array and checking length before processing
  if (styleArr.length) {
    const classArr = [];
    for (let i = 0; i < styleArr.length; i += 1) {
      classArr[i] = styleObj[styleArr[i]];
    }
    return classArr.join(' ');
  }
  return '';
}

export function isTablet() {
  return (function returnAgent(agent) {
    return /(?:ipad|tab)/i.test(agent);
  })(navigator.userAgent || navigator.vendor || window.opera);
}
