const baseWebpackConfig = require('../webpack.config');

const isCSSRule = (rule) => rule?.test?.toString() === '/\\.css$/';
const isSCSSRule = (rule) =>
  rule?.test?.toString() === '/\\.scss$/' ||
  rule?.test?.toString() === '/\\.(scss|css)$/';

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-babel',
  ],

  webpackFinal: async (config) => {
    // Removes the existing CSS rule.
    // eslint-disable-next-line no-param-reassign
    config.module.rules = config.module.rules.filter(
      (rule) => !isCSSRule(rule),
    );

    // Tells Storybook to use the same CSS rule config as our app.
    // eslint-disable-next-line no-param-reassign
    config.module.rules.push(baseWebpackConfig.module.rules.find(isSCSSRule));

    config.resolve.alias = {
      ...config.resolve.alias,
      ...baseWebpackConfig.resolve.alias,
    };
    config.resolve.modules = [
      ...config.resolve.modules,
      ...baseWebpackConfig.resolve.modules,
    ];
    console.log("configconfig", config.plugins[2].definitions);
    console.log("baseWebpackConfig",  baseWebpackConfig.plugins[0].definitions);

    config.plugins[2].definitions= { ...config.plugins[2].definitions  , ...baseWebpackConfig.plugins[0].definitions}
    console.log("configconfig", config.plugins[2].definitions);

    // Return the altered config
    return config;
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: { builder: { useSWC: true } },
  },
  docs: {
    autodocs: true,
  },
};
