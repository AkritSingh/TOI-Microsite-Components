const baseWebpackConfig = require('../webpack.config');

const isCSSRule = (rule) => rule?.test?.toString() === '/\\.css$/';
const isSCSSRule = (rule) =>
  rule?.test?.toString() === '/\\.scss$/' ||
  rule?.test?.toString() === '/\\.(scss|css)$/';

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'], // Supports multiple file types for stories
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-babel',
  ],

  webpackFinal: async (config) => {
    // Remove the existing CSS rule
    config.module.rules = config.module.rules.filter((rule) => !isCSSRule(rule));

    // Add the SCSS rule from the base Webpack configuration
    const scssRule = baseWebpackConfig.module.rules.find(isSCSSRule);
    if (scssRule) {
      config.module.rules.push(scssRule);
    } else {
      console.warn('SCSS rule not found in base Webpack config. Ensure it is defined correctly.');
    }

    // Merge resolve.alias and resolve.modules from base Webpack config
    config.resolve.alias = {
      ...config.resolve.alias,
      ...baseWebpackConfig.resolve.alias,
    };

    config.resolve.modules = [
      ...(config.resolve.modules || []), // Ensure Storybook's resolve.modules is not undefined
      ...(baseWebpackConfig.resolve.modules || []), // Ensure baseWebpackConfig.resolve.modules is not undefined
    ];

    // Merge DefinePlugin definitions
    const storybookDefinePlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'DefinePlugin',
    );
    const baseDefinePlugin = baseWebpackConfig.plugins.find(
      (plugin) => plugin.constructor.name === 'DefinePlugin',
    );

    if (storybookDefinePlugin && baseDefinePlugin) {
      storybookDefinePlugin.definitions = {
        ...storybookDefinePlugin.definitions,
        ...baseDefinePlugin.definitions,
      };
    } else {
      console.warn(
        'DefinePlugin not found in one or both configurations. Ensure both Storybook and base Webpack configurations include it.',
      );
    }

    console.log('Updated Storybook DefinePlugin definitions:', storybookDefinePlugin?.definitions);

    // Return the updated Webpack config
    return config;
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true, // Use SWC for faster builds
      },
    },
  },

  docs: {
    autodocs: true,
  },
};
