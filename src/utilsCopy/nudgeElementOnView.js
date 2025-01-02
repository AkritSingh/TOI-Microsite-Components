/* eslint-disable no-param-reassign */

const shiftToLeft = (elem) => {
  elem.style.marginLeft = '-120px'
  elem.style.transition = 'all 0.5s'
}

const shiftToDefault = (elem) => {
  elem.style.marginLeft = '0px'
  elem.style.transition = 'all 0.5s'
}

const inViewCallback = (entryToCheck) => {
  setTimeout(() => {
    shiftToLeft(entryToCheck.target)
    setTimeout(() => {
      shiftToDefault(entryToCheck.target)
    }, 500)
  }, 500)
}

let inViewObserver
const nudgeElementOnView = (
  elem,
  viewMargin = '-60px 0px -60px 0px',
  threshold = 1
) => {
  if (elem && 'IntersectionObserver' in window) {
    inViewObserver = new IntersectionObserver(
      (entries) => {
        const entryToCheck = entries[0]
        if (
          entryToCheck &&
          (entryToCheck.isIntersecting || entryToCheck.intersectionRatio > 0)
        ) {
          inViewCallback(entryToCheck)
          inViewObserver.unobserve(entryToCheck.target)
        }
      },

      { rootMargin: viewMargin || '0px 0px 0px 0px', threshold }
    )
    inViewObserver.observe(elem)
  }
}
export default nudgeElementOnView
