export const onError = (e) => {
  e.target.onerror = null;
  e.target.src = 'https://static.toiimg.com/photo/34824568.cms';
};
export const createImgUrl = (data) => {
  const { imgsize = 12345, msid, width, resizemode = 4, height } = data;
  if (!msid) {
    return undefined;
  }
  const urlData = [];
  urlData.push(
    `https://static.toiimg.com/thumb/imgsize-${imgsize},msid-${msid}`,
  );

  if (width) {
    urlData.push(`width-${width}`);
  }
  if (height) {
    urlData.push(`height-${height}`);
  }

  urlData.push(`resizemode-${resizemode}`);

  return `${urlData.join(',')}/${msid}.jpg`;
};

export function getImageFromImageObject(imageData, isMobile = false) {
  //default should be placeholder image
  let imageUrl = null;

  if (typeof imageData !== 'object') {
    return imageUrl;
  }

  const imgsize = imageData.version || '12345';
  try {
    if (
      imageData &&
      imageData.id &&
      imageData.id.toString().indexOf('&') !== -1
    ) {
      imageData.id = imageData.id.split('&')[0];
    }
  } catch (error) {
    console.error('getImageFromImageObject: ', error);
  }

  if (imageData.id && typeof parseInt(imageData.id, 10) === 'number') {
    imageUrl = createImgUrl({
      imgsize,
      msid: imageData.id,
      width: imageData.width || '600',
      resizemode: imageData.resizemode,
      height: imageData.height,
    });
  } else if (imageData.src || imageData.desktop_src) {
    imageUrl = isMobile
      ? imageData.src
      : imageData.desktop_src || imageData.src;
  }

  return imageUrl;
}
