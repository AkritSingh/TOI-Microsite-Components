export const sendGAEvent = ({
  category,
  action,
  label,
  value,
  nonInteraction,
}) => {
  if (typeof window.ga === 'function') {
    window.ga(
      'send',
      'event',
      category,
      action,
      label,
      value,
      nonInteraction ? { nonInteraction: true } : undefined
    )
  }
}

export const isIpad = (onResize) => {
  if (window) {
    const mql = window.matchMedia('(min-width: 768px) and (max-width: 1023px)')
    if (typeof onResize === 'function') {
      mql.addEventListener('change', (e) => onResize(e.matches))
    }
    return mql.matches
  }
  return false
}

function getRandomNumber(max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min)
}

export const shuffleArray = (data = []) => {
  const array = [...data]
  const totalItems = data.length
  if (totalItems > 0) {
    let temp
    let randomIndex
    for (let currentIndex = 0; currentIndex < totalItems; currentIndex += 1) {
      randomIndex = getRandomNumber(totalItems, currentIndex)
      temp = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temp
    }
  }
  return array
}

export const getParamNameValueString = (name, value, url = '') =>
  name && value ? `${url.includes('?') ? '&' : '?'}${name}=${value}` : ''

export const isEmptyOrNull = (obj) => {
  if (!obj) {
    return true
  }
  if (Array.isArray(obj)) {
    return obj.length === 0
  }
  return Object.keys(obj).length === 0
}

export const getDateTimeDifference = (endTimeStamp, startTimeStamp) => {
  let difference = endTimeStamp - startTimeStamp

  const hoursDifference = Math.floor(difference / 1000 / 60 / 60)
  difference -= hoursDifference * 1000 * 60 * 60

  const minutesDifference = Math.floor(difference / 1000 / 60)
  difference -= minutesDifference * 1000 * 60

  const secondsDifference = Math.floor(difference / 1000)
  return `${hoursDifference}:${minutesDifference}:${secondsDifference}`
}

export const getGAWithPrefixes = (ga = {}, gaPrefixes = {}) => {
  const finalGA = { ...ga }
  const { category, action } = gaPrefixes
  if (category) {
    finalGA.category = `${category}_${ga.category}`
  }
  if (action) {
    finalGA.action = `${action}_${ga.action}`
  }
  return finalGA
}

const nortanURLs = [
  'https://www.anrdoezrs.net/click-100246100-13681578',
  'https://www.dpbolvw.net/click-100246100-13681581',
  'https://www.kqzyfj.com/click-100246100-13788730',
  'https://www.jdoqocy.com/click-100246100-14362389',
  'https://www.kqzyfj.com/click-100246100-14508190',
  'https://www.dpbolvw.net/click-100246100-14056332',
]

const isNortanURL = (url) => {
  let flag = false
  nortanURLs.forEach((nURL) => {
    if (!flag && url.includes(nURL)) {
      flag = true
    }
  })
  return flag
}

export const getURLSeparator = (url) => (url.includes('?') ? '&' : '?')

const isAffiliateURL = (validAffiliateList, url = '') => {
  let isValidAffiliate = false
  validAffiliateList.forEach((item) => {
    if (url.includes(item)) {
      isValidAffiliate = true
    }
  })

  return (
    isValidAffiliate ||
    url.includes('amazon.') ||
    url.includes('croma.') ||
    url.includes('livpuresmart.') ||
    url.includes('fnp.') ||
    url.includes('amd.') ||
    url.includes('bajajmall.') ||
    url.includes('organicindia.') ||
    url.includes('flipkart.') ||
    url.includes('jdoqocy.com') ||
    isNortanURL(url)
  )
}

export const getIntermediateURLWithTag = (
  url,
  validAffiliateList = [],
  intermediateURLConfig = {},
) => {
  if (!isAffiliateURL(url, validAffiliateList)) {
    return url
  }
  let finalURL = url
  const { urlsuffix, tag, utm_params: utmParams } = intermediateURLConfig
  if (utmParams) {
    finalURL = `${url}${getURLSeparator(url)}${utmParams}`
  } else if (tag) {
    finalURL += getURLSeparator(url)
    finalURL += `tag=${tag}`
  }

  if (urlsuffix) {
    finalURL = `${urlsuffix}${getURLSeparator(
      urlsuffix
    )}url=${encodeURIComponent(finalURL)}`
  }
  return finalURL
}
export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const addAffiliateNameInGAAction = (
  affiliatename = '',
  gaAction = ''
) => {
  if (
    affiliatename &&
    affiliatename !== 'amazon' &&
    gaAction.includes('Affiliate')
  ) {
    return gaAction.replace('Affiliate', capitalizeFirstLetter(affiliatename))
  }
  return gaAction
}

export const getImageURL = (msid) =>
  `https://static.toiimg.com/thumb/width-347,resizemode-4,msid-${msid}/${msid}.jpg`

export const createChunks = (arr, chunkSize, randomizeData) => {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }
  if (randomizeData) {
    return shuffleArray(res)
  }
  return res
}

export const wait = ms => new Promise(resolve => {setTimeout(resolve, ms)});

export function inViewForReact(el, partial, roundValues, skew = 0) {
  const rect = el.getBoundingClientRect();
  let { top, bottom } = rect;
  let { height } = rect;
  let { left, right } = rect;
  if (roundValues) {
    top = Math.round(top);
    height = Math.round(height);
    left = Math.round(left);
    right = Math.round(right);
  }
  let isInView = false;
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  if (skew) {
    top = skew ? top + skew / 2 : top;
    bottom = skew ? bottom - skew / 2 : bottom;
  }

  if (partial) {
    isInView =
      (bottom > 0 && bottom <= windowHeight) ||
      (bottom > 0 && bottom < height) ||
      (top >= 0 && top <= windowHeight);
  } else {
    isInView =
      top >= 0 && left >= 0 && bottom <= windowHeight && right <= windowWidth;
  }
  return isInView;
}
