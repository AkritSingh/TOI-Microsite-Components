const getSiteSettings = async () => {
  let siteSettings;
  try {
    // get site settings
    const siteSettingStream = await fetch(
      'https://timesofindia.indiatimes.com/site_settings/feedtype-json.cms',
    );
    siteSettings = await siteSettingStream.json();
  } catch (err) {
    console.log('error in fetcing site Config', err);
  }
  return siteSettings;
};

export default getSiteSettings;
