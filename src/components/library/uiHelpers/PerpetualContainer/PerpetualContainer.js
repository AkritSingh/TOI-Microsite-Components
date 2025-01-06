/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import PropTypes from 'prop-types';
import LoaderSpinner from '../../atoms/LoaderSpinner/LoaderSpinner';
import fireEventsOnUrlChange from '../../utils/fireEventsOnUrlChange';
import fireEventsOnPerpetualPageLoad from '../../utils/fireEventsOnPerpetualPageLoad';
import { useGlobalContext } from '../../contexts/GlobalContext';
import getSection from '../../utils/getSection';
import getJarvisASFeedURL from '../../utils/getJarvisASFeedURL';
import s from './PerpetualContainer.scss';
import { ARTICLESHOW_VARS } from '../../../../constants';

// eslint-disable-next-line react/function-component-definition
const PerpetualContainer = (props) => {
  useStyles(s);
  const pcRef = useRef();
  const { appInitialState } = useGlobalContext();
  const { isMobile, isUpcache } = appInitialState;

  // PerpetualContainer -> will observe and listen , accordingly render content
  const {
    ComponentToRender, // component need to render
    initalData, // implies not need to fetch data , simply pass this to ComponentToRender and start observing
    perpetualLoadingStrategy, // observing logic
    dataFetchingInfo, // require to render the ComponentToRender
    componentProps,
    posID, // postion of each ComponentToRender // to let
    // allowForcedFetching, // incase first initial RenderArticle is not present and we forcefully want component to Load Data
  } = props;
  const { isLast, pageTemplate } = componentProps;
  const msid = initalData?.id || dataFetchingInfo?.msid;

  const [allowFetching, setAllowFetching] = useState(false);
  const [dataForComponentToRender, setDataForComponentToRender] =
    useState(initalData);

  useEffect(() => {
    // loading data for perpetual article
    const fetchData = async () => {
      const { dataUrl } = dataFetchingInfo;
      if (!dataForComponentToRender && allowFetching) {
        const response = await fetch(dataUrl);
        const apiData = await response.json();
        let { subsecname1 = '' } = getSection(apiData?.navsubsecs);
        subsecname1 = subsecname1.toLowerCase();
        // #todo : this code should not be specific to articleshow, everything has to be passd from outside,
        // even mutilple calls may be required
        // one way would be to pass data loader functions, instead of data urls
        let sectionData = window?.App?.routeData?.sections[subsecname1];
        window.App.routeData = window.App.routeData || {}; // this might not required
        window.App.routeData.articles[msid] = apiData;
        if (!sectionData) {
          const jarvisFeedUrl = getJarvisASFeedURL({
            jarvisClient: ARTICLESHOW_VARS.JARVIS_CLIENT,
            jarvisType: ARTICLESHOW_VARS.JARVIS_TYPE,
            isMobile,
            isPrimeUser: false,
            isUpcache,
            sectionL1: subsecname1,
          });
          sectionData = await fetch(jarvisFeedUrl).then((res) => res.json());
          window.App.routeData.sections[subsecname1] = sectionData;
        }
        setDataForComponentToRender({ articleData: apiData, ...sectionData });
      }
    };
    try {
      fetchData();
    } catch (err) {
      console.log('perpetual feed fetch error: ', err);
    }
  }, [
    dataForComponentToRender,
    allowFetching,
    dataFetchingInfo,
    msid,
    isMobile,
    isUpcache,
  ]);

  const nextPageCallBackRef = useCallback(
    (node) => {
      // if (!startObserve) {
      //   return;
      // }
      // scope is managed to maitain information required to preseve in window variable
      window.PerpetualScope = window.PerpetualScope || {};

      if (!window.PerpetualScope.nextPageLoadObserver) {
        // IntersectionObserver is presevered in window
        window.PerpetualScope.nextPageLoadObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const { nextPageLoadObserver } = window.PerpetualScope;
              if (entry.isIntersecting) {
                const upcomingPagePosId = entry.target.getAttribute(
                  'data-upcoming-art-id',
                ); // to load
                nextPageLoadObserver.unobserve(node);

                window.dispatchEvent(
                  // dispatching event so that rest of PC can listen to this event
                  new CustomEvent('PERPETUAL_LOAD_INITIATE', {
                    detail: { pos_id: upcomingPagePosId },
                  }),
                );
              }
            });
          },
          {
            rootMargin: perpetualLoadingStrategy.config.rootMargin,
          },
        );
      }
      // posID is presevered in window, representing the current PC postion
      // window.PerpetualScope.posID = posID;
      if (node) window.PerpetualScope.nextPageLoadObserver.observe(node);
    },
    [perpetualLoadingStrategy], //
  );

  useEffect(() => {
    if (!dataForComponentToRender) {
      return;
    }
    // scope is managed to maitain information required to preseve in window variable
    window.PerpetualScope = window.PerpetualScope || {};
    const { articleData } = dataForComponentToRender;
    const { wu } = articleData || {};

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('HTML_UPDATED', {
          detail: { root: pcRef.current },
        }),
      );
    }, 1000);

    window.PerpetualScope.nextUrls = window.PerpetualScope.nextUrls || {};
    window.PerpetualScope.nextUrls[posID] = `${wu.replace(
      'https://timesofindia.indiatimes.com',
      window.location.origin,
    )}${window.location.search}`;

    if (!window.PerpetualScope.urlChangeObserver) {
      // IntersectionObserver is presevered in window
      window.PerpetualScope.urlChangeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // change url of the page, make sure wu is of same domain
              // as we have saved the function in window, we need to use the window variable to use info
              // check pos Id from node
              // Fire Events on Url Change like comscore
              // setTimeout is for breaking the long task
              setTimeout(fireEventsOnUrlChange, 0);

              const currentPcPosition = entry.target.getAttribute('data-posId');
              const isLastPerpetual = entry.target.getAttribute('data-isLast');
              const perpetualMsid = entry.target.getAttribute('data-msid');
              window.history.pushState(
                {},
                '',
                window.PerpetualScope.nextUrls[currentPcPosition],
              );

              window.PerpetualScope.perpetualLoadFired =
                window.PerpetualScope.perpetualLoadFired || {};
              if (
                currentPcPosition > 1 &&
                !window.PerpetualScope.perpetualLoadFired[currentPcPosition]
              ) {
                // setTimeout is for breaking the long task
                setTimeout(() => {
                  // will run only once, the perpetual load
                  fireEventsOnPerpetualPageLoad(
                    window.PerpetualScope.nextUrls[currentPcPosition],
                    window.App?.routeData.articles[perpetualMsid],
                    {
                      pageTemplate,
                      isMobile,
                      perpetual: isLastPerpetual ? 'false' : 'true',
                      pagination: `p${currentPcPosition - 1}`,
                    },
                  );
                }, 0);

                window.PerpetualScope.perpetualLoadFired[
                  currentPcPosition
                ] = true;
              }
            }
          });
        },
        {
          rootMargin: '-50% 0px -50% 0px',
        },
      );
    }
    if (pcRef.current)
      window.PerpetualScope.urlChangeObserver.observe(pcRef.current);
  }, [dataForComponentToRender, isMobile, posID, pageTemplate]);

  useEffect(() => {
    // when PM render PC , each PC will start listening this event , so that they start  loading their data
    window.addEventListener('PERPETUAL_LOAD_INITIATE', (e) => {
      if (parseInt(e.detail.pos_id, 10) === posID) {
        setAllowFetching(true);
      }
    });
  }, [posID]);

  // console.log('=============> PerpetualContainer', posID);
  const dataObj = isLast ? { 'data-isLast': isLast } : {};
  return (
    <div
      className={`${s.pc}`}
      ref={pcRef}
      data-posid={posID}
      data-msid={msid}
      {...dataObj}
    >
      {/* <span ref={componentRef}>this is Perpetaul Container</span> */}
      {dataForComponentToRender && (
        <ComponentToRender
          data={dataForComponentToRender}
          posID={posID}
          {...componentProps}
        />
      )}
      {!dataForComponentToRender && (
        <div
          className={`${s.refel} ${
            !dataForComponentToRender ? s.upcoming : ''
          }`}
          ref={nextPageCallBackRef}
          data-upcoming-art-id={posID}
        >
          {!dataForComponentToRender && <LoaderSpinner />}
        </div>
      )}
    </div>
  );
};

PerpetualContainer.propTypes = {
  ComponentToRender: PropTypes.elementType,
  initalData: PropTypes.shape({ id: PropTypes.string }),
  dataFetchingInfo: PropTypes.shape({
    dataUrl: PropTypes.string,
    msid: PropTypes.string,
  }),
  perpetualLoadingStrategy: PropTypes.shape({
    strategy: PropTypes.string,
    config: PropTypes.shape({
      rootMargin: PropTypes.string,
    }),
  }),
  posID: PropTypes.number,
  // allowForcedFetching: PropTypes.bool,
  componentProps: PropTypes.shape({
    isLast: PropTypes.bool,
    pageTemplate: PropTypes.string,
  }),
};

PerpetualContainer.defaultProps = {
  ComponentToRender: null,
  initalData: null,
  dataFetchingInfo: {},
  perpetualLoadingStrategy: {},
  posID: 0,
  // allowForcedFetching: false,
  componentProps: {},
};

export default PerpetualContainer;
