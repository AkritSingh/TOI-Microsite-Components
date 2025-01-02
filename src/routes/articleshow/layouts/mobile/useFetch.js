import { useEffect, useState } from 'react';

export default function useFetch(url, options = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState();
  const [abort, setAbort] = useState(() => {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // If the component unmount it will abort the request
        const controller = new AbortController();
        const { signal } = controller;
        setAbort(controller.abort);
        const response = await fetch(url, { ...options, signal });
        const json = await response.json();
        setLoading(false);
        setApiResponse(json.message);
      } catch (err) {
        setError(err);
        setApiResponse(null);
      }
    };
    fetchData();
    return () => {
      abort();
    };
  }, [abort, url, options]);

  return { loading, error, apiResponse };
}
