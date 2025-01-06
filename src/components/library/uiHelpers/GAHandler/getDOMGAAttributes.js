// params: {
//   action: 'author',
//   label: 'about-author',
//   category: 'articleshow_v2',
// },
// type: 'ga3',
// stategy: {
//   inview: true,
//   click: true,
// },

// const getDOMGAAttributes = (ga = {}) => {
//   const {
//     category,
//     action,
//     label,
//     value,
//     unObserve = true,
//     strategy = {},
//     // nonInteraction,
//     setLabelAtClientSide,
//   } = ga;

//   let gaAttributes = {};
//   let attributeRequired;

//   if (strategy.click) {
//     attributeRequired = true;
//     gaAttributes = { ...gaAttributes, 'data-ga-click': 'yes' };
//   }
//   if (strategy.view) {
//     attributeRequired = true;
//     gaAttributes = {
//       ...gaAttributes,
//       'data-ga-view': 'yes',
//       'data-ga-ni': 'yes',
//     };
//     // if (nonInteraction) {
//     //   gaAttributes = { ...gaAttributes,  };
//     // }
//     if (!unObserve) {
//       gaAttributes = {
//         ...gaAttributes,
//         'data-ga-i-uo': 'no', // specifying this element will not b unobserve
//       };
//     }
//   }

//   if (attributeRequired) {
//     gaAttributes = {
//       ...gaAttributes,
//       'data-ga-c': category || '',
//       'data-ga-a': action || '',
//     };

//     if (setLabelAtClientSide) {
//       gaAttributes = {
//         ...gaAttributes,
//         'data-ga-sl': setLabelAtClientSide, // in case we need to set label on client with url , for layout component
//       };
//     } else {
//       gaAttributes = {
//         ...gaAttributes,
//         'data-ga-l': label || '',
//       };
//     }

//     if (value) {
//       gaAttributes = { ...gaAttributes, 'data-ga-v': value };
//     }
//   }

//   return gaAttributes;
// };

// export default getDOMGAAttributes;
