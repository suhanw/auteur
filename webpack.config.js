const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin'); // to delete in PROD

let plugins = [];

const devPlugins = [
  new LiveReloadPlugin({ port: 8080, hostname: 'localhost' })
];

const prodPlugins = [
  // new webpack.DefinePlugin({
  //   'process.env': {
  //     'NODE_ENV': JSON.stringify('production')
  //   }
  // }),
  // new webpack.optimize.UglifyJsPlugin({
  //   compress: {
  //     warnings: true
  //   }
  // })
];

plugins = plugins.concat(
  process.env.NODE_ENV === 'production' ? prodPlugins : devPlugins
);

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
  plugins: plugins,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  }
}
