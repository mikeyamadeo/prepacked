module.exports = {
  dev: function (context) {
    return [
      '<html>',
        '<head>',
          '<meta charset="utf-8"/>',
          '<title>Development</title>',
          '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '</head>',
        '<body>',
          '<div id="app"></div>',
          '<script src="/' + context.main + '"></script>',
        '</body>',
      '</html>'
    ].join('')
  },
  prod: function (context) {
    return [
      '<html>',
        '<head>',
          '<meta charset="utf-8"/>',
          '<title>Production</title>',
          '<meta name="viewport" content="width=device-width, initial-scale=1">',
          '<link href="/' + context.css + '" rel="stylesheet" type="text/css" />',
        '</head>',
        '<body>',
          '<div id="app"></div>',
          '<script src="/' + context.main + '"></script>',
        '</body>',
      '</html>'
    ].join('')
  }
}
