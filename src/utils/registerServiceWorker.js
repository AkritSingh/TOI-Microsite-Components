const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const swPath = __PROD__ ? '/grxsw.cms' : '/grxsw.js';
    try {
      const registration = await navigator.serviceWorker.register(swPath, {
        scope: '/',
      });
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

export default registerServiceWorker;
