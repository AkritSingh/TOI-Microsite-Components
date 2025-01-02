import React from 'react'

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import StyleContext from 'isomorphic-style-loader-react18/StyleContext';
import PageContextProvider  from '../src/components/library/contexts/PageContext';
import PageContextData from '../src/components/library/contexts/PageContextData';
import GlobalContextProvider  from '../src/components/library/contexts/GlobalContext';
import GlobalContextData from '../src/components/library/contexts/GlobalContextData';
import LoginContextData from '../src/components/library/contexts/LoginContextData';
import LoginContextProvider from '../src/components/library/contexts/LoginContext';
import useStyles from 'isomorphic-style-loader-react18/useStyles';

// import TestContextProvider from '../src/components/library/contexts/TestContext';


// import '../src/styles/storybook_global.scss';
// import '../src/styles/typography.scss';
import s from '../src/components/library/pages/MobilePage/MobilePage.scss';

const GloblaStyleLoader = () =>{
  useStyles(s);
  return null;
}
// #todo - add ga loading code for storybook, analytics.js loading script
const insertCss = (...styles) => {
  if (styles) {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map((x) => x._insertCss());
    return () => {
      removeCss.forEach((f) => f());
    };
  }
  return () => {};
};

const preview = {
  parameters: {
    // actions: { argTypesRegex: '^on[A-Z].*' },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        // <TestContextProvider>
        <GlobalContextProvider value={{appInitialState:GlobalContextData}}>        
          <StyleContext.Provider value={{ insertCss }}>
            <PageContextProvider value={{data: PageContextData}}>
              <GloblaStyleLoader/>
              <Story />
            </PageContextProvider>
          </StyleContext.Provider>
        </GlobalContextProvider>
        // </TestContextProvider>
      );
    },
  ],
};

export default preview;
