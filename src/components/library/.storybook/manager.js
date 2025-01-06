import { addons } from '@storybook/manager-api';
import libraryTheme from './libraryTheme';

addons.setConfig({
  theme: libraryTheme,
});