const fireEventsOnUrlChange = () => {
  if (window.TimesApps && window.TimesApps.fireComscore) {
    window.TimesApps.fireComscore();
  }
};

export default fireEventsOnUrlChange;
