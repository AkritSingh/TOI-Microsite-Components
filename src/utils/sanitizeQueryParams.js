export default function sanitizeQueryParams(paramsObj) {
  const sanitizedParamsObj = {};

  // loop through params keys, if value is array, pick its last value as param's value
  Object.keys(paramsObj).forEach((paramKey) => {
    const paramValue = paramsObj[paramKey];
    if (Array.isArray(paramValue)) {
      sanitizedParamsObj[paramKey] = paramValue[paramValue.length - 1];
    } else {
      sanitizedParamsObj[paramKey] = paramValue;
    }
  });

  return sanitizedParamsObj;
}
