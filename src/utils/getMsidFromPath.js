export default function getMsidFromPath(path) {
  let msid = '';
  if (typeof path === 'string' && path.length > 0) {
    const articlePathSplit = path.split('/');
    if (
      articlePathSplit &&
      articlePathSplit.length > 0 &&
      articlePathSplit[articlePathSplit.length - 1].includes('.cms')
    ) {
      msid = articlePathSplit[articlePathSplit.length - 1].split('.')[0];
    }
  }

  return msid;
}
