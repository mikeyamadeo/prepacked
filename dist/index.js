'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _postcssCssnext = require('postcss-cssnext');

var _postcssCssnext2 = _interopRequireDefault(_postcssCssnext);

var _postcssImport = require('postcss-import');

var _postcssImport2 = _interopRequireDefault(_postcssImport);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _compressionWebpackPlugin = require('compression-webpack-plugin');

var _compressionWebpackPlugin2 = _interopRequireDefault(_compressionWebpackPlugin);

var _libHtmlPlugin = require('./lib/html-plugin');

var _libHtmlPlugin2 = _interopRequireDefault(_libHtmlPlugin);

var _utils = require('./utils');

exports['default'] = function (settings) {
  (0, _utils.checkRequired)(settings, {
    isDev: 'A boolean to indicate whether or not everything is in production mode or development mode',
    src: 'This should just be the path to the file that serves as the main entry point of your application.',
    out: 'Path to directory where we\'re going to put generated files.'
  });

  // checkRequiredPackages (babel-loader)
  // checkForConfigErrors (e.g. resolves should be an array of strings vs. string)

  var _withDefaults = (0, _utils.withDefaults)(settings);

  var isDev = _withDefaults.isDev;
  var src = _withDefaults.src;
  var styleSrc = _withDefaults.styleSrc;
  var out = _withDefaults.out;
  var resolves = _withDefaults.resolves;
  var html = _withDefaults.html;
  var devServer = _withDefaults.devServer;
  var featureFlags = _withDefaults.featureFlags;

  var commonPlugins = [new _libHtmlPlugin2['default']({ html: html })];

  var postcss = [(0, _postcssImport2['default'])({
    path: styleSrc
  }), _postcssCssnext2['default']];

  var polyfills = {
    Promise: 'imports?this=>global!exports?global.Promise!es6-promise'
  };

  return {
    devServer: devServer,

    devtool: isDev ? 'eval' : 'source-map',

    entry: (isDev ? ['webpack-hot-middleware/client?reload=true'] : []).concat([src]),

    output: {
      filename: '[name].js',
      path: out,
      publicPath: '/'
    },

    resolve: {
      extensions: ['.js', '.css'],

      /**
       * 1. Enables absolute url imports. With file structure:
       *
       * src
       *  - App
       *    - shared
       *      - Btn
       *    - views
       *      - Main
       *        - components
       *          - Header
       *
       * from Header/index.js you can import Btn from
       *   'App/shared/Btn'
       *   vs.
       *   '../../../../../shared/Btn'
       *
       * 2. Allows user to add additional directories for webpack to check when resolving
       * imports. While potentially overkill, by adding 'shared' & using the above (1)
       * file structure you can:
       *   import Btn from 'Btn'
       *   vs.
       *   import Btn from 'App/shared/Btn'
       */
      modules: [src].concat(_toConsumableArray(resolves), [/* [2] */
      'node_modules'])

    },

    /**
     * 1. Skips any files outside of your project's `src` directory
     */
    module: {
      loaders: [{
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [src], /* [1] */
        query: {
          presets: (isDev ? ['react-hmre'] : []).concat([['es2015', { loose: true, modules: false }], 'react', { plugins: ['transform-object-rest-spread'] }])
        }
      }, {
        /**
         * 1. postcss plugin configuration does not work as specified in official docs:
         * https://github.com/postcss/postcss-loader#webpack-2x-config
         * had to use config using LoaderOptionsPlugin to get postcss plugins to work properly:
         * https://github.com/postcss/postcss-loader/issues/92
         */
        test: /\.css$/,
        loaders: isDev ? ['style-loader', {
          loader: 'css-loader',
          query: { modules: true, localIdentName: '[path]-[local]-[hash:base64:5]' }
        }, 'postcss-loader' /* [1] */
        ] : _extractTextWebpackPlugin2['default'].extract({
          loader: [{
            loader: 'css-loader',
            query: { modules: true, localIdentName: '[path]-[local]-[hash:base64:5]' }
          }, 'postcss-loader' /* [1] */
          ]
        })
      },

      // Load images
      { test: /\.jpg/, loader: 'url-loader', query: { limit: 10000, mimetype: 'image/jpg' } }, { test: /\.gif/, loader: 'url-loader', query: { limit: 10000, mimetype: 'image/gif' } }, { test: /\.png/, loader: 'url-loader', query: { limit: 10000, mimetype: 'image/png' } }, { test: /\.svg/, loader: 'url-loader', query: { limit: 10000, mimetype: 'image/svg' } }]
    },

    plugins: (isDev ? [new _webpack2['default'].HotModuleReplacementPlugin(), new _webpack2['default'].DefinePlugin(featureFlags), new _webpack2['default'].ProvidePlugin(polyfills),

    /**
     * 1. https://github.com/webpack/webpack/issues/2684
     */
    new _webpack2['default'].LoaderOptionsPlugin({
      options: {
        context: __dirname, /* [1] */
        postcss: postcss
      }
    }), new _webpack2['default'].optimize.CommonsChunkPlugin({ children: true, async: true })] : [

    /**
     * Searches for equal or similar files and deduplicates them in the output.
     * see: https://github.com/webpack/docs/wiki/optimization#deduplication
     */
    new _webpack2['default'].optimize.DedupePlugin(), new _webpack2['default'].optimize.CommonsChunkPlugin({ children: true, async: true }), new _webpack2['default'].ProvidePlugin(polyfills),

    // minify
    new _webpack2['default'].LoaderOptionsPlugin({
      context: __dirname, /* [1] */
      options: {
        postcss: postcss
      },
      minimize: true,
      debug: true
    }), new _webpack2['default'].optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: true
      },
      output: {
        comments: false
      },
      sourceMap: true
    }),

    /**
     * ExtractTextPlugin moves every style import in entry chunks into a separate css
     * output file. Stylesheet bundle is loaded in parallel to the javascript bundle.
     * See: https://github.com/webpack/extract-text-webpack-plugin
     */
    new _extractTextWebpackPlugin2['default']({
      filename: 'style.css',
      allChunks: true
    }),

    /**
     * Feature flags
     * see: https://github.com/petehunt/webpack-howto#6-feature-flags
     */
    new _webpack2['default'].DefinePlugin(_extends({
      'process.env.NODE_ENV': '"production"'
    }, featureFlags)),

    /**
     * Source of our gzip power!
     */
    new _compressionWebpackPlugin2['default']({
      asset: '[file].gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.css$|\.gif$|\.png$|\.svg$/,
      threshold: 10240,
      minRatio: 0.8
    })]).concat(commonPlugins)

  };
};

module.exports = exports['default'];
/* [1] */