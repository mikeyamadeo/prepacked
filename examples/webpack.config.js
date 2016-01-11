var getConfig = require('../dist')
var path = require('path')
var src = path.join(__dirname, 'src')
var out = path.join(__dirname, 'public')
var styleSrc = path.join(__dirname, 'src', 'App', 'style')
var isDev = process.env.NODE_ENV !== 'production'

// console.log(getConfig({
//   isDev: true,
//   src: path.join(__dirname, 'src'),
//   out: 'public',
//   port: 1337
// }).plugins)

module.exports = getConfig({
  isDev: isDev,
  src: src,
  out: out,

  styleSrc: styleSrc,

  devServer: {
    port: 1337
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
