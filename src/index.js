import webpack from 'webpack'
import cssnext from 'postcss-cssnext'
import cssimport from 'postcss-import'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
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
    styleSrc,
    out,
    resolves,
    html,
    devServer,
    featureFlags
  } = withDefaults(settings)

  const commonPlugins = [
    new HtmlPlugin({ html })
  ]

  const postcss = [
    cssimport({
      path: styleSrc
    }),
    cssnext
  ]

  /**
   * 1. https://github.com/webpack/webpack/issues/2684
   */
  const loaderOptions = {
    context: __dirname, /* [1] */
    postcss
  }

  const polyfills = {
    Promise: 'imports?this=>global!exports?global.Promise!es6-promise'
  }

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
      modules: [
        src, /* [1] */
        ...resolves, /* [2] */
        'node_modules'
      ]

    },

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
              ['es2015', {loose: true, modules: false}],
              'react',
              { plugins: [
                'transform-object-rest-spread'
              ]}
            ])
          }
        },

        {
          /**
           * 1. postcss plugin configuration does not work as specified in official docs:
           * https://github.com/postcss/postcss-loader#webpack-2x-config
           * had to use config using LoaderOptionsPlugin to get postcss plugins to work properly:
           * https://github.com/postcss/postcss-loader/issues/92
           */
          test: /\.css$/,
          loaders: isDev ? [
            'style-loader',
            {
              loader: 'css-loader',
              query: { modules: true, localIdentName: '[path]-[local]-[hash:base64:5]' }
            },
            'postcss-loader' /* [1] */
          ] : ExtractTextPlugin.extract({
            loader: [
              {
                loader: 'css-loader',
                query: { modules: true, localIdentName: '[path]-[local]-[hash:base64:5]' }
              },
              'postcss-loader' /* [1] */
            ]
          })
        },

        // Load images
        { test: /\.jpg/, loader: 'url-loader', query: { limit: 10000, mimetype: 'image/jpg' } },
        { test: /\.gif/, loader: 'url-loader', query: { limit: 10000, mimetype: 'image/gif' } },
        { test: /\.png/, loader: 'url-loader', query: { limit: 10000, mimetype: 'image/png' } },
        { test: /\.svg/, loader: 'url-loader', query: { limit: 10000, mimetype: 'image/svg' } }

      ]
    },

    plugins: (isDev
      ? [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(featureFlags),
        new webpack.ProvidePlugin(polyfills),

        new webpack.LoaderOptionsPlugin({
          loaderOptions
        }),

        new webpack.optimize.CommonsChunkPlugin({children: true, async: true})
      ]

      : [

        /**
         * Searches for equal or similar files and deduplicates them in the output.
         * see: https://github.com/webpack/docs/wiki/optimization#deduplication
         */
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({children: true, async: true}),
        new webpack.ProvidePlugin(polyfills),

        // minify
        new webpack.LoaderOptionsPlugin({
          loaderOptions,
          minimize: true,
          debug: true
        }),

        new webpack.optimize.UglifyJsPlugin({
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
        new ExtractTextPlugin({
          filename: 'style.css',
          allChunks: true
        }),

        /**
         * Feature flags
         * see: https://github.com/petehunt/webpack-howto#6-feature-flags
         */
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"production"',
          ...featureFlags
        }),

        /**
         * Source of our gzip power!
         */
        new CompressionPlugin({
          asset: '[file].gz',
          algorithm: 'gzip',
          regExp: /\.js$|\.css$/,
          threshold: 10240,
          minRatio: 0.8
        })

      ]).concat(commonPlugins)

  }
}
