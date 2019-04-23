const path = require('path');
const webpack = require('webpack');



module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        // app: ['./src/App.jsx'],
        app: './client/Client.jsx',
        vendor: ['react', 'react-dom', 'whatwg-fetch', 'react-router-dom', 'react-router', 'react-bootstrap', 'react-router-bootstrap',],
    },
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    chunks: 'initial',
                }
              }
            
        }
    },
    devServer: {
        port: 8000,
        contentBase: './static',
        proxy: {
            // '/api/*': {
            '**': {
                target: 'http://localhost:3000'
            }
        },
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.SourceMapDevToolPlugin({})
    ],
    module: {
        rules: [
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
    }
}