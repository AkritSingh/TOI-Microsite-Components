/* eslint-disable default-param-last */
// Example GET request
//   const { response: getData, error: getError, loading: getLoading } = useFetch(
//     'https://api.example.com/data'
//   );

//   // Example POST request
//   const postData = async () => {
//     const dataToSend = {
//       key1: 'value1',
//       key2: 'value2',
//       // Add other key-value pairs as needed
//     };

//     const { response: postData, error: postError, loading: postLoading } = useFetch(
//       'https://api.example.com/postEndpoint',
//       'POST',
//       dataToSend
//     );
//   };

const makeRequest = async (
  url,
  data = null,
  method = 'GET',
  abortArr,
  newoptions = {},
) => {
  try {
    let apiUrl = url;

    // Append GET parameters if provided
    if (method === 'GET' && data) {
      const params = new URLSearchParams(data);
      apiUrl += `?${params.toString()}`;
    }
    const headers = newoptions.headers || {};
    headers.Accept = 'application/json, text/plain, */*';

    const options = {
      method,
      ...newoptions,
      credentials: newoptions.withCredentials ? 'include' : 'same-origin',
      headers,
      body: data ? JSON.stringify(data) : null,
    };

    // If the component unmount it will abort the request
    const controller = new AbortController();
    const { signal } = controller;
    if (abortArr) {
      abortArr.push(controller.abort);
    }
    const res = await fetch(apiUrl, { ...options, signal });
    let result = res;
    try {
      result = await res.json();
    } catch (error) {
      /* empty */
    }
    return { response: result, error: null };
  } catch (e) {
    return { response: null, error: e };
  }
};

const get = async (url, options, abortArr) => {
  const res = await makeRequest(url, null, 'GET', abortArr, options);
  return res;
};

const post = async (url, data, options, abortArr) => {
  const res = await makeRequest(url, data, 'POST', abortArr, options);
  return res;
};

export default { get, post };
