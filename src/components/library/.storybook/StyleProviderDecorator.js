// .storybook/StyleProviderDecorator.js
import React from 'react'
import StyleContext from 'isomorphic-style-loader-react18/StyleContext'
import PageContextProvider from '../contexts/PageContext'
import PageContextData from '../contexts/PageContextData'
import GlobalContextProvider from '../contexts/GlobalContext'
import GlobalContextData from '../contexts/GlobalContextData'
import LoginContextData from '../contexts/LoginContextData'
import LoginContextProvider from '../contexts/LoginContext'

const insertCss = (...styles) => {
  if (styles) {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map((x) => x._insertCss())
    return () => {
      removeCss.forEach((f) => f())
    }
  }
  return () => {}
}

const StyleProviderDecorator = (Story) => (
  <LoginContextProvider value={{ userData: LoginContextData }}>
    <GlobalContextProvider value={{ appInitialState: GlobalContextData }}>
      <StyleContext.Provider value={{ insertCss }}>
        <PageContextProvider value={{ data: PageContextData }}>
          <Story />
        </PageContextProvider>
      </StyleContext.Provider>
    </GlobalContextProvider>
  </LoginContextProvider>
)

export default StyleProviderDecorator
