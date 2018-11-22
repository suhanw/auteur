const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin'); // to delete in PROD

module.exports = {
  entry: './src/client/index.jsx',
  output: {
    path: path.resolve(__dirname, 'src', 'client', 'public', 'scripts'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env', '@babel/react']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.jsx', '.js', '*']
  },
  plugins: [
    new LiveReloadPlugin({ port: 8080, hostname: 'localhost' }) // to delete in PROD
  ]
}
