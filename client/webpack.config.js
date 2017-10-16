const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        vendor: [
            'angular',
            'angular-animate',
            'angular-aria',
            'angular-material',
            'angular-material-data-table',
            'moment'
        ],
        app: './src/app.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new ExtractTextPlugin('vendor.css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.template.ejs',
            title: 'Url Shortener'
        })
    ],
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /src.*\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /node_modules.*\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(html)$/,
                use: 'html-loader'
            }
        ]
    }
};
