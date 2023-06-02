const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

module.exports = {
    entry: { bundle: path.resolve(__dirname, 'src/index.js') },
    output: {
        path: path.resolve(__dirname, 'build'), // Thư mục chứa file được build ra
        filename: '[name].[contenthash].js', // Tên file được build ra
        clean: true,
        assetModuleFilename: '[name][ext]',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'build'),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(css|scss|module.scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                json: {
                    type: 'json',
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'CI/CD Github Dashboard',
            filename: 'index.html',
            template: 'public/index.html',
            meta: {
                viewport: 'width=device-width, initial-scale=1',
                'theme-color': '#000000',
                description: 'Web site created using webpack',
            },
            // favicon: 'public/logo192.png',
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'json',
        }),
    ],
}
