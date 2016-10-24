var getConfig = require('../dist')
var path = require('path')
// var html = require('./html')
var src = path.join('./index.js')
var styleSrc = path.join('./styles')
var out = path.join(__dirname, 'public')
var isDev = process.env.NODE_ENV !== 'production'

module.exports = getConfig({
  isDev: isDev,
  src: './index.js',
  out: out,
  styleSrc: styleSrc,

  devServer: {
    host: 'Mikeys-Hackbook-Pro.local',
    port: 1337
  },

  featureFlags: {
    '__DEV__': isDev,
    '__PROD__': !isDev
  }

})
