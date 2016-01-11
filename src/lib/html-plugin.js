let config = {}
const setConfig = (c) => config = c
const getConfig = () => config

const defaultHtml = ({main, css}) =>
`<!doctype html>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
  ${css ? `<link href="/${css}" rel="stylesheet" type="text/css" />` : ''}
<body><div id="app"></div></body>
<script src="${main}"></script>`

/**
 * Liberally borrowed & tweaked from Henrik Joreteg:
 * https://github.com/HenrikJoreteg/hjs-webpack/blob/master/lib/html-plugin.js
 */
function HtmlPlugin ({
  html = defaultHtml,
  filename = 'index.html'
}) {
  setConfig({
    html,
    filename
  })
}

/**
 * 1. Webpack outputs an array for each chunk when using sourcemaps
 * ex: { main: [ 'bundle.js', 'bundle.js.map' ] }
 * 2. If we've got a CSS file add it here
 * 3. The main bundle seems like it's always the first
 */
const getAssets = ({assetsByChunkName}) => {
  const assets = {}
  let value, chunk

  for (chunk in assetsByChunkName) {
    value = assetsByChunkName[chunk]

    if (value instanceof Array) { /* [1] */

      if (chunk === 'main') { /* [2] */
        assets.css = value[1]
      }

      value = value[0]
    }

    assets[chunk] = value /* [3] */
  }

  return assets
}

/**
 * 1. if it's a string, we assume it's an html string for the index file
 */
const addAssets = (compiler, data) => {
  const {filename} = getConfig()
  let dataType = typeof data
  let pages

  if (dataType === 'string') { /* [1] */
    pages = {}
    pages[filename] = data
  } else if (dataType === 'object') {
    pages = data
  } else {
    throw new Error('Result from `html` callback must be a string or an object')
  }

  for (let name in pages) {
    compiler.assets[name] = (function (asset) {
      return {
        source: function () {
          return asset
        },
        size: function () {
          return asset.length
        }
      }
    }(pages[name]))
  }
}

HtmlPlugin.prototype.apply = function (compiler) {
  const { html: htmlFunction } = getConfig()

  compiler.plugin('emit', (compiler, callback) => {
    const stats = compiler.getStats().toJson()
    addAssets(compiler, htmlFunction(getAssets(stats)))
    callback()
  })
}

export default HtmlPlugin
