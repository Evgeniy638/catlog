const path = require("path");
const webpack = require("webpack");
const ASSET_PATH = process.env.ASSET_PATH || '/';
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("babel-polyfill");

module.exports = {
    entry: ["babel-polyfill", path.join(__dirname, 'src', 'main', 'resources', 'static', 'react', 'index.js')],
    output: {
        path: path.join(__dirname, 'target', 'classes', 'static'),
        filename: "index-bundle.js",
        publicPath: ASSET_PATH
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'main', 'resources', 'static', 'new_index.html'),
            filename: path.join(__dirname, 'target', 'classes', 'static', 'new_index.html')
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: {
                    loader: 'svg-url-loader',
                    options: {
                        encoding: 'base64'
                    }
                }
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        compress: true,
        historyApiFallback: true,
        port: 8000,
        allowedHosts: [
            'localhost:8080'
        ]
    },
}
