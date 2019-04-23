const path = require('path');
const webpack = require('webpack');


module.exports = {
        target: 'node',
        mode: 'development',
        
        devtool: 'source-map',
        entry: ['./server/index.js', './node_modules/webpack/hot/poll.js' ],
        output: {
            filename: 'server.bundle.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'commonjs',
          },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ],
        module: {
            rules:[
                {
                    test: /\.jsx$/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.jsx$/,
                    use: ["source-map-loader"],
                    enforce: "pre"
                }
            ]
        },
        resolve: {
            extensions: ['.', '.js', '.jsx', ],
        },
        externals:[/^[a-z]/],
};