const resolve = require('path').resolve

module.exports = {
  mode: 'development',
  entry: [resolve(__dirname, 'src/index.js')],
  output: {
    path: resolve(__dirname, `public`),
    filename: 'index.bundle.js'
  }
}
