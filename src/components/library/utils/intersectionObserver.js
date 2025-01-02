import { useEffect } from 'react';

const listenerCallbacks = new WeakMap();

let observer;

function handleIntersections(entries) {
  entries.forEach((entry) => {
    if (listenerCallbacks.has(entry.target)) {
      const cb = listenerCallbacks.get(entry.target);

      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        observer.unobserve(entry.target);
        listenerCallbacks.delete(entry.target);
        cb();
      }
    }
  });
}

function getIntersectionObserver() {
  if (observer === undefined) {
    observer = new IntersectionObserver(handleIntersections, {
      rootMargin: '100px',
      threshold: '0.15',
    });
  }
  return observer;
}

export default function useIntersection(elem, callback) {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || elem.current === undefined) {
      callback();
      return () => {};
    }
    if (
      typeof window !== 'undefined' &&
      window.TimesApps &&
      window.TimesApps.globalIntersectObserver &&
      window.TimesApps.globalIntersectObserver.disconnect
    ) {
      window.TimesApps.globalIntersectObserver.disconnect();
    }
    const target = elem.current;
    const _observer = getIntersectionObserver();
    listenerCallbacks.set(target, callback);
    _observer.observe(target);

    return () => {
      listenerCallbacks.delete(target);
      _observer.unobserve(target);
      if (
        typeof window !== 'undefined' &&
        window.TimesApps &&
        window.TimesApps.globalIntersectObserver &&
        window.TimesApps.globalIntersectObserver.disconnect
      ) {
        window.TimesApps.globalIntersectObserver.disconnect();
      }
    };
  }, [callback, elem]);
}
