import { useState, useEffect, useCallback } from 'react';

function useFetch(apiObj, initalData, allowFetching) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [apiResponse, setApiResponse] = useState(initalData);

  const initFetching = useCallback(async () => {
    try {
      let response;
      let apiData;
      setLoading(true);
      setError(false);
      if (!initalData && allowFetching) {
        // console.log('-------useFetch----->>', apiObj.dataUrl);
        // #todo need to manage the fetch call for both section and article
        response = await fetch(apiObj.dataUrl);
        apiData = await response.json();
        setApiResponse(apiData);
      } else {
        setApiResponse(initalData);
      }
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [apiObj, initalData, allowFetching]);

  useEffect(() => {
    // console.log('-------useFetch----->>', apiObj);
    initFetching(apiObj, initalData, allowFetching);
  }, [apiObj, initalData, allowFetching, initFetching]);

  return { loading, error, apiResponse };
}

export default useFetch;

// function useFetch(apiObj, initalData, allowFetching, allowForcedFetching) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [apiResponse, setApiResponse] = useState(initalData);

//   const initFetching = useCallback(async () => {
//     try {
//       let response;
//       let apiData;
//       setLoading(true);
//       setError(false);
//       if ((!initalData && allowFetching) || allowForcedFetching) {
//         response = await fetch(apiObj.dataUrl);
//         apiData = response.json();
//         setApiResponse(apiData);
//       } else {
//         setApiResponse(initalData);
//       }
//       setLoading(false);
//     } catch (err) {
//       setError(err);
//     }
//   }, [apiObj, initalData, allowFetching, allowForcedFetching]);

//   useEffect(() => {
//     initFetching(apiObj, initalData, allowFetching, allowForcedFetching);
//   }, [apiObj, initalData, allowFetching, initFetching, allowForcedFetching]);

//   return { loading, error, apiResponse };
// }
