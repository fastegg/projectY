
var path = require('path');

var LoopbackBootPlugin = require('loopback-webpack-plugin');

console.log(__dirname);
 
module.exports = {
    entry: './client/app.js',
    context: __dirname,
    output: {
        path: __dirname + '\\builds\\',
        filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.jsx', '.js', '.json', '.less'],
      modules: [
        __dirname,
        path.resolve(__dirname, "src/lib"),
        path.resolve(__dirname, "node_modules"),
        'node_modules'
      ],
      alias: {
        //style: path.resolve(__dirname, "src/style"),
        'react': 'preact-compat',
        'react-dom': 'preact-compat'
      }
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' } // Be careful, the JSON loader is required 
        ],
        rules: [
          {
            test: /\.jsx?$/,
            exclude: path.resolve(__dirname, 'src'),
            enforce: 'pre',
            use: 'source-map-loader'
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: 'babel-loader'
          }
        ]
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      new LoopbackBootPlugin() // You can pass any loopback-boot options 
                               // Default: appRootDir is the directory of the last entry 
    ]
};