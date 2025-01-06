export const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

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
