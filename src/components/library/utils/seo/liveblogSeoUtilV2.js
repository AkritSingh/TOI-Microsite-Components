// import {
//   liveBlogSchemaShell,
//   sampleLiveblogUpdate,
//   newsArticleSchema,
// } from 'helpers/seo/getLiveBlogSchema';
// import { format, addDays, isPast } from 'date-fns';
// import { getMilliSecondsTimestamp } from '../../utils/dateUtils';
// import { TOI_LIVE_DOMAIN } from '../../constants/index';

// function getLiveblogPostArray(timelineData, processedLiveblogUpdate) {
//   if (
//     timelineData &&
//     timelineData.data &&
//     timelineData.data.contents instanceof Array
//   ) {
//     return timelineData.data.contents.map((item, index) => {
//       let desc = '';
//       if (typeof item.smalldesc === 'string') {
//         desc = item.smalldesc.substr(0, 96);
//         if (desc === '' && typeof item.title === 'string') {
//           desc = item.title.substr(0, 96);
//         }
//       }
//       const dateObject = new Date(parseInt(item.timestamp, 10) * 1000);
//       return {
//         ...processedLiveblogUpdate,
//         url: `${processedLiveblogUpdate.url}#post${index + 1}`,
//         articleBody: desc,
//         headline: `${format(dateObject, 'HH:mm')}(IST) ${desc}`,
//         datePublished: format(dateObject, 'YYYY-MM-DDTHH:mm:ss+05:30'),
//         dateModified: format(dateObject, 'YYYY-MM-DDTHH:mm:ss+05:30'),
//       };
//     });
//   }
//   return [];
// }
// function getLetestTime(upd, lastupd) {
//   let newupd = Number(getMilliSecondsTimestamp(upd));
//   const newlastupd = Number(getMilliSecondsTimestamp(lastupd));
//   if (newlastupd > newupd) {
//     newupd = newlastupd;
//   }
//   const test = format(newupd, 'YYYY-MM-DDTHH:mm:ss+05:30');
//   return test;
// }
// function generateBodyFromTimeline(timelineData) {
//   if (
//     timelineData &&
//     timelineData.data &&
//     timelineData.data.contents instanceof Array
//   ) {
//     return timelineData.data.contents
//       .filter((item, index) => index > 2)
//       .map(item => `${item.title || ''} ${item.smalldesc || ''}`)
//       .join('.');
//   }
//   return '';
// }

// const processSeoData = function processSeoData(seoData, state) {
//   const processedSeoData = [];
//   // copying all constant SEO data to process them further
//   // const processedSeoData = Object.assign({}, seoData);
//   // sample liveblog update which can be modified to create actual update
//   const processedLiveblogUpdate = Object.assign({}, sampleLiveblogUpdate);
//   // sample newsarticle schema which will be filled with actual data
//   const processedNewsArticleSchema = Object.assign({}, newsArticleSchema);
//   // sample liveblog schema which will be filled with actual data
//   const processedLiveBlogSchemaShell = Object.assign({}, liveBlogSchemaShell);
//   // following section will modify the above object to create a final object which will be stringified

//   if (state && state.liveblog_v2 && seoData && seoData.seo) {
//     processedSeoData.title = `${seoData.title} ${
//       state.liveblog_v2.miniScorecard
//         ? state.liveblog_v2.miniScorecard.seoTitle
//         : ''
//     }`;
//     processedLiveBlogSchemaShell.headline =
//       (state.liveblog_v2.timelineData &&
//         state.liveblog_v2.timelineData.title1) ||
//       '';
//     processedLiveBlogSchemaShell.description = seoData.seo.description;
//     processedLiveBlogSchemaShell.coverageStartTime =
//       seoData.seo.datePublished || '';
//     processedLiveBlogSchemaShell.coverageEndTime =
//       format(
//         addDays(new Date(seoData.seo.datePublished), 2),
//         'YYYY-MM-DDTHH:mm:ss+05:30',
//       ) || '';
//     processedLiveBlogSchemaShell.url = seoData.seo.canonical;
//     processedLiveBlogSchemaShell['@id'] = seoData.seo.canonical;
//     processedLiveBlogSchemaShell.datePublished =
//       seoData.seo.datePublished || '';
//     if (state.liveblog_v2.timelineData && state.liveblog_v2.upd) {
//       processedLiveBlogSchemaShell.dateModified = getLetestTime(
//         state.liveblog_v2.upd,
//         state.liveblog_v2.timelineData.lastupd,
//       );
//     } else {
//       processedLiveBlogSchemaShell.dateModified =
//         seoData.seo.datePublished || '';
//     }

//     processedLiveBlogSchemaShell.keywords = seoData.keywords;
//     processedLiveblogUpdate.mainEntityOfPage = seoData.seo.canonical;
//     processedLiveblogUpdate.url = seoData.seo.canonical;
//     // create an array of liveblog updates using sample liveblog update
//     processedLiveBlogSchemaShell.liveBlogUpdate = getLiveblogPostArray(
//       state.liveblog_v2.timelineData,
//       processedLiveblogUpdate,
//     );
//     // About sechema changes
//     const imgSize =
//       state && state.liveblog && state.liveblog.imgSize
//         ? state.liveblog.imgSize
//         : '';

//     processedLiveBlogSchemaShell.about.name =
//       processedLiveBlogSchemaShell.headline;
//     processedLiveBlogSchemaShell.about.startDate =
//       seoData.seo.datePublished || '';
//     processedLiveBlogSchemaShell.about.description = seoData.seo.description;
//     processedLiveBlogSchemaShell.about.endDate =
//       format(
//         addDays(new Date(seoData.seo.datePublished), 2),
//         'YYYY-MM-DDTHH:mm:ss+05:30',
//       ) || '';
//     processedLiveBlogSchemaShell.about.eventStatus = isPast(
//       processedLiveBlogSchemaShell.about.endDate,
//     )
//       ? 'Over'
//       : 'Live';
//     processedLiveBlogSchemaShell.about.image = `https://timesofindia.indiatimes.com/thumb/msid-${
//       seoData?.timelineData?.msid
//     },width-1280,height-720,resizemode-4${
//       imgSize !== '' ? `,imgsize-${imgSize}` : ''
//     }/${seoData?.timelineData?.msid}.jpg`;

//     processedNewsArticleSchema.mainEntityOfPage = seoData.seo.canonical;
//     processedNewsArticleSchema.headline =
//       state.liveblog_v2.timelineData && state.liveblog_v2.timelineData.title1
//         ? state.liveblog_v2.timelineData.title1.substr(0, 109)
//         : '';
//     processedNewsArticleSchema.keywords = seoData.keywords;
//     processedNewsArticleSchema.url = seoData.seo.canonical;
//     processedNewsArticleSchema.description = seoData.seo.description;
//     processedNewsArticleSchema.datePublished = seoData.seo.datePublished || '';
//     processedNewsArticleSchema.dateModified =
//       processedLiveBlogSchemaShell.dateModified;
//     // convert all liveblog updates to one paragraph
//     processedNewsArticleSchema.articleBody = generateBodyFromTimeline(
//       state.liveblog_v2.timelineData,
//     );
//     processedNewsArticleSchema.alternativeHeadline = seoData.title;
//     if (seoData.timelineData) {
//       processedNewsArticleSchema.image.url = `${TOI_LIVE_DOMAIN}/thumb/msid-${
//         seoData.timelineData.msid
//       },width-1280,height-720,resizemode-4/${seoData.timelineData.msid}.jpg`;
//     }

//     // stringify objects to use on page

//     processedSeoData.push({
//       data: JSON.stringify(processedLiveBlogSchemaShell),
//     });

//     processedSeoData.push({
//       data: JSON.stringify(processedNewsArticleSchema),
//     });
//     return processedSeoData;
//   }
//   return processedSeoData;
// };

// export default processSeoData;
