import webpack from 'webpack'
import getConfig from './getConfig'
import chalk from 'chalk'

const { log } = console
const compiler = webpack(getConfig())

compiler.run((err, stats) => {
  if (err) {
    log(err)
  }

  const { assets } = stats.toJson()
  assets.sort(sortAssets)
  assets.forEach(asset => {
    log(formatAsset(asset))
  })
})

function formatAsset ({name, size}) {
  return `${chalk.green(name)}: ${formatSize(size)}`
}

function formatSize (size) {
  const sizeInKb = size * 0.001
  return (sizeInKb.toFixed(0) > 0)
    ? `${sizeInKb.toFixed(1)} kB`
    : `${size} bytes`
}

function sortAssets (a, b) {
  return alphabetical(a.name, b.name)
}

function alphabetical (a, b) {
  var A = a.toLowerCase()
  var B = b.toLowerCase()

  if (A < B) {
    return -1
  } else if (A > B) {
    return 1
  }else {
    return 0
  }
}
