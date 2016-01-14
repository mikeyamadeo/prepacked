#!/usr/bin/env node

// Based on
// https://github.com/gaearon/react-transform-boilerplate/blob/master/devServer.js

import path from 'path'
import express from 'express'
import webpack from 'webpack'

const {argv, cwd, exit} = process
const configFile = argv[2] || 'webpack.config.js'
let config

try {
  config = require(path.join(cwd(), configFile))
} catch (e) {
  console.error(e.stack)
  console.error(
    'Failed to load webpack config'
  )
  exit(1)
}

const app = express()
const compiler = webpack(config)
const { devServer } = config
const { contentBase, port, host } = devServer

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}))

app.use(require('webpack-hot-middleware')(compiler))

if (contentBase) {
  app.use(express.static(contentBase))
}

app.listen(port, host, function (err) {
  if (err) {
    console.error(err)
    return
  }

  console.log(`Listening at http://${host}:${port}`)
})
