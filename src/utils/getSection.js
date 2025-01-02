const getSection = (navsubsecs = {}) => {
  const { subsec1, subsec2 } = navsubsecs;
  const { subsecmsid1, subsecname1, subsecnameseo1 } = subsec1 || {};
  const { subsecmsid2, subsecname2, subsecnameseo2 } = subsec2 || {};
  return {
    subsecmsid1,
    subsecname1,
    subsecname2,
    subsecmsid2,
    subsecnameseo1,
    subsecnameseo2,
  };
};

export default getSection;
