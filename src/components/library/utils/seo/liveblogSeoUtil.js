// import {
//   liveBlogSchemaShell,
//   sampleLiveblogUpdate,
//   newsArticleSchema,
// } from 'helpers/seo/getLiveBlogSchema';
// import { format, addDays, isPast } from 'date-fns';

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
//   // copying all constant SEO data to process them further
//   const processedSeoData = Object.assign({}, seoData);
//   // sample liveblog update which can be modified to create actual update
//   const processedLiveblogUpdate = Object.assign({}, sampleLiveblogUpdate);
//   // sample newsarticle schema which will be filled with actual data
//   const processedNewsArticleSchema = Object.assign({}, newsArticleSchema);
//   // sample liveblog schema which will be filled with actual data
//   const processedLiveBlogSchemaShell = Object.assign({}, liveBlogSchemaShell);
//   // following section will modify the above object to create a final object which will be stringified
//   if (state && state.liveblog) {
//     processedSeoData.data.title = `${seoData.data.title} ${
//       state.liveblog.miniScorecard ? state.liveblog.miniScorecard.seoTitle : ''
//     }`;
//     processedLiveBlogSchemaShell.headline =
//       state.liveblog.timelineData && state.liveblog.timelineData.title1;
//     processedLiveBlogSchemaShell.description =
//       processedSeoData.data.description;
//     processedLiveBlogSchemaShell.coverageStartTime =
//       processedSeoData.data.datePublished || '';
//     processedLiveBlogSchemaShell.coverageEndTime =
//       format(
//         addDays(new Date(processedSeoData.data.datePublished), 2),
//         'YYYY-MM-DDTHH:mm:ss+05:30',
//       ) || '';
//     processedLiveBlogSchemaShell.url = processedSeoData.data.canonical;
//     processedLiveBlogSchemaShell['@id'] = processedSeoData.data.canonical;
//     processedLiveBlogSchemaShell.datePublished =
//       processedSeoData.data.datePublished || '';
//     if (state.liveblog.timelineData) {
//       processedLiveBlogSchemaShell.dateModified = format(
//         state.liveblog.timelineData.lastupd * 1000,
//         'YYYY-MM-DDTHH:mm:ss+05:30',
//       );
//       processedSeoData.data.dateModified = format(
//         state.liveblog.timelineData.lastupd * 1000,
//         'YYYY-MM-DDTHH:mm:ss+05:30',
//       );
//     } else {
//       processedLiveBlogSchemaShell.dateModified =
//         processedSeoData.data.datePublished || '';
//     }

//     processedLiveBlogSchemaShell.keywords = seoData.data.keywords;
//     processedLiveblogUpdate.mainEntityOfPage = processedSeoData.data.canonical;
//     processedLiveblogUpdate.url = processedSeoData.data.canonical;
//     // create an array of liveblog updates using sample liveblog update
//     processedLiveBlogSchemaShell.liveBlogUpdate = getLiveblogPostArray(
//       state.liveblog.timelineData,
//       processedLiveblogUpdate,
//     );
//     // About sechema changes
//     const imgSize =
//       state && state.liveblog && state.liveblog.imgSize
//         ? state.liveblog.imgSize
//         : '';

//     processedLiveBlogSchemaShell.about.name = processedSeoData.data.title;
//     processedLiveBlogSchemaShell.about.startDate =
//       processedSeoData.data.datePublished || '';
//     processedLiveBlogSchemaShell.about.description =
//       processedSeoData.data.description;
//     processedLiveBlogSchemaShell.about.endDate =
//       format(
//         addDays(new Date(processedSeoData.data.datePublished), 2),
//         'YYYY-MM-DDTHH:mm:ss+05:30',
//       ) || '';
//     processedLiveBlogSchemaShell.about.eventStatus = isPast(
//       processedLiveBlogSchemaShell.about.endDate,
//     )
//       ? 'Over'
//       : 'Live';
//     processedLiveBlogSchemaShell.about.image = `https://timesofindia.indiatimes.com/thumb/msid-${
//       processedSeoData.data.msid
//     },width-1280,height-720,resizemode-4${
//       imgSize !== '' ? `,imgsize-${imgSize}` : ''
//     }/${processedSeoData.data.msid}.jpg`;

//     processedNewsArticleSchema.mainEntityOfPage =
//       processedSeoData.data.canonical;
//     processedNewsArticleSchema.headline =
//       state.liveblog.timelineData && state.liveblog.timelineData.title1
//         ? state.liveblog.timelineData.title1.substr(0, 109)
//         : '';
//     processedNewsArticleSchema.keywords = seoData.data.keywords;
//     processedNewsArticleSchema.url = processedSeoData.data.canonical;
//     processedNewsArticleSchema.description = processedSeoData.data.description;
//     processedNewsArticleSchema.datePublished =
//       processedSeoData.data.datePublished || '';
//     processedNewsArticleSchema.dateModified =
//       processedLiveBlogSchemaShell.dateModified;
//     // convert all liveblog updates to one paragraph
//     processedNewsArticleSchema.articleBody = generateBodyFromTimeline(
//       state.liveblog.timelineData,
//     );
//     processedNewsArticleSchema.alternativeHeadline =
//       processedSeoData.data.title;

//     processedNewsArticleSchema.image.url = `https://timesofindia.indiatimes.com/thumb/msid-${
//       processedSeoData.data.msid
//     },width-1280,height-720,resizemode-4${
//       imgSize !== '' ? `,imgsize-${imgSize}` : ''
//     }/${processedSeoData.data.msid}.jpg`;
//     // stringify objects to use on page
//     processedSeoData.data.schema.push({
//       data: JSON.stringify(processedLiveBlogSchemaShell),
//     });
//     processedSeoData.data.schema.push({
//       data: JSON.stringify(processedNewsArticleSchema),
//     });
//     return processedSeoData;
//   }
//   return processedSeoData;
// };

// export default processSeoData;
