var getConfig = require('../dist')
var path = require('path')
var webpack = require('webpack')
var appPath = path.resolve(__dirname, 'src')
var buildPath = path.resolve(__dirname, 'public')
var isDev = process.env.NODE_ENV !== 'production'

module.exports = getConfig({
  isDev: isDev,
  src: appPath,
  out: buildPath,

  resolves: [
    'shared',
    'style'
  ],

  featureFlags: {
    '__DEV__': isDev,
    '__PROD__': !isDev
  }

})
