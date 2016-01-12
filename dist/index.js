'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _webpack = require('webpack');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _compressionWebpackPlugin = require('compression-webpack-plugin');

var _compressionWebpackPlugin2 = _interopRequireDefault(_compressionWebpackPlugin);

var _postcssImport = require('postcss-import');

var _postcssImport2 = _interopRequireDefault(_postcssImport);

var _postcssCssnext = require('postcss-cssnext');

var _postcssCssnext2 = _interopRequireDefault(_postcssCssnext);

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
  var out = _withDefaults.out;
  var styleSrc = _withDefaults.styleSrc;
  var resolves = _withDefaults.resolves;
  var html = _withDefaults.html;
  var devServer = _withDefaults.devServer;

  var commonPlugins = [new _libHtmlPlugin2['default']({ html: html })];

  /**
   * Feature flags
   * see: https://github.com/petehunt/webpack-howto#6-feature-flags
   */
  var commonFeatureFlags = {
    '__DEV__': isDev,
    '__PROD__': !isDev
  };

  return {
    devServer: devServer,

    devtool: isDev ? 'eval' : 'cheap-module-source-map',

    entry: [src],

    output: {
      filename: 'app.js',
      path: out,
      publicPath: '/'
    },

    resolve: {
      extensions: ['', '.js', '.css'],

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
      modulesDirectories: [src].concat(_toConsumableArray(resolves), [/* [2] */
      'node_modules'])

    },

    /**
     * 1. Enables clean css dependency imports by telling each import which directory to
     * import from. With file structure:
     *
     * src
     *  - App
     *    - style
     *      - settings.colors.css
     *    - views
     *      - Main
     *        - components
     *          - Header
     *
     * from Header/style.js you can inline settings.colors.css like
     *   @import 'settings.colors'
     *   vs.
     *   @import '../../../../../settings.colors'
     *
     * 2. Webpack knows how to inline styles from @import in thanks to css-loader with
     * modules turned on (css-loader?modules). Otherwise we would need to teach postcss-loader
     * how to do it by adding `addDependencyTo: webpack` as a `key: value` to cssimport.
     *
     */
    postcss: function postcss(webpack) {
      return [(0, _postcssImport2['default'])({
        path: styleSrc /* [1] */
      }), /* [2] */
      (0, _postcssCssnext2['default'])()];
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
          presets: ['es2015', 'react']
        }
      }, {
        test: /\.css$/,
        loader: isDev ? 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss'
        // see css-modules readme for this note -> Note: For prerendering with extract-text-webpack-plugin you should use css-loader/locals instead of style-loader!css-loader in the prerendering bundle. It doesn't embed CSS but only exports the identifier mappings.
        : _extractTextWebpackPlugin2['default'].extract('style-loader', 'css-loader?modules&sourceMap!postcss-loader')
      },

      // Load images
      { test: /\.jpg/, loader: 'url-loader?limit=10000&mimetype=image/jpg' }, { test: /\.gif/, loader: 'url-loader?limit=10000&mimetype=image/gif' }, { test: /\.png/, loader: 'url-loader?limit=10000&mimetype=image/png' }, { test: /\.svg/, loader: 'url-loader?limit=10000&mimetype=image/svg' }]
    },

    plugins: (isDev ? [new _webpack.DefinePlugin(commonFeatureFlags)] : [

    /**
     * Searches for equal or similar files and deduplicates them in the output.
     * see: https://github.com/webpack/docs/wiki/optimization#deduplication
     */
    new _webpack.optimize.DedupePlugin(),

    /**
     * Reduces the total file size and is recommended. So why not?
     * see: https://github.com/webpack/docs/wiki/optimization#minimize
     */
    new _webpack.optimize.OccurenceOrderPlugin(true), new _webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),

    /**
     * ExtractTextPlugin moves every style import in entry chunks into a separate css
     * output file. Stylesheet bundle is loaded in parallel to the javascript bundle.
     * See: https://github.com/webpack/extract-text-webpack-plugin
     */
    new _extractTextWebpackPlugin2['default']('style.css', {
      allChunks: true
    }), new _webpack.DefinePlugin(_extends({
      'process.env.NODE_ENV': '"production"'
    }, commonFeatureFlags)),

    /**
     * Source of our gzip power!
     */
    new _compressionWebpackPlugin2['default']({
      asset: '{file}.gz',
      algorithm: 'gzip',
      regExp: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })]).concat(commonPlugins)

  };
};

module.exports = exports['default'];
/* [1] */