#!/usr/bin/env node

// Based on
// https://github.com/gaearon/react-transform-boilerplate/blob/master/devServer.js
// see as example for autoreload https://github.com/stsiarzhanau/webpack-react-redux-starter/blob/master/tools/devServer.js

import express from 'express'
import webpack from 'webpack'
import getConfig from './getConfig'

const config = getConfig()
const app = express()
const compiler = webpack(config)
const { devServer } = config
const { contentBase, port, host } = devServer

app.use(
  require('webpack-dev-middleware')(compiler, {
    hot: true,
    publicPath: config.output.publicPath,
    stats: { colors: true }
  })
)

app.use(require('webpack-hot-middleware')(compiler))

if (contentBase) {
  app.use(express.static(contentBase))
}

app.listen(port, host, function (err) {
  if (err) {
    console.error(err)
    return
  }

  console.log(`🚀 Listening at http://${host}:${port}`)
})
