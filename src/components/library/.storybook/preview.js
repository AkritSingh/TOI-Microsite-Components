// import React from 'react'

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import StyleProviderDecorator from './StyleProviderDecorator';

import '../styles/storybook_global.scss';
import '../styles/typography.scss';

// #todo - add ga loading code for storybook, analytics.js loading script
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
};

export const decorators = [StyleProviderDecorator];

export default preview;
