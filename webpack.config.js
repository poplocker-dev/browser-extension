const CopyWebpackPlugin = require('copy-webpack-plugin')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

let config = {
  entry: {
    background: './src/background.js',
    popup: './src/popup/popup.jsx'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        include: __dirname + '/src',
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      lib: __dirname + '/src/lib'
    },
    plugins: [
      new DirectoryNamedWebpackPlugin({
        exclude: /node_modules/,
        include: [
          __dirname + '/src/popup',
          __dirname + '/src/lib'
        ]
      }),
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: __dirname + '/src/manifest.json',
      transform: function (content, path) {
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    new HtmlWebpackPlugin({
      filename: __dirname + '/dist/popup.html',
      title: 'PopWallet',
      chunks: ['popup']
    })
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }
  return config;
};

