var getConfig = require('../dist')
var path = require('path')
var html = require('./html')
var src = path.join(__dirname, 'src')
var out = path.join(__dirname, 'public')
var styleSrc = path.join(__dirname, 'src', 'App', 'style')
var isDev = process.env.NODE_ENV !== 'production'

module.exports = getConfig({
  isDev: isDev,
  src: src,
  out: out,

  styleSrc: styleSrc,

  devServer: {
    host: 'Mikeys-Hackbook-Pro.local',
    port: 1337
  },

  featureFlags: {
    '__DEV__': isDev,
    '__PROD__': !isDev
  },

  html: isDev
    ? html.dev
    : html.prod

})
