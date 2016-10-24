var getConfig = require('../dist')
var path = require('path')
var appPath = path.resolve(__dirname, 'src')
var buildPath = path.resolve(__dirname, 'public')
var stylePath = path.resolve(__dirname, 'src', 'App', 'style')
var env = process.env.NODE_ENV
var isDev = env !== 'production' && env !== 'staging'
var isProd = env === 'production'

var config = getConfig({
  isDev: isDev,
  src: appPath,
  out: buildPath,
  styleSrc: stylePath,
  resolves: [
    'shared',
    'style'
  ],

  devServer: {
    port: 1337,
    contentBase: buildPath
  },

  featureFlags: {
    __DEV__: isDev,
    __PROD__: isProd
  }
})

module.exports = config
