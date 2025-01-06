export const fetchData = async (dataUrl) => {
  try {
    const response = await fetch(dataUrl);
    const apiData = response.json();
    return apiData;
  } catch (err) {
    throw new Error(err);
  }
};

export const postData = async (dataUrl, body, headers = {}) => {
  try {
    const response = await fetch(dataUrl, {
      body: JSON.stringify(body),
      headers,
    });
    const apiData = response.json();
    return apiData;
  } catch (err) {
    throw new Error(err);
  }
};
