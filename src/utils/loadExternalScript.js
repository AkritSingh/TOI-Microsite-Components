/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

const useExternalScript = (url, setLoadStatus) => {
  const changeLoadStatus = (value) => {
    if (setLoadStatus && typeof setLoadStatus === 'function') {
      setLoadStatus(value);
    }
  };
  useEffect(() => {
    if (!url) {
      changeLoadStatus(0);
      return;
    }
    let script = document.querySelector(`script[src="${url}"]`);

    const handleScript = (e) => {
      changeLoadStatus(e.type === 'load' ? 1 : -1);
    };

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/javascript';
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      script.addEventListener('load', handleScript);
      script.addEventListener('error', handleScript);
    } else {
      changeLoadStatus(1);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      script.removeEventListener('load', handleScript);
      script.removeEventListener('error', handleScript);
    };
  }, [url]);
};

export default useExternalScript;
