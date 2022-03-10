const path = require('path');

module.exports = {
  entry: './views/index.js',
  mode: "production",
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'static/js'),
  },
};