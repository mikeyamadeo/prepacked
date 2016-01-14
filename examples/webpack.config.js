var getConfig = require('../dist')
var path = require('path')
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
    port: 1337
  },

  featureFlags: {
    '__DEV__': isDev,
    '__PROD__': !isDev
  },

  html: function (data) {
    return [
      '<html>',
        '<head>',
          '<meta charset="utf-8"/>',
          '<meta name="viewport" content="width=device-width, initial-scale=1">',
          '<link href="/' + data.css + '" rel="stylesheet" type="text/css" />',
        '</head>',
        '<body>',
          '<div id="app"></div>',
          '<script src="/' + data.main + '"></script>',
        '</body>',
      '</html>'
    ].join('')
  }

})
