var LoopbackBootPlugin = require('loopback-webpack-plugin');

console.log(__dirname);
 
module.exports = {
    entry: './client/app.js',
    output: {
        path: __dirname + '\\builds\\',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' } // Be careful, the JSON loader is required 
        ]
    },
    plugins: [
      new LoopbackBootPlugin() // You can pass any loopback-boot options 
                               // Default: appRootDir is the directory of the last entry 
    ]
};