import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';

const isClientSide = typeof window !== 'undefined';

const eventListenerOptions = {
  once: true,
  capture: true,
  passive: true,
};

const getDisplayName = (WrappedComponent) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const withHydrationOnDemandServerSide = (WrappedComponent) =>
  // eslint-disable-next-line func-names, react/display-name
  function ({ wrapperProps, ...props }) {
    return (
      <section data-h-o-d {...wrapperProps}>
        <WrappedComponent {...props} />
      </section>
    );
  };

const withHydrationOnDemandClientSide =
  ({
    disableFallback = false,
    isInputPendingFallbackValue = true,
    on = [],
    onBefore,
    whenInputPending = false,
    disableHydration = false,
  }) =>
  (WrappedComponent) => {
    function WithHydrationOnDemand({
      forceHydration = false,
      wrapperProps,
      ...props
    }) {
      const rootRef = useRef(null);
      const cleanupFunctions = useRef([]);

      const isInputPending = () => {
        // eslint-disable-next-line no-shadow
        const isInputPending = navigator?.scheduling?.isInputPending?.();
        return isInputPending ?? isInputPendingFallbackValue;
      };

      const getDefaultHydrationState = () => {
        const isNotInputPending = whenInputPending && !isInputPending();
        return (isNotInputPending || forceHydration) && !onBefore;
      };

      const [isHydrated, setIsHydrated] = useState(getDefaultHydrationState());

      const cleanUp = () => {
        cleanupFunctions.current.forEach((fn) => fn());
        cleanupFunctions.current = [];
      };

      const hydrate = useCallback(async () => {
        cleanUp();
        if (isHydrated) return;

        if (onBefore) await onBefore();
        setIsHydrated(true);
      }, [isHydrated]);

      const initDOMEvent = useCallback(
        (type, getTarget = () => rootRef.current) => {
          const target = getTarget();
          target.addEventListener(type, hydrate, eventListenerOptions);
          cleanupFunctions.current.push(() => {
            if (!target) return;
            target.removeEventListener(type, hydrate, eventListenerOptions);
          });
        },
        [hydrate],
      );

      const initTimeout = useCallback(
        (delay = 2000) => {
          if (delay <= 0) return;

          const timeout = setTimeout(hydrate, delay);
          cleanupFunctions.current.push(() => clearTimeout(timeout));
        },
        [hydrate],
      );

      const initIdleCallback = useCallback(() => {
        if (!('requestIdleCallback' in window)) {
          initTimeout();
          return;
        }

        const idleCallback = requestIdleCallback(
          () => requestAnimationFrame(() => hydrate()),
          { timeout: 500 },
        );

        if (!('cancelIdleCallback' in window)) return;

        cleanupFunctions.current.push(() => {
          cancelIdleCallback(idleCallback);
        });
      }, [hydrate, initTimeout]);

      const initIntersectionObserver = useCallback(
        (getOptions = Function.prototype) => {
          if (!('IntersectionObserver' in window)) {
            hydrate();
            return;
          }

          const options = getOptions();
          const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting || !(entry.intersectionRatio > 0)) return;
            hydrate();
          }, options);

          cleanupFunctions.current.push(() => {
            if (!observer) return;
            observer.disconnect();
          });
          observer.observe(rootRef.current);
        },
        [hydrate],
      );

      const initEvent = useCallback(
        (type, options) => {
          switch (type) {
            case 'delay':
              initTimeout(options);
              break;
            case 'visible':
              initIntersectionObserver(options);
              break;
            case 'idle':
              initIdleCallback();
              break;
            default:
              initDOMEvent(type, options);
          }
        },
        [initDOMEvent, initIdleCallback, initIntersectionObserver, initTimeout],
      );

      useLayoutEffect(() => {
        if (isHydrated) return;
        if (disableHydration) return;

        if (forceHydration) {
          hydrate();
          return;
        }

        const wasRenderedServerSide =
          !!rootRef.current.getAttribute('data-h-o-d');
        const shouldHydrate = !wasRenderedServerSide && !disableFallback;

        if (shouldHydrate) hydrate();
      }, [forceHydration, hydrate, isHydrated]);

      useEffect(() => {
        if (isHydrated) return;
        if (disableHydration) return;

        on.forEach((event) =>
          Array.isArray(event) ? initEvent(...event) : initEvent(event),
        );
        // eslint-disable-next-line consistent-return
        return cleanUp;
      }, [initEvent, isHydrated]);

      if (!isHydrated) {
        return (
          <section
            ref={rootRef}
            suppressHydrationWarning
            {...wrapperProps}
            data-h-o-d
            dangerouslySetInnerHTML={{
              __html: '',
            }}
          />
        );
      }

      return (
        <section {...wrapperProps} data-h-o-d>
          <WrappedComponent {...props} />
        </section>
      );
    }

    WithHydrationOnDemand.displayName = `withHydrationOnDemand(${getDisplayName(
      WrappedComponent,
    )})`;

    return WithHydrationOnDemand;
  };
const withHydrationOnDemand = (options = {}) => {
  if (isClientSide) return withHydrationOnDemandClientSide(options);

  return withHydrationOnDemandServerSide;
};

export default withHydrationOnDemand;
