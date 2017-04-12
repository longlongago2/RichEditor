const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AutoPreFixer = require('autoprefixer');

module.exports = {
    output: {
        // for babel plugin
        libraryTarget: 'commonjs2',
        // where to place webpack files
        path: path.resolve(__dirname, 'lib'),
    },
    plugins: [
        new ExtractTextPlugin('Style/' + path.parse(process.argv[2]).name + '.css'),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: { modules: false }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    AutoPreFixer()
                                ];
                            }
                        }
                    }],
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader', options: { modules: true }
                    }, {
                        loader: 'less-loader', options: { modules: true }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    AutoPreFixer()
                                ];
                            }
                        }
                    }],
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: '[name]-[hash].[ext]',
                        },
                    },
                ],
            },
        ],
    },
};
