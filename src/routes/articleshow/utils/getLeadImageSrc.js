// #todo - Would need removeDefaultImageSupport logic on feed side and need to remove this code
export default function getLeadImageSrc(
  image,
  video,
  removeDefaultImageSupport = false,
) {
  let leadImageSrc;
  if (image || video) {
    let leadImgId = image?.id;
    let imgsize = image?.imgsize || image?.imagesize;

    if (video) {
      leadImgId = video.id;
      imgsize = video.imageid ? video.imageid.split('&imgsize=')[1] : '12345';
    }
    if (!leadImgId) return undefined;
    leadImageSrc = `https://static.toiimg.com/thumb/msid-${leadImgId},${
      imgsize ? `imgsize-${imgsize}` : ''
    },width-400,resizemode-4/${leadImgId}.jpg`;
  } else if (!removeDefaultImageSupport) {
    leadImageSrc =
      'https://static.toiimg.com/thumb/msid-47529300,imgsize-110164,width-400,resizemode-4/47529300.jpg';
  }
  return leadImageSrc;
}
