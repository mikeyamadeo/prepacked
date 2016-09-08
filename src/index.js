import { DefinePlugin, optimize, HotModuleReplacementPlugin } from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import cssimport from 'postcss-import'
import cssnext from 'postcss-cssnext'
import HtmlPlugin from './lib/html-plugin'
import { checkRequired, withDefaults } from './utils'

export default (settings) => {
  checkRequired(settings, {
    isDev: 'A boolean to indicate whether or not everything is in production mode or development mode',
    src: 'This should just be the path to the file that serves as the main entry point of your application.',
    out: 'Path to directory where we\'re going to put generated files.'
  })

  // checkRequiredPackages (babel-loader)
  // checkForConfigErrors (e.g. resolves should be an array of strings vs. string)

  const {
    isDev,
    src,
    out,
    styleSrc,
    resolves,
    html,
    devServer,
    featureFlags
  } = withDefaults(settings)

  const commonPlugins = [
    new HtmlPlugin({ html })
  ]

  return {
    devServer,

    devtool: isDev
      ? 'eval'
      : 'source-map',

    entry: (isDev ? [
      'webpack-hot-middleware/client?reload=true'
    ] : []).concat([src]),

    output: {
      filename: '[name].js',
      path: out,
      publicPath: '/'
    },

    resolve: {
      extensions: [
        '',
        '.js',
        '.css'
      ],

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
      modulesDirectories: [
        src, /* [1] */
        ...resolves, /* [2] */
        'node_modules'
      ]

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
    postcss: (webpack) => [
      cssimport({
        path: styleSrc /* [1] */
      }), /* [2] */
      cssnext()
    ],

    /**
     * 1. Skips any files outside of your project's `src` directory
     */
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          include: [src], /* [1] */
          query: {
            presets: (isDev ? ['react-hmre'] : []).concat([
              'es2015',
              'react',
              { plugins: [
                'transform-object-rest-spread'
              ]}
            ])
          }
        },

        {
          test: /\.css$/,
          loader: isDev
            ? 'style!css?modules&localIdentName=[path]-[local]-[hash:base64:5]!postcss'
            // see css-modules readme for this note -> Note: For prerendering with extract-text-webpack-plugin you should use css-loader/locals instead of style-loader!css-loader in the prerendering bundle. It doesn't embed CSS but only exports the identifier mappings.
            // https://github.com/webpack/css-loader/issues/59
            : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap!postcss-loader')
        },

        // Load images
        { test: /\.jpg/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
        { test: /\.gif/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
        { test: /\.png/, loader: 'url-loader?limit=10000&mimetype=image/png' },
        { test: /\.svg/, loader: 'url-loader?limit=10000&mimetype=image/svg' }

      ]
    },

    plugins: (isDev
      ? [
          new HotModuleReplacementPlugin(),
          new DefinePlugin(featureFlags)
        ]

      : [

        /**
         * Searches for equal or similar files and deduplicates them in the output.
         * see: https://github.com/webpack/docs/wiki/optimization#deduplication
         */
        new optimize.DedupePlugin(),

        /**
         * Reduces the total file size and is recommended. So why not?
         * see: https://github.com/webpack/docs/wiki/optimization#minimize
         */
        new optimize.OccurenceOrderPlugin(true),

        new optimize.UglifyJsPlugin({
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
        new ExtractTextPlugin('style.css', {
          allChunks: true
        }),

        /**
         * Feature flags
         * see: https://github.com/petehunt/webpack-howto#6-feature-flags
         */
        new DefinePlugin({
          'process.env.NODE_ENV': '"production"',
          ...featureFlags
        }),

        /**
         * Source of our gzip power!
         */
        new CompressionPlugin({
          asset: '{file}.gz',
          algorithm: 'gzip',
          regExp: /\.js$|\.css$/,
          threshold: 10240,
          minRatio: 0.8
        })

      ]).concat(commonPlugins)

  }
}
