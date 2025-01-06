export default function convertHtmlToStringText(cmt) {
  if (typeof document === 'undefined') {
    return cmt;
  }
  const elem = document.createElement('div');
  elem.innerHTML = cmt;
  return elem.innerText;
}
