import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import "babel-polyfill";

module.exports = (env, argv) => ({
    mode: argv.mode,
    entry: ["babel-polyfill", path.join(__dirname, 'src', 'main', 'webapp', 'index.js')],
    output: {
        path: path.join(__dirname, 'target', 'classes', 'static'),
        filename: "index-bundle.js",
        publicPath: argv.mode === 'production' ?'/' :'http://localhost:8000/'
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(argv.mode)
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'main', 'resources', 'static', 'new_index.html'),
            filename: path.join(__dirname, 'target', 'classes', 'static', 'new_index.html')
        })
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
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
});
