const getDateDiffFromNow = (publishedDate) => {
  const todayDate = new Date();
  const diff = Math.round(
    (todayDate - new Date(Number(publishedDate))) / (1000 * 60 * 60 * 24),
  );
  return diff;
};

export default getDateDiffFromNow;
