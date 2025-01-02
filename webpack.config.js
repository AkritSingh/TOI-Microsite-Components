const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const ROOT_DIR = path.resolve(__dirname, '.')
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args)
const SRC_DIR = resolvePath('src')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const CompressionPlugin = require('compression-webpack-plugin')
const pkg = require('./package.json')

const isDebug = !(
  process.argv.includes('--staging') || process.argv.includes('--production')
)
const isStaging = process.argv.includes('--staging')
const isProduction = process.argv.includes('--production')
const isVerbose = process.argv.includes('--verbose')
const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse')

const reScript = /\.(js|jsx|mjs)$/
const reStyle = /\.(scss|css)$/

module.exports = {
  context: ROOT_DIR,
  mode: isDebug ? 'development' : 'production',
  entry: {
    // modules/components are exposed using Module Federation
  },
  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      // Rules for JS / JSX
      {
        test: reScript,
        include: [SRC_DIR, resolvePath('tools')],
        loader: 'babel-loader',
        options: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: isDebug,
          presets: [
            // A Babel preset that can automatically determine the Babel plugins and polyfills
            // https://github.com/babel/babel-preset-env
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: pkg.browserslist,
                },
                // #todo: check the function of options below
                modules: false,
                useBuiltIns: false,
                debug: false,
              },
            ],
            // // JSX
            // // https://github.com/babel/babel/tree/master/packages/babel-preset-react
            // ['@babel/preset-react', { development: isDebug }],
          ],
          // plugins: [
          //     // #todo: check the usefulness/requirement of the options below
          //     // Treat React JSX elements as value types and hoist them to the highest scope
          //     // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
          //     ...(isDebug
          //         ? []
          //         : ['@babel/transform-react-constant-elements']),
          //     // Replaces the React.createElement function with one that is more optimized for production
          //     // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
          //     ...(isDebug
          //         ? []
          //         : ['@babel/transform-react-inline-elements']),
          //     // Remove unnecessary React propTypes from the production build
          // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
          // #todo - enabling this is breaking production build
          // check for modifications to fix it, it would be useful to reduce size
          // ...(isDebug ? [] : ['transform-react-remove-prop-types']),
          // ],
        },
      },
      // Rules for Style Sheets
      {
        test: reStyle,
        rules: [
          // Convert CSS into JS module
          {
            issuer: { not: [reStyle] },
            loader: 'isomorphic-style-loader-react18',
          },
          // Process external/third-party styles
          {
            exclude: SRC_DIR,
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              // minimize: isDebug ? false : minimizeCssOptions,
            },
          },

          // Process internal/project styles (from src folder)
          {
            include: SRC_DIR,
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: isDebug,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: {
                localIdentName: isDebug
                  ? '[name]-[local]-[hash:base64:5]'
                  : '[hash:base64:5]',
              },
            },
          },

          // Compile Sass to CSS
          // https://github.com/webpack-contrib/sass-loader
          {
            test: /\.scss$/,
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
  },
  resolve: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    modules: [path.resolve(__dirname, 'node_modules'), SRC_DIR],
    alias: {
      // react: 'preact/compat',
      // 'react-dom': 'preact/compat',
      'components':resolvePath('src/components'),
      'config':resolvePath('src/config'),
    },
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
  },
  // externals: {
  //     react: 'React',
  //     ['react-dom']: 'ReactDOM',
  // },
  plugins: [
    // Define free variables
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      __DEV__: isDebug,
      __PROD__: isProduction,
      __STAGING__: isStaging,
    }),
    ...(isDebug
      ? []
      : [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './statistics.html',
          }),
          // new Visualizer({
          //   filename: './statistics.html',
          // }),
        ]),

    // Webpack Bundle Analyzer
    // https://github.com/th0r/webpack-bundle-analyzer
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
    // s3-deploy has compress option, we are using that
    // new CompressionPlugin(),
  ],
  // Don't attempt to continue if there are any errors.
  bail: !isDebug,

  cache: isDebug,

  // Specify what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: {
    cached: isVerbose,
    cachedAssets: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose,
  },
  devtool: 'source-map',
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  optimization: {
    chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
      minSize: 5 * 1024,
      cacheGroups: {
        core: {
          // check for more modules to be added to core
          test: /[\\/]node_modules[\\/](preact|classnames|css-loader|style-loader|prop-types|lodash.get)[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors.commons',
          filename: '[name].[contenthash:8].js',
          enforce: true,
        },
        commons: {
          test: (module) => {
            const regex = /organisms|templates|molecules/g
            return module.resource && !module.resource.match(regex)
          },
          priority: -20,
          name: 'library.commons',
          filename: '[name].[contenthash:8].js',
          minChunks: 3,
          enforce: true,
          reuseExistingChunk: true,
        },
        default: {
          test: /[\\/]src[\\/]/,
          minSize: 0,
          priority: -30,
          filename: (pathData) => {
            const chunkId = pathData.chunk.id
            let finalChunkFileName = chunkId
            if (!isDebug && chunkId.includes('default-src_components_')) {
              const chunkFileName = chunkId.replace(
                'default-src_components_',
                ''
              )
              const chunkFileNameParts = chunkFileName.split('_')
              chunkFileNameParts.splice(chunkFileNameParts.length - 2, 1)
              finalChunkFileName = chunkFileNameParts.join('_')
            }

            return `${finalChunkFileName}.[contenthash:8].js`
          },
        },
      },
    },
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
  
}
