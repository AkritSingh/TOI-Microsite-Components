const scriptPromises = {};
export const loadJS = (src, id, windowVariable) => {
  let scriptPromise = scriptPromises[id];

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    let script = document.getElementById(id);

    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.id = id;
      document.body.appendChild(script);
    }
    if (windowVariable && window[windowVariable]) {
      resolve();
    } else {
      let jsLoaded = false;
      script.addEventListener('load', () => {
        setTimeout(() => {
          jsLoaded = true;
          resolve();
        });
      });
      script.addEventListener('error', (e) => {
        jsLoaded = true;
        reject(e);
      });
      setTimeout(() => {
        if (!jsLoaded) {
          resolve();
        }
      }, 3000);
    }
  });

  scriptPromises[id] = scriptPromise;
  return scriptPromise;
};

// function checkJsExist(id) {
//   let isScriptExist = false;
//   if (id && typeof document !== 'undefined') {
//     isScriptExist = !!document.getElementById(id);
//   }
//   return isScriptExist;
// }

// function loadJS(id, src) {
//   return new Promise((resolve, rej) => {
//     if (checkJsExist(id)) {
//       resolve();
//     } else {
//       const scriptTag = document.createElement('script');
//       scriptTag.src = src;
//       scriptTag.id = id;
//       scriptTag.onload = resolve;
//       scriptTag.onerror = rej;
//       const body = document.getElementsByTagName('body')[0];
//       body.appendChild(scriptTag);
//     }
//   });
// }

export default function loadPlayerJSFiles(cb = () => {}) {
  const loadPlayer = () => {
    Promise.all([
      loadJS('https://tvid.in/sdk/slikeloader.js', 'tvid_sdk_js', 'spl'),
      loadJS(
        'https://timesofindia.indiatimes.com/video_comscore_api/version-3.cms',
        'video_comscore_js',
      ),
    ]).then(() => {
      cb();
    });
  };

  loadJS(
    'https://imasdk.googleapis.com/js/sdkloader/ima3.js',
    'ima3_sdk_js',
    'ima',
  )
    .then(() => {
      loadPlayer();
    })
    .catch(() => {
      loadPlayer();
    });
}
