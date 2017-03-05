var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './client/client.js'
  ],
  output: {
    path: path.join(__dirname, './build'),
    filename: 'client.js',
    publicPath: '/builds/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        include: path.resolve(__dirname, './client'),
      },
      {
        test: /\.css$/, loader: 'style-loader!css-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        query: { mimetype: 'image/png' }
      },
      {
        test: /\.svg$/,
        loader: 'babel!react-svg?' + JSON.stringify({
          svgo: {
            // svgo options
            plugins: [{removeTitle: false}],
            floatPrecision: 2
          }
        }),
      }
    ]
  }
};