const path = require('path');

module.exports = {
  context: __dirname,
  entry: './src/client/index.jsx',
  output: {
    path: path.resolve(__dirname, 'src', 'client'),
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
      }
    ]
  },
  devServer: {
    port: 3000,
    open: false,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.jsx', '.js', '*']
  }
}
