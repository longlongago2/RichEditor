const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin'); // 注意：使用0.0.4版本出现一个bug会导致HMR编译挂起
const AutoPreFixer = require('autoprefixer');
require('colors');

const CONFIG_HMR = {
    context: __dirname,
    entry: [
        'react-hot-loader/patch',
        // activate HMR for React
        'whatwg-fetch',
        // add fetch to window
        'babel-polyfill',
        // add Promise and so on
        './index.js',
        // the entry point of our app
    ],
    output: {
        filename: 'bundle.js',
        path: __dirname,
        publicPath: '/'
        // necessary for HMR to know where to load the hot update chunks
    },
    devServer: {
        hot: true,
        // enable HMR on the server
        contentBase: __dirname,
        // match the output path
        publicPath: '/',
        // match the output `publicPath`
        overlay: {
            warnings: true,
            errors: true
        },
        // 警告和错误屏幕显示信息
        host: '0.0.0.0',
        port: '8010'
        // 打开对外提供服务
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { modules: false } },
                ],
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS
                    options: { modules: true }
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                    options: { modules: true }
                }]
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
    plugins: [
        new OpenBrowserPlugin({
            url: 'http://localhost:8010',
            browser: 'chrome'
        }),
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally
        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates
    ],
};
const CONFIG_DIST = {
    entry: {
        CFRichEditor: './src/dist-entry.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    externals: {
        "react": 'React',       // dist文件一般不打包react模块，因为dist文件是通过html script引入的，html会有react.js引入，会导致重复引入
        'react-dom': 'ReactDOM'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
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
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
        }),
    ],
};

function config(env) {
    // console.log(env);
    if (env && env.hmr) {
        console.log('正在启动本地HMR调试...'.red);
        return CONFIG_HMR;
    }
    if (env && env.dist) {
        console.log('正在从src打包生产代码至dist...'.green);
        return CONFIG_DIST;
    }
}

module.exports = config;
