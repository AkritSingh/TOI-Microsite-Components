import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchData } from './utils';

function APIFetcher(props) {
  const { apiUrl, eventName, eventData, apiResKey } = props;
  const [apiData, setAPIData] = useState(null);
  // Send this to get data client side ->
  // apiUrl -> url to hit
  // eventName -> the event name that you listning to recieve data
  // apiResKey -> This will store response data inside  window.App.external_data[apiResKey]
  useEffect(() => {
    const getAPIData = async () => {
      if (!apiData) {
        const apiResponse = await fetchData(apiUrl);
        window.App.external_data = window.App.external_data || {};
        window.App.external_data[apiResKey] = apiResponse;
        setAPIData(apiResponse);
        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: { eventData, apiResponse },
          }),
        );
      }
    };
    getAPIData();
  }, [apiData, apiResKey, apiUrl, eventData, eventName]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

APIFetcher.propTypes = {
  eventName: PropTypes.string.isRequired,
  eventData: PropTypes.shape({}),
  apiUrl: PropTypes.string.isRequired,
  apiResKey: PropTypes.string.isRequired,
};

APIFetcher.defaultProps = {
  eventData: {},
};

export default React.memo(APIFetcher);
