const CopyWebpackPlugin = require('copy-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

let config = {
  entry: {
    background: './src/background.js',
    popup: './src/popup/popup.jsx',
    contentscript: './src/contentscript.js',
    injected: './src/injected.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
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
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-nested'),
                require('cssnano')
              ]
            }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use: 'worker-loader'
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: {
          loader: 'url-loader',
          options: { limit: 8000 }
        }
      },
      {
        test: /\.woff2$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            limit: 50000,
            outputPath: __dirname + '/dist'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      lib: __dirname + '/src/lib',
      assets: __dirname + '/src/assets'
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
    }),
    new Dotenv()
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }
  return config;
};

