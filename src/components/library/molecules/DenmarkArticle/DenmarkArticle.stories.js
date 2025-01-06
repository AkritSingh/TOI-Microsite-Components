/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import DenmarkArticle from './DenmarkArticle';

// import s from './Header.scss'

export default {
  title: 'molecules/Denmark Article',
  component: DenmarkArticle,
};

export const Default = {
  args: {
    type: 'denmark',
    config: {
      layout: {
        id:"",
        classname: "",
        components:{
          title: {
            isVisible: true,
            text: {
              layout: {
                type: 'h1',
              },
            },
          },
          description: {
            isVisible: true,
            text: {
              layout: {
                type: 'h3',
              },
            },
          },
          content: {
            isVisible: true,
            text: {
              layout: {
                type: 'normal',
              },
            },
          },
        }
      },
    },
    data: {
      api: {
        title:
          "Couldn't crack CA? Here are the best alternative career options",
        description:
          "The Institute of Chartered Accountants of India declared the ICAI CA Final and Inter November Result 2023. The recent CA exams revealed the distribution of success among candidates. For those who couldn't clear the CA Finals 2023, this article explores alternative career options that leverage their skills and knowledge. Some popular alternatives include financial analyst, investment banker, management consultant, forensic accountant, data analyst, entrepreneur, teaching, and content creation.",
        content:
          "<div class=\"section1\"><div class=\"Normal\"><strong>Career Options After Failing CA:</strong>The Institute of Chartered Accountants of India on Tuesday declared the ICAI CA Final and Inter November Result 2023. For the CA Final November 2023 examination, 9.42% of candidates successfully passed both groups, with 9.46% clearing Group 1 and 21.6% achieving success in Group 2. In the CA Intermediate November 2023 exam, 9.73% of candidates qualified in both groups, while 16.87% and 19.18% successfully passed Group 1 and Group 2, respectively. These statistics offer insights into the distribution of success among candidates in the recent CA exams.<br></br><br></br>However, some candidates could not clear the CA Finals 2023. In this article, we explore some of the best alternative career options for candidates who may have faced roadblocks in the pursuit of a CA qualification, shedding light on alternative career paths that hold the potential to lead to rewarding and satisfying careers.<br></br><br></br>Didn't the Chartered Accountancy exam quite go your way? No worries, because the road to success isn't paved with just one set of initials. Instead of viewing this as a detour, let's celebrate the incredible skills and knowledge you've already gained throughout this journey, and open the door to a world of exciting alternative career options that leverage your financial smarts, analytical prowess, and entrepreneurial spirit.<br></br><br></br>Instead of focusing on not cracking CA, let's shift the perspective to the abundance of exciting career opportunities available for those with the skills and knowledge gained through CA preparation. Here are some popular career alternatives, categorised based on interests and skillsets;<br></br><br></br><strong>Financial Analyst:</strong>Leverage your financial modeling and analytical skills to support investment decisions, risk management, or corporate budgeting.<br></br><br></br><strong>Investment Banker:</strong>Apply your knowledge of financial markets and valuations to raise capital, advise on mergers and acquisitions, or manage investment portfolios.<br></br><br></br><strong>Management Consultant:</strong>Utilise your understanding of business processes and financial analysis to help companies improve efficiency, reduce costs, or develop growth strategies.<br></br><br></br><strong>Forensic Accountant:</strong>Combine your accounting expertise with investigative skills to uncover fraud, investigate financial crimes, or provide expert witness testimony.<br></br><br></br><strong>Data Analyst:</strong>Leverage your strong analytical skills and familiarity with financial data to solve problems, identify trends, and gain insights from large datasets.<br></br><br></br><strong>Entrepreneur:</strong>Launch your own business, drawing upon your understanding of finance, business planning, and risk management.<br></br><br></br><strong>Teaching:</strong>Share your knowledge and passion for finance by teaching at universities, colleges, or coaching institutes.<br></br><br></br><strong>Content Creator:</strong>Build a career in finance writing, blogging, or creating educational content to help others learn about finance and accounting.<br></br></div></div>",
      },
    },
  },

  render: (args) => <DenmarkArticle {...args} />,
};
