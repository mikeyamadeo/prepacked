import path from 'path'

const {argv, cwd, exit} = process
const configFile = argv[2] || 'webpack.config.js'

export default function getConfig () {
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

  return config
}
