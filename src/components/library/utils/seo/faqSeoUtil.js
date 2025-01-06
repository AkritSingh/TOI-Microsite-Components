// import { baseFaqSchemaShell, baseFaqItems } from 'helpers/seo/getFaqSchema';

// function getFaqArray(faqData, processedFaqItemsUpdate) {
//   if (faqData && faqData?.qna instanceof Array) {
//     return faqData.qna.map(item => ({
//       ...processedFaqItemsUpdate,
//       name: item.que,
//       acceptedAnswer: {
//         ...processedFaqItemsUpdate.acceptedAnswer,
//         text: item.ans,
//       },
//     }));
//   } else if (faqData && faqData.length) {
//     return faqData.map(item => ({
//       ...processedFaqItemsUpdate,
//       name: item.question,
//       acceptedAnswer: {
//         ...processedFaqItemsUpdate.acceptedAnswer,
//         text: item.answer,
//       },
//     }));
//   }
//   return [];
// }

// const processFaqSeoData = function processSeoData(faqData) {
//   const processedSeoData = [];
//   // sample Faq schema which will be filled with actual data
//   const stringifiedFaqSchemaShell = Object.assign({}, baseFaqSchemaShell);
//   // sample Faq update which can be modified to create actual update
//   const processedFaqItemsUpdate = Object.assign({}, baseFaqItems);

//   if (faqData) {
//     stringifiedFaqSchemaShell.mainEntity = getFaqArray(
//       faqData,
//       processedFaqItemsUpdate,
//     );

//     processedSeoData.push(JSON.stringify(stringifiedFaqSchemaShell));
//     return processedSeoData;
//   }
//   return processedSeoData;
// };

// export default processFaqSeoData;
