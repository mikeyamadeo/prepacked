import webpack from 'webpack'
import Merge from 'webpack-merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import HtmlPlugin from './lib/html-plugin'
import { checkRequired, withDefaults } from './utils'

export default settings => {
  checkRequired(settings, {
    isDev: 'A boolean to indicate whether or not everything is in production mode or development mode',
    src: 'This should just be the path to the file that serves as the main entry point of your application.',
    out: "Path to directory where we're going to put generated files."
  })

  // checkRequiredPackages (babel-loader)
  // checkForConfigErrors (e.g. resolves should be an array of strings vs. string)
  const {
    isDev,
    src,
    // styleSrc,
    out,
    resolves,
    html,
    devServer,
    featureFlags
  } = withDefaults(settings)

  // const polyfills = {
  //   Promise: 'imports?this=>global!exports?global.Promise!es6-promise'
  // }
  const common = {
    entry: src,
    output: { filename: '[name].js', path: out, publicPath: '/' },
    resolve: {
      extensions: [ '.js', '.css' ],
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
        src,
        /* [1] */
        ...resolves,
        /* [2] */
        'node_modules'
      ]
    },
    module: {
      rules: [
        // es6 support
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          use: {
            loader: 'babel-loader',
            options: {
              // env == polyfills all es6 not supported by browsers
              // react === jsx support
              presets: [ 'env', 'stage-1', 'react' ],
              // support for spread/rest
              plugins: [
                require('babel-plugin-transform-object-rest-spread'),
                require('babel-plugin-transform-export-extensions')
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlPlugin({ html }),
      new webpack.DefinePlugin(featureFlags)
    ]
  }

  const dev = {
    entry: [
      'react-hot-loader/patch',
      `webpack-hot-middleware/client`,
      'webpack/hot/dev-server',
      src
    ],
    devtool: 'cheap-module-source-map',
    devServer: {
      hot: true,
      // makes hostnames like http://mikeys-hackbook-pro.local:PORT/ possible
      disableHostCheck: true,
      ...devServer
    },
    module: {
      rules: [
        // load styles
        {
          test: /\.css$/,
          exclude: '/node_modules/',
          use: [ 'style-loader', 'css-loader' ]
        }
      ]
    },
    plugins: [
      // enable HMR globally
      new webpack.HotModuleReplacementPlugin(),
      // prints more readable module names in the browser console on HMR updates
      new webpack.NamedModulesPlugin()
    ]
  }

  const prod = {
    module: {
      rules: [
        // load styles
        {
          test: /\.css$/,
          exclude: '/node_modules/',
          use: ExtractTextPlugin.extract({ use: 'css-loader' })
        }
      ]
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        ...featureFlags
      }),
      new ExtractTextPlugin('style.css'),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: { screw_ie8: true, keep_fnames: true },
        compress: { screw_ie8: true, warnings: false },
        comments: false
      }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|html|css)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }

  return isDev ? Merge(common, dev) : Merge(common, prod)
}
